import { Flow } from 'flow-sdk';
import { 
  DramaDuration, 
  DramaStyle, 
  CharacterAsset, 
  LocationAsset, 
  PropAsset,
  DramaShot, 
  AspectRatio 
} from '../types';
/**
 * Hàm phân giải JSON thông minh: 
 * - Tự động tìm cặp ngoặc { ... } hoặc [ ... ]
 * - Loại bỏ dấu phẩy thừa trước dấu đóng ngoặc (trailing commas)
 */
const parseJsonFromAi = <T,>(text: string, defaultValue: T): T => {
  try {
    // Tìm nội dung trong cặp ngoặc nhọn hoặc ngoặc vuông
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!match) return defaultValue;
    
    let jsonStr = match[0];
    
    // Loại bỏ các dấu phẩy thừa ở cuối mảng hoặc object trước khi đóng ngoặc
    // Ví dụ: [1, 2,] -> [1, 2] hoặc { "a": 1, } -> { "a": 1 }
    jsonStr = jsonStr.replace(/,\s*([\}\]])/g, '$1');
    
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('Lỗi phân giải JSON từ AI:', error);
    return defaultValue;
  }
};
/**
 * Làm sạch kịch bản trước khi gửi cho AI trích xuất
 */
const cleanScriptForExtraction = (script: string): string => {
  return script
    .replace(/#{1,6}\s?/g, '') // Bỏ tiêu đề markdown
    .replace(/\*{1,3}/g, '')    // Bỏ in đậm, in nghiêng
    .replace(/\[\[.*?\]\]/g, '') // Bỏ các tag SFX/Ghi chú
    .trim();
};
export const generateDramaScript = async (params: { 
  premise: string; 
  duration: DramaDuration; 
  style: DramaStyle; 
  characters?: CharacterAsset[] 
}): Promise<string> => {
  const { premise, duration, style, characters } = params;
  
  const charContext = characters?.length 
    ? `\nDàn nhân vật hiện có:\n${characters.map(c => `- ${c.name}: ${c.physicalDescription}`).join('\n')}` 
    : '';
  const prompt = `
Hãy viết kịch bản phim ngắn drama kịch tính.
Yêu cầu:
- Ý tưởng cốt truyện: ${premise}
- Thời lượng: ${duration}
- Phong cách: ${style}
${charContext}
Cấu trúc kịch bản:
1. Hook (3s đầu): Tình huống gây sốc.
2. Đẩy mâu thuẫn: Tăng tính đối đầu.
3. Climax: Đỉnh điểm tranh cãi.
4. Twist: Cú lật kèo bất ngờ.
Định dạng:
Tên cảnh: [INT/EXT...]
Mô tả hành động: Ngắn gọn.
**TÊN NHÂN VẬT** (Cảm xúc): Lời thoại.
[[SFX: Mô tả âm thanh]]
  `;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là đạo diễn phim ngắn drama triệu view."
  });
  return response.text;
};
export const extractDramaAssets = async (script: string) => {
  const cleanedScript = cleanScriptForExtraction(script);
  
  const prompt = `
Phân tích kịch bản drama sau và bóc tách tất cả Nhân vật, Bối cảnh và Đạo cụ quan trọng.
Kịch bản:
---
${cleanedScript}
---
Yêu cầu định dạng trả về là JSON duy nhất theo cấu trúc:
{
  "characters": [
    { "name": "Tên nhân vật", "physicalDescription": "Mô tả khuôn mặt, tóc, độ tuổi", "defaultOutfit": "Trang phục mặc định", "voiceTone": "Chất giọng" }
  ],
  "locations": [
    { "name": "Tên bối cảnh", "description": "Chi tiết không gian, ánh sáng" }
  ],
  "props": [
    { "name": "Tên đạo cụ", "description": "Chi tiết vật phẩm quan trọng" }
  ]
}
  `;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là chuyên gia tiền kỳ phim (Line Producer). Trích xuất dữ liệu chính xác, không thêm văn bản rác bên ngoài JSON."
  });
  return parseJsonFromAi(response.text, { characters: [], locations: [], props: [] });
};
export const breakdownScriptToShots = async (
  script: string, 
  duration: DramaDuration, 
  characters: CharacterAsset[]
): Promise<DramaShot[]> => {
  const shotCounts: Record<DramaDuration, number> = {
    '15s': 6,
    '30s': 10,
    '45s': 14,
    '60s': 18,
    '90s': 25,
    '180s': 45
  };
  const targetCount = shotCounts[duration] || 10;
  const prompt = `
Hãy chia kịch bản sau thành chính xác ${targetCount} shot quay chi tiết.
Kịch bản: ${script}
Trả về mảng JSON DramaShot:
[
  {
    "shotNumber": number,
    "title": string,
    "durationSeconds": number,
    "cameraAngle": string,
    "visualPrompt": string (Cực kỳ chi tiết cho AI sinh ảnh),
    "videoMotionPrompt": string,
    "dialogue": { "characterName": string, "line": string, "emotion": string },
    "sfxAudioCue": string
  }
]
  `;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là đạo diễn hình ảnh (DOP)."
  });
  const shots = parseJsonFromAi<any[]>(response.text, []);
  return shots.map((s, idx) => ({
    ...s,
    id: `shot-${idx}-${Date.now()}`
  }));
};
export const generateShotImage = async (
  shot: DramaShot, 
  characters: CharacterAsset[], 
  locations: LocationAsset[], 
  style: DramaStyle, 
  aspectRatio: AspectRatio
) => {
  const mentionedCharacters = characters.filter(c => 
    shot.visualPrompt.toLowerCase().includes(c.name.toLowerCase()) || 
    shot.dialogue?.characterName === c.name
  );
  const referenceImageMediaIds = mentionedCharacters
    .map(c => c.mediaId)
    .filter((id): id is string => !!id);
  const fullPrompt = `${style} style. ${shot.visualPrompt}. Camera Angle: ${shot.cameraAngle}. Emotion: ${shot.dialogue?.emotion || 'dramatic'}. cinematic lighting, high quality.`;
  return await Flow.generate.image({
    prompt: fullPrompt,
    referenceImageMediaIds: referenceImageMediaIds.length > 0 ? referenceImageMediaIds : undefined,
    aspectRatio: aspectRatio,
    modelDisplayName: '🍌 Nano Banana 2'
  });
};