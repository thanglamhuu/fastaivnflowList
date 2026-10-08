import { Flow } from 'flow-sdk';
import { 
  DramaDuration, 
  DramaStyle, 
  CharacterAsset, 
  LocationAsset, 
  PropAsset,
  DramaShot, 
  AspectRatio,
  Resolution
} from '../types';
/**
 * Hàm phân giải JSON an toàn từ phản hồi của AI.
 */
const parseJsonFromAi = <T,>(text: string, defaultValue: T): T => {
  try {
    if (!text) return defaultValue;
    const startIdx = text.indexOf('{');
    const lastIdx = text.lastIndexOf('}');
    const startIdxArr = text.indexOf('[');
    const lastIdxArr = text.lastIndexOf(']');
    
    let jsonStr = '';
    if (startIdx !== -1 && (startIdx < startIdxArr || startIdxArr === -1)) {
      jsonStr = text.substring(startIdx, lastIdx + 1);
    } else if (startIdxArr !== -1) {
      jsonStr = text.substring(startIdxArr, lastIdxArr + 1);
    }
    
    if (!jsonStr) return defaultValue;
    
    const cleaned = jsonStr
      .replace(/,\s*([\}\]])/g, '$1')
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
      
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.warn("Lỗi parse JSON từ AI", error);
    return defaultValue;
  }
};
const snapDuration = (seconds: number): number => {
  const supported = [4, 6, 8, 10];
  return supported.reduce((prev, curr) => 
    Math.abs(curr - seconds) < Math.abs(prev - seconds) ? curr : prev
  );
};
export const analyzeCharacterImage = async (base64: string, mimeType: string) => {
  const prompt = `Phân tích ảnh nhân vật này để tạo bộ hồ sơ nhận dạng.
  Trích xuất chi tiết cực độ về:
  1. Khuôn mặt: Mắt, mũi, miệng, da.
  2. Kiểu tóc: Độ dài, màu, kiểu.
  3. Trang phục: Màu sắc, họa tiết, kiểu dáng.
  
  Trả về JSON: { "physicalDescription": "mô tả khuôn mặt/tóc", "defaultOutfit": "mô tả trang phục" }`;
  const response = await Flow.generate.text(prompt, {
    images: [{ base64, mimeType }],
    systemInstruction: "Bạn là chuyên gia thiết kế nhân vật."
  });
  
  return parseJsonFromAi(response.text, { physicalDescription: "", defaultOutfit: "" });
};
export const generateDramaScript = async (params: { 
  premise: string; 
  duration: DramaDuration; 
  style: DramaStyle; 
  characters: CharacterAsset[];
  locations: LocationAsset[];
}): Promise<string> => {
  const { premise, duration, style, characters, locations } = params;
  
  const charContext = characters.length 
    ? `\nDANH SÁCH NHÂN VẬT THAM CHIẾU:\n${characters.map(c => `- ${c.name}: ${c.physicalDescription}. Trang phục: ${c.defaultOutfit}`).join('\n')}` 
    : '';
    
  const locContext = locations.length 
    ? `\nDANH SÁCH BỐI CẢNH:\n${locations.map(l => `- ${l.name}: ${l.description}`).join('\n')}` 
    : '';
  const prompt = `Viết kịch bản drama kịch tính.
Ý TƯỞNG: ${premise}
THỜI LƯỢNG: ${duration}
PHONG CÁCH: ${style}
${charContext}
${locContext}
QUY TẮC:
1. Giữ nguyên đặc điểm ngoại hình nhân vật.
2. Định dạng: Cảnh:, Mô tả:, **TÊN NHÂN VẬT** (Cảm xúc): Lời thoại.`;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là biên kịch chuyên nghiệp.",
    thinkingLevel: 'medium'
  });
  return response.text || "";
};
export const extractDramaAssets = async (script: string) => {
  const prompt = `Trích xuất Nhân vật, Bối cảnh, Đạo cụ từ kịch bản sau dưới dạng JSON: { "characters": [...], "locations": [...], "props": [...] }. 
  Kịch bản: ${script}`;
  
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Chỉ trả về JSON."
  });
  
  const result = parseJsonFromAi(response.text, { characters: [], locations: [], props: [] });
  
  return {
    characters: Array.isArray(result.characters) ? result.characters.map((c: any) => ({ ...c, name: String(c.name || "") })) : [],
    locations: Array.isArray(result.locations) ? result.locations.map((l: any) => ({ ...l, name: String(l.name || "") })) : [],
    props: Array.isArray(result.props) ? result.props : []
  };
};
export const breakdownScriptToShots = async (
  script: string, 
  duration: DramaDuration, 
  characters: CharacterAsset[]
): Promise<DramaShot[]> => {
  const shotCounts: Record<DramaDuration, number> = { '15s': 3, '30s': 5, '45s': 7, '60s': 9, '90s': 12, '180s': 15 };
  const targetCount = shotCounts[duration] || 6;
  
  const prompt = `Phân rã kịch bản thành ${targetCount} shot JSON array. 
  Mỗi phần tử có: shotNumber, title, durationSeconds, cameraAngle, visualPrompt (mô tả cảnh chi tiết), videoMotionPrompt, characterNames (mảng các nhân vật XUẤT HIỆN trong shot này), dialogue { characterName, line, emotion }. 
  Kịch bản: ${script}`;
  
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Đảm bảo characterNames chứa đúng tên nhân vật trong hồ sơ."
  });
  
  const shots = parseJsonFromAi<any[]>(response.text, []);
  
  return shots.map((s, idx) => ({
    ...s,
    id: `shot-${idx}-${Date.now()}`,
    shotNumber: s.shotNumber || (idx + 1),
    durationSeconds: snapDuration(Number(s.durationSeconds) || 6),
    characterNames: Array.isArray(s.characterNames) ? s.characterNames.map(String) : [],
    cameraAngle: String(s.cameraAngle || "Medium Shot"),
    visualPrompt: String(s.visualPrompt || ""),
    videoMotionPrompt: String(s.videoMotionPrompt || "Cinematic movement"),
    title: String(s.title || `Shot ${idx + 1}`)
  }));
};
/**
 * SINH ẢNH CHO SHOT (Nâng cấp tính đồng nhất)
 */
export const generateShotImage = async (
  shot: DramaShot, 
  characters: CharacterAsset[], 
  locations: LocationAsset[], 
  style: DramaStyle, 
  aspectRatio: AspectRatio
) => {
  // 1. Logic nhận diện nhân vật thông minh (Smart Character Matching)
  const relevantChars = characters.filter(c => {
    if (!c.name) return false;
    const charNameLower = c.name.toLowerCase();
    
    // Kiểm tra trong danh sách tag của AI
    const isTagged = shot.characterNames?.some(name => {
      const sName = String(name).toLowerCase();
      return charNameLower.includes(sName) || sName.includes(charNameLower);
    });
    
    if (isTagged) return true;
    // Fallback: Kiểm tra xem tên có xuất hiện trong Visual Prompt không
    const visualPromptLower = (shot.visualPrompt || "").toLowerCase();
    return visualPromptLower.includes(charNameLower);
  });
  // Thu thập mediaId từ những nhân vật được tìm thấy
  const charRefs = relevantChars
    .map(c => c.mediaId)
    .filter((id): id is string => !!id);
  // 2. Nhận diện bối cảnh
  const visualPromptLower = (shot.visualPrompt || "").toLowerCase();
  const locRefs = locations
    .filter(l => l.name && visualPromptLower.includes(l.name.toLowerCase()))
    .map(l => l.mediaId)
    .filter((id): id is string => !!id);
  // Gộp tham chiếu (Tối đa 10 ảnh cho model Banana Pro)
  const referenceImageMediaIds = [...new Set([...charRefs, ...locRefs])].slice(0, 10);
  // 3. Xây dựng cấu trúc Prompt 'ACTOR LOCK'
  const actorLockDirectives = relevantChars.map((c, idx) => {
    // Tìm index của mediaId trong mảng tham chiếu để chỉ dẫn model
    const refIndex = referenceImageMediaIds.indexOf(c.mediaId!);
    return `[CHARACTER: "${c.name}"]
- IDENTITY: Match face from Reference Image #${refIndex + 1} exactly.
- FEATURES: ${c.physicalDescription || 'Maintain consistent facial features'}.
- OUTFIT: ${c.defaultOutfit || 'Keep clothing pattern and style from reference image'}.`;
  }).join('\n\n');
  const sceneDescription = shot.visualPrompt || shot.title || "Cinematic scene";
  const fullPrompt = `
[ACTOR & VISUAL CONTINUITY]:
${actorLockDirectives}
[SCENE]: ${sceneDescription}. 
[STYLE]: ${style}. 
[CAMERA]: ${shot.cameraAngle || 'Eye level'}.
[TECHNICAL]: 8k resolution, cinematic lighting, masterpiece, extremely detailed skin textures, realistic hair strands.
[STRICT]: No deviation from character reference faces or clothing colors.
  `.trim();
  return await Flow.generate.image({
    prompt: fullPrompt,
    referenceImageMediaIds: referenceImageMediaIds.length > 0 ? referenceImageMediaIds : undefined,
    aspectRatio: aspectRatio,
    modelDisplayName: '🍌 Nano Banana Pro'
  });
};
/**
 * SINH VIDEO CHO SHOT (I2V)
 */
export const generateShotVideo = async (params: {
  shot: DramaShot;
  characters: CharacterAsset[];
  aspectRatio: AspectRatio;
  model: string;
  resolution: Resolution;
}) => {
  const { shot, aspectRatio, model, resolution } = params;
  const validatedDuration = snapDuration(shot.durationSeconds);
  
  const motionPrompt = shot.videoMotionPrompt || "Subtle cinematic camera movement and character expressions.";
  const finalVideoPrompt = `
[MOTION]: ${motionPrompt}.
[DIALOGUE]: ${shot.dialogue ? `Character "${shot.dialogue.characterName}" speaks: "${shot.dialogue.line}"` : ''}
[CONTINUITY]: Lock facial features and clothing patterns from the first frame. No morphing.
  `.trim();
  const targetRatio = (aspectRatio === '9:16' || aspectRatio === '16:9') ? aspectRatio : '16:9';
  return await Flow.generate.video({
    prompt: finalVideoPrompt,
    firstFrameImageMediaId: shot.imageMediaId,
    durationSeconds: validatedDuration,
    aspectRatio: targetRatio,
    modelDisplayName: model,
    resolution: resolution
  });
};