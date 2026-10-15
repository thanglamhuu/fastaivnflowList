import { Flow } from 'flow-sdk';
import { Scene, CameraRig, ProjectState, CameraRigMode } from '../types';
import { MATRIX_12_VOICES, VoiceOption } from '../constants/voicePresets';
import { CAMERA_RIG_SYSTEM } from '../constants';
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
 * Đảm bảo mỗi phân cảnh có CHÍNH XÁC đúng 32 từ.
 * Nếu thiếu từ so với 32 từ, tự động đệm thêm các từ ngữ tự nhiên chuẩn ngữ cảnh podcast
 * để lấp đầy đúng 32 từ, ngăn AI nói thêm từ ngoài kịch bản do thừa thời gian 8.0s.
 */
export const normalizeToExact32Words = (words: string[]): string[] => {
  const TARGET_WORD_COUNT = 32;
  let currentWords = words.filter(Boolean);
  if (currentWords.length > TARGET_WORD_COUNT) {
    return currentWords.slice(0, TARGET_WORD_COUNT);
  }
  // Danh mục từ ngữ tự nhiên, tích cực để đệm khi người dùng nhập thiếu từ
  const naturalFillers = [
    'hãy', 'luôn', 'ghi', 'nhớ', 'và', 'thực', 'hành', 'điều', 'này', 'mỗi',
    'ngày', 'để', 'đạt', 'hiệu', 'quả', 'tối', 'ưu', 'nhất', 'bạn', 'nhé',
    'chắc', 'chắn', 'kết', 'quả', 'sẽ', 'làm', 'bạn', 'bất', 'ngờ', 'thành',
    'công', 'luôn', 'đến', 'với', 'người', 'kiên', 'trì'
  ];
  let fillerIdx = 0;
  while (currentWords.length < TARGET_WORD_COUNT) {
    currentWords.push(naturalFillers[fillerIdx % naturalFillers.length]);
    fillerIdx++;
  }
  return currentWords;
};
export const splitScriptStrictV4 = (
  script: string, 
  dramaHook: string,
  targetShotsCount: number,
  cameraRigMode: CameraRigMode = 'DYNAMIC_MULTI_CAM',
  fixedRigChoice: CameraRig = 'CAM_FRONT_MCU'
): Scene[] => {
  const cleanHook = sanitizeDialogue(dramaHook).toLowerCase();
  const cleanBody = sanitizeDialogue(script).toLowerCase();
  const hookWords = cleanHook ? cleanHook.split(/\s+/).filter(Boolean) : [];
  const bodyWords = cleanBody ? cleanBody.split(/\s+/).filter(Boolean) : [];
  const totalShots = Math.max(1, Math.min(40, targetShotsCount));
  const scenes: Scene[] = [];
  const rigs: CameraRig[] = CAMERA_RIG_SYSTEM.map(r => r.id);
  for (let i = 0; i < totalShots; i++) {
    let shotWords: string[] = [];
    if (i === 0) {
      if (hookWords.length > 0) {
        const remainingSlots = Math.max(0, 32 - hookWords.length);
        const firstShotBodyWords = bodyWords.slice(0, remainingSlots);
        shotWords = [...hookWords, ...firstShotBodyWords];
      } else {
        shotWords = bodyWords.slice(0, 32);
      }
    } else {
      const offsetAfterShot0 = hookWords.length > 0 ? Math.max(0, 32 - hookWords.length) : 32;
      const startIdx = offsetAfterShot0 + (i - 1) * 32;
      const endIdx = startIdx + 32;
      shotWords = bodyWords.slice(startIdx, endIdx);
    }
    shotWords = normalizeToExact32Words(shotWords);
    const sceneScript = shotWords.join(' ');
    let primaryRig: CameraRig = fixedRigChoice;
    let cutRig: CameraRig = rigs[(i + 1) % rigs.length];
    if (cameraRigMode === 'DYNAMIC_MULTI_CAM') {
      primaryRig = 'CAM_FRONT_MCU';
      const secondaryCandidates = rigs.filter(r => r !== 'CAM_FRONT_MCU');
      cutRig = secondaryCandidates[i % secondaryCandidates.length];
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
const getVoiceEstimatedAge = (voice: VoiceOption): string => {
  switch (voice.id) {
    case 'voice_01': return '30-35 years old';
    case 'voice_02': return '28-34 years old';
    case 'voice_03': return '22-26 years old';
    case 'voice_04': return '25-30 years old';
    case 'voice_05': return '35-45 years old';
    case 'voice_06': return '30-38 years old';
    case 'voice_07': return '32-40 years old';
    case 'voice_08': return '26-32 years old';
    case 'voice_09': return '23-28 years old';
    case 'voice_10': return '22-27 years old';
    case 'voice_11': return '32-42 years old';
    case 'voice_12': return '24-29 years old';
    default: return voice.gender === 'female' ? '28 years old' : '32 years old';
  }
};
export const getRigEnglishDescription = (rig: CameraRig): string => {
  switch (rig) {
    case 'CAM_FRONT_MCU':
      return 'front medium close-up at eye level (CAM_FRONT_MCU)';
    case 'CAM_SIDE_45':
      return '45-degree cinematic side angle shot of the subject (CAM_SIDE_45)';
    case 'CAM_TIGHT_CU':
      return 'tight close-up focused intensely on face (CAM_TIGHT_CU)';
    case 'CAM_LOW_ANGLE':
      return 'authoritative low-angle shot tilted upward 10-15 degrees (CAM_LOW_ANGLE)';
    case 'CAM_BOKEH_MIC':
      return 'close-up shot with shallow depth of field framing (CAM_BOKEH_MIC)';
    case 'CAM_SLIDER_LATERAL':
      return 'subtle slow lateral slider dolly shot (CAM_SLIDER_LATERAL)';
    case 'CAM_WIDE_DESK':
      return 'medium-wide shot showing the subject and natural body gestures (CAM_WIDE_DESK)';
    case 'CAM_EXTREME_CU':
      return 'extreme close-up on eyes and eyebrows reflecting deep contemplation (CAM_EXTREME_CU)';
    default:
      return 'cinematic medium close-up angle';
  }
};
export const buildFixedVoiceConstraint = (voice: VoiceOption): string => {
  const age = getVoiceEstimatedAge(voice);
  const genderText = voice.gender === 'female' ? 'Female' : 'Male';
  const regionText = voice.region.includes('Bắc') 
    ? 'Northern Vietnamese accent' 
    : voice.region.includes('Nam') 
      ? 'Southern Vietnamese accent' 
      : 'Native Vietnamese accent';
  return `AUDIO PROFILE: Native Vietnamese speaker, ${regionText}, ${genderText}, ${age}, Speaking speed ${voice.speed}x, Pitch ${voice.pitch}, Tone "${voice.acousticProfile}". Character natural speaking voice must clearly deliver dialogue in Vietnamese.`;
};
export const compileOmniPromptV4 = async (
  scene: Scene, 
  project: ProjectState,
  sceneIndex: number
): Promise<string> => {
  const voice = MATRIX_12_VOICES.find(v => v.id === project.selectedVoiceId) || MATRIX_12_VOICES[0];
  const spokenText = sanitizeDialogue(scene.script).toLowerCase();
  const secondaryRig: CameraRig = scene.transitionCutRig || 'CAM_SIDE_45';
  const secondaryRigDesc = getRigEnglishDescription(secondaryRig);
  let cameraDesc = '';
  let performanceDesc = '';
  // NGUYÊN TẮC TUYỆT ĐỐI: Không sinh ra chữ, subtitle, title card, watermark khi đổi camera hoặc xuyên suốt cảnh quay
  const zeroTextRule = `STRICT NEGATIVE CONSTRAINT: ABSOLUTELY ZERO ON-SCREEN TEXT, NO SUBTITLES, NO CAPTIONS, NO LOWER-THIRDS, NO TITLE CARDS, NO WATERMARKS, NO GRAPHICS, NO TYPOGRAPHY, NO CHINESE/ENGLISH/VIETNAMESE CHARACTERS DISPLAYED ON VIDEO. When switching camera angles at 5.0 seconds, do not introduce any text card, slide, or overlay. Clean raw camera video only.`;
  if (scene.cameraRigMode === 'DYNAMIC_MULTI_CAM') {
    cameraDesc = `TIMELINE: 0-5s: direct front camera angle (CAM_FRONT_MCU). At exactly 5.0s, a clean hard camera angle cut switches perspective instantaneously to ${secondaryRigDesc}. During and after the 5.0s camera switch, ABSOLUTELY NO text, titles, subtitles, or captions appear on screen. Pure seamless visual cut without any typography overlay.`;
    performanceDesc = `From 0-5s, character speaks directly to the camera with articulate lip-sync and natural hand gestures. From 5-8s, speech and natural performance continue seamlessly from the new camera angle without interruption.`;
  } else {
    const fixedDesc = getRigEnglishDescription(scene.cameraRig);
    cameraDesc = `Fixed locked tripod camera framing using ${fixedDesc} for the entire 8.0s shot. Completely clean footage with zero on-screen text, subtitles, or graphic overlays.`;
    performanceDesc = `Subject speaks naturally facing the camera with articulate lip movement and expressive micro-expressions.`;
  }
  const strictAnchorConstraint = project.masterMediaId
    ? `Retain exact background, environment, lighting, and wardrobe from the provided reference image. Do not add unrequested props or studio clutter.`
    : `Stable natural podcast setting matching original scene setup.`;
  const strictIdentityConstraint = project.masterMediaId
    ? `Preserve 100% facial identity, hair, skin, and outfit from the reference image.`
    : ``;
  const fixedVoiceDirective = buildFixedVoiceConstraint(voice);
  const hookRepetitionConstraint = sceneIndex === 0
    ? `The opening hook is spoken at the start of this shot.`
    : `Do not repeat the opening hook from earlier shots; speak only this shot's dialogue.`;
  const strictCadenceAndNoExtraWordsDirective = `Verbatim spoken dialogue: "${spokenText}". Speak naturally to fit the 8-second duration with accurate lip sync. Once dialogue finishes, character naturally closes lips. ${hookRepetitionConstraint}`;
  return [
    `Professional podcast production video for personal branding.`,
    zeroTextRule,
    strictAnchorConstraint,
    strictIdentityConstraint,
    fixedVoiceDirective,
    performanceDesc,
    strictCadenceAndNoExtraWordsDirective,
    `Camera directing: ${cameraDesc}`,
    `Authentic high-fidelity cinematography, 9:16 vertical video.`
  ].filter(Boolean).join(' ');
};
export const generateAiscriptV4 = async (subNiche: string, genre: any, totalShots: number): Promise<{ script: string, hook: string }> => {
  const totalDuration = totalShots * 8;
  const exactTotalWords = totalShots * 32;
  const prompt = `Bạn là biên tập viên kịch bản video podcast thương mại chuyên nghiệp.
Hãy viết kịch bản Video Podcast chia sẻ kiến thức tích cực, giá trị, lịch sự và hoàn toàn tuân thủ chuẩn mực phát sóng:
- Tổng số Shot: ${totalShots} shots (mỗi shot 8.0s, tổng ${totalDuration}s).
- QUY TẮC ĐẶC BIỆT: MỖI PHÂN CẢNH BẮT BUỘC PHẢI ĐỦ CHÍNH XÁC 32 TỪ. Tổng cộng đúng ${exactTotalWords} từ cho cả bài để khớp trọn vẹn thời lượng 8 giây, tránh trường hợp thừa thời gian AI sẽ nói thêm từ không có trong kịch bản.
- Chủ đề: ${genre.name} (${subNiche || 'Kinh doanh, phát triển bản thân, tư duy tích cực'}).
QUY ĐỊNH BẮT BUỘC:
1. HOOK: Câu mở đầu thu hút, truyền cảm hứng hoặc đặt vấn đề thực tế (khoảng 10-14 từ), phù hợp quảng bá thương hiệu thương mại tích cực, không dùng từ ngữ tiêu cực hay bạo lực.
2. NỘI DUNG NỐI TIẾP: Toàn bộ lời thoại viết bằng chữ thường tiếng Việt tự nhiên, chuẩn chính tả, sao cho khi chia theo từng shot 8s thì mỗi shot có đủ 32 từ.
3. CẤM TUYỆT ĐỐI các từ ngữ thừa, câu cảm thán tùy tiện ở cuối câu kịch bản.
4. Định dạng trả về DUY NHẤT mã JSON:
{
  "hook": "câu mở đầu thu hút...",
  "script": "nội dung lời thoại nối tiếp..."
}`;
  
  const { text } = await Flow.generate.text(prompt, {
    thinkingLevel: 'low',
    systemInstruction: "Bạn là biên tập viên kịch bản podcast. Chỉ trả về JSON thuần túy, không có văn bản giải thích nào khác."
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
      hook: "bí quyết xây dựng thương hiệu cá nhân bền vững nằm ở giá trị thực bạn trao đi", 
      script: text.replace(/```json|```/g, '').trim().toLowerCase() 
    };
  }
};