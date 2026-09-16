var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// virtual:App.tsx
import { useState as useState2, useEffect as useEffect2, useRef } from "react";
import { Flow } from "flow-sdk";

// virtual:services/ffmpegService.ts
import { toBlobURL } from "@ffmpeg/util";
var MSG = {
  LOAD: "LOAD",
  EXEC: "EXEC",
  WRITE_FILE: "WRITE_FILE",
  READ_FILE: "READ_FILE",
  DELETE_FILE: "DELETE_FILE",
  ERROR: "ERROR",
  LOG: "LOG",
  PROGRESS: "PROGRESS"
};
var FFmpegService = class {
  constructor() {
    __publicField(this, "worker", null);
    __publicField(this, "loaded", false);
    __publicField(this, "msgId", 0);
    __publicField(this, "callbacks", /* @__PURE__ */ new Map());
    __publicField(this, "logCb", null);
    __publicField(this, "progressCb", null);
  }
  async load(onLog) {
    if (this.loaded && this.worker) return;
    this.logCb = onLog || null;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");
    const workerBlob = this.buildWorkerBlob();
    this.worker = new Worker(workerBlob);
    this.worker.onmessage = ({ data: { id, type, data } }) => {
      if (type === MSG.LOG) {
        this.logCb?.(data?.message || "");
        return;
      }
      if (type === MSG.PROGRESS) {
        this.progressCb?.(data);
        return;
      }
      if (type === MSG.ERROR) {
        const cb2 = this.callbacks.get(id);
        if (cb2) {
          this.callbacks.delete(id);
          cb2.reject(new Error(data));
        }
        return;
      }
      const cb = this.callbacks.get(id);
      if (cb) {
        this.callbacks.delete(id);
        cb.resolve(data);
      }
    };
    await this.send(MSG.LOAD, { coreURL, wasmURL });
    this.loaded = true;
  }
  send(type, data) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.worker.postMessage({ id, type, data });
    });
  }
  buildWorkerBlob() {
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
    throw new Error("failed to import ffmpeg-core.js");
  }
  return self.createFFmpegCore({
    mainScriptUrlOrBlob: opts.coreURL + "#" + btoa(JSON.stringify({ wasmURL: opts.wasmURL })),
  }).then(function(core) {
    ffmpeg = core;
    ffmpeg.setLogger(function(data) { self.postMessage({ type: MSG.LOG, data: data }); });
    ffmpeg.setProgress(function(data) { self.postMessage({ type: MSG.PROGRESS, data: data }); });
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
    self.postMessage({ id: id, type: MSG.ERROR, data: err.toString() });
  };

  try {
    if (type !== MSG.LOAD && !ffmpeg) { handleError(new Error("ffmpeg is not loaded")); return; }
    switch (type) {
      case MSG.LOAD: load(_data).then(handleResult).catch(handleError); return;
      case MSG.EXEC:
        ffmpeg.setTimeout(_data.timeout || -1);
        ffmpeg.exec.apply(ffmpeg, _data.args);
        data = ffmpeg.ret;
        ffmpeg.reset();
        break;
      case MSG.WRITE_FILE: ffmpeg.FS.writeFile(_data.path, _data.data); data = true; break;
      case MSG.READ_FILE: data = ffmpeg.FS.readFile(_data.path); break;
      case MSG.DELETE_FILE: ffmpeg.FS.unlink(_data.path); data = true; break;
      default: handleError(new Error("unknown message type: " + type)); return;
    }
  } catch (err) { handleError(err); return; }
  if (data instanceof Uint8Array) trans.push(data.buffer);
  self.postMessage({ id: id, type: type, data: data }, trans);
};
`;
    return URL.createObjectURL(new Blob([script], { type: "text/javascript" }));
  }
  async exec(args) {
    if (!this.worker) throw new Error("FFmpeg not loaded");
    return this.send(MSG.EXEC, { args, timeout: -1 });
  }
  async writeFile(name, data) {
    if (!this.worker) throw new Error("FFmpeg not loaded");
    return this.send(MSG.WRITE_FILE, { path: name, data });
  }
  async readFile(name) {
    if (!this.worker) throw new Error("FFmpeg not loaded");
    return this.send(MSG.READ_FILE, { path: name });
  }
  async deleteFile(name) {
    if (!this.worker) throw new Error("FFmpeg not loaded");
    return this.send(MSG.DELETE_FILE, { path: name });
  }
  onProgress(cb) {
    this.progressCb = cb;
  }
};
var ffmpegService = new FFmpegService();

// virtual:services/licenseService.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
var PROJECT_ID = "DyoEwgDvZ2xDNL34nZ7m";
var firebaseConfig = {
  apiKey: "AIzaSyC1g2LX72MkVJ9l9RZ_Yiosx-7kMFd9DK4",
  authDomain: "fastai2609.firebaseapp.com",
  projectId: "fastai2609",
  storageBucket: "fastai2609.firebasestorage.app",
  messagingSenderId: "446866267447",
  appId: "1:446866267447:web:d8bd9fe79806bb80b34eb2",
  measurementId: "G-R06EZK0J66"
};
var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var STORAGE_KEYS = {
  MACHINE_ID: "flow_app_machine_id",
  LICENSE_KEY: "flow_app_license_key"
};
var safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
    }
  }
};
var getOrCreateMachineId = () => {
  let id = safeStorage.getItem(STORAGE_KEYS.MACHINE_ID);
  if (!id) {
    id = crypto.randomUUID();
    safeStorage.setItem(STORAGE_KEYS.MACHINE_ID, id);
  }
  return id;
};
var getStoredLicenseKey = () => {
  return safeStorage.getItem(STORAGE_KEYS.LICENSE_KEY);
};
var saveLicenseKey = (key) => {
  safeStorage.setItem(STORAGE_KEYS.LICENSE_KEY, key);
};
var verifyLicense = async (licenseKey) => {
  const machineId = getOrCreateMachineId();
  try {
    const docRef = doc(db, "machines", machineId, "projects", PROJECT_ID, "licenses", licenseKey);
    const snapshot = await getDocFromServer(docRef);
    return snapshot.exists();
  } catch (error) {
    console.error("License check error:", error);
    return false;
  }
};

// virtual:components/LicenseGate.tsx
import { useState, useEffect } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LicenseGate = ({ onVerified }) => {
  const [keyInput, setKeyInput] = useState("");
  const [machineId, setMachineId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setMachineId(getOrCreateMachineId());
  }, []);
  const handleCheck = async () => {
    if (!keyInput.trim()) return;
    setIsVerifying(true);
    setError(null);
    const isValid = await verifyLicense(keyInput.trim());
    if (isValid) {
      saveLicenseKey(keyInput.trim());
      onVerified();
    } else {
      setError("License kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c kh\xF4ng c\xF2n hi\u1EC7u l\u1EF1c.");
    }
    setIsVerifying(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center p-6 font-sans", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4", children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[32px] text-white/40", children: "vpn_key" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "K\xEDch ho\u1EA1t \u1EE9ng d\u1EE5ng" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm", children: "Vui l\xF2ng nh\u1EADp License Key \u0111\u1EC3 ti\u1EBFp t\u1EE5c s\u1EED d\u1EE5ng." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-1.5 block", children: "Project ID" }),
          /* @__PURE__ */ jsx("div", { className: "bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60", children: PROJECT_ID })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-1.5 block", children: "M\xE3 thi\u1EBFt b\u1ECB (Machine ID)" }),
          /* @__PURE__ */ jsx("div", { className: "bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 break-all", children: machineId }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/20 mt-1 ml-1", children: "G\u1EEDi m\xE3 n\xE0y cho Admin \u0111\u1EC3 \u0111\u01B0\u1EE3c c\u1EA5p ph\xE9p." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1 mb-1.5 block", children: "License Key" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: keyInput,
              onChange: (e) => setKeyInput(e.target.value),
              placeholder: "Nh\u1EADp kh\xF3a b\u1EA3n quy\u1EC1n c\u1EE7a b\u1EA1n...",
              className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-all placeholder-white/20"
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCheck,
          disabled: isVerifying || !keyInput.trim(),
          className: "w-full bg-white text-black h-12 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2",
          children: isVerifying ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "animate-spin material-symbols-outlined text-[18px]", children: "progress_activity" }),
            "\u0110ANG KI\u1EC2M TRA..."
          ] }) : "KI\u1EC2M TRA LICENSE"
        }
      )
    ] })
  ] }) });
};

// virtual:App.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SectionLabel = ({ children }) => /* @__PURE__ */ jsx2("div", { className: "flex items-center px-2 mb-1", children: /* @__PURE__ */ jsx2("span", { className: "text-[10px] font-bold text-white/40 tracking-[1px] uppercase", children }) });
var GlassCard = ({ children, className = "" }) => /* @__PURE__ */ jsx2("div", { className: `bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${className}`, children });
var FloatingButton = ({ icon, children, variant = "primary", onClick, disabled, loading, className = "" }) => {
  const base = "relative flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl font-medium text-xs transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 shadow-white/10",
    secondary: "bg-[#1a1a1a] text-white border border-white/10 hover:bg-[#252525]",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5"
  };
  return /* @__PURE__ */ jsxs2("button", { onClick, disabled: disabled || loading, className: `${base} ${variants[variant]} ${className}`, children: [
    loading ? /* @__PURE__ */ jsx2("span", { className: "animate-spin material-symbols-outlined text-[18px]", children: "progress_activity" }) : icon && /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[18px]", children: icon }),
    /* @__PURE__ */ jsx2("span", { className: "truncate", children })
  ] });
};
var ModernSelect = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState2(false);
  const ref = useRef(null);
  useEffect2(() => {
    const click = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);
  return /* @__PURE__ */ jsxs2("div", { ref, className: "relative flex-1", children: [
    /* @__PURE__ */ jsx2("div", { className: "text-[9px] font-bold text-white/30 uppercase ml-1 mb-1", children: label }),
    /* @__PURE__ */ jsxs2("button", { onClick: () => setOpen(!open), className: "w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 flex items-center justify-between hover:bg-white/10 transition-colors", children: [
      /* @__PURE__ */ jsx2("span", { className: "text-[11px] font-medium truncate", children: value }),
      /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-white/40 text-[18px]", children: "expand_more" })
    ] }),
    open && /* @__PURE__ */ jsx2("div", { className: "absolute z-50 bottom-full mb-2 left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-2", children: options.map((o) => /* @__PURE__ */ jsx2("button", { onClick: () => {
      onChange(o);
      setOpen(false);
    }, className: `w-full text-left px-3 py-2.5 text-[11px] hover:bg-white/5 transition-colors ${o === value ? "text-white bg-white/10" : "text-white/60"}`, children: o }, o)) })
  ] });
};
var DIRECTORS = ["None", "Christopher Nolan", "Wes Anderson", "Quentin Tarantino", "Hayao Miyazaki", "Tim Burton", "Greta Gerwig", "Denis Villeneuve", "David Fincher", "Stanley Kubrick", "Bong Joon-ho"];
var GENRES = ["Drama", "Mystery", "Crime", "Horror", "Psychological", "Action Thriller", "Sci-Fi", "Romance", "Historical"];
var STYLES = ["Cinematic", "Realistic", "Ghibli Anime", "American Comic", "Japanese Anime", "Pixar 3D", "Claymation", "Blackboard Chalk", "Stickman Sketch", "Oil Painting", "Cyberpunk"];
function App() {
  const [activeTab, setActiveTab] = useState2("story");
  const [prompt, setPrompt] = useState2("");
  const [duration, setDuration] = useState2(32);
  const [config, setConfig] = useState2({
    imageModel: "\u{1F34C} Nano Banana Pro",
    videoModel: "Veo 3.1 - Lite",
    language: "Ti\u1EBFng Vi\u1EC7t",
    style: "Cinematic",
    director: "None",
    genre: "Drama",
    profiles: []
  });
  const [segments, setSegments] = useState2([]);
  const [isProcessing, setIsProcessing] = useState2(false);
  const [status, setStatus] = useState2("");
  const [finalVideo, setFinalVideo] = useState2(null);
  const [isLicensed, setIsLicensed] = useState2(null);
  useEffect2(() => {
    const id = "custom-style";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        html, body, #root { height: 100%; background: #050505; color: white; font-family: 'Google Sans Text', sans-serif; }
        .dark-scrollbar::-webkit-scrollbar { width: 4px; }
        .dark-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .skeleton { background: linear-gradient(90deg, #111 25%, #222 50%, #111 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      `;
      document.head.appendChild(style);
    }
    ffmpegService.load();
    checkAppLicense();
  }, []);
  const checkAppLicense = async () => {
    const storedKey = getStoredLicenseKey();
    if (!storedKey) {
      setIsLicensed(false);
      return;
    }
    const isValid = await verifyLicense(storedKey);
    setIsLicensed(isValid);
  };
  if (isLicensed === null) {
    return /* @__PURE__ */ jsx2("div", { className: "h-full w-full bg-[#050505] flex items-center justify-center", children: /* @__PURE__ */ jsx2("span", { className: "animate-spin material-symbols-outlined text-white/20 text-[48px]", children: "progress_activity" }) });
  }
  if (isLicensed === false) {
    return /* @__PURE__ */ jsx2(LicenseGate, { onVerified: () => setIsLicensed(true) });
  }
  const addProfile = async (type) => {
    try {
      const media = await Flow.media.select({ filter: "image" });
      const newProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: type === "character" ? "New Character" : "New Location",
        description: "",
        base64: media.base64,
        mediaId: media.mediaId,
        type
      };
      setConfig((prev) => ({ ...prev, profiles: [...prev.profiles, newProfile] }));
    } catch (e) {
    }
  };
  const updateProfile = (id, updates) => {
    setConfig((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => p.id === id ? { ...p, ...updates } : p)
    }));
  };
  const removeProfile = (id) => {
    setConfig((prev) => ({ ...prev, profiles: prev.profiles.filter((p) => p.id !== id) }));
  };
  const generateStoryboard = async () => {
    if (!prompt) return;
    setIsProcessing(true);
    setStatus("Drafting screenplay with visual consistency...");
    try {
      const numShots = Math.ceil(duration / 8);
      const characterContext = config.profiles.filter((p) => p.type === "character").map((p) => `${p.name}: ${p.description}`).join("\n");
      const locationContext = config.profiles.filter((p) => p.type === "location").map((p) => `${p.name}: ${p.description}`).join("\n");
      const systemInstruction = `You are a world-class film director. 
      Break the story into ${numShots} distinct shots (8s each).
      
      CONSISTENCY RULES:
      - For every shot, you MUST specify:
        1. timeOfDay: (e.g., Golden Hour, Midnight, Rainy Morning)
        2. setting: Precise location description.
        3. outfit: Specific clothing and hairstyle for characters.
      - imagePrompt: Create a high-detail prompt for an image generator. Include the character's physical features, the setting, time of day, and EXACT outfit/hair for this specific moment. 
      - videoPrompt: Describe the cinematic camera motion (e.g., Dolly zoom, slow pan left, handheld tracking).
      - Ensure the style strictly matches: ${config.style}, directed by ${config.director}, Genre: ${config.genre}.
      
      CHARACTERS: ${characterContext}
      LOCATIONS: ${locationContext}
      
      Return JSON array of objects with keys: script, imagePrompt, videoPrompt, timeOfDay, setting, outfit. Language: ${config.language}.`;
      const { text } = await Flow.generate.text(prompt, {
        systemInstruction,
        thinkingLevel: "high",
        images: config.profiles.filter((p) => p.base64).map((p) => ({ base64: p.base64, mimeType: "image/jpeg" }))
      });
      const json = JSON.parse(text.substring(text.indexOf("["), text.lastIndexOf("]") + 1));
      setSegments(json.map((s, i) => ({
        ...s,
        id: `seg-${i}`,
        status: "idle"
      })));
      setActiveTab("timeline");
    } catch (err) {
      setStatus(`Drafting failed: ${err}`);
    } finally {
      setIsProcessing(false);
    }
  };
  const generateShot = async (id) => {
    const seg = segments.find((s) => s.id === id);
    if (!seg) return;
    updateSegment(id, { status: "generating-image", error: void 0 });
    try {
      const charRefIds = config.profiles.filter((p) => p.type === "character" && p.mediaId).map((p) => p.mediaId);
      const locRefIds = config.profiles.filter((p) => p.type === "location" && p.mediaId).map((p) => p.mediaId);
      const img = await Flow.generate.image({
        prompt: seg.imagePrompt,
        modelDisplayName: config.imageModel,
        aspectRatio: "16:9",
        referenceImageMediaIds: [...charRefIds, ...locRefIds].slice(0, 10)
      });
      updateSegment(id, { imageBase64: img.base64, imageMediaId: img.mediaId, status: "ready-image" });
      updateSegment(id, { status: "generating-video" });
      const vid = await Flow.generate.video({
        prompt: seg.videoPrompt,
        firstFrameImageMediaId: img.mediaId,
        modelDisplayName: config.videoModel,
        durationSeconds: 8,
        aspectRatio: "16:9"
      });
      updateSegment(id, { videoBase64: vid.base64, videoMediaId: vid.mediaId, status: "ready-video" });
    } catch (err) {
      updateSegment(id, { status: "error", error: String(err) });
    }
  };
  const updateSegment = (id, updates) => {
    setSegments((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
  };
  const renderTabIcon = (tab, icon, label) => /* @__PURE__ */ jsxs2("button", { onClick: () => setActiveTab(tab), className: `flex flex-col items-center gap-1.5 py-4 transition-all ${activeTab === tab ? "text-white" : "text-white/20 hover:text-white/40"}`, children: [
    /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[24px]", children: icon }),
    /* @__PURE__ */ jsx2("span", { className: "text-[9px] font-bold uppercase tracking-wider", children: label }),
    activeTab === tab && /* @__PURE__ */ jsx2("div", { className: "absolute left-0 w-1 h-8 bg-white rounded-r-full" })
  ] });
  return /* @__PURE__ */ jsxs2("div", { className: "flex h-full w-full bg-[#050505] overflow-hidden", children: [
    /* @__PURE__ */ jsxs2("div", { className: "w-20 h-full border-r border-white/5 flex flex-col bg-white/[0.02] backdrop-blur-3xl relative z-10", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex-1 flex flex-col pt-8", children: [
        renderTabIcon("story", "movie_edit", "Story"),
        renderTabIcon("identity", "face_6", "Identity"),
        renderTabIcon("timeline", "view_timeline", "Timeline"),
        renderTabIcon("export", "ios_share", "Export")
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "p-4 border-t border-white/5 flex flex-col gap-4", children: /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-white/20 text-center", children: "settings" }) })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "flex-1 h-full overflow-y-auto dark-scrollbar p-8", children: [
      activeTab === "story" && /* @__PURE__ */ jsxs2("div", { className: "max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4", children: [
        /* @__PURE__ */ jsxs2("header", { children: [
          /* @__PURE__ */ jsx2("h1", { className: "text-4xl font-bold tracking-tight mb-2", children: "Director's Script" }),
          /* @__PURE__ */ jsx2("p", { className: "text-white/40 text-sm", children: "Define your vision. AI will handle the technical cinematography." })
        ] }),
        /* @__PURE__ */ jsxs2(GlassCard, { className: "p-6 space-y-8", children: [
          /* @__PURE__ */ jsxs2("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx2(SectionLabel, { children: "Conceptual Idea" }),
            /* @__PURE__ */ jsx2(
              "textarea",
              {
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                placeholder: "Describe your story idea... (e.g., A detective finds a mysterious glowing box in a dark Tokyo alleyway)",
                className: "w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white/20 outline-none transition-all resize-none placeholder-white/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx2(ModernSelect, { label: "Director Style", value: config.director, options: DIRECTORS, onChange: (v) => setConfig({ ...config, director: v }) }),
            /* @__PURE__ */ jsx2(ModernSelect, { label: "Visual Style", value: config.style, options: STYLES, onChange: (v) => setConfig({ ...config, style: v }) })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx2(ModernSelect, { label: "Genre", value: config.genre, options: GENRES, onChange: (v) => setConfig({ ...config, genre: v }) }),
            /* @__PURE__ */ jsxs2("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx2("div", { className: "text-[9px] font-bold text-white/30 uppercase ml-1 mb-1", children: "Duration" }),
              /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 h-11", children: [
                /* @__PURE__ */ jsx2("input", { type: "range", min: 8, max: 120, step: 8, value: duration, onChange: (e) => setDuration(Number(e.target.value)), className: "flex-1" }),
                /* @__PURE__ */ jsxs2("span", { className: "text-xs font-mono w-8 text-right", children: [
                  duration,
                  "s"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx2(FloatingButton, { onClick: generateStoryboard, loading: isProcessing, className: "w-full py-4 text-sm font-bold uppercase tracking-widest", children: "Generate Screenplay" })
        ] })
      ] }),
      activeTab === "identity" && /* @__PURE__ */ jsxs2("div", { className: "max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4", children: [
        /* @__PURE__ */ jsxs2("header", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsx2("h1", { className: "text-4xl font-bold tracking-tight mb-2", children: "Visual Identity" }),
            /* @__PURE__ */ jsx2("p", { className: "text-white/40 text-sm", children: "Define characters and locations to ensure consistency across shots." })
          ] }),
          /* @__PURE__ */ jsxs2("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx2(FloatingButton, { variant: "secondary", icon: "person_add", onClick: () => addProfile("character"), children: "Character" }),
            /* @__PURE__ */ jsx2(FloatingButton, { variant: "secondary", icon: "add_location", onClick: () => addProfile("location"), children: "Location" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          config.profiles.map((p) => /* @__PURE__ */ jsxs2(GlassCard, { className: "p-4 flex gap-4 group", children: [
            /* @__PURE__ */ jsx2("div", { className: "w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative", children: p.base64 ? /* @__PURE__ */ jsx2("img", { src: `data:image/jpeg;base64,${p.base64}`, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx2("div", { className: "w-full h-full flex items-center justify-center text-white/10", children: /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[32px]", children: p.type === "character" ? "person" : "landscape" }) }) }),
            /* @__PURE__ */ jsxs2("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsx2("input", { value: p.name, onChange: (e) => updateProfile(p.id, { name: e.target.value }), className: "bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0", placeholder: "Name..." }),
              /* @__PURE__ */ jsx2("textarea", { value: p.description, onChange: (e) => updateProfile(p.id, { description: e.target.value }), className: "bg-white/5 border border-white/10 rounded-lg p-2 text-[11px] w-full h-12 resize-none text-white/60 outline-none", placeholder: "Features, clothing, traits..." }),
              /* @__PURE__ */ jsxs2("button", { onClick: () => removeProfile(p.id), className: "text-[10px] text-red-500/50 hover:text-red-500 flex items-center gap-1 transition-colors", children: [
                /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[14px]", children: "delete" }),
                " Remove"
              ] })
            ] })
          ] }, p.id)),
          config.profiles.length === 0 && /* @__PURE__ */ jsxs2("div", { className: "col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/10", children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[48px] block mb-2", children: "diversity_3" }),
            "Add characters or locations to begin"
          ] })
        ] })
      ] }),
      activeTab === "timeline" && /* @__PURE__ */ jsxs2("div", { className: "max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4", children: [
        /* @__PURE__ */ jsxs2("header", { className: "flex items-center justify-between border-b border-white/5 pb-8", children: [
          /* @__PURE__ */ jsxs2("div", { children: [
            /* @__PURE__ */ jsx2("h1", { className: "text-3xl font-bold tracking-tight", children: "Timeline Master" }),
            /* @__PURE__ */ jsx2("p", { className: "text-white/40 text-sm", children: "Review, edit prompts, and generate shots." })
          ] }),
          /* @__PURE__ */ jsx2(FloatingButton, { variant: "secondary", onClick: () => segments.forEach((s) => generateShot(s.id)), children: "Generate All Sequences" })
        ] }),
        /* @__PURE__ */ jsx2("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-10", children: segments.map((seg, i) => /* @__PURE__ */ jsxs2("div", { className: "group flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs2("div", { className: "aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative shadow-2xl transition-transform hover:scale-[1.02]", children: [
            seg.videoBase64 ? /* @__PURE__ */ jsx2("video", { src: `data:video/mp4;base64,${seg.videoBase64}`, controls: true, loop: true, className: "w-full h-full object-cover" }) : seg.imageBase64 ? /* @__PURE__ */ jsx2("img", { src: `data:image/jpeg;base64,${seg.imageBase64}`, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx2("div", { className: `w-full h-full flex items-center justify-center ${seg.status.includes("generating") ? "skeleton" : ""}`, children: /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-white/5 text-[64px]", children: "movie" }) }),
            /* @__PURE__ */ jsxs2("div", { className: "absolute top-4 left-4 flex gap-2", children: [
              /* @__PURE__ */ jsxs2("span", { className: "bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider", children: [
                "Shot ",
                i + 1
              ] }),
              /* @__PURE__ */ jsx2("span", { className: "bg-black/80 backdrop-blur-md text-white/60 text-[10px] px-2 py-1 rounded-md border border-white/10", children: seg.timeOfDay })
            ] }),
            /* @__PURE__ */ jsx2("div", { className: "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx2(FloatingButton, { onClick: () => generateShot(seg.id), loading: seg.status.includes("generating"), icon: "refresh", variant: "secondary", className: "w-10 h-10 p-0 rounded-full", children: "" }) })
          ] }),
          /* @__PURE__ */ jsxs2(GlassCard, { className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsx2(SectionLabel, { children: "Screenplay Script" }),
              /* @__PURE__ */ jsxs2("p", { className: "text-sm italic text-white/80", children: [
                '"',
                seg.script,
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs2("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx2(SectionLabel, { children: "Image Prompt (Visual Identity)" }),
                /* @__PURE__ */ jsx2("textarea", { value: seg.imagePrompt, onChange: (e) => updateSegment(seg.id, { imagePrompt: e.target.value }), className: "w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white/60 focus:border-white/40 outline-none resize-none" })
              ] }),
              /* @__PURE__ */ jsxs2("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx2(SectionLabel, { children: "Video Prompt (Motion)" }),
                /* @__PURE__ */ jsx2("textarea", { value: seg.videoPrompt, onChange: (e) => updateSegment(seg.id, { videoPrompt: e.target.value }), className: "w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white/60 focus:border-white/40 outline-none resize-none" })
              ] })
            ] }),
            seg.error && /* @__PURE__ */ jsx2("div", { className: "p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] text-red-400", children: seg.error })
          ] })
        ] }, seg.id)) })
      ] }),
      activeTab === "export" && /* @__PURE__ */ jsx2("div", { className: "max-w-4xl mx-auto flex flex-col items-center justify-center h-full gap-10", children: finalVideo ? /* @__PURE__ */ jsxs2("div", { className: "w-full space-y-8 animate-in zoom-in-95 duration-500", children: [
        /* @__PURE__ */ jsx2("div", { className: "aspect-video rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border border-white/10 relative bg-black", children: /* @__PURE__ */ jsx2("video", { src: finalVideo, controls: true, className: "w-full h-full" }) }),
        /* @__PURE__ */ jsxs2("div", { className: "flex justify-center gap-4", children: [
          /* @__PURE__ */ jsx2(FloatingButton, { onClick: async () => {
            const res = await fetch(finalVideo);
            const blob = await res.blob();
            const b64 = await new Promise((r) => {
              const reader = new FileReader();
              reader.onloadend = () => r(reader.result.split(",")[1]);
              reader.readAsDataURL(blob);
            });
            await Flow.download({ base64: b64, mimeType: "video/mp4", filename: "ai_production.mp4" });
          }, icon: "download", children: "Download Master Copy" }),
          /* @__PURE__ */ jsx2(FloatingButton, { variant: "secondary", onClick: () => setFinalVideo(null), children: "Re-stitch" })
        ] })
      ] }) : /* @__PURE__ */ jsxs2("div", { className: "text-center space-y-8", children: [
        /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[100px] text-white/5", children: "auto_videocam" }),
        /* @__PURE__ */ jsxs2("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx2("h2", { className: "text-3xl font-bold", children: "Ready for Master Export?" }),
          /* @__PURE__ */ jsx2("p", { className: "text-white/40 text-sm", children: 'Ensure all sequences in the timeline are "Ready Video".' })
        ] }),
        /* @__PURE__ */ jsx2(FloatingButton, { onClick: async () => {
          setIsProcessing(true);
          setStatus("Stitching final masterpiece...");
          try {
            const videos = segments.filter((s) => s.videoBase64).map((s) => s.videoBase64);
            let list = "";
            for (let i = 0; i < videos.length; i++) {
              const name = `f${i}.mp4`;
              await ffmpegService.writeFile(name, Uint8Array.from(atob(videos[i]), (c) => c.charCodeAt(0)));
              list += `file '${name}'
`;
            }
            await ffmpegService.writeFile("list.txt", new TextEncoder().encode(list));
            await ffmpegService.exec(["-f", "concat", "-safe", "0", "-i", "list.txt", "-c", "copy", "out.mp4"]);
            const data = await ffmpegService.readFile("out.mp4");
            setFinalVideo(URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })));
          } catch (e) {
            console.error(e);
          }
          setIsProcessing(false);
        }, loading: isProcessing, className: "px-12 py-4", children: "Process Master Stitch" })
      ] }) })
    ] }),
    status && /* @__PURE__ */ jsx2("div", { className: "fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-10", children: /* @__PURE__ */ jsxs2(GlassCard, { className: "px-4 py-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx2("span", { className: "w-2 h-2 rounded-full bg-white animate-pulse" }),
      /* @__PURE__ */ jsx2("span", { className: "text-xs font-medium tracking-tight", children: status }),
      /* @__PURE__ */ jsx2("button", { onClick: () => setStatus(""), className: "material-symbols-outlined text-[16px] text-white/20 hover:text-white", children: "close" })
    ] }) })
  ] });
}
export {
  App as default
};
