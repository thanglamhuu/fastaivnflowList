import { VoiceOption, ShotScene } from '../types/voice';
/**
 * BIÊN DỊCH PROMPT CHO TỪNG SHOT CLIP
 * Cưỡng chế khóa giọng nói và đồng bộ khẩu hình nhân vật.
 * Bổ sung Identity & Biometric Hard-Lock để giữ ổn định nhân vật.
 */
export const compileShotPrompt = (scene: ShotScene, voice: VoiceOption): string => {
  const duration = scene.durationSec.toFixed(1);
  return `
[VIDEO SHOT PRODUCTION PROMPT]
[SHOT TIMECODE & DURATION]:
- Shot Index: ${scene.shotIndex} / ${scene.totalShots}
- Duration: ${duration}s
- Visual Style: ${scene.visualPrompt}
- Camera Rig / Movement: ${scene.cameraMovement || 'Static Frontal Medium Close-Up'}
- Actor Acting: ${scene.actorExpression || 'Natural lip-sync, subtle eye blinking, consistent facial expression'}
[IDENTITY & BIOMETRIC HARD-LOCK]:
- Reference Source: 100% conditioned on the provided master reference image.
- Facial Features: Exact 1:1 biometric clone of face structure, eyes, nose bridge, jawline, skin tone, and facial contours from the reference image.
- Hair Consistency: Strictly preserve exact hair style, hairline, part, volume, and hair color from the reference image. Zero hairstyle drift.
- Wardrobe & Props: Exact outfit fabric, neckline, and accessories from the reference image.
[UNIVERSAL ACOUSTIC & VOICEPRINT HARD-LOCK]:
- Language: Native Vietnamese (vi-VN).
- Voice Identity Profile: ${voice.label} (Base Engine: ${voice.baseVoice}).
- Timbre & Acoustics: ${voice.prompt}.
- Speaking Speed: ${voice.speed}x native rate | Pitch Shift: ${voice.pitch}.
- Hard Rules:
  1. TIMBRE INVARIANT: Maintain 100% vocal tract geometry and speaker identity. Never drift into other voice timbres.
  2. EMOTION DECOUPLING: Express emotion purely through facial micro-expressions and delivery tempo; do NOT alter the fundamental vocal identity.
  3. CLEAR ARTICULATION: Pronounce standard Vietnamese tones accurately (sac, huyen, hoi, nga, nang, ngang).
[SPOKEN DIALOGUE / LIP-SYNC]:
"${scene.dialogue}"
[NEGATIVE CONSTRAINTS]:
NO face morphing, NO hairstyle changes, NO outfit drift, NO voice switching, NO vocal drift between shots, NO audio distortion, NO robotic clipping, NO wrong lip flap, NO extra unscripted dialogue, NO subtitles, NO watermarks.
`.trim();
};