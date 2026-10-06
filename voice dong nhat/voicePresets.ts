export interface VoiceOption {
  id: string;
  category: 'podcast' | 'tiktok' | 'raw';
  label: string;
  subLabel: string;
  gender: 'female' | 'male';
  region: string;
  baseVoice: 'Aoede' | 'Charon' | 'Kore' | 'Fenrir' | 'Puck';
  alias?: string;
  speed: number;
  pitch: string;
  badgeColor: string;
  prompt: string;
  sampleSentence: string;
}
export const CURATED_VOICE_PRESETS: VoiceOption[] = [
  {
    id: 'koc_1',
    category: 'podcast',
    label: 'Nữ Trầm Bản Lĩnh',
    subLabel: 'Deep chest resonance, crisp articulation',
    gender: 'female',
    region: 'Bắc',
    baseVoice: 'Kore',
    speed: 1.05,
    pitch: '-8%',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    prompt: 'Professional Northern Vietnamese female with deep chest resonance.',
    sampleSentence: "Bản lĩnh không nằm ở việc bạn thắng được ai, mà là cách bạn học từ thất bại."
  },
  {
    id: 'koc_2',
    category: 'podcast',
    label: 'Nam Tri Kỷ',
    subLabel: 'Warm baritone, empathetic pacing',
    gender: 'male',
    region: 'Toàn quốc',
    baseVoice: 'Fenrir',
    speed: 0.95,
    pitch: '-5%',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    prompt: 'Warm baritone Vietnamese male, empathetic pacing.',
    sampleSentence: "Chào bạn, hãy cùng mình học cách yêu thương bản thân nhiều hơn mỗi ngày."
  },
  {
    id: 'koc_3',
    category: 'podcast',
    label: 'Nữ Tươi Sáng & Hóm Hỉnh',
    subLabel: 'Bright, energetic delivery',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.2,
    pitch: '+12%',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    prompt: 'Bright and energetic Southern Vietnamese female.',
    sampleSentence: "Trời ơi tin được không, bí kíp này sẽ giúp bạn học mọi thứ nhanh gấp đôi đó!"
  },
  {
    id: 'koc_4',
    category: 'podcast',
    label: 'Nữ Chữa Lành & Tự Sự',
    subLabel: 'Airy low-register (Leda)',
    gender: 'female',
    region: 'Bắc nhẹ',
    baseVoice: 'Aoede',
    alias: 'Leda',
    speed: 0.95,
    pitch: '-3%',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    prompt: 'Soothing and airy Northern Vietnamese female, Leda profile.',
    sampleSentence: "Hãy để trái tim được nghỉ ngơi và học cách chữa lành những vết thương cũ."
  },
  {
    id: 'koc_5',
    category: 'podcast',
    label: 'Nam Lãnh Đạo Hào Sảng',
    subLabel: 'Resonant, commanding presence',
    gender: 'male',
    region: 'Toàn quốc',
    baseVoice: 'Charon',
    speed: 1.1,
    pitch: '-2%',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    prompt: 'Commanding and resonant Vietnamese male leader.',
    sampleSentence: "Chúng ta cần học cách dẫn dắt bằng tầm nhìn chứ không chỉ bằng mệnh lệnh."
  },
  {
    id: 'koc_6',
    category: 'podcast',
    label: 'Nam Trí Thức Điềm Đạm',
    subLabel: 'Composed, analytical (Orpheus)',
    gender: 'male',
    region: 'Toàn quốc',
    baseVoice: 'Fenrir',
    alias: 'Orpheus',
    speed: 1.0,
    pitch: '-4%',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    prompt: 'Analytical and composed Vietnamese male intellectual.',
    sampleSentence: "Phân tích kỹ lưỡng sẽ giúp bạn học được những quy luật ẩn sau các con số."
  },
  {
    id: 'koc_7',
    category: 'podcast',
    label: 'Nữ Trải Đời & Thực Tế',
    subLabel: 'Husky, candid realism',
    gender: 'female',
    region: 'Toàn quốc',
    baseVoice: 'Kore',
    speed: 1.05,
    pitch: '-5%',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    prompt: 'Husky and candid female voice with high realism.',
    sampleSentence: "Cuộc đời này sẽ dạy bạn học những bài học thực tế nhất, dù có đau lòng."
  },
  {
    id: 'koc_8',
    category: 'podcast',
    label: 'Nữ Kể Chuyện & Tản Văn',
    subLabel: 'Poetic, soft lyrical (Leda)',
    gender: 'female',
    region: 'Toàn quốc',
    baseVoice: 'Aoede',
    alias: 'Leda',
    speed: 0.9,
    pitch: '0%',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    prompt: 'Soft and poetic narrative female voice.',
    sampleSentence: "Mỗi trang sách đều chứa đựng một tâm hồn đang học cách kể lại câu chuyện của mình."
  },
  {
    id: 'koc_9',
    category: 'tiktok',
    label: 'Nữ Chốt Đơn Bùng Nổ',
    subLabel: 'Punchy, rapid persuasion',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.25,
    pitch: '+15%',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    prompt: 'Punchy, high-speed sales persuasion female voice.',
    sampleSentence: "Săn deal ngay bây giờ để học cách làm đẹp với chi phí rẻ nhất thị trường!"
  },
  {
    id: 'koc_10',
    category: 'tiktok',
    label: 'Nữ Hóng Biến Xéo Xắt',
    subLabel: 'Sarcastic, vocal fry',
    gender: 'female',
    region: 'Nam',
    baseVoice: 'Aoede',
    speed: 1.2,
    pitch: '+10%',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    prompt: 'Sarcastic and witty Southern Vietnamese female gossip voice.',
    sampleSentence: "Để tui chỉ cho mấy bà học cách soi drama sao cho nó chuẩn chỉnh nè."
  },
  {
    id: 'koc_11',
    category: 'podcast',
    label: 'Nam Kỳ Án & Bí Ẩn',
    subLabel: 'Whispering low register (Zephyr)',
    gender: 'male',
    region: 'Toàn quốc',
    baseVoice: 'Puck',
    alias: 'Zephyr',
    speed: 0.9,
    pitch: '-10%',
    badgeColor: 'bg-violet-900/40 text-violet-400 border-violet-500/30',
    prompt: 'Low register, whispering and ominous male voice.',
    sampleSentence: "Bạn sẽ không muốn học về những bí mật đen tối đang lẩn khuất ở đây đâu."
  },
  {
    id: 'koc_12',
    category: 'tiktok',
    label: 'Nữ POV Kiêu Kỳ',
    subLabel: 'Haughty, superior drawl',
    gender: 'female',
    region: 'Toàn quốc',
    baseVoice: 'Kore',
    speed: 1.05,
    pitch: '+5%',
    badgeColor: 'bg-cyan-900/40 text-cyan-400 border-cyan-500/30',
    prompt: 'Haughty and composed superior female drawl.',
    sampleSentence: "Muốn bước vào thế giới này, trước tiên anh phải học cách khiêm nhường đã."
  }
];
export const RAW_GEMINI_BASE_VOICES: VoiceOption[] = [
  { id: 'raw_aoede', category: 'raw', label: 'Aoede', subLabel: 'Standard Female (Bright)', gender: 'female', region: 'Gemini Default', baseVoice: 'Aoede', speed: 1.0, pitch: '0%', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', prompt: 'Standard Gemini TTS voice Aoede.', sampleSentence: "Đây là giọng đọc gốc Aoede." },
  { id: 'raw_charon', category: 'raw', label: 'Charon', subLabel: 'Standard Male (Warm)', gender: 'male', region: 'Gemini Default', baseVoice: 'Charon', speed: 1.0, pitch: '0%', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', prompt: 'Standard Gemini TTS voice Charon.', sampleSentence: "Đây là giọng đọc gốc Charon." },
  { id: 'raw_fenrir', category: 'raw', label: 'Fenrir', subLabel: 'Standard Male (Deep)', gender: 'male', region: 'Gemini Default', baseVoice: 'Fenrir', speed: 1.0, pitch: '0%', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', prompt: 'Standard Gemini TTS voice Fenrir.', sampleSentence: "Đây là giọng đọc gốc Fenrir." },
  { id: 'raw_kore', category: 'raw', label: 'Kore', subLabel: 'Standard Female (Soft)', gender: 'female', region: 'Gemini Default', baseVoice: 'Kore', speed: 1.0, pitch: '0%', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', prompt: 'Standard Gemini TTS voice Kore.', sampleSentence: "Đây là giọng đọc gốc Kore." },
  { id: 'raw_puck', category: 'raw', label: 'Puck', subLabel: 'Standard Male (Punchy)', gender: 'male', region: 'Gemini Default', baseVoice: 'Puck', speed: 1.0, pitch: '0%', badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30', prompt: 'Standard Gemini TTS voice Puck.', sampleSentence: "Đây là giọng đọc gốc Puck." }
];
export const VOICE_PRESETS = [...CURATED_VOICE_PRESETS, ...RAW_GEMINI_BASE_VOICES];