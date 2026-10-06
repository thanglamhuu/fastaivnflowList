import { Flow } from 'flow-sdk';
import { Scene, CameraRig } from '../types';
import { VOICE_PRESETS } from '../constants/voicePresets';
import { CAMERA_LABELS } from '../constants';
/**
 * QUY TẮC KHÓA CỨNG THỜI LƯỢNG (STRICT DURATION LOCK)
 * Chia kịch bản thành các phân cảnh dựa trên mốc thời lượng Omni (8s, 10s, 16s, 20s, 30s).
 */
export const splitScriptStrict = (script: string, totalSec: number): Scene[] => {
  let numScenes = 1;
  let secPerScene = totalSec;
  if (totalSec <= 10) {
    numScenes = 1;
  } else if (totalSec <= 20) {
    numScenes = 2;
    secPerScene = totalSec / 2;
  } else {
    numScenes = 3;
    secPerScene = totalSec / 3;
  }
  const words = script.trim().split(/\s+/);
  const wordsPerScene = Math.floor(words.length / numScenes);
  const scenes: Scene[] = [];
  for (let i = 0; i < numScenes; i++) {
    const startIdx = i * wordsPerScene;
    const endIdx = i === numScenes - 1 ? words.length : (i + 1) * wordsPerScene;
    const sceneScript = words.slice(startIdx, endIdx).join(' ');
    scenes.push({
      id: i + 1,
      startTime: i * secPerScene,
      endTime: (i + 1) * secPerScene,
      script: sceneScript,
      cameraRig: i === 0 ? 'CAM_1_FRONT_MCU' : (i === 1 ? 'CAM_2_SIDE_CU' : 'CAM_3_TIGHT_CU'),
      isCameraLocked: true,
      status: 'idle',
      progress: 0
    });
  }
  return scenes;
};
/**
 * COMPILER CHUẨN OMNI V4.1
 * Chuyển hóa scene thành prompt kỹ thuật "Khóa chết vân giọng" và "Mỏ neo Biometric".
 */
export const compileVideoPrompt = async (
  scene: Scene, 
  voiceId?: string,
  sceneIndex: number = 0,
  totalScenes: number = 1
): Promise<string> => {
  const voice = VOICE_PRESETS.find(v => v.id === voiceId) || VOICE_PRESETS[0];
  const isLocked = scene.isCameraLocked;
  const duration = (scene.endTime - scene.startTime).toFixed(1);
  const wordCount = scene.script.split(/\s+/).length;
  // XÁC ĐỊNH PHA DIỄN XUẤT (PHASE ACTING)
  let actingDirectives = "";
  if (sceneIndex === 0) {
    actingDirectives = "Pha 1 (Hook Drama / Tư Duy Ngược): Câu ngắn, sốc. Diễn xuất: Thần thái lạnh lùng ('mặt lạnh như tiền'), mắt sắc bén nhìn thẳng camera. Âm sắc giữ nguyên, chỉ hạ tốc độ và nhấn nhịp.";
  } else if (sceneIndex === totalScenes - 1) {
    actingDirectives = "Pha 3 (Kết Mở & Khoảng Lặng): Câu hỏi tu từ hoặc kết mở. Dứt câu, giữ ánh mắt suy tư hướng về người xem, khép môi tự nhiên trong khoảng lặng tĩnh 0.8s - 1.0s.";
  } else {
    actingDirectives = "Pha 2 (Luận Điểm Đồng Hành): Chuyển sang phong thái diễn giả chuyên nghiệp, gần gũi. Tay cử động tự nhiên (chuẩn giải phẫu 5 ngón), nhướn mày, nghiêng đầu nhấn nhá.";
  }
  const modeTag = isLocked ? 'STATIC LOCKED-OFF MODE' : 'DYNAMIC MULTI-CAM MODE';
  const directorRig = CAMERA_LABELS[scene.cameraRig] || scene.cameraRig;
  // CƠ CHẾ MASTER ANCHOR (IDENTITY & ASSET LOCK)
  const assetLock = `
[IDENTITY & ASSET LOCK]:
- Face & Eyewear: 1:1 biometric clone from [MASTER_REF_IMAGE]. Stable jawline, nose contour, eyes, and glasses frame. Zero morphing.
- Wardrobe & Studio: Exact clothing, fabric texture, and chest logo from [MASTER_REF_IMAGE]. Shure mic locked strictly on right desk side.`;
  // CƠ CHẾ KHÓA VÂN GIỌNG (UNIVERSAL ACOUSTIC HARD-LOCK)
  const acousticLock = `
[UNIVERSAL ACOUSTIC & VOICEPRINT HARD-LOCK]:
- Language: Native Vietnamese (vi-VN). 
- Voice Profile: ${voice.label} (Base Model: ${voice.baseVoice}, Speed: ${voice.speed}, Pitch: ${voice.pitch}).
- Timbre Invariant: Lock 100% vocal tract geometry, formant baseline, and acoustic identity from ${voice.baseVoice}. 
- Emotion Decoupling: Express drama, urgency, or warmth SOLELY through cadence, pauses, and facial acting. STRICTLY FORBIDDEN to alter base pitch, volume gain, or vocal resonance across scenes.
- Articulation: Native pronunciation, clear Tone 6 (thanh Nặng) and final stop /-k/.
- Verbatim: Speak ONLY text in [SPOKEN DIALOGUE]. Zero added words. Controlled pacing filling ${duration}s.`;
  if (isLocked) {
    return `
[CHẾ ĐỘ B: "${modeTag}"]
[SCENE TIMECODE & DURATION]:
- Timecode: ${scene.startTime}s - ${scene.endTime}s | Target Duration: ${duration}s | Word Count: ${wordCount} words.
${acousticLock}
[FRAME & CAMERA RIG]:
- Boundary Conditioning: Start frame conditioned on [MASTER_REF_IMAGE].
- Rig Execution: ${directorRig}. 100% static tripod perspective. Zero unintended camera wobble or drifting.
${assetLock}
[ACTING & KINESICS]:
- ${actingDirectives}
- Authentic hand movements on desk (strict 5 fingers), subtle nods, natural micro-expressions.
[SPOKEN DIALOGUE]:
"${scene.script}"
[CONSTRAINTS & NEGATIVES]:
Vertical 9:16, static tripod, NO voice timbre drift, NO speaker switching, NO pitch variation, NO wardrobe alteration, NO facial morphing, NO mic flipping, NO deformed hands, NO extra words, NO dead silence, NO sparkle icons, NO text, NO HUD.
    `.trim();
  }
  return `
[CHẾ ĐỘ A: "${modeTag}"]
[SCENE TIMECODE & DURATION]:
- Timecode: ${scene.startTime}s - ${scene.endTime}s | Target Duration: ${duration}s | Word Count: ${wordCount} words.
${acousticLock}
${assetLock}
[TIMELINE DIRECTING - MULTI-CAM]:
- Smooth angle cuts matching dialogue beats: Frontal MCU -> 45° Side Profile -> Tight Close-Up. Continuous speech flow across cuts.
[ACTING & KINESICS]:
- ${actingDirectives}
- Organic hand movements on desk (strict 5 fingers), dynamic eyebrow raises, thoughtful head tilts matching the narrative. Phase acting strictly synchronized with script beats.
[SPOKEN DIALOGUE]:
"${scene.script}"
[CONSTRAINTS & NEGATIVES]:
Vertical 9:16, NO voice timbre change, NO speaker identity drift, NO pitch jumping between scenes, NO shouting, NO loud volume spikes, NO wardrobe alteration, NO facial morphing, NO jaw slimming, NO glasses frame change, NO mic flipping, NO deformed hands, NO extra words, NO dead silence, NO sparkle icons, NO watermark, NO text, NO HUD.
  `.trim();
};
export const generateAiscript = async (subNiche: string, genreName: string, duration: number, wordsPerSec: number): Promise<string> => {
  const wordTarget = Math.floor(duration * 3.1); // Chuẩn KOC: ~3.1 từ/giây
  
  const prompt = `Viết kịch bản podcast viral cho KOC chuyên sâu về ${genreName}${subNiche ? ': ' + subNiche : ''}. 
  TỔNG THỜI LƯỢNG: ${duration} giây. 
  YÊU CẦU ĐỘ DÀI: Khoảng ${wordTarget} từ tiếng Việt.
  
  Cấu trúc 3 pha bắt buộc:
  1. Hook Phản Biện (Scene 1): Câu mở đầu "Mặt lạnh như tiền", đảo ngược định kiến.
  2. Luận Điểm Đồng Hành (Scene 2): Chuyển tông chuyên nghiệp, cử chỉ tay linh hoạt.
  3. Kết Mở & Khoảng Lặng (Scene cuối): Câu hỏi gợi mở, kết thúc bằng ánh nhìn suy tư 1s.
  
  Lưu ý: Chỉ viết lời thoại, không thêm [Scene], không thêm icon. Ngôn ngữ đời thường, gãy gọn.`;
  
  const { text } = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là AI Đạo diễn KOC Podcast. Viết lời thoại tiếng Việt 100% tự nhiên. Không dùng markdown. Không dùng icon."
  });
  return text.trim();
};