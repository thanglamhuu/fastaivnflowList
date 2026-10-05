Version 2.8.1.
Thêm label error để hiện lỗi trên Header hoặc tích hợp thu viện Toast để hiện các cảnh báo khi có lỗi thay vì alert error do chạy trong môi trường sanbox.
Thêm lựa chọn Giọng nói dạng combobox cùng dòng, thay thế vào vị trí Nam/Nữ giọng Miền Bắc/Miền Trung/Miền Nam. Khi tạo voice sẽ lấy theo lựa chọn này.
/**
 * ============================================================================
 * GEMINI TTS MASTER ENGINE - AUDIO & SCRIPT CONTROLLER (vi-VN)
 * ============================================================================
 * - Tích hợp chuẩn 12 Curated Presets (8 Podcast + 4 TikTok Viral)
 * - Tích hợp 5 Base Voices gốc của Gemini TTS (Aoede, Charon, Fenrir, Kore, Puck)
 * - Khóa cứng ngữ âm tiếng Việt chuẩn bản xứ (Strict Native vi-VN Enforcement)
 * - Thuật toán phân bổ kịch bản theo nhịp câu & tính toán thời lượng đọc
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

export interface SceneSegment {
  id: number;
  startTime: number;
  endTime: number;
  durationSec: number;
  script: string;
  wordCount: number;
  cameraRigSuggestion: string;
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

// ============================================================================
// 1. DANH MỤC 12 PRESET GIỌNG CHUẨN HÓA (8 PODCAST + 4 TIKTOK TREND)
// ============================================================================
export const CURATED_VOICE_PRESETS: VoicePreset[] = [
  // --- 8 GIỌNG PODCAST CHUYÊN SÂU ---
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
    prompt: `Voice Profile: A deep, husky Contralto Vietnamese female voice in her 30s with an authentic Northern accent.
Timbre & Pitch: Lowered by one tone into a warm, deep Contralto register. The vocal texture is distinctly husky, smoky, and richly textured, featuring subtle natural vocal fry and deep chest resonance at lower notes.
Delivery & Pacing: Moderately brisk, rhythmic, and articulate at 1.1x speed (around 120-130 WPM), maintaining clear articulation and natural pauses without losing momentum. Tone is calm, confident, and mature, like an experienced mentor sharing heartfelt life insights.
Constraints: NO high pitch, NO bright or overly sweet soprano tones, NO artificial smoothness, NO slurring. Emphasize grounded acoustic warmth, dry vocal raspiness, crisp enunciation, and sincere emotional maturity.`
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
    prompt: `Voice Profile: A relatable, warm, and emotionally expressive Vietnamese male host in his mid-30s with a genuine, friendly Southern Vietnamese accent.
Timbre & Acoustics: Warm baritone with natural acoustic intimacy (close-mic feel). Unfiltered, organic vocal texture with gentle breathiness and zero harshness.
Tone & Delivery: Highly conversational, empathetic, heartfelt, and brotherly, resembling a beloved late-night talkshow host or close friend confiding life stories ("tri kỷ"). Delivery shifts smoothly between welcoming cheerfulness and tender, nostalgic introspection at 1.05x speed.
Pacing: Natural conversational flow (around 120 WPM), incorporating authentic emotional pauses, thoughtful sighs, and spontaneous conversational inflections.
Constraints: NO stiff newsreader cadence, NO robotic monotony, NO exaggerated theatrics, NO aggressive vocal fry. Emphasize sincere warmth, approachable charm, and soulful connection.`
  },
  {
    id: 'voice_south_bubbly',
    category: 'podcast',
    label: 'Nữ Tươi Sáng & Hóm Hỉnh (miền Nam)',
    subLabel: 'Gen Z, góc nhìn văn phòng, đời sống hiện đại',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.2,
    pitch: '+12%',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    prompt: `Voice Profile: A lively, witty, and bubbly young Vietnamese female creator (early 20s) with an authentic, trendy Southern accent (Saigon style).
Timbre & Texture: High-spirited, bright, and cheerful tone with playful pitch variations and natural giggly inflections.
Delivery & Mood: Brisk, fast-talking, and conversational at 1.2x pace. Engaging and comedic timing for short-form viral storytelling.
Constraints: NO robotic monotone, NO slow sorrowful cadence, NO formal broadcast stiffness.`
  },
  {
    id: 'voice_central_poetic',
    category: 'podcast',
    label: 'Nữ Trầm Mặc & Tự Sự (miền Trung)',
    subLabel: 'Hoài niệm quê hương, tản văn sâu lắng, thơ ca',
    gender: 'female',
    region: 'Trung',
    baseVoice: 'Kore',
    speed: 0.92,
    pitch: '-5%',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    prompt: `Voice Profile: A soulful, poetic Vietnamese female narrator in her late 20s with an evocative Central Vietnamese inflection (soft Hue/Da Nang cadence).
Timbre & Texture: Mellow, slightly shadowed mezzo-soprano with a gentle, nostalgic lilt and emotional vulnerability.
Delivery & Mood: Flowing, gentle, and contemplative at a slow pace (around 100 WPM, 0.92x speed). Perfect for literary essays, hometown memories, and poetry.
Constraints: NO aggressive sharpness, NO cold analytical tone, avoid overly heavy regional slang that harms comprehension.`
  },
  {
    id: 'voice_south_leader',
    category: 'podcast',
    label: 'Nam Lãnh Đạo Hào Sảng (miền Nam)',
    subLabel: 'Quản trị, chiến lược kinh doanh, lãnh đạo thực chiến',
    gender: 'male',
    region: 'Nam',
    baseVoice: 'Charon',
    speed: 1.02,
    pitch: '-5%',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    prompt: `Voice Profile: A distinguished, authoritative, yet charismatic Vietnamese male executive in his 40s with a mature Southern accent.
Timbre & Texture: Deep chest-resonant baritone, clear, assertive, and acoustically full with commanding warmth.
Delivery & Mood: Steady, convincing, and inspiring at a measured conversational pace (1.02x speed). Projects leadership, credibility, and pragmatic wisdom.
Constraints: NO hesitant pauses, NO juvenile pitch, NO aggressive yelling.`
  },
  {
    id: 'voice_north_scholar',
    category: 'podcast',
    label: 'Nam Trí Thức Điềm Đạm (miền Bắc)',
    subLabel: 'Triết lý sống, chiêm nghiệm nội tâm, bài học làm người',
    gender: 'male',
    region: 'Bắc',
    baseVoice: 'Charon',
    speed: 0.95,
    pitch: '-6%',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    prompt: `Voice Profile: A wise, composed, and scholarly Vietnamese male mentor in his 40s speaking refined, classical Northern Vietnamese.
Timbre & Resonance: Warm, rich baritone with gentle pharyngeal resonance and a steady chest base. Zero vocal fry, perfectly smooth and calming.
Delivery & Cadence: Unhurried, deliberate, and deeply grounding at 0.95x pace. Pauses are thoughtful and comfortable, projecting wisdom and non-judgmental empathy.
Constraints: NO aggressive emphasis, NO dramatic theatrics, NO modern slang, NO rapid speech.`
  },
  {
    id: 'voice_south_candid',
    category: 'podcast',
    label: 'Nữ Trải Đời & Thực Tế (miền Nam)',
    subLabel: 'Chị em tâm sự, tự lập, góc nhìn thực tế',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.08,
    pitch: '+2%',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    prompt: `Voice Profile: An independent, down-to-earth Vietnamese modern woman in her mid-30s with a genuine, casual Saigon accent.
Timbre & Texture: Organic mezzo-soprano with a slightly textured, husky edge. Speaks with candid, warm sisterly energy ("chị em tâm sự").
Delivery & Cadence: Moderately brisk (around 120 WPM, 1.08x speed), conversational, and direct. Natural colloquial rhythm, zero pretentiousness.
Constraints: NO sweet baby voice, NO corporate jargon stiffness, NO slow poetic melancholy.`
  },
  {
    id: 'voice_north_narrator',
    category: 'podcast',
    label: 'Nữ Kể Chuyện & Tản Văn (miền Bắc)',
    subLabel: 'Trích dẫn sách, truyện ngắn, tản văn hiện đại',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Kore',
    speed: 1.2,
    pitch: '-4%',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    prompt: `Voice Profile: A graceful, captivating Vietnamese female literary narrator (around 30 years old) with a smooth, refined Northern accent.
Timbre & Texture: Velvety, warm mezzo-soprano with soft breath support and clean, soothing resonance. Zero harsh consonants, zero vocal fry.
Delivery & Pacing: Brisk, fluid, and rhythmic at 1.2x speed (around 130-140 WPM). Articulate and expressive, blending gentle storytelling warmth with modern, engaging momentum. Pacing feels natural, effortless, and easy to follow.
Constraints: NO robotic rush, NO sharp aggressive pitch, NO heavy melancholic dragging. Maintain melodic grace, gentle warmth, and crisp enunciation.`
  },

  // --- 4 GIỌNG TIKTOK TREND & VIRAL SHORTS ---
  {
    id: 'trend_live_f',
    category: 'tiktok',
    label: 'Nữ Chốt Đơn Bùng Nổ (miền Nam)',
    subLabel: 'Livestream, săn deal, review sản phẩm TikTok Shop',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.25,
    pitch: '+10%',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    prompt: `Voice Profile: An ultra-energetic, charismatic young Vietnamese female creator (early 20s) with a trendy Saigon accent, perfect for viral TikTok Shop livestreams and unboxings.
Timbre & Modulation: High-energy, bright, and infectious tone. Expressive pitch peaks with bubbly laughter and persuasive shopping enthusiasm.
Delivery & Pace: Fast-talking at 1.25x speed with bouncy rhythm, urgent promotional hooks, and direct friendly calls-to-action.
Constraints: NO stiff corporate tone, NO sad melancholy, NO slow meditative pauses. Keep it electric and infectious.`
  },
  {
    id: 'trend_spicy_f',
    category: 'tiktok',
    label: 'Nữ Hóng Biến Xéo Xắt (miền Bắc)',
    subLabel: 'Drama showbiz, mỏ hỗn, bóc phốt, phản biện',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Aoede',
    speed: 1.18,
    pitch: '+5%',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    prompt: `Voice Profile: A sharp-witted, satirical Vietnamese female entertainment commentator in her mid-20s with an edgy Hanoi street accent.
Timbre & Delivery: Sarcastic, biting enunciation with dramatic inflection shifts, mocking theatrical whispers, and sharp comedic timing. Paced briskly at 1.18x.
Mood & Style: Highly engaging, unapologetically dramatic, and gossip-fueled ("hóng biến"). Alternates between hushed secrets and loud satirical punchlines.
Constraints: NO gentle bedtime sweetness, NO monotone objectivity, NO formal newsreader restraint.`
  },
  {
    id: 'trend_spooky_m',
    category: 'tiktok',
    label: 'Nam Kỳ Án & Bí Ẩn (miền Bắc)',
    subLabel: 'Vụ án rùng rợn, creepypasta, tâm lý tội phạm',
    gender: 'male',
    region: 'Bắc',
    baseVoice: 'Fenrir',
    speed: 0.88,
    pitch: '-16%',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    prompt: `Voice Profile: A chilling, hypnotic Vietnamese male horror storyteller in his late 30s with a dark, atmospheric Northern accent.
Timbre & Texture: Murky, deep bass with prominent proximity effect, raspy breath control, and a shadowy whispery edge.
Delivery & Mood: Deliberately paced at 0.88x with calculated, unnerving silences. Builds creeping psychological dread for urban legends and true-crime mysteries.
Constraints: NO upbeat cheerfulness, NO fast commercial pacing, NO bright treble. Must sound spine-chilling and clandestine.`
  },
  {
    id: 'trend_villain_f',
    category: 'tiktok',
    label: 'Nữ POV Kiêu Kỳ / Quyến Rũ (miền Bắc)',
    subLabel: 'POV biến hình, dark feminine, thao túng tâm lý',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Aoede',
    speed: 0.95,
    pitch: '-8%',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    prompt: `Voice Profile: A cold, enigmatic, and magnetically seductive Vietnamese female villainess in her late 20s with an aristocratic Northern accent.
Timbre & Texture: Low, smoky Contralto register with silky chest resonance and crisp, razor-sharp enunciation. Speaks with unbothered poise and chilling elegance.
Delivery & Mood: Slow, calculated, and predatory at 0.95x pace. Designed for dark feminine POV transformation trends, power dynamics, and psychological intrigue.
Constraints: NO bubbly enthusiasm, NO submissive warmth, NO rushed syllables. Exude absolute control and cold sophistication.`
  }
];

// ============================================================================
// 2. DANH MỤC 5 GIỌNG GỐC GEMINI TTS THUẦN TÚY (BASE VOICES)[cite: 4]
// ============================================================================
export const RAW_BASE_VOICES: RawBaseVoice[] = [
  { id: 'raw_aoede', name: 'Aoede', gender: 'female', label: 'AOEDE', subLabel: 'Standard Female (Bright & Expressive)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_charon', name: 'Charon', gender: 'male', label: 'CHARON', subLabel: 'Standard Male (Warm & Grounded)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_fenrir', name: 'Fenrir', gender: 'male', label: 'FENRIR', subLabel: 'Deep Male (Resonant & Authoritative)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_kore', name: 'Kore', gender: 'female', label: 'Kore', subLabel: 'Soft Female (Poetic & Soothing)', defaultSpeed: 1.0, defaultPitch: '0%' },
  { id: 'raw_puck', name: 'Puck', gender: 'male', label: 'Puck', subLabel: 'Energetic Male (Punchy & Agile)', defaultSpeed: 1.0, defaultPitch: '0%' }
];

// ============================================================================
// 3. MASTER ENGINE LOGIC (XỬ LÝ NGỮ ÂM, THỜI LƯỢNG VÀ PAYLOAD)
// ============================================================================
export class GeminiVoiceMasterEngine {
  /**
   * Khóa cứng ngữ âm tiếng Việt bản xứ (Anti-Foreign Accent Guard)
   */
  private static readonly VIETNAMESE_ACCENT_GUARD = `
[LANGUAGE & PHONETIC DIRECTIVE - MANDATORY CRITICAL]:
- Spoken Language: 100% Native Vietnamese (tiếng Việt chuẩn bản xứ).
- Phonetics & Tonality: Accurate 6-tone articulation (Ngang, Huyền, Sắc, Hỏi, Ngã, Nặng).
- Absolute Negative Restriction: STRICTLY NO English accent, NO Americanized cadence, NO broken Vietnamese, NO foreign mispronunciation ("Tuyệt đối cấm đọc tiếng Việt lơ lớ kiểu người nước ngoài").
- Natural Speaking Flow: Ensure clear final consonants (-c, -t, -p, -m, -n, -ng) and organic conversational cadence.
`.trim();

  /**
   * Tính toán ngân sách từ tối đa cho thời lượng video
   * Chuẩn tốc độ nói tiếng Việt: ~2.6 từ/giây ở tốc độ 1.0x
   */
  public static calculateSpeechBudget(durationSec: number, speed: number = 1.0): { targetWords: number; minWords: number; maxWords: number } {
    const baseWps = 2.65;
    const targetWords = Math.round(durationSec * baseWps * speed);
    return {
      targetWords,
      minWords: Math.floor(targetWords * 0.85),
      maxWords: Math.ceil(targetWords * 1.15)
    };
  }

  /**
   * Tìm kiếm preset theo ID
   */
  public static getPresetById(presetId: string): VoicePreset | undefined {
    return CURATED_VOICE_PRESETS.find(p => p.id === presetId);
  }

  /**
   * Ghép System Instruction hoàn chỉnh cho Gemini TTS
   */
  public static buildSystemInstruction(promptDirective?: string): string {
    const customPart = promptDirective ? `\n\n[STYLE & TIMBRE SPECIFICATION]:\n${promptDirective.trim()}` : '';
    return `this.VIETNAMESEACCENTGUARD{customPart}`;
  }

  /**
   * Phân tích cao độ chuỗi (vd: "+10%", "-5%") thành số nguyên
   */
  public static parsePitchToNumber(pitchStr: string): number {
    const cleaned = pitchStr.replace('%', '').trim();
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Tạo Payload chuẩn để gửi thẳng đến REST API hoặc SDK của Gemini TTS
   */
  public static generateTTSPayload(params: {
    text: string;
    baseVoice: GeminiBaseVoiceName;
    speed?: number;
    pitch?: string;
    promptDirective?: string;
    audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
  }): TTSRequestPayload {
    const speed = params.speed || 1.0;
    const pitchNum = params.pitch ? this.parsePitchToNumber(params.pitch) : 0;

    return {
      input: {
        text: params.text.trim()
      },
      voice: {
        languageCode: 'vi-VN',
        name: params.baseVoice
      },
      audioConfig: {
        audioEncoding: params.audioEncoding || 'MP3',
        speakingRate: speed,
        pitch: pitchNum
      },
      systemInstruction: this.buildSystemInstruction(params.promptDirective)
    };
  }

  /**
   * Thuật toán chia kịch bản theo câu nguyên vẹn (Sentence-Boundary Aware)
   * Đảm bảo không bao giờ bị cắt cụt câu và bảo toàn 100% nội dung kịch bản
   */
  public static splitScriptComplete(
    script: string,
    totalScenes: number = 3,
    sceneSec: number = 10
  ): SceneSegment[] {
    const cleanSentences = script
      .replace(/([.!?…])\s+/g, "$1|")
      .split("|")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (cleanSentences.length === 0) return [];

    const cameraSequences = ['CAM_1_FRONT_MCU', 'CAM_2_SIDE_CU', 'CAM_1_ZOOM'];
    const scenes: SceneSegment[] = [];

    if (cleanSentences.length <= totalScenes) {
      for (let i = 0; i < totalScenes; i++) {
        const segText = cleanSentences[i] || '';
        scenes.push({
          id: i + 1,
          startTime: i * sceneSec,
          endTime: (i + 1) * sceneSec,
          durationSec: sceneSec,
          script: segText,
          wordCount: segText ? segText.split(/\s+/).length : 0,
          cameraRigSuggestion: cameraSequences[i % cameraSequences.length]
        });
      }
      return scenes;
    }

    const sentencesPerScene = Math.ceil(cleanSentences.length / totalScenes);

    for (let i = 0; i < totalScenes; i++) {
      const start = i * sentencesPerScene;
      const end = (i === totalScenes - 1) ? cleanSentences.length : Math.min(start + sentencesPerScene, cleanSentences.length);
      const segText = cleanSentences.slice(start, end).join(' ');

      scenes.push({
        id: i + 1,
        startTime: i * sceneSec,
        endTime: (i + 1) * sceneSec,
        durationSec: sceneSec,
        script: segText,
        wordCount: segText ? segText.split(/\s+/).length : 0,
        cameraRigSuggestion: cameraSequences[i % cameraSequences.length]
      });
    }

    return scenes;
  }
}
