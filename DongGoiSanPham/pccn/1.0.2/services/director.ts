import { Flow } from 'flow-sdk';
import { Scene, CameraRig, ProjectState, CameraRigMode } from '../types';
import { MATRIX_12_VOICES } from '../constants/voicePresets';
import { CAMERA_RIG_SYSTEM } from '../constants';
/**
 * Xóa sạch nhãn kỹ thuật, chỉ giữ lại lời thoại thuần túy
 */
export const sanitizeDialogue = (text: string): string => {
  return text
    .replace(/\[Shot\s*\d+\]/gi, '')
    .replace(/\[Scene\s*\d+\]/gi, '')
    .replace(/\[\d+:\d+\]/gi, '')
    .replace(/Shot\s*\d+[:\-]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};
/**
 * CÔNG THỨC MẬT ĐỘ TỪ & KIẾN TRÚC SHOT MODULE 8S
 * Quy chuẩn: Cố định tuyệt đối 8.0s / Shot. Tối đa 32 từ / Shot (chuẩn 26 - 30 từ/shot)
 */
export const splitScriptStrictV4 = (
  script: string, 
  dramaHook: string,
  targetShotsCount: number,
  cameraRigMode: CameraRigMode = 'DYNAMIC_MULTI_CAM',
  fixedRigChoice: CameraRig = 'CAM_FRONT_MCU'
): Scene[] => {
  const cleanHook = sanitizeDialogue(dramaHook).toLowerCase();
  const cleanBody = sanitizeDialogue(script).toLowerCase();
  // BẮT BUỘC: Shot 01 bắt đầu bằng chính câu Hook do nhân vật nói: "{DRAMA_HOOK}. {Kịch bản nối tiếp của Shot 01}"
  const fullText = cleanHook ? `${cleanHook}. ${cleanBody}` : cleanBody;
  const words = fullText.split(/\s+/).filter(Boolean);
  const totalShots = Math.max(1, Math.min(40, targetShotsCount));
  const scenes: Scene[] = [];
  const rigs: CameraRig[] = CAMERA_RIG_SYSTEM.map(r => r.id);
  // Phân bổ chính xác N shot mà người dùng đã chọn (CẤM tạo shot thứ N + 1)
  const totalWords = words.length;
  const wordsPerShot = Math.ceil(totalWords / totalShots);
  for (let i = 0; i < totalShots; i++) {
    const startIdx = i * wordsPerShot;
    const endIdx = Math.min((i + 1) * wordsPerShot, totalWords);
    let shotWords = words.slice(startIdx, endIdx);
    // Giới hạn ngân sách tối đa 32 từ / Shot
    if (shotWords.length > 32) {
      shotWords = shotWords.slice(0, 32);
    }
    const sceneScript = shotWords.join(' ');
    // Luân chuyển góc máy cho Dynamic Multi-Cam (đổi góc tại 04:00) hoặc khóa cứng Static Locked-Off
    let primaryRig: CameraRig = fixedRigChoice;
    let cutRig: CameraRig = 'CAM_SIDE_45';
    if (cameraRigMode === 'DYNAMIC_MULTI_CAM') {
      primaryRig = rigs[(i * 2) % rigs.length];
      cutRig = rigs[(i * 2 + 1) % rigs.length];
      if (primaryRig === cutRig) {
        cutRig = rigs[(i * 2 + 2) % rigs.length];
      }
    }
    scenes.push({
      id: i + 1,
      startTime: i * 8.0,
      endTime: (i + 1) * 8.0,
      script: sceneScript,
      cameraRig: primaryRig,
      transitionCutRig: cutRig,
      cameraRigMode,
      wordCount: shotWords.length,
      status: 'idle',
      progress: 0
    });
  }
  return scenes;
};
/**
 * BIÊN DỊCH DUY NHẤT 1 PROMPT RENDER CHO TỪNG SHOT 8.0S GỬI TỚI ENGINE OMNI
 */
export const compileOmniPromptV4 = async (
  scene: Scene, 
  project: ProjectState,
  sceneIndex: number
): Promise<string> => {
  const voice = MATRIX_12_VOICES.find(v => v.id === project.selectedVoiceId) || MATRIX_12_VOICES[0];
  const isShot01 = sceneIndex === 0;
  // Lời thoại chuyển thành CHỮ THƯỜNG chuẩn chính tả tiếng Việt
  const spokenTextLower = sanitizeDialogue(scene.script).toLowerCase();
  // 1. QUY TẮC MỎ NEO THAM CHIẾU (ADAPTIVE BIOMETRIC & ASSET LOCK)
  const anchorSection = `
[MASTER_REF_IMAGE ANCHOR & BIOMETRIC LOCK]:
- Single Source of Truth: 1:1 biometric facial coordinate alignment from [MASTER_REF_IMAGE].
- Adaptive Biometrics: 100% strict lock on facial bone structure, nasal bridge, alar base, eye geometry, glasses frame, and accurate gender identity matching [MASTER_REF_IMAGE]. NO masculine jawline imposition on females; NO V-line jaw morphing; NO alteration to spectacles/glasses frames.
- Wardrobe & Background: Exact fabric texture, collar design, stitching lines, and chest emblem preserved 1:1 from [MASTER_REF_IMAGE]. Warm amber 3200K studio background wall and acoustic paneling.
- Microphone Rig: Shure SM7B studio microphone LOCKED ON THE RIGHT SIDE OF THE DESK angled toward the speaker. STRICTLY FORBIDDEN to flip microphone to the left side (NO mic flipping).`;
  // 2. MA TRẬN GIỌNG GỐC & KHÓA ÂM HỌC (EMOTION DECOUPLING & ON-CAMERA DIALOGUE ONLY)
  const acousticSection = `
[ACOUSTIC HARD-LOCK, VOICE MATRIX & ON-CAMERA DIALOGUE ENFORCEMENT]:
- Profile: ${voice.label} (${voice.subLabel})
- Parameters: Base ${voice.baseVoice} | Dialect: ${voice.region} | Speaking Speed: ${voice.speed}x | Pitch Modulation: ${voice.pitch}
- Timbre Characteristics: ${voice.acousticProfile}
- Emotion Decoupling: Invariant voiceprint and acoustic resonance across all shots. Emotional nuance expressed SOLELY through subtle facial articulation, breathing pauses, and micro-expressions. ZERO pitch drift, ZERO speaker voice switching.
- 100% ON-CAMERA CHARACTER VOCALIZATION: The words MUST BE SPOKEN DIRECTLY BY THE ON-SCREEN CHARACTER into the Shure microphone with exact visible lip synchronization (môi chuyển động khớp từng âm tiết).
- ABSOLUTELY NO VOICEOVER, NO BACKGROUND NARRATOR, NO OFF-SCREEN VOICE: It is STRICTLY FORBIDDEN to have any third-person voiceover, off-camera narration, narrator overlay, or background ambient voice. Every single word heard must originate directly from the physical character's mouth on screen.`;
  // 3. ĐIỀU PHỐI CAMERA (DYNAMIC MULTI-CAM vs STATIC LOCKED-OFF)
  let cameraDirective = "";
  if (scene.cameraRigMode === 'DYNAMIC_MULTI_CAM') {
    cameraDirective = `
[CAMERA COORDINATION - DYNAMIC MULTI-CAM]:
- 00:00 - 04.0s: Established perspective at ${scene.cameraRig}.
- Sharp Hard Cut at 04:00: Instant transition to secondary angle ${scene.transitionCutRig || 'CAM_SIDE_45'} with continuous dialogue lip-sync.
- Prohibitions: ABSOLUTELY NO camera panning, NO smooth drift, NO parallax wobbling. Sharp 4.0s multi-camera director cut only.`;
  } else {
    cameraDirective = `
[CAMERA COORDINATION - STATIC LOCKED-OFF TRIPOD]:
- Start Frame: Locked firmly to [MASTER_REF_IMAGE].
- Stability: 100% fixed tripod lock at ${scene.cameraRig}.
- Prohibitions: Perfectly still frame, zero camera wobble, zero panning, zero zooming, unwavering framing.`;
  }
  // 4. DIỄN XUẤT THEO TIMECODE 8.0S & QUY TRÌNH DRAMA HOOK (DO CHÍNH NHÂN VẬT ĐỌC)
  let actingTimeline = "";
  if (isShot01) {
    actingTimeline = `
[SHOT 01 DRAMA HOOK ACTING PROTOCOL - SPOKEN DIRECTLY BY THE CHARACTER]:
- 00:00 - 03.0s: The character looks directly into the lens with intense composure ("mặt lạnh như tiền") and DELIVERS THE DRAMA HOOK DIRECTLY OUT LOUD FROM THEIR OWN LIPS into the Shure microphone. Visible, articulate lip-sync as the character speaks the hook sentence.
- 03.0s - 03.5s: 0.5s compressed psychological pause / pregnant pause with steady gaze while character pauses speaking.
- 03.5s - 07.2s: Softening facial musculature transitioning into an authentic, deeply empathetic keynote speaker persona as the character continues speaking the follow-up dialogue naturally at 3.5 - 3.8 words/sec.
- 07.2s - 08.0s: Silent pause (0.8s) – lips softly meet in relaxed natural closure, reflective eyes maintaining warm viewer connection.`;
  } else {
    actingTimeline = `
[SHOT ACTING & TIMECODE CADENCE 8.0S]:
- 00:00 - 07.2s: Character actively speaks the dialogue into the Shure microphone with natural conversational Vietnamese cadence (3.5 - 3.8 words/sec) and synchronized lip movement. Organic professional kinesics, micro head tilts, expressive hand gestures resting on desk.
- 07.2s - 08.0s: Silent pause (0.8s) – speech completely terminates at 07.2s. Subject gently closes lips in natural relaxation, eyes reflect thoughtful contemplation towards audience.`;
  }
  // BIÊN DỊCH THÀNH DUY NHẤT 1 PROMPT RENDER
  return `
[OMNI ENGINE RENDER PROTOCOL - SHOT ${scene.id.toString().padStart(2, '0')}] [DURATION: 8.0s] [ASPECT: 9:16]
${anchorSection}
${acousticSection}
${cameraDirective}
${actingTimeline}
[ON-SCREEN CHARACTER SPOKEN DIALOGUE]:
"${spokenTextLower}"
[EXECUTION CONSTRAINTS]:
Strictly single continuous 8.0s take. The dialogue MUST be spoken exclusively by the on-screen character with realistic lip movements. ZERO VOICEOVER, ZERO OFF-SCREEN NARRATOR, ZERO BACKGROUND VOICES. Spoken dialogue must be executed in lowercase Vietnamese verbatim. Shure mic anchored right side only. No technical label tokens in audio. Total silence from 07.2s to 08.0s.
  `.trim();
};
export const generateAiscriptV4 = async (subNiche: string, genre: any, totalShots: number): Promise<{ script: string, hook: string }> => {
  const totalDuration = totalShots * 8;
  const wordTarget = Math.min(totalShots * 28, totalShots * 32); 
  const prompt = `Bạn là AI KOC Podcast Prompt Director chuyên nghiệp.
Hãy viết kịch bản Podcast và Drama Hook đúng quy chuẩn:
- Tổng số Shot: ${totalShots} shots (mỗi shot đúng 8.0s, tổng ${totalDuration}s).
- Tổng số từ toàn bài: Đúng khoảng ${wordTarget} từ (khoảng 26 - 30 từ / shot, tối đa 32 từ / shot).
- Thể loại: ${genre.name} (${subNiche || 'Đời sống, tư duy'}).
QUY ĐỊNH BẮT BUỘC:
1. DRAMA_HOOK: Câu hook giật gân, sắc bén, phản biện đảo ngược tư duy (dưới 14 từ). Câu hook này PHẢI DO CHÍNH NHÂN VẬT NHÌN THẲNG ỐNG KÍNH ĐỌC TRỰC TIẾP (On-screen spoken dialogue, tuyệt đối không dùng giọng lồng tiếng nền / voiceover).
2. PHẦN THÂN: Toàn bộ lời thoại viết bằng CHỮ THƯỜNG tiếng Việt tự nhiên do nhân vật nói trực tiếp trên hình, không in hoa bừa bãi, không chứa các nhãn kỹ thuật như "[Shot 01]", "[Shot 02]".
3. Định dạng trả về DUY NHẤT mã JSON:
{
  "hook": "câu hook mở đầu...",
  "script": "nội dung lời thoại nối tiếp..."
}`;
  
  const { text } = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là AI KOC Podcast Prompt Director. Chỉ trả lời định dạng JSON hợp lệ thuần túy, không có code block markdown hay lời dẫn."
  });
  
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleaned);
    return {
      hook: sanitizeDialogue(data.hook || "").toLowerCase(),
      script: sanitizeDialogue(data.script || "").toLowerCase()
    };
  } catch (e) {
    return { 
      hook: "hầu hết mọi người đang hiểu sai hoàn toàn về cách tạo nội dung podcast", 
      script: text.replace(/```json|```/g, '').trim().toLowerCase() 
    };
  }
};