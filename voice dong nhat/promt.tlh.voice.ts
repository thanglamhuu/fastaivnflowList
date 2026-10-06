Version 2.v2.8.1
Hãy tích hợp hoàn chỉnh tính năng: "Bộ chọn giọng nói (Voice Combobox/Picker) và Đồng bộ khóa vân giọng nhân vật (Acoustic Lock) vào Prompt sinh video shot clip" cho dự án React + TypeScript này. 

Dự án hiện chưa có cơ chế cố định voice. Tôi muốn khi người dùng chọn một giọng bất kỳ (hoặc tùy biến tham số), cấu hình âm học đó sẽ được lưu vào State và tự động chèn vào Prompt sinh video của từng cảnh (shot) nhằm đảm bảo video sinh ra không bị đổi giọng hay trôi tông giữa các clip.

Hãy triển khai theo cấu trúc 4 file chi tiết dưới đây:

---
Hãy tích hợp hoàn chỉnh tính năng: "Bộ chọn giọng nói (Voice Combobox/Picker) và Đồng bộ khóa vân giọng nhân vật (Acoustic Lock) vào Prompt sinh video shot clip" cho dự án React + TypeScript này. 

Dự án hiện chưa có cơ chế cố định voice. Tôi muốn khi người dùng chọn một giọng bất kỳ (hoặc tùy biến tham số), cấu hình âm học đó sẽ được lưu vào State và tự động chèn vào Prompt sinh video của từng cảnh (shot) nhằm đảm bảo video sinh ra không bị đổi giọng hay trôi tông giữa các clip.

Hãy triển khai theo cấu trúc 4 file chi tiết dưới đây:

---

### 1. `src/types/voice.ts`
Tạo interface định nghĩa cấu hình giọng nói và dữ liệu shot clip:

```typescript
export type BaseVoiceModel = 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';

export interface VoiceOption {
  id: string;
  label: string;
  category: 'podcast' | 'drama' | 'tiktok' | 'custom';
  gender: 'male' | 'female';
  baseVoice: BaseVoiceModel;
  speed: number;        // Ví dụ: 0.9, 1.0, 1.15
  pitch: string;        // Ví dụ: "-5%", "0%", "+10%"
  toneDescription: string; // Mô tả sắc thái âm học tiếng Việt
  sampleText?: string;
}

export interface ShotScene {
  id: string | number;
  shotIndex: number;
  totalShots: number;
  durationSec: number;
  dialogue: string;
  cameraMovement: string;
  actorExpression: string;
}
2. src/constants/voicePresets.ts
Khai báo danh mục preset giọng tiếng Việt mẫu chuẩn cho video ngắn/drama:

TypeScript
import { VoiceOption } from '../types/voice';

export const DEFAULT_VOICE_PRESETS: VoiceOption[] = [
  {
    id: 'voice_drama_nu_tram',
    label: 'Nữ Trầm Lạnh Lùng (Drama Hook)',
    category: 'drama',
    gender: 'female',
    baseVoice: 'Kore',
    speed: 1.0,
    pitch: '-6%',
    toneDescription: 'Giọng nữ Bắc trầm lạnh, nhả chữ dứt khoát, sắc sảo, không cảm xúc dư thừa, uy lực.',
    sampleText: 'Đừng bao giờ đánh giá thấp người khác chỉ vì họ chọn cách im lặng.'
  },
  {
    id: 'voice_drama_nam_quyen_luc',
    label: 'Nam Trầm Trấn Áp (CEO/Trùm Cuối)',
    category: 'drama',
    gender: 'male',
    baseVoice: 'Charon',
    speed: 0.95,
    pitch: '-8%',
    toneDescription: 'Giọng nam trung niên trầm đục, vang ngực (chest resonance), uy nghiêm, câu từ chậm rãi.',
    sampleText: 'Ký vào đây, rồi mọi chuyện coi như chưa từng bắt đầu.'
  },
  {
    id: 'voice_drama_nu_nghen_ngao',
    label: 'Nữ Tự Sự Nghẹn Ngào (Cảm Động)',
    category: 'drama',
    gender: 'female',
    baseVoice: 'Aoede',
    speed: 0.9,
    pitch: '-2%',
    toneDescription: 'Giọng nữ có độ khàn nhẹ, thở dài tự nhiên ở cuối câu, rung cảm xúc và thổn thức.',
    sampleText: 'Rốt cuộc trong mắt anh, tôi là gì suốt 5 năm qua?'
  },
  {
    id: 'voice_nam_dan_chuyen',
    label: 'Nam Kể Chuyện Kịch Tính (Narrator)',
    category: 'podcast',
    gender: 'male',
    baseVoice: 'Fenrir',
    speed: 1.05,
    pitch: '-4%',
    toneDescription: 'Giọng đọc dẫn chuyện phim ly kỳ, âm sắc rõ ràng, nhấn mạnh trọng âm và từ khóa.',
    sampleText: 'Chính vào khoảnh khắc đó, chiếc chìa khóa cuối cùng đã biến mất.'
  },
  {
    id: 'voice_nu_soc_tiktok',
    label: 'Nữ KOC Hóng Biến (High Energy)',
    category: 'tiktok',
    gender: 'female',
    baseVoice: 'Aoede',
    speed: 1.2,
    pitch: '+10%',
    toneDescription: 'Giọng nữ miền Nam lảnh lót, tốc độ cao, biểu cảm kịch tính, cuốn hút người xem.',
    sampleText: 'Ủa alo chuyện chấn động này mấy bà đã biết chưa vậy?'
  }
];
3. src/components/VoiceSelector.tsx
Tạo component Combobox / Dropdown chọn giọng nói kèm chức năng nghe thử (Preview) bằng Web Speech API và chỉnh tốc độ/cao độ:

TypeScript
import React, { useState } from 'react';
import { VoiceOption } from '../types/voice';
import { DEFAULT_VOICE_PRESETS } from '../constants/voicePresets';

interface VoiceSelectorProps {
  selectedVoice: VoiceOption;
  onVoiceChange: (voice: VoiceOption) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Nghe thử giọng bằng Web Speech API trên trình duyệt
  const handleTestAudio = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const sample = selectedVoice.sampleText || 'Đây là đoạn thoại mẫu cho nhân vật.';
    const utterance = new SpeechSynthesisUtterance(sample);
    utterance.lang = 'vi-VN';
    utterance.rate = selectedVoice.speed;
    
    // Chuyển pitch phần trăm sang hệ số 0.5 - 1.5
    const pitchOffset = parseInt(selectedVoice.pitch.replace('%', ''), 10) || 0;
    utterance.pitch = 1 + pitchOffset / 50;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-[#16171f] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <span>🎙️</span> Giọng nhân vật cố định
        </label>
        <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
          Model: {selectedVoice.baseVoice}
        </span>
      </div>

      {/* Dropdown / Combobox */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-[#0e0f14] border border-white/10 rounded-xl px-4 py-3 text-left hover:border-amber-500/40 transition"
        >
          <div>
            <div className="text-sm font-bold text-white">{selectedVoice.label}</div>
            <div className="text-[11px] text-gray-400 line-clamp-1">{selectedVoice.toneDescription}</div>
          </div>
          <span className="text-xs text-gray-400">▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e0f14] border border-white/15 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-white/5">
            {DEFAULT_VOICE_PRESETS.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  onVoiceChange(v);
                  setIsOpen(false);
                }}
                className={`p-3 cursor-pointer hover:bg-white/5 transition flex items-center justify-between ${
                  v.id === selectedVoice.id ? 'bg-amber-500/10 text-amber-400' : 'text-gray-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{v.label}</div>
                  <div className="text-[10px] text-gray-400">{v.toneDescription}</div>
                </div>
                <span className="text-[10px] font-mono text-gray-400">{v.speed}x | {v.pitch}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice Controls: Preview & Badges */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleTestAudio}
          disabled={isPlaying}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition disabled:opacity-50"
        >
          <span>{isPlaying ? '🔊 Đang đọc...' : '▶ Nghe thử'}</span>
        </button>
        <div className="text-[10px] text-gray-400 font-mono px-3 py-2 bg-black/40 rounded-xl border border-white/5">
          Speed: {selectedVoice.speed}x | Pitch: {selectedVoice.pitch}
        </div>
      </div>
    </div>
  );
};
4. src/services/videoPromptCompiler.ts
Module sinh Prompt kỹ thuật cho model sinh video, inject cấu hình VoiceOption thành block Acoustic Hard-Lock:

TypeScript
import { VoiceOption, ShotScene } from '../types/voice';

/**
 * BIÊN DỊCH PROMPT CHO TỪNG SHOT CLIP
 * Cưỡng chế khóa giọng nói và đồng bộ khẩu hình nhân vật.
 */
export const compileShotPrompt = (scene: ShotScene, voice: VoiceOption): string => {
  const duration = scene.durationSec.toFixed(1);

  return `
[VIDEO SHOT PRODUCTION PROMPT]
[SHOT TIMECODE & DURATION]:
- Shot Index: ${scene.shotIndex} / ${scene.totalShots}
- Duration: ${duration}s
- Camera Rig / Movement: ${scene.cameraMovement || 'Static Frontal Medium Close-Up'}
- Actor Acting: ${scene.actorExpression || 'Natural lip-sync, subtle eye blinking, consistent facial expression'}

[UNIVERSAL ACOUSTIC & VOICEPRINT HARD-LOCK]:
- Language: Native Vietnamese (vi-VN).
- Voice Identity Profile: ${voice.label} (Base Engine: ${voice.baseVoice}).
- Timbre & Acoustics: ${voice.toneDescription}.
- Speaking Speed: ${voice.speed}x native rate | Pitch Shift: ${voice.pitch}.
- Hard Rules:
  1. TIMBRE INVARIANT: Maintain 100% vocal tract geometry and speaker identity. Never drift into other voice timbres.
  2. EMOTION DECOUPLING: Express emotion purely through facial micro-expressions and delivery tempo; do NOT alter the fundamental vocal identity.
  3. CLEAR ARTICULATION: Pronounce standard Vietnamese tones accurately (sac, huyen, hoi, nga, nang, ngang).

[SPOKEN DIALOGUE / LIP-SYNC]:
"${scene.dialogue}"

[NEGATIVE CONSTRAINTS]:
NO voice switching, NO vocal drift between shots, NO audio distortion, NO robotic clipping, NO wrong lip flap, NO extra unscripted dialogue, NO subtitles, NO watermarks.
`.trim();
};