import { Shot, Character, Location, FlowMedia } from '../types';
/**
 * Tìm tất cả nhân vật có mặt trong shot:
 * 1. Dựa trên shot.characterNames
 * 2. Nếu rỗng, quét thêm trong visualPrompt xem có nhắc đến tên nhân vật nào không
 */
export function getCharactersInShot(shot: Shot, allCharacters: Character[]): Character[] {
  const matchedChars = allCharacters.filter(c => 
    shot.characterNames.some(name => name.trim().toLowerCase() === c.name.trim().toLowerCase())
  );
  if (matchedChars.length > 0) {
    return matchedChars;
  }
  // Quét visualPrompt nếu characterNames rỗng
  const visualPromptLower = (shot.visualPrompt || '').toLowerCase();
  const detected = allCharacters.filter(c => {
    const charName = c.name.trim().toLowerCase();
    return charName.length > 1 && visualPromptLower.includes(charName);
  });
  return detected;
}
/**
 * Thu thập tất cả các FlowMedia tham chiếu (avatar của các nhân vật trong shot + bối cảnh nếu có)
 */
export function getShotReferenceMedias(
  shotChars: Character[],
  location?: Location
): FlowMedia[] {
  const refs: FlowMedia[] = [];
  // Lấy avatar của các nhân vật
  for (const char of shotChars) {
    if (char.avatarMedia && (char.avatarMedia.mediaId || char.avatarMedia.base64)) {
      refs.push(char.avatarMedia);
    }
  }
  // Lấy ảnh bối cảnh nếu có
  if (location?.locationMedia && (location.locationMedia.mediaId || location.locationMedia.base64)) {
    refs.push(location.locationMedia);
  }
  return refs;
}
/**
 * Xây dựng prompt khóa nhận diện khuôn mặt và cố định trang phục nghiêm ngặt
 */
export function buildConsistentImagePrompt(
  rawVisualPrompt: string,
  shotChars: Character[],
  location?: Location
): string {
  if (shotChars.length === 0) {
    let prompt = rawVisualPrompt.trim();
    if (location && location.description) {
      prompt += ` [Setting: ${location.name} - ${location.description}]`;
    }
    return prompt;
  }
  const hasReferenceImages = shotChars.some(c => c.avatarMedia?.mediaId || c.avatarMedia?.base64);
  // Chỉ thị khóa nghiêm ngặt khuôn mặt và trang phục
  const rules = `[STRICT CHARACTER & OUTFIT CONSISTENCY RULES:
You MUST strictly preserve the exact facial features, face identity, hairstyle, skin tone, and EXACT OUTFIT (clothing style, cut, and exact color) from the provided character reference image(s).
IGNORE and OVERRIDE any conflicting clothing or dress descriptions in the scene prompt below. Do NOT change the color or style of the character's outfit from the reference image!
${shotChars.map((c, idx) => {
  const refLabel = hasReferenceImages && c.avatarMedia ? ` from Reference Image #${idx + 1}` : '';
  const outfit = c.defaultOutfit ? ` (Mandatory Outfit: ${c.defaultOutfit})` : '';
  const appearance = c.physicalDescription ? ` (Appearance: ${c.physicalDescription})` : '';
  return `- Character ${idx + 1} (${c.name}): Keep 100% identical face and exact outfit${refLabel}${outfit}${appearance}.`;
}).join('\n')}
]
Scene Action & Composition: ${rawVisualPrompt.trim()}${location?.description ? ` [Setting: ${location.name} - ${location.description}]` : ''}`;
  return rules;
}