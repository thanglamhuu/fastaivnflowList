import { Flow } from 'flow-sdk';
import { ffmpegService } from './ffmpegService';
import { 
  Input, Output, Conversion, 
  Mp4OutputFormat, BufferTarget, BlobSource, ALL_FORMATS,
  canEncodeAudio
} from 'mediabunny';
import { registerAc3Decoder, registerAc3Encoder } from '@mediabunny/ac3';
import { registerMp3Encoder } from '@mediabunny/mp3-encoder';
import { Resolution, AspectRatio } from '../types';
let encodersInitialized = false;
async function initEncoders() {
  if (encodersInitialized) return;
  registerAc3Decoder();
  registerAc3Encoder();
  if (!(await canEncodeAudio('mp3'))) {
    registerMp3Encoder();
  }
  encodersInitialized = true;
}
/**
 * Điều chỉnh tốc độ clip đơn lẻ sử dụng MediaBunny.
 */
export async function adjustClipSpeed(base64: string, speedFactor: number): Promise<string> {
  await initEncoders();
  
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const videoBlob = new Blob([bytes], { type: 'video/mp4' });
  
  const input = new Input({ source: new BlobSource(videoBlob), formats: ALL_FORMATS });
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
    target: new BufferTarget(),
  });
  const conversion = await Conversion.init({
    input,
    output,
    video: {
      process: (sample) => {
        sample.setTimestamp(sample.timestamp / speedFactor);
        return sample;
      },
    },
    audio: {
      discard: speedFactor > 2 || speedFactor < 0.5,
    }
  });
  if (!conversion.isValid) {
    throw new Error("Không thể xử lý clip để đổi tốc độ.");
  }
  await conversion.execute();
  
  // Chuyển Uint8Array sang Base64 an toàn bằng FileReader
  const resultBlob = new Blob([output.target.buffer!], { type: 'video/mp4' });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Str = (reader.result as string).split(',')[1];
      resolve(base64Str);
    };
    reader.readAsDataURL(resultBlob);
  });
}
/**
 * Tính toán kích thước mục tiêu dựa trên Resolution và Aspect Ratio.
 */
function getTargetDimensions(resolution: Resolution, ratio: AspectRatio): { w: number, h: number } {
  const is360 = resolution === '360p';
  
  if (ratio === '16:9') return is360 ? { w: 640, h: 360 } : { w: 1280, h: 720 };
  if (ratio === '9:16') return is360 ? { w: 360, h: 640 } : { w: 720, h: 1280 };
  if (ratio === '1:1') return is360 ? { w: 360, h: 360 } : { w: 720, h: 720 };
  if (ratio === '4:3') return is360 ? { w: 480, h: 360 } : { w: 960, h: 720 };
  if (ratio === '3:4') return is360 ? { w: 360, h: 480 } : { w: 720, h: 960 };
  
  return is360 ? { w: 640, h: 360 } : { w: 1280, h: 720 };
}
/**
 * Ghép danh sách video base64 thành một clip duy nhất sử dụng FFmpeg.
 */
export async function concatVideos(
  videos: string[], 
  resolution: Resolution = '360p',
  ratio: AspectRatio = '16:9'
): Promise<{ base64: string; mimeType: string }> {
  await ffmpegService.load();
  const fileNames: string[] = [];
  const { w, h } = getTargetDimensions(resolution, ratio);
  
  // Ghi file vào FS ảo của FFmpeg
  for (let i = 0; i < videos.length; i++) {
    const fileName = `clip_${i}.mp4`;
    fileNames.push(fileName);
    const bytes = Uint8Array.from(atob(videos[i]), c => c.charCodeAt(0));
    await ffmpegService.writeFile(fileName, bytes);
  }
  const inputArgs: string[] = [];
  fileNames.forEach(name => inputArgs.push('-i', name));
  /**
   * Filter Complex cho từng clip:
   * 1. scale: resize giữ tỷ lệ sao cho lấp đầy khung hình (hoặc fit tùy chọn)
   * 2. setsar: reset sample aspect ratio
   * 3. pad: thêm viền đen nếu cần để đúng kích thước mục tiêu
   */
  const filterInputs = fileNames.map((_, i) => {
    return `[${i}:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}];[${i}:a]aresample=44100[a${i}];`;
  }).join('');
  
  const concatInputs = fileNames.map((_, i) => `[v${i}][a${i}]`).join('');
  const filterComplex = `${filterInputs}${concatInputs}concat=n=${fileNames.length}:v=1:a=1[outv][outa]`;
  await ffmpegService.exec([
    ...inputArgs,
    '-filter_complex', filterComplex,
    '-map', '[outv]',
    '-map', '[outa]',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '22', 
    '-c:a', 'aac',
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-movflags', 'faststart',
    '-y', 'output.mp4',
  ]);
  const outputData = await ffmpegService.readFile('output.mp4') as Uint8Array;
  
  // Cleanup
  for (const name of fileNames) {
    try { await ffmpegService.deleteFile(name); } catch(e) {}
  }
  try { await ffmpegService.deleteFile('output.mp4'); } catch(e) {}
  // Chuyển Uint8Array sang Base64 an toàn
  const blob = new Blob([outputData.buffer], { type: 'video/mp4' });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({ base64, mimeType: 'video/mp4' });
    };
    reader.readAsDataURL(blob);
  });
}