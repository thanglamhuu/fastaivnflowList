// virtual:App.tsx
import { useState, useEffect } from "react";

// virtual:components/SidebarLeft.tsx
import { Flow } from "flow-sdk";

// virtual:components/Dropdown.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Dropdown = ({ label, value, options, onChange, className = "" }) => {
  return /* @__PURE__ */ jsxs("div", { className: `relative h-[52px] w-full border border-[#27272a] rounded-[10px] bg-[#0a0a0a] px-3 flex flex-col justify-center transition-colors hover:border-[#3f3f46] ${className}`, children: [
    /* @__PURE__ */ jsx("label", { className: "text-[9px] font-semibold text-[#71717a] uppercase tracking-wider mb-0", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between -mt-0.5", children: [
      /* @__PURE__ */ jsx(
        "select",
        {
          value,
          onChange: (e) => onChange(e.target.value),
          className: "bg-transparent text-[13px] text-[#fafafa] outline-none w-full appearance-none cursor-pointer font-medium pr-6",
          children: options.map((opt) => /* @__PURE__ */ jsx("option", { value: opt, className: "bg-[#0a0a0a] text-white", children: opt }, opt))
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[#52525b] pointer-events-none text-[18px] absolute right-3", children: "expand_more" })
    ] })
  ] });
};

// virtual:components/SidebarLeft.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SidebarLeft = ({ config, setConfig }) => {
  const selectModelImage = async () => {
    const media = await Flow.media.select({ filter: "image" });
    if (media) setConfig((prev) => ({ ...prev, modelImage: media }));
  };
  const selectProductImage = async () => {
    const media = await Flow.media.select({ filter: "image" });
    if (media) setConfig((prev) => ({ ...prev, productImage: media }));
  };
  const environments = ["T\u1EF1 \u0111\u1ED9ng", "Kho h\xE0ng l\u1EDBn", "Kho th\xE0nh ph\u1EA9m", "D\xE2y chuy\u1EC1n s\u1EA3n xu\u1EA5t", "Khu v\u1EF1c \u0111\xF3ng g\xF3i", "Khu v\u1EF1c l\u1EAFp r\xE1p", "Nh\xE0 m\xE1y ch\u1EBF bi\u1EBFn", "Khu tr\u01B0ng b\xE0y / Ki\u1EC3m \u0111\u1ECBnh"];
  const densities = ["B\xECnh th\u01B0\u1EDDng", "D\xE0y \u0111\u1EB7c", "Kh\u1ED5ng l\u1ED3"];
  const actions = ["T\u1EF1 \u0111\u1ED9ng", "C\u1EED ch\u1EC9 thuy\u1EBFt tr\xECnh", "C\u1EA7m s\u1EA3n ph\u1EA9m ch\xEDnh", "Tr\xECnh di\u1EC5n s\u1EA3n ph\u1EA9m", "Ki\u1EC3m tra s\u1EA3n ph\u1EA9m", "M\u1EDF h\u1ED9p s\u1EA3n ph\u1EA9m", "\u0110\u1EE9ng c\u1EA1nh kho h\xE0ng", "\u0110\u1EE9ng sau b\xE0n s\u1EA3n ph\u1EA9m"];
  const brandSources = ["T\u1EF1 \u0111\u1ED9ng qu\xE9t t\u1EEB S\u1EA3n ph\u1EA9m", "Nh\u1EADp tay t\xEAn th\u01B0\u01A1ng hi\u1EC7u", "Kh\xF4ng g\u1EAFn th\u01B0\u01A1ng hi\u1EC7u"];
  const spaceStyles = ["T\u1EF1 \u0111\u1ED9ng", "Kho h\xE0ng Th\xE0nh ph\u1EA9m Chuy\xEAn nghi\u1EC7p", "Showroom Tr\u01B0ng b\xE0y Nh\xE0 m\xE1y", "Khu v\u1EF1c D\xE2y chuy\u1EC1n S\u1EA3n xu\u1EA5t", "T\u1ED1i gi\u1EA3n / Kh\xF4ng gian m\u1EDF"];
  const outfits = ["T\u1EF1 \u0111\u1ED9ng", "Gi\u1EEF nguy\xEAn trang ph\u1EE5c g\u1ED1c", "M\u1EB7c \u0111\u1ED3ng ph\u1EE5c nh\xE0 x\u01B0\u1EDFng", "M\u1EB7c/\u0110eo tr\u1EF1c ti\u1EBFp s\u1EA3n ph\u1EA9m"];
  return /* @__PURE__ */ jsx2("aside", { className: "w-[270px] flex-shrink-0 bg-[#080808] border-r border-[#1f1f23] flex flex-col overflow-hidden", children: /* @__PURE__ */ jsxs2("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-3 space-y-8", children: [
    /* @__PURE__ */ jsxs2("section", { children: [
      /* @__PURE__ */ jsx2("h3", { className: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4e4e7] mb-3 ml-0.5", children: "\u1EA2NH M\u1EAAU NG\u01AF\u1EDCI M\u1EAAU" }),
      /* @__PURE__ */ jsx2(
        "div",
        {
          onClick: selectModelImage,
          className: "w-full h-[132px] rounded-[10px] border border-dashed border-[#27272a] bg-[#000000] flex flex-col items-center justify-center cursor-pointer hover:border-[#3f3f46] transition-all overflow-hidden group",
          children: config.modelImage ? /* @__PURE__ */ jsx2("img", { src: `data:${config.modelImage.mimeType};base64,${config.modelImage.base64}`, className: "w-full h-full object-cover", alt: "Model" }) : /* @__PURE__ */ jsxs2("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[#3f3f46] text-[28px] mb-1", children: "add_photo_alternate" }),
            /* @__PURE__ */ jsx2("span", { className: "text-[11px] text-[#a1a1aa] font-medium", children: "Nh\u1EA5n \u0111\u1EC3 ch\u1ECDn \u1EA3nh" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx2("p", { className: "mt-2 text-[10px] text-[#52525b] italic leading-tight px-1", children: "D\xF9ng \u0111\u1EC3 tham chi\u1EBFu nh\u1EADn di\u1EC7n khu\xF4n m\u1EB7t, ki\u1EC3u t\xF3c v\xE0 t\u1EF7 l\u1EC7 c\u01A1 th\u1EC3." })
    ] }),
    /* @__PURE__ */ jsxs2("section", { children: [
      /* @__PURE__ */ jsx2("h3", { className: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4e4e7] mb-3 ml-0.5", children: "\u1EA2NH M\u1EAAU S\u1EA2N PH\u1EA8M" }),
      /* @__PURE__ */ jsx2(
        "div",
        {
          onClick: selectProductImage,
          className: "w-full h-[132px] rounded-[10px] border border-dashed border-[#27272a] bg-[#000000] flex flex-col items-center justify-center cursor-pointer hover:border-[#3f3f46] transition-all overflow-hidden group",
          children: config.productImage ? /* @__PURE__ */ jsx2("img", { src: `data:${config.productImage.mimeType};base64,${config.productImage.base64}`, className: "w-full h-full object-cover", alt: "Product" }) : /* @__PURE__ */ jsxs2("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[#3f3f46] text-[28px] mb-1", children: "inventory_2" }),
            /* @__PURE__ */ jsx2("span", { className: "text-[11px] text-[#a1a1aa] font-medium", children: "Nh\u1EA5n \u0111\u1EC3 ch\u1ECDn \u1EA3nh" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx2("p", { className: "mt-2 text-[10px] text-[#52525b] italic leading-tight px-1", children: "D\xF9ng \u0111\u1EC3 tham chi\u1EBFu h\xECnh d\xE1ng, m\xE0u s\u1EAFc v\xE0 bao b\xEC s\u1EA3n ph\u1EA9m th\u1EADt." })
    ] }),
    /* @__PURE__ */ jsxs2("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx2("h3", { className: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4e4e7] ml-0.5", children: "THI\u1EBET L\u1EACP B\u1ED0I C\u1EA2NH" }),
      /* @__PURE__ */ jsx2(Dropdown, { label: "M\xF4i tr\u01B0\u1EDDng nh\xE0 m\xE1y", value: config.environment, options: environments, onChange: (val) => setConfig((prev) => ({ ...prev, environment: val })) }),
      /* @__PURE__ */ jsx2(Dropdown, { label: "M\u1EADt \u0111\u1ED9 h\xE0ng h\xF3a", value: config.density, options: densities, onChange: (val) => setConfig((prev) => ({ ...prev, density: val })) }),
      /* @__PURE__ */ jsx2(Dropdown, { label: "H\xE0nh \u0111\u1ED9ng ng\u01B0\u1EDDi m\u1EABu", value: config.action, options: actions, onChange: (val) => setConfig((prev) => ({ ...prev, action: val })) })
    ] }),
    /* @__PURE__ */ jsxs2("section", { className: "space-y-3 pb-8", children: [
      /* @__PURE__ */ jsx2("h3", { className: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4e4e7] ml-0.5", children: "THI\u1EBET L\u1EACP TH\u01AF\u01A0NG HI\u1EC6U" }),
      /* @__PURE__ */ jsx2(Dropdown, { label: "Ngu\u1ED3n nh\u1EADn di\u1EC7n", value: config.brandSource, options: brandSources, onChange: (val) => setConfig((prev) => ({ ...prev, brandSource: val })) }),
      config.brandSource === "Nh\u1EADp tay t\xEAn th\u01B0\u01A1ng hi\u1EC7u" && /* @__PURE__ */ jsx2("div", { className: "px-0.5", children: /* @__PURE__ */ jsx2(
        "input",
        {
          type: "text",
          value: config.brandName,
          onChange: (e) => setConfig((prev) => ({ ...prev, brandName: e.target.value })),
          placeholder: "Nh\u1EADp t\xEAn th\u01B0\u01A1ng hi\u1EC7u...",
          className: "w-full h-[48px] bg-[#0a0a0a] border border-[#1f1f23] rounded-[10px] px-3.5 text-[12px] text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#27272a]"
        }
      ) }),
      /* @__PURE__ */ jsx2(Dropdown, { label: "Phong c\xE1ch kh\xF4ng gian", value: config.spaceStyle, options: spaceStyles, onChange: (val) => setConfig((prev) => ({ ...prev, spaceStyle: val })) }),
      /* @__PURE__ */ jsx2(Dropdown, { label: "Trang ph\u1EE5c ng\u01B0\u1EDDi m\u1EABu", value: config.outfit, options: outfits, onChange: (val) => setConfig((prev) => ({ ...prev, outfit: val })) })
    ] })
  ] }) });
};

// virtual:components/MainView.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var MainView = ({ results, isGenerating, progress, error }) => {
  if (error) {
    return /* @__PURE__ */ jsxs3("div", { className: "flex-1 flex flex-col items-center justify-center p-12 text-center bg-black", children: [
      /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[#ef4444]/30 text-[48px] mb-4", children: "report" }),
      /* @__PURE__ */ jsx3("h2", { className: "text-[16px] font-bold text-[#ef4444]/80 mb-2 uppercase tracking-widest", children: "L\u1ED7i h\u1EC7 th\u1ED1ng" }),
      /* @__PURE__ */ jsx3("p", { className: "text-[#52525b] text-[12px] max-w-[280px]", children: error })
    ] });
  }
  if (!isGenerating && results.length === 0) {
    return /* @__PURE__ */ jsxs3("div", { className: "flex-1 flex flex-col items-center justify-center p-12 text-center bg-black", children: [
      /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[#27272a] text-[40px] mb-4", children: "factory" }),
      /* @__PURE__ */ jsx3("h2", { className: "text-[18px] font-bold text-white mb-2 uppercase tracking-[0.2em]", children: "S\u1EB5n s\xE0ng \u0111i\u1EC1u ph\u1ED1i" }),
      /* @__PURE__ */ jsxs3("p", { className: "text-[#52525b] text-[13px] max-w-[320px] leading-relaxed font-medium", children: [
        "T\u1EA3i l\xEAn \u1EA3nh m\u1EABu ng\u01B0\u1EDDi m\u1EABu v\xE0 s\u1EA3n ph\u1EA9m \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u",
        /* @__PURE__ */ jsx3("br", {}),
        "t\u1EA1o ra c\xE1c c\u1EA3nh quay kho b\xE1u nh\xE0 m\xE1y ch\xE2n th\u1EF1c",
        /* @__PURE__ */ jsx3("br", {}),
        "v\u1EDBi nh\u1EADn di\u1EC7n th\u01B0\u01A1ng hi\u1EC7u ri\xEAng."
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx3("div", { className: "flex-1 flex flex-col p-6 lg:p-10 bg-black", children: /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center", children: [
    isGenerating && Array.from({ length: progress?.total || 4 }).map((_, i) => {
      const isFinished = results.length > i;
      if (isFinished) return null;
      const isActive = results.length === i;
      return /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx3("div", { className: "text-[9px] font-bold text-[#3f3f46] uppercase tracking-[0.2em] px-1 truncate", children: isActive ? progress?.label : `CH\u1EDC \u0110\u1EA0O DI\u1EC4N C\u1EA2NH ${i + 1}...` }),
        /* @__PURE__ */ jsxs3("div", { className: "aspect-[9/16] bg-[#080808] border border-[#1f1f23] rounded-[15px] flex flex-col items-center justify-center relative overflow-hidden", children: [
          isActive && /* @__PURE__ */ jsx3("div", { className: "absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent animate-pulse" }),
          /* @__PURE__ */ jsx3("span", { className: `material-symbols-outlined ${isActive ? "text-white/20 animate-spin" : "text-[#18181b]"} text-[32px]`, children: isActive ? "progress_activity" : "hourglass_top" })
        ] })
      ] }, `loading-${i}`);
    }),
    results.map((res, i) => /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-3 animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsx3("div", { className: "text-[9px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] px-1 truncate", children: res.label }),
      /* @__PURE__ */ jsx3("div", { className: "relative aspect-[9/16] rounded-[15px] overflow-hidden border border-[#1f1f23] bg-[#080808] group transition-all hover:border-[#27272a] shadow-xl", children: /* @__PURE__ */ jsx3(
        "img",
        {
          src: `data:${res.mimeType};base64,${res.base64}`,
          className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
          alt: res.label
        }
      ) })
    ] }, i))
  ] }) });
};

// virtual:components/SidebarRight.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var SidebarRight = ({ config, setConfig, onGenerate, onExport, isGenerating, hasResults }) => {
  const cameraStrategies = [
    "Tr\u1ED9n t\u1EF1 \u0111\u1ED9ng",
    "G\xF3c cao to\xE0n c\u1EA3nh",
    "Ch\xEDnh di\u1EC7n n\xE2ng cao",
    "Ngang m\u1EAFt trung c\u1EA3nh",
    "To\xE0n c\u1EA3nh nh\xE0 m\xE1y",
    "S\u1EA3n ph\u1EA9m ti\u1EC1n c\u1EA3nh",
    "L\u1ED1i \u0111i kho h\xE0ng",
    "D\xE2y chuy\u1EC1n s\u1EA3n xu\u1EA5t",
    "Tr\xECnh di\u1EC5n t\u1EA1i b\xE0n",
    "S\u1EA3n ph\u1EA9m ti\xEAu bi\u1EC3u"
  ];
  const counts = [1, 2, 4, 6, 8];
  const aspectRatios = ["9:16", "4:5", "1:1", "16:9"];
  const canGenerate = config.modelImage && config.productImage && !isGenerating;
  return /* @__PURE__ */ jsxs4("aside", { className: "w-[270px] flex-shrink-0 bg-[#080808] border-l border-[#1f1f23] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex-1 p-3 space-y-8 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ jsxs4("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx4("h3", { className: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4e4e7] ml-0.5", children: "CHI\u1EBEN L\u01AF\u1EE2C CAMERA" }),
        /* @__PURE__ */ jsx4(Dropdown, { label: "G\xF3c quay \u0111\u1EA1o di\u1EC5n", value: config.cameraStrategy, options: cameraStrategies, onChange: (val) => setConfig((prev) => ({ ...prev, cameraStrategy: val })) })
      ] }),
      /* @__PURE__ */ jsxs4("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx4("h3", { className: "text-[10px] font-bold uppercase tracking-[0.12em] text-[#e4e4e7] ml-0.5", children: "\u0110\u1ECANH D\u1EA0NG \u0110\u1EA6U RA" }),
        /* @__PURE__ */ jsxs4("div", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsx4(Dropdown, { label: "S\u1ED1 l\u01B0\u1EE3ng \u1EA3nh", value: config.imageCount, options: counts, onChange: (val) => setConfig((prev) => ({ ...prev, imageCount: Number(val) })) }),
          /* @__PURE__ */ jsx4(Dropdown, { label: "T\u1EF7 l\u1EC7", value: config.aspectRatio, options: aspectRatios, onChange: (val) => setConfig((prev) => ({ ...prev, aspectRatio: val })) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "p-3 mt-auto border-t border-[#1f1f23]/30 space-y-3 bg-[#080808]", children: [
      hasResults && !isGenerating && /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: onExport,
          className: "w-full h-[52px] bg-[#0a0a0a] border border-[#1f1f23] text-[#a1a1aa] rounded-[10px] font-bold text-[11px] uppercase tracking-[0.12em] transition-all hover:bg-[#121214] flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[18px]", children: "download" }),
            "Xu\u1EA5t t\u1EA5t c\u1EA3 \u1EA3nh"
          ]
        }
      ),
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: onGenerate,
          disabled: !canGenerate,
          className: `w-full h-[52px] rounded-[10px] flex items-center justify-center gap-2 font-black uppercase tracking-[0.15em] text-[12px] transition-all duration-300 ${canGenerate ? "bg-white text-black hover:bg-[#d4d4d8] active:scale-[0.98]" : "bg-[#18181b] text-[#3f3f46] cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[18px]", children: isGenerating ? "sync" : "auto_awesome" }),
            isGenerating ? "\u0110ang \u0111\u1EA1o di\u1EC5n..." : "T\u1EA1o c\xE1c c\u1EA3nh quay"
          ]
        }
      )
    ] })
  ] });
};

// virtual:services/generation.ts
import { Flow as Flow2 } from "flow-sdk";
var ENV_MAP = {
  "T\u1EF1 \u0111\u1ED9ng": "AI autonomously decides the most suitable industrial setting based on the product and model.",
  "Kho h\xE0ng l\u1EDBn": "ENVIRONMENT: A massive industrial high-bay warehouse with towering storage racks and heavy-duty infrastructure.",
  "Kho th\xE0nh ph\u1EA9m": "ENVIRONMENT: A clean, organized storage area for finished goods with rows of boxed products ready for shipping.",
  "D\xE2y chuy\u1EC1n s\u1EA3n xu\u1EA5t": "ENVIRONMENT: An active manufacturing floor with automated conveyor belts and production machinery.",
  "Khu v\u1EF1c \u0111\xF3ng g\xF3i": "ENVIRONMENT: A busy logistics station with packaging materials, boxes, and shipping activities.",
  "Khu v\u1EF1c l\u1EAFp r\xE1p": "ENVIRONMENT: A technical assembly zone with workstations and industrial tools.",
  "Nh\xE0 m\xE1y ch\u1EBF bi\u1EBFn": "ENVIRONMENT: A large-scale processing facility with industrial equipment and high-volume throughput.",
  "Khu tr\u01B0ng b\xE0y / Ki\u1EC3m \u0111\u1ECBnh": "ENVIRONMENT: A professional quality control area or factory showroom with clean industrial lighting."
};
var DENSITY_MAP = {
  "B\xECnh th\u01B0\u1EDDng": "DENSITY: A realistic, moderate volume of background inventory and goods.",
  "D\xE0y \u0111\u1EB7c": "DENSITY: Heavily packed with a high volume of inventory and stock items filling the midground and background.",
  "Kh\u1ED5ng l\u1ED3": "DENSITY: Massive industrial scale with an overwhelming quantity of products stretching infinitely into the distance."
};
var ACTION_MAP = {
  "T\u1EF1 \u0111\u1ED9ng": "AI autonomously decides the best professional interaction between the model and the product.",
  "C\u1EED ch\u1EC9 thuy\u1EBFt tr\xECnh": "ACTION: The model is using clear hand gestures to present the product and the industrial facility.",
  "C\u1EA7m s\u1EA3n ph\u1EA9m ch\xEDnh": "ACTION: The model is explicitly holding the primary product from the reference image.",
  "Tr\xECnh di\u1EC5n s\u1EA3n ph\u1EA9m": "ACTION: The model is demonstrating or showcasing the features of the product.",
  "Ki\u1EC3m tra s\u1EA3n ph\u1EA9m": "ACTION: The model is carefully inspecting the product sample for quality control.",
  "M\u1EDF h\u1ED9p s\u1EA3n ph\u1EA9m": "ACTION: The model is in the act of unboxing or opening a package containing the product.",
  "\u0110\u1EE9ng c\u1EA1nh kho h\xE0ng": "ACTION: The model is standing confidently next to a large rack or stack of goods.",
  "\u0110\u1EE9ng sau b\xE0n s\u1EA3n ph\u1EA9m": "ACTION: The model is positioned behind an industrial workbench where the product is displayed."
};
var SPACE_STYLE_MAP = {
  "T\u1EF1 \u0111\u1ED9ng": "AI autonomously selects a professional and realistic industrial spatial style.",
  "Kho h\xE0ng Th\xE0nh ph\u1EA9m Chuy\xEAn nghi\u1EC7p": "SPACE: Sleek, modern, organized, and highly professional logistics atmosphere.",
  "Showroom Tr\u01B0ng b\xE0y Nh\xE0 m\xE1y": "SPACE: A hybrid of a clean showroom display area within a real factory context.",
  "Khu v\u1EF1c D\xE2y chuy\u1EC1n S\u1EA3n xu\u1EA5t": "SPACE: Gritty, authentic, and mechanical manufacturing floor with high detail.",
  "T\u1ED1i gi\u1EA3n / Kh\xF4ng gian m\u1EDF": "SPACE: A vast, clean, open industrial floor with high ceilings and minimal clutter."
};
var OUTFIT_MAP = {
  "T\u1EF1 \u0111\u1ED9ng": "AI autonomously selects professional clothing suitable for an industrial environment.",
  "Gi\u1EEF nguy\xEAn trang ph\u1EE5c g\u1ED1c": "OUTFIT: Model MUST wear the exact same clothing seen in the first reference image.",
  "M\u1EB7c \u0111\u1ED3ng ph\u1EE5c nh\xE0 x\u01B0\u1EDFng": "OUTFIT: Model MUST wear a standard industrial factory uniform, jumpsuit, or professional work overalls.",
  "M\u1EB7c/\u0110eo tr\u1EF1c ti\u1EBFp s\u1EA3n ph\u1EA9m": "OUTFIT: Model is physically wearing or using the product directly as part of their attire or gear."
};
var CAMERA_MAP = {
  "Tr\u1ED9n t\u1EF1 \u0111\u1ED9ng": "Varying cinematic perspectives.",
  "G\xF3c cao to\xE0n c\u1EA3nh": "CAMERA: High-angle bird-eye view showing the vast scale of the entire factory floor.",
  "Ch\xEDnh di\u1EC7n n\xE2ng cao": "CAMERA: Elevated front-view perspective looking down at the scene.",
  "Ngang m\u1EAFt trung c\u1EA3nh": "CAMERA: Eye-level medium shot framing the model and product realistically.",
  "To\xE0n c\u1EA3nh nh\xE0 m\xE1y": "CAMERA: Wide establishing shot focusing on the massive infrastructure and scale.",
  "S\u1EA3n ph\u1EA9m ti\u1EC1n c\u1EA3nh": "CAMERA: Deep depth-of-field with the product in sharp focus in the foreground.",
  "L\u1ED1i \u0111i kho h\xE0ng": "CAMERA: Vanishing point perspective looking down a long, deep aisle between warehouse racks.",
  "D\xE2y chuy\u1EC1n s\u1EA3n xu\u1EA5t": "CAMERA: Focused angle highlighting the movement and depth of the production line.",
  "Tr\xECnh di\u1EC5n t\u1EA1i b\xE0n": "CAMERA: Medium-close shot focused on the interaction at a workbench.",
  "S\u1EA3n ph\u1EA9m ti\xEAu bi\u1EC3u": "CAMERA: Centric commercial shot where the primary product is the main hero focal point."
};
async function generateImages(config, onProgress) {
  const results = [];
  if (!config.modelImage || !config.productImage) {
    throw new Error("Vui l\xF2ng ch\u1ECDn \u0111\u1EA7y \u0111\u1EE7 \u1EA3nh m\u1EABu ng\u01B0\u1EDDi m\u1EABu v\xE0 \u1EA3nh s\u1EA3n ph\u1EA9m.");
  }
  const modelId = config.modelImage.mediaId;
  const productId = config.productImage.mediaId;
  for (let i = 0; i < config.imageCount; i++) {
    let currentCamera = config.cameraStrategy;
    if (config.cameraStrategy === "Tr\u1ED9n t\u1EF1 \u0111\u1ED9ng") {
      const strategies = [
        "G\xF3c cao to\xE0n c\u1EA3nh",
        "L\u1ED1i \u0111i kho h\xE0ng",
        "D\xE2y chuy\u1EC1n s\u1EA3n xu\u1EA5t",
        "Ch\xEDnh di\u1EC7n n\xE2ng cao",
        "Ngang m\u1EAFt trung c\u1EA3nh",
        "To\xE0n c\u1EA3nh nh\xE0 m\xE1y"
      ];
      currentCamera = strategies[i % strategies.length];
    }
    const label = currentCamera.toUpperCase();
    onProgress(i + 1, config.imageCount, `\u0110ANG \u0110\u1EA0O DI\u1EC4N: ${label}`);
    let brandDesc = "";
    if (config.brandSource === "Nh\u1EADp tay t\xEAn th\u01B0\u01A1ng hi\u1EC7u" && config.brandName) {
      brandDesc = `BRAND: Clearly incorporate the brand name "${config.brandName}" on factory banners, shelves, or background boxes.`;
    } else if (config.brandSource === "T\u1EF1 \u0111\u1ED9ng qu\xE9t t\u1EEB S\u1EA3n ph\u1EA9m") {
      brandDesc = "BRAND: Automatically identify and maintain the brand identity seen on the product reference image.";
    } else {
      brandDesc = "BRAND: Do not add any additional branding or custom logos.";
    }
    const prompt = `
MODEL IDENTITY: Mandatory maintenance of the model from the first reference image (face features, hair style, body shape, and proportions).
PRODUCT IDENTITY: Mandatory maintenance of the product from the second reference image (exact shape, color, materials, labels, and design).

ENVIRONMENT: ${ENV_MAP[config.environment]}
DENSITY: ${DENSITY_MAP[config.density]}
ACTION: ${ACTION_MAP[config.action]}
${brandDesc}
SPACE: ${SPACE_STYLE_MAP[config.spaceStyle]}
OUTFIT: ${OUTFIT_MAP[config.outfit]}
CAMERA: ${CAMERA_MAP[currentCamera]}

Every explicitly selected option is mandatory. 
Do not ignore, weaken, replace, or reinterpret an explicitly selected option. 
Only options set to Auto may be decided freely by the AI.

STYLE: Photorealistic industrial photography, 8k resolution, cinematic lighting, sharp details, realistic textures, commercial factory context. No empty spaces, no studio backdrops.
`.trim();
    try {
      const result = await Flow2.generate.image({
        prompt,
        referenceImageMediaIds: [modelId, productId],
        modelDisplayName: "\u{1F34C} Nano Banana Pro",
        aspectRatio: config.aspectRatio
      });
      results.push({
        mediaId: result.mediaId,
        base64: result.base64,
        mimeType: result.mimeType,
        label
      });
    } catch (err) {
      console.error(`L\u1ED7i khi t\u1EA1o \u1EA3nh ${i + 1}:`, err);
      throw err;
    }
  }
  return results;
}

// virtual:App.tsx
import { Flow as Flow3 } from "flow-sdk";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function App() {
  const [config, setConfig] = useState({
    modelImage: null,
    productImage: null,
    environment: "T\u1EF1 \u0111\u1ED9ng",
    density: "B\xECnh th\u01B0\u1EDDng",
    action: "T\u1EF1 \u0111\u1ED9ng",
    brandSource: "T\u1EF1 \u0111\u1ED9ng qu\xE9t t\u1EEB S\u1EA3n ph\u1EA9m",
    brandName: "",
    spaceStyle: "T\u1EF1 \u0111\u1ED9ng",
    outfit: "T\u1EF1 \u0111\u1ED9ng",
    cameraStrategy: "Tr\u1ED9n t\u1EF1 \u0111\u1ED9ng",
    imageCount: 4,
    aspectRatio: "9:16"
  });
  const [results, setResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";
    document.head.appendChild(link);
  }, []);
  const handleGenerate = async () => {
    if (!config.modelImage || !config.productImage) return;
    setError(null);
    setIsGenerating(true);
    setResults([]);
    try {
      const newResults = await generateImages(config, (current, total, label) => {
        setProgress({ current, total, label });
      });
      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "\u0110\xE3 c\xF3 l\u1ED7i x\u1EA3y ra.");
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };
  const handleExportAll = async () => {
    if (results.length === 0) return;
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const ext = res.mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
      await Flow3.download({
        base64: res.base64,
        mimeType: res.mimeType,
        filename: `Anh_LP_V1_${i + 1}.${ext}`
      });
    }
  };
  return /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-[270px_minmax(0,1fr)_270px] h-screen w-full bg-[#050505] text-[#e4e4e7] overflow-hidden font-sans select-none", children: [
    /* @__PURE__ */ jsx5(SidebarLeft, { config, setConfig }),
    /* @__PURE__ */ jsx5("main", { className: "flex flex-col bg-[#000000] overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsx5(
      MainView,
      {
        results,
        isGenerating,
        progress,
        error
      }
    ) }),
    /* @__PURE__ */ jsx5(
      SidebarRight,
      {
        config,
        setConfig,
        onGenerate: handleGenerate,
        onExport: handleExportAll,
        isGenerating,
        hasResults: results.length > 0
      }
    ),
    /* @__PURE__ */ jsx5("style", { children: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f23; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #27272a; }
        
        select {
          background-image: none;
        }
      ` })
  ] });
}
export {
  App as default
};
