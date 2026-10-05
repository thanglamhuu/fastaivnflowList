/**
 * ============================================================================
 * GEMINI TTS MASTER ENGINE - AUDIO & SCRIPT CONTROLLER (vi-VN)
 * ============================================================================
 */
export type GeminiBaseVoiceName = 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';
export type VoiceCategory = 'podcast' | 'tiktok';
export type VoiceGender = 'female' | 'male';
export type VoiceRegion = 'Bắc' | 'Trung' | 'Nam';
export interface VoicePreset {
  id: string;
  category: VoiceCategory;
  label: string;
  subLabel: string;
  gender: VoiceGender;
  region: VoiceRegion;
  baseVoice: GeminiBaseVoiceName;
  speed: number;
  pitch: string;
  badgeColor?: string;
  prompt: string;
}
export interface RawBaseVoice {
  id: string;
  name: GeminiBaseVoiceName;
  gender: VoiceGender;
  label: string;
  subLabel: string;
  defaultSpeed: number;
  defaultPitch: string;
}
export interface TTSRequestPayload {
  input: {
    text: string;
  };
  voice: {
    languageCode: 'vi-VN';
    name: GeminiBaseVoiceName;
  };
  audioConfig: {
    audioEncoding: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
    speakingRate: number;
    pitch: number;
  };
  systemInstruction: string;
}
export const CURATED_VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'voice_north_alto',
    category: 'podcast',
    label: 'Nữ Trầm Bản Lĩnh (miền Bắc)',
    subLabel: 'Tài chính, tâm lý học hành vi, bản lĩnh sống',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Aoede',
    speed: 1.1,
    pitch: '-10%',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    prompt: `Voice Profile: A deep, husky Contralto Vietnamese female voice...`
  },
  {
    id: 'voice_south_intimate',
    category: 'podcast',
    label: 'Nam Tri Kỷ (miền Nam)',
    subLabel: 'Tâm sự đời thường, tri kỷ cảm xúc, thấu cảm',
    gender: 'male',
    region: 'Nam',
    baseVoice: 'Charon',
    speed: 1.05,
    pitch: '0%',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    prompt: `Voice Profile: A relatable, warm, and emotionally expressive Vietnamese male host...`
  },
  {
    id: 'voice_south_bubbly',
    category: 'podcast',
    label: 'Nữ Tươi Sáng (miền Nam)',
    subLabel: 'Gen Z, góc nhìn văn phòng, đời sống hiện đại',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.2,
    pitch: '+12%',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    prompt: `Voice Profile: A lively, witty, and bubbly young Vietnamese female creator...`
  },
  {
    id: 'voice_central_poetic',
    category: 'podcast',
    label: 'Nữ Trầm Mặc (miền Trung)',
    subLabel: 'Hoài niệm quê hương, tản văn sâu lắng, thơ ca',
    gender: 'female',
    region: 'Trung',
    baseVoice: 'Kore',
    speed: 0.92,
    pitch: '-5%',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    prompt: `Voice Profile: A soulful, poetic Vietnamese female narrator...`
  },
  {
    id: 'voice_south_leader',
    category: 'podcast',
    label: 'Nam Hào Sảng (miền Nam)',
    subLabel: 'Quản trị, chiến lược kinh doanh',
    gender: 'male',
    region: 'Nam',
    baseVoice: 'Charon',
    speed: 1.02,
    pitch: '-5%',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    prompt: `Voice Profile: A distinguished, authoritative, yet charismatic Vietnamese male executive...`
  },
  {
    id: 'voice_north_scholar',
    category: 'podcast',
    label: 'Nam Trí Thức (miền Bắc)',
    subLabel: 'Triết lý sống, chiêm nghiệm nội tâm',
    gender: 'male',
    region: 'Bắc',
    baseVoice: 'Charon',
    speed: 0.95,
    pitch: '-6%',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    prompt: `Voice Profile: A wise, composed, and scholarly Vietnamese male mentor...`
  },
  {
    id: 'voice_south_candid',
    category: 'podcast',
    label: 'Nữ Thực Tế (miền Nam)',
    subLabel: 'Chị em tâm sự, tự lập',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.08,
    pitch: '+2%',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    prompt: `Voice Profile: An independent, down-to-earth Vietnamese modern woman...`
  },
  {
    id: 'voice_north_narrator',
    category: 'podcast',
    label: 'Nữ Kể Chuyện (miền Bắc)',
    subLabel: 'Trích dẫn sách, truyện ngắn',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Kore',
    speed: 1.2,
    pitch: '-4%',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    prompt: `Voice Profile: A graceful, captivating Vietnamese female literary narrator...`
  },
  {
    id: 'trend_live_f',
    category: 'tiktok',
    label: 'Nữ Chốt Đơn (miền Nam)',
    subLabel: 'Livestream, săn deal, review TikTok Shop',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.25,
    pitch: '+10%',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    prompt: `Voice Profile: An ultra-energetic, charismatic young Vietnamese female creator...`
  },
  {
    id: 'trend_spicy_f',
    category: 'tiktok',
    label: 'Nữ Hóng Biến (miền Bắc)',
    subLabel: 'Drama showbiz, mỏ hỗn, bóc phốt',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Aoede',
    speed: 1.18,
    pitch: '+5%',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    prompt: `Voice Profile: A sharp-witted, satirical Vietnamese female entertainment commentator...`
  },
  {
    id: 'trend_spooky_m',
    category: 'tiktok',
    label: 'Nam Kỳ Án (miền Bắc)',
    subLabel: 'Vụ án rùng rợn, bí ẩn',
    gender: 'male',
    region: 'Bắc',
    baseVoice: 'Fenrir',
    speed: 0.88,
    pitch: '-16%',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    prompt: `Voice Profile: A chilling, hypnotic Vietnamese male horror storyteller...`
  },
  {
    id: 'trend_villain_f',
    category: 'tiktok',
    label: 'Nữ Villainess (miền Bắc)',
    subLabel: 'POV biến hình, dark feminine',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Aoede',
    speed: 0.95,
    pitch: '-8%',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    prompt: `Voice Profile: A cold, enigmatic, and magnetically seductive Vietnamese female villainess...`
  }
];
export const RAW_BASE_VOICES: RawBaseVoice[] = [
  { id: 'raw_aoede', name: 'Aoede', gender: 'female', label: 'AOEDE', subLabel: 'Standard Female (Bright)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_charon', name: 'Charon', gender: 'male', label: 'CHARON', subLabel: 'Standard Male (Warm)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_fenrir', name: 'Fenrir', gender: 'male', label: 'FENRIR', subLabel: 'Deep Male (Resonant)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_kore', name: 'Kore', gender: 'female', label: 'Kore', subLabel: 'Soft Female (Poetic)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_puck', name: 'Puck', gender: 'male', label: 'Puck', subLabel: 'Energetic Male (Punchy)', defaultSpeed: 1.0, defaultPitch: '0%' }
];
export class GeminiVoiceMasterEngine {
  private static readonly VIETNAMESE_ACCENT_GUARD = `
[LANGUAGE & PHONETIC DIRECTIVE - MANDATORY CRITICAL]:
- Spoken Language: 100% Native Vietnamese.
- Phonetics & Tonality: Accurate 6-tone articulation.
- Natural Speaking Flow: Ensure organic conversational cadence.`.trim();
  public static buildSystemInstruction(promptDirective?: string): string {
    const customPart = promptDirective ? `\n\n[STYLE & TIMBRE SPECIFICATION]:\n${promptDirective.trim()}` : '';
    return `${this.VIETNAMESE_ACCENT_GUARD}${customPart}`;
  }
  public static parsePitchToNumber(pitchStr: string): number {
    const cleaned = pitchStr.replace('%', '').trim();
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }
}