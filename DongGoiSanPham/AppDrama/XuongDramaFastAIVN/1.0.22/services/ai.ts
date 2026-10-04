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
 * Hàm phân giải JSON thông minh
 */
const parseJsonFromAi = <T,>(text: string, defaultValue: T): T => {
  try {
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!match) return defaultValue;
    
    let jsonStr = match[0];
    jsonStr = jsonStr.replace(/,\s*([\}\]])/g, '$1'); // Chống trailing commas
    
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('Lỗi phân giải JSON từ AI:', error);
    return defaultValue;
  }
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
1. Hook: Tình huống gây sốc.
2. Mâu thuẫn: Tăng tính đối đầu.
3. Climax: Đỉnh điểm tranh cãi.
4. Twist: Cú lật kèo bất ngờ.
Định dạng:
Tên cảnh: [INT/EXT...]
Mô tả hành động: Ngắn gọn.
**TÊN NHÂN VẬT** (Cảm xúc): Lời thoại.
[[SFX: Mô tả âm thanh]]
  `;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là đạo diễn phim ngắn drama triệu view chuyên nghiệp."
  });
  return response.text;
};
export const extractDramaAssets = async (script: string) => {
  // Không dùng regex xóa dấu * để tránh hỏng tên nhân vật
  const prompt = `
Phân tích kịch bản drama sau và bóc tách CHÍNH XÁC tất cả Nhân vật (characters), Bối cảnh (locations) và Đạo cụ quan trọng (props).
GIỮ NGUYÊN tên nhân vật như trong kịch bản (kể cả khi có dấu * hoặc định dạng đặc biệt).
Kịch bản:
---
${script}
---
Yêu cầu định dạng trả về là JSON duy nhất:
{
  "characters": [
    { "name": "Tên nhân vật", "physicalDescription": "Mô tả ngoại hình", "defaultOutfit": "Trang phục", "voiceTone": "Giọng nói" }
  ],
  "locations": [
    { "name": "Tên bối cảnh", "description": "Mô tả không gian" }
  ],
  "props": [
    { "name": "Tên đạo cụ", "description": "Mô tả chi tiết" }
  ]
}
  `;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là chuyên gia tiền kỳ (Line Producer). Trích xuất JSON chính xác từ kịch bản gốc."
  });
  return parseJsonFromAi(response.text, { characters: [], locations: [], props: [] });
};
export const breakdownScriptToShots = async (
  script: string, 
  duration: DramaDuration, 
  characters: CharacterAsset[]
): Promise<DramaShot[]> => {
  const shotCounts: Record<DramaDuration, number> = {
    '15s': 6, '30s': 10, '45s': 14, '60s': 18, '90s': 25, '180s': 45
  };
  const targetCount = shotCounts[duration] || 10;
  const prompt = `
Hãy phân chia kịch bản sau thành ${targetCount} shot chi tiết.
Kịch bản: ${script}
Yêu cầu JSON output (array):
[
  {
    "shotNumber": number,
    "title": string,
    "durationSeconds": number,
    "cameraAngle": string,
    "visualPrompt": string (Mô tả hình ảnh chi tiết),
    "videoMotionPrompt": string (Mô tả chuyển động cho AI Video),
    "characterNames": ["Tên nhân vật 1", "Tên nhân vật 2"],
    "dialogue": { "characterName": string, "line": string, "emotion": string },
    "sfxAudioCue": string
  }
]
  `;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Bạn là đạo diễn hình ảnh (DOP). Chia nhỏ kịch bản thành các shot quay kịch tính."
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
    shot.characterNames?.some(name => name.toLowerCase() === c.name.toLowerCase()) ||
    shot.visualPrompt.toLowerCase().includes(c.name.toLowerCase()) || 
    shot.dialogue?.characterName === c.name
  );
  const referenceImageMediaIds = mentionedCharacters
    .map(c => c.mediaId)
    .filter((id): id is string => !!id);
  const fullPrompt = `${style} style. ${shot.visualPrompt}. Camera Angle: ${shot.cameraAngle}. ${shot.dialogue ? `Character ${shot.dialogue.characterName} is ${shot.dialogue.emotion}.` : ''} cinematic lighting, high resolution.`;
  return await Flow.generate.image({
    prompt: fullPrompt,
    referenceImageMediaIds: referenceImageMediaIds.length > 0 ? referenceImageMediaIds : undefined,
    aspectRatio: aspectRatio,
    modelDisplayName: '🍌 Nano Banana 2'
  });
};
export const generateShotVideo = async (params: {
  prompt: string;
  imageMediaId?: string;
  durationSeconds: number;
  aspectRatio: AspectRatio;
}) => {
  const { prompt, imageMediaId, durationSeconds, aspectRatio } = params;
  // Sử dụng Omni 1.1 Flash cho tốc độ và chất lượng ổn định
  return await Flow.generate.video({
    prompt: prompt,
    firstFrameImageMediaId: imageMediaId,
    durationSeconds: Math.min(durationSeconds, 10), // SDK hỗ trợ tối đa 10s cho Omni Flash
    aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    modelDisplayName: 'Omni 1.1 Flash',
    resolution: '720p'
  });
};