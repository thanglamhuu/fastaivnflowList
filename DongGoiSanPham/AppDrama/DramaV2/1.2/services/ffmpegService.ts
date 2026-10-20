import { toBlobURL } from '@ffmpeg/util';
const MSG = {
  LOAD: 'LOAD', EXEC: 'EXEC', WRITE_FILE: 'WRITE_FILE',
  READ_FILE: 'READ_FILE', DELETE_FILE: 'DELETE_FILE',
  ERROR: 'ERROR', LOG: 'LOG', PROGRESS: 'PROGRESS',
} as const;
// Danh sách các CDN uy tín cung cấp bản UMD của ffmpeg-core 0.12.6
const CORE_CDN_URLS = [
  'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd'
];
class FFmpegService {
  private worker: Worker | null = null;
  private loaded = false;
  private isInitializing = false;
  private msgId = 0;
  private callbacks = new Map<number, {
    resolve: (v: any) => void;
    reject: (e: any) => void;
  }>();
  private logCb: ((msg: string) => void) | null = null;
  private progressCb: ((p: { progress: number }) => void) | null = null;
  /** Tự động dọn sạch worker nếu gặp sự cố */
  terminate() {
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (_) {}
      this.worker = null;
    }
    this.loaded = false;
    this.isInitializing = false;
    this.callbacks.clear();
  }
  async load(onLog?: (msg: string) => void) {
    if (this.loaded && this.worker) return;
    if (this.isInitializing) {
      // Đang khởi tạo, đợi tối đa 15s
      let retries = 30;
      while (this.isInitializing && retries > 0) {
        await new Promise(r => setTimeout(r, 500));
        retries--;
      }
      if (this.loaded && this.worker) return;
    }
    this.isInitializing = true;
    this.logCb = onLog || null;
    let lastError: any = null;
    // Thử lần lượt các CDN nếu một CDN bị chặn hoặc gián đoạn mạng
    for (const baseURL of CORE_CDN_URLS) {
      try {
        this.logCb?.(`Đang tải thư viện xử lý video (${baseURL.includes('jsdelivr') ? 'jsDelivr' : 'Unpkg'})...`);
        
        const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
        const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
        this.terminate(); // Đảm bảo dọn worker cũ nếu có
        const workerBlob = this.buildWorkerBlob();
        this.worker = new Worker(workerBlob);
        this.worker.onmessage = ({ data: { id, type, data } }) => {
          if (type === MSG.LOG) {
            this.logCb?.(data?.message || '');
            return;
          }
          if (type === MSG.PROGRESS) {
            this.progressCb?.(data);
            return;
          }
          if (type === MSG.ERROR) {
            const cb = this.callbacks.get(id);
            if (cb) { this.callbacks.delete(id); cb.reject(new Error(data)); }
            return;
          }
          const cb = this.callbacks.get(id);
          if (cb) { this.callbacks.delete(id); cb.resolve(data); }
        };
        this.worker.onerror = (e) => {
          console.error("FFmpeg Worker Error:", e);
        };
        await this.send(MSG.LOAD, { coreURL, wasmURL });
        this.loaded = true;
        this.isInitializing = false;
        return;
      } catch (err) {
        console.warn(`Tải FFmpeg Core từ ${baseURL} thất bại, thử nguồn khác:`, err);
        lastError = err;
        this.terminate();
      }
    }
    this.isInitializing = false;
    throw new Error(lastError?.message || 'Không thể tải bộ mã hóa FFmpeg. Vui lòng kiểm tra kết nối mạng và thử lại.');
  }
  private send(type: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        return reject(new Error('Bộ xử lý FFmpeg chưa sẵn sàng. Hãy bấm thử lại.'));
      }
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.worker.postMessage({ id, type, data });
    });
  }
  private buildWorkerBlob(): string {
    const script = `
var MSG = {
  LOAD: "LOAD", EXEC: "EXEC",
  WRITE_FILE: "WRITE_FILE", READ_FILE: "READ_FILE",
  DELETE_FILE: "DELETE_FILE", ERROR: "ERROR",
  LOG: "LOG", PROGRESS: "PROGRESS",
};
var ffmpeg = null;
var load = function(opts) {
  importScripts(opts.coreURL);
  if (!self.createFFmpegCore) {
    throw new Error("Không thể khởi tạo ffmpeg-core");
  }
  return self.createFFmpegCore({
    mainScriptUrlOrBlob: opts.coreURL
      + "#" + btoa(JSON.stringify({ wasmURL: opts.wasmURL })),
  }).then(function(core) {
    ffmpeg = core;
    ffmpeg.setLogger(function(data) {
      self.postMessage({ type: MSG.LOG, data: data });
    });
    ffmpeg.setProgress(function(data) {
      self.postMessage({ type: MSG.PROGRESS, data: data });
    });
    return true;
  });
};
self.onmessage = function(e) {
  var id = e.data.id;
  var type = e.data.type;
  var _data = e.data.data;
  var trans = [];
  var data;
  var handleResult = function(result) {
    data = result;
    if (data instanceof Uint8Array) trans.push(data.buffer);
    self.postMessage({ id: id, type: type, data: data }, trans);
  };
  var handleError = function(err) {
    self.postMessage({
      id: id, type: MSG.ERROR, data: (err && err.message) ? err.message : err.toString()
    });
  };
  try {
    if (type !== MSG.LOAD && !ffmpeg) {
      handleError(new Error("ffmpeg is not loaded"));
      return;
    }
    switch (type) {
      case MSG.LOAD:
        load(_data).then(handleResult).catch(handleError);
        return;
      case MSG.EXEC:
        ffmpeg.setTimeout(_data.timeout || -1);
        ffmpeg.exec.apply(ffmpeg, _data.args);
        data = ffmpeg.ret;
        ffmpeg.reset();
        if (data !== 0) {
          handleError(new Error("FFmpeg exited with code " + data));
          return;
        }
        break;
      case MSG.WRITE_FILE:
        ffmpeg.FS.writeFile(_data.path, _data.data);
        data = true;
        break;
      case MSG.READ_FILE:
        try {
          data = ffmpeg.FS.readFile(_data.path);
          if (!data || data.length === 0) {
            handleError(new Error("File " + _data.path + " rỗng hoặc không tồn tại."));
            return;
          }
        } catch (readErr) {
          handleError(new Error("Không thể đọc file " + _data.path + ": " + (readErr && readErr.message ? readErr.message : readErr)));
          return;
        }
        break;
      case MSG.DELETE_FILE:
        try {
          ffmpeg.FS.unlink(_data.path);
        } catch (_) {}
        data = true;
        break;
      default:
        handleError(new Error("unknown message type: " + type));
        return;
    }
  } catch (err) {
    handleError(err);
    return;
  }
  if (data instanceof Uint8Array) trans.push(data.buffer);
  self.postMessage({ id: id, type: type, data: data }, trans);
};
`;
    return URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
  }
  async exec(args: string[]) {
    if (!this.worker) await this.load();
    return this.send(MSG.EXEC, { args, timeout: -1 });
  }
  async writeFile(name: string, data: Uint8Array | any) {
    if (!this.worker) await this.load();
    return this.send(MSG.WRITE_FILE, { path: name, data });
  }
  async readFile(name: string): Promise<Uint8Array> {
    if (!this.worker) await this.load();
    return this.send(MSG.READ_FILE, { path: name });
  }
  async deleteFile(name: string) {
    if (!this.worker) return;
    return this.send(MSG.DELETE_FILE, { path: name });
  }
  onProgress(cb: (p: { progress: number }) => void) {
    this.progressCb = cb;
  }
}
export const ffmpegService = new FFmpegService();