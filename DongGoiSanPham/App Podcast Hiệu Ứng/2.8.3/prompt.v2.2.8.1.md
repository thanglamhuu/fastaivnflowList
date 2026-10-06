Version 2.8.1a
Thêm label error để hiện lỗi trên Header hoặc tích hợp thu viện Toast để hiện các cảnh báo khi có lỗi thay vì alert error do chạy trong môi trường sanbox.
Thêm lựa chọn Giọng nói dạng combobox cùng dòng, thay thế vào vị trí Nam/Nữ giọng Miền Bắc/Miền Trung/Miền Nam. Khi tạo voice sẽ lấy theo lựa chọn này.
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KOC Studio - Voice & Script Director</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #0f141c; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #263142; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff6a00; }
  </style>
</head>
<body class="bg-[#090D14] text-slate-200 min-h-screen p-4 md:p-8 custom-scrollbar">

  <!-- HEADER -->
  <header class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
    <div>
      <div class="flex items-center gap-3">
        <span class="text-2xl font-black tracking-wider text-white">KOC<span class="text-[#ff6a00]">STUDIO</span></span>
        <span class="px-2.5 py-0.5 text-xs font-semibold bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/30 rounded-full tracking-wide">VOICE ENGINE V2</span>
      </div>
      <p class="text-xs text-slate-400 mt-1">Hệ thống chuẩn hóa 12 giọng đọc KOC tiếng Việt & khóa âm sắc đa phân cảnh</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        ACOUSTIC LOCK: 100%
      </div>
    </div>
  </header>

  <!-- MAIN WRAPPER -->
  <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

    <!-- CỘT TRÁI: DANH SÁCH 12 GIỌNG GỐC (5 COLS) -->
    <section class="lg:col-span-5 flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
          <span class="w-1.5 h-3.5 bg-[#ff6a00] rounded-sm"></span>
          1. CHỌN GIỌNG ĐỌC MẪU (12 PROFILES)
        </h2>
        <span id="selected-voice-count" class="text-xs text-slate-400 font-mono">Đang chọn: Nam Kỳ Án</span>
      </div>

      <!-- GRID 12 GIỌNG -->
      <div id="voice-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
        <!-- Javascript render 12 voice cards ở đây -->
      </div>

      <!-- KHỐI THÔNG SỐ KHÓA ÂM HỌC -->
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2.5">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thông Số Bất Biến Của Giọng Được Chọn</div>
        <div class="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
          <div class="p-2 rounded bg-slate-950/60 border border-slate-800/80">Base Model: <span id="param-base" class="text-[#ff6a00] font-bold">Zephyr</span></div>
          <div class="p-2 rounded bg-slate-950/60 border border-slate-800/80">Tốc Độ: <span id="param-speed" class="text-white">0.90x</span></div>
          <div class="p-2 rounded bg-slate-950/60 border border-slate-800/80">Cao Độ: <span id="param-pitch" class="text-white">-10%</span></div>
          <div class="p-2 rounded bg-slate-950/60 border border-slate-800/80">Chuẩn Hóa: <span class="text-emerald-400">-14 LUFS</span></div>
        </div>
        <p id="param-desc" class="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-800/60 pt-2">
          "Ominous whispering low-register, deliberate suspense pauses, controlled tension"
        </p>
      </div>
    </section>

    <!-- CỘT PHẢI: THỜI LƯỢNG, KỊCH BẢN & XUẤT PROMPT (7 COLS) -->
    <section class="lg:col-span-7 flex flex-col gap-6">

      <!-- 1. BỘ CHỌN THỜI LƯỢNG -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <span class="w-1.5 h-3.5 bg-[#ff6a00] rounded-sm"></span>
            2. TỔNG THỜI LƯỢNG VIDEO
          </label>
          <span id="scene-summary-tag" class="text-xs font-mono text-[#ff6a00] bg-[#ff6a00]/10 px-2 py-0.5 rounded border border-[#ff6a00]/20">
            2 Phân cảnh (8s + 8s)
          </span>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button type="button" onclick="selectDuration(8)" class="duration-btn py-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 text-xs font-bold transition">8s (1 Scene)</button>
          <button type="button" onclick="selectDuration(10)" class="duration-btn py-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 text-xs font-bold transition">10s (1 Scene)</button>
          <button type="button" onclick="selectDuration(16)" class="duration-btn active-duration py-2.5 rounded-lg border border-[#ff6a00] bg-[#ff6a00]/10 text-[#ff6a00] text-xs font-bold transition">16s (2 Scene)</button>
          <button type="button" onclick="selectDuration(20)" class="duration-btn py-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 text-xs font-bold transition">20s (2 Scene)</button>
          <button type="button" onclick="selectDuration(24)" class="duration-btn py-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 text-xs font-bold transition">24s (3 Scene)</button>
          <button type="button" onclick="selectDuration(30)" class="duration-btn py-2.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 text-xs font-bold transition">30s (3 Scene)</button>
        </div>
      </div>

      <!-- 2. TRÌNH SOẠN THẢO KỊCH BẢN TỪNG PHÂN CẢNH -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <span class="w-1.5 h-3.5 bg-[#ff6a00] rounded-sm"></span>
            3. BIÊN SOẠN THOẠI THEO PHÂN CẢNH (PACING GUARD)
          </label>
          <span class="text-[11px] text-slate-400">Khuyến nghị: 26 - 34 từ / 8s</span>
        </div>

        <div id="scenes-container" class="space-y-4">
          <!-- Javascript sẽ sinh các card kịch bản theo số phân cảnh -->
        </div>
      </div>

      <!-- 3. OUTPUT PROMPT BLOCK -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <span class="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></span>
            4. PROMPT XUẤT CHO ENGINE (VOICEPRINT LOCKED)
          </label>
          <button onclick="copyGeneratedPrompt()" class="px-3.5 py-1.5 bg-[#ff6a00] hover:bg-[#ff7b1a] text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-[#ff6a00]/20">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            SAO CHÉP PROMPT
          </button>
        </div>

        <pre id="output-prompt" class="w-full h-52 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 overflow-y-auto leading-relaxed custom-scrollbar whitespace-pre-wrap"></pre>
      </div>

    </section>
  </main>

  <!-- JAVASCRIPT ENGINE & EVENT HANDLING -->
  <script>
    // 1. DATA 12 GIỌNG CHUẨN HÓA
    const VOICE_DATA = [
      { id: "VOICE_01", name: "Nữ Trầm Bản Lĩnh", baseModel: "Kore", region: "Bắc", speed: 1.05, pitch: "-8%", desc: "Deep chest resonance, assertive, steady cadence, cold-stable timbre" },
      { id: "VOICE_02", name: "Nam Tri Kỷ", baseModel: "Fenrir", region: "Bắc / Nam", speed: 0.95, pitch: "-5%", desc: "Warm baritone, empathetic pacing, intimate low-frequency resonance" },
      { id: "VOICE_03", name: "Nữ Tươi Sáng & Hóm Hỉnh", baseModel: "Aoede", region: "Nam", speed: 1.20, pitch: "+12%", desc: "Bright, crisp treble, bouncy cadence, high clarity, non-shrill" },
      { id: "VOICE_04", name: "Nữ Chữa Lành & Tự Sự", baseModel: "Leda", region: "Bắc nhẹ", speed: 0.95, pitch: "-3%", desc: "Soft melodic low-register, airy delivery, intimate conversational cadence" },
      { id: "VOICE_05", name: "Nam Lãnh Đạo Hào Sảng", baseModel: "Charon", region: "Bắc", speed: 1.10, pitch: "-2%", desc: "Commanding baritone, authoritative chest projection, resonant, non-shouting" },
      { id: "VOICE_06", name: "Nam Trí Thức Điềm Đạm", baseModel: "Orpheus", region: "Bắc", speed: 1.00, pitch: "-4%", desc: "Composed, analytical baritone, steady calm articulation, scholarly pacing" },
      { id: "VOICE_07", name: "Nữ Trải Đời & Thực Tế", baseModel: "Kore", region: "Bắc", speed: 1.05, pitch: "-5%", desc: "Husky chest resonance, candid realism, grounding conversational tone" },
      { id: "VOICE_08", name: "Nữ Kể Chuyện & Tản Văn", baseModel: "Leda", region: "Bắc", speed: 0.90, pitch: "0%", desc: "Poetic lyrical cadence, tranquil, delicate articulation, soft airflow" },
      { id: "VOICE_09", name: "Nữ Chốt Đơn Bùng Nổ", baseModel: "Aoede", region: "Nam / Bắc", speed: 1.25, pitch: "+15%", desc: "High tempo, punchy projection, sharp commercial urgency, controlled volume" },
      { id: "VOICE_10", name: "Nữ Hóng Biến Xéo Xắt", baseModel: "Aoede", region: "Nam", speed: 1.20, pitch: "+10%", desc: "Sarcastic inflection, vocal fry, rapid cadence, sharp trailing accents" },
      { id: "VOICE_11", name: "Nam Kỳ Án & Bí Ẩn", baseModel: "Zephyr", region: "Bắc", speed: 0.90, pitch: "-10%", desc: "Ominous whispering low-register, deliberate suspense pauses, controlled tension" },
      { id: "VOICE_12", name: "Nữ POV Kiêu Kỳ", baseModel: "Kore", region: "Bắc", speed: 1.05, pitch: "+5%", desc: "Haughty superior drawl, crisp articulate cadence, detached elegance" }
    ];

    // Mẫu kịch bản test
    const DEFAULT_SCRIPTS = {
      1: "Đừng bao giờ tin vào những lời hứa hẹn làm giàu sau một đêm. Thị trường này không phải sòng bạc, nó là nơi thanh lọc những kẻ lười biếng và thiếu kỷ luật.",
      2: "Kiếm được tiền đã khó, giữ được tiền trước lòng tham của chính mình còn khó hơn gấp vạn lần. Bạn bước vào đây để đầu tư thực thụ, hay chỉ đang đánh bạc?"
    };

    let currentVoice = VOICE_DATA[10]; // Mặc định: Nam Kỳ Án (VOICE_11)
    let currentDuration = 16;          // Mặc định: 16s (2 scene)
    let sceneData = [];

    // 2. KHỞI TẠO GIAO DIỆN
    function initUI() {
      renderVoiceGrid();
      selectDuration(16);
    }

    function renderVoiceGrid() {
      const grid = document.getElementById("voice-grid");
      grid.innerHTML = VOICE_DATA.map((v) => {
        const isSelected = v.id === currentVoice.id;
        return `
          <div onclick="selectVoice('${v.id}')" 
               class="cursor-pointer p-3 rounded-xl border transition flex flex-col justify-between gap-2 ${
                 isSelected 
                 ? 'bg-[#ff6a00]/10 border-[#ff6a00] shadow-md shadow-[#ff6a00]/10' 
                 : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
               }">
            <div class="flex items-start justify-between gap-1">
              <span class="text-xs font-bold isSelected?'text-[#ff6a00]':'text-slate-200'">{v.name}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">${v.baseModel}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-400">
              <span>Miền: ${v.region}</span>
              <span class="font-mono text-slate-500">${v.speed}x | ${v.pitch}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function selectVoice(voiceId) {
      currentVoice = VOICE_DATA.find(v => v.id === voiceId) || VOICE_DATA[0];
      document.getElementById("selected-voice-count").innerText = `Đang chọn: ${currentVoice.name}`;
      document.getElementById("param-base").innerText = currentVoice.baseModel;
      document.getElementById("param-speed").innerText = `${currentVoice.speed}x`;
      document.getElementById("param-pitch").innerText = currentVoice.pitch;
      document.getElementById("param-desc").innerText = `"${currentVoice.desc}"`;
      renderVoiceGrid();
      updatePromptOutput();
    }

    function selectDuration(seconds) {
      currentDuration = seconds;
      document.querySelectorAll(".duration-btn").forEach(btn => {
        btn.classList.remove("border-[#ff6a00]", "bg-[#ff6a00]/10", "text-[#ff6a00]");
        btn.classList.add("border-slate-800", "bg-slate-900/50", "text-slate-300");
      });
      event.target.classList.add("border-[#ff6a00]", "bg-[#ff6a00]/10", "text-[#ff6a00]");
      event.target.classList.remove("border-slate-800", "bg-slate-900/50", "text-slate-300");

      generateSceneSlices(seconds);
    }

    function generateSceneSlices(totalSeconds) {
      let scenes = [];
      if (totalSeconds === 8) {
        scenes = [{ num: 1, duration: 8, tc: "00:00 - 00:08", targetWords: "26 - 32" }];
      } else if (totalSeconds === 10) {
        scenes = [{ num: 1, duration: 10, tc: "00:00 - 00:10", targetWords: "35 - 42" }];
      } else if (totalSeconds === 16) {
        scenes = [
          { num: 1, duration: 8, tc: "00:00 - 00:08", targetWords: "26 - 32", phase: "Pha 1 (Hook Drama)" },
          { num: 2, duration: 8, tc: "00:08 - 00:16", targetWords: "26 - 32", phase: "Pha 3 (Kết Mở)" }
        ];
      } else if (totalSeconds === 20) {
        scenes = [
          { num: 1, duration: 10, tc: "00:00 - 00:10", targetWords: "35 - 42", phase: "Pha 1 + 2" },
          { num: 2, duration: 10, tc: "00:10 - 00:20", targetWords: "35 - 42", phase: "Pha 2 + 3" }
        ];
      } else if (totalSeconds === 24) {
        scenes = [
          { num: 1, duration: 8, tc: "00:00 - 00:08", targetWords: "26 - 32", phase: "Pha 1 (Hook)" },
          { num: 2, duration: 8, tc: "00:08 - 00:16", targetWords: "26 - 32", phase: "Pha 2 (Luận điểm)" },
          { num: 3, duration: 8, tc: "00:16 - 00:24", targetWords: "26 - 32", phase: "Pha 3 (Kết mở)" }
        ];
      } else {
        scenes = [
          { num: 1, duration: 10, tc: "00:00 - 00:10", targetWords: "35 - 42", phase: "Pha 1 (Hook)" },
          { num: 2, duration: 10, tc: "00:10 - 00:20", targetWords: "35 - 42", phase: "Pha 2 (Luận điểm)" },
          { num: 3, duration: 10, tc: "00:20 - 00:30", targetWords: "35 - 42", phase: "Pha 3 (Kết mở)" }
        ];
      }

      document.getElementById("scene-summary-tag").innerText = `scenes.lengthPhâncảnh({scenes.map(s => s.duration + 's').join(' + ')})`;

      const container = document.getElementById("scenes-container");
      container.innerHTML = scenes.map((s, idx) => {
        const textVal = DEFAULT_SCRIPTS[s.num] || `Nội dung kịch bản phân cảnh 0${s.num} của bài nói podcast...`;
        return `
          <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-200">Scene 0s.num({s.tc}) • <span class="text-[#ff6a00]">${s.phase || 'Nội dung'}</span></span>
              <span id="meter-${idx}" class="font-mono text-[11px] text-slate-400">Đang tính...</span>
            </div>
            <textarea id="script-scene-idx"oninput="handleScriptInput({idx})" 
              class="w-full h-20 bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#ff6a00] resize-none custom-scrollbar leading-relaxed">${textVal}</textarea>
          </div>
        `;
      }).join('');

      sceneData = scenes;
      scenes.forEach((_, idx) => handleScriptInput(idx));
    }

    function handleScriptInput(index) {
      const textarea = document.getElementById(`script-scene-${index}`);
      const text = textarea.value.trim();
      const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
      const targetMin = sceneData[index].duration === 8 ? 26 : 35;
      const targetMax = sceneData[index].duration === 8 ? 34 : 42;

      const meter = document.getElementById(`meter-${index}`);
      if (wordCount < targetMin) {
        meter.innerHTML = `<span class="text-amber-400 font-bold">${wordCount} từ</span> (Thiếu từ, dễ dead air)`;
      } else if (wordCount > targetMax) {
        meter.innerHTML = `<span class="text-rose-400 font-bold">${wordCount} từ</span> (Nhiều từ, dễ bị nói vội)`;
      } else {
        meter.innerHTML = `<span class="text-emerald-400 font-bold">${wordCount} từ</span> (Đạt chuẩn)`;
      }

      updatePromptOutput();
    }

    function updatePromptOutput() {
      if (!sceneData || sceneData.length === 0) return;

      const fullPrompt = sceneData.map((s, idx) => {
        const textElem = document.getElementById(`script-scene-${idx}`);
        const scriptText = textElem ? textElem.value.trim() : "";
        const words = scriptText.length > 0 ? scriptText.split(/\s+/).length : 0;

        return `[PHÂN CẢNH 0${s.num} - TIMECODE: ${s.tc} | THỜI LƯỢNG: ${s.duration}.0s | MẬT ĐỘ: ${words} TỪ]
[UNIVERSAL ACOUSTIC & VOICEPRINT HARD-LOCK]:
- Language: Native Vietnamese (vi-VN).
- Voice Selection: ${currentVoice.name}
- Engine Config: Base Model: ${currentVoice.baseModel} | Speed: ${currentVoice.speed} | Pitch: ${currentVoice.pitch} | Accent: ${currentVoice.region}.
- Voiceprint Invariant: Lock 100% vocal tract geometry, formant baseline, and acoustic identity from ${currentVoice.baseModel}. Zero speaker switching across scenes.
- Acoustic Descriptors: ${currentVoice.desc}.
- Emotion Decoupling: Express drama, urgency, or warmth SOLELY through cadence, micro-pauses, and facial acting. STRICTLY FORBIDDEN to alter base pitch, volume gain, or vocal resonance across scenes.
- Gain Normalization: Lock steady studio gain (-14 LUFS). NO sudden shouting or fading whisper.
- Phonetic Articulation Lock: Flawless native Vietnamese tone articulation. Crisp Tone 6 (thanh Nặng) with glottal stop and distinct final stop /-k/ (e.g., "học").
- Strict Verbatim: Speak ONLY text in [SPOKEN DIALOGUE]. ZERO added starter/filler words. Speech duration fills exactly ${s.duration}.0s.

[SPOKEN DIALOGUE]:
"${scriptText}"

[CONSTRAINTS & AUDIO NEGATIVES]:
NO voice timbre change, NO speaker identity drift, NO pitch jumping between scenes, NO shouting, NO loud volume spikes, NO added filler words, NO trailing speech, NO stuttering, NO audio hallucination.`;
      }).join("\n\n" + "=".repeat(70) + "\n\n");

      document.getElementById("output-prompt").innerText = fullPrompt;
    }

    function copyGeneratedPrompt() {
      const promptText = document.getElementById("output-prompt").innerText;
      navigator.clipboard.writeText(promptText).then(() => {
        alert("Đã sao chép Master Prompt thành công!");
      });
    }

    // Chạy khi load trang
    window.onload = initUI;
  </script>
</body>
</html>
