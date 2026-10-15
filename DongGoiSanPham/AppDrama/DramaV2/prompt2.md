Hãy đóng vai trò là một Senior ReactJS/TypeScript Architect chuyên phát triển ứng dụng AI Video Studio trên Google Flow. Hãy xây dựng cho tôi ứng dụng làm phim ngắn hoàn chỉnh từ kịch bản JSON mang tên **"Flow AI Short Film Studio"**.

### 1. DỮ LIỆU GIỌNG ĐỌC (`src/voicePresets.ts`) & TYPES (`src/types.ts`)
Tạo file `src/voicePresets.ts` chứa chính xác interface `VoiceOption` và đủ 12 giọng đọc trong mảng `MATRIX_12_VOICES`, được sắp xếp theo thứ tự **TẤT CẢ GIỌNG NAM (`gender: 'male'`) LÊN TRƯỚC, SAU ĐÓ ĐẾN TẤT CẢ GIỌNG NỮ (`gender: 'female'`)** như sau:

```typescript
export interface VoiceOption {
  id: string;
  category: 'podcast' | 'tiktok' | 'narrative';
  label: string;
  subLabel: string;
  gender: 'female' | 'male';
  region: string;
  baseVoice: 'Kore' | 'Fenrir' | 'Aoede' | 'Leda' | 'Charon' | 'Orpheus' | 'Zephyr';
  speed: number;
  pitch: string;
  acousticProfile: string;
  badgeColor: string;
  sampleSentence: string;
}

export const MATRIX_12_VOICES: VoiceOption[] = [
  // === NHÓM GIỌNG NAM (HIỂN THỊ TRƯỚC) ===
  {
    id: 'voice_02',
    category: 'podcast',
    label: '02. Nam Tri Kỷ',
    subLabel: 'Base Fenrir | vi-VN (Bắc/Nam)',
    gender: 'male',
    region: 'vi-VN (Bắc/Nam)',
    baseVoice: 'Fenrir',
    speed: 0.95,
    pitch: '-5%',
    acousticProfile: 'Warm baritone, empathetic pacing, intimate low-frequency resonance.',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    sampleSentence: 'Hãy thở chậm lại một nhịp, lắng nghe chính mình sau một ngày dài mỏi mệt.'
  },
  {
    id: 'voice_05',
    category: 'podcast',
    label: '05. Nam Lãnh Đạo Hào Sảng',
    subLabel: 'Base Charon | vi-VN (Bắc)',
    gender: 'male',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Charon',
    speed: 1.10,
    pitch: '-2%',
    acousticProfile: 'Commanding baritone, authoritative chest projection.',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    sampleSentence: 'Kỷ luật và tầm nhìn là hai yếu tố duy nhất định hình nên một vị thuyền trưởng thực thụ.'
  },
  {
    id: 'voice_06',
    category: 'podcast',
    label: '06. Nam Trí Thức Điềm Đạm',
    subLabel: 'Base Orpheus | vi-VN (Bắc)',
    gender: 'male',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Orpheus',
    speed: 1.00,
    pitch: '-4%',
    acousticProfile: 'Composed baritone, analytical, steady calm cadence.',
    badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    sampleSentence: 'Bản chất logic của mọi vấn đề luôn nằm ở những dữ kiện cốt lõi mà chúng ta thường bỏ qua.'
  },
  {
    id: 'voice_11',
    category: 'narrative',
    label: '11. Nam Kỳ Án & Bí Ẩn',
    subLabel: 'Base Zephyr | vi-VN (Bắc)',
    gender: 'male',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Zephyr',
    speed: 0.90,
    pitch: '-10%',
    acousticProfile: 'Ominous whispering low-register, deliberate suspense pauses.',
    badgeColor: 'bg-violet-900/40 text-violet-300 border-violet-500/30',
    sampleSentence: 'Trong màn đêm dày đặc, manh mối duy nhất bị chôn vùi dưới tầng hầm hoang phế.'
  },
  // === NHÓM GIỌNG NỮ (HIỂN THỊ SAU) ===
  {
    id: 'voice_01',
    category: 'podcast',
    label: '01. Nữ Trầm Bản Lĩnh',
    subLabel: 'Base Kore | vi-VN (Bắc)',
    gender: 'female',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Kore',
    speed: 1.05,
    pitch: '-8%',
    acousticProfile: 'Deep chest resonance, assertive, cold-stable timbre.',
    badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    sampleSentence: 'Bản lĩnh không nằm ở việc áp đặt, mà là sự tự chủ tĩnh lặng từ sâu bên trong.'
  },
  {
    id: 'voice_03',
    category: 'tiktok',
    label: '03. Nữ Tươi Sáng & Hóm Hỉnh',
    subLabel: 'Base Aoede | vi-VN (Nam)',
    gender: 'female',
    region: 'vi-VN (Nam)',
    baseVoice: 'Aoede',
    speed: 1.20,
    pitch: '+12%',
    acousticProfile: 'Bright, crisp treble, bouncy cadence.',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    sampleSentence: 'Bí kíp này siêu đơn giản luôn, áp dụng liền là thấy kết quả bất ngờ liền nghen!'
  },
  {
    id: 'voice_04',
    category: 'podcast',
    label: '04. Nữ Chữa Lành & Tự Sự',
    subLabel: 'Base Leda | vi-VN (Bắc nhẹ)',
    gender: 'female',
    region: 'vi-VN (Bắc nhẹ)',
    baseVoice: 'Leda',
    speed: 0.95,
    pitch: '-3%',
    acousticProfile: 'Soft melodic low-register, airy delivery.',
    badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    sampleSentence: 'Vết thương nào rồi cũng sẽ lành, chỉ cần bạn cho bản thân đủ thời gian và sự kiên nhẫn.'
  },
  {
    id: 'voice_07',
    category: 'podcast',
    label: '07. Nữ Trải Đời & Thực Tế',
    subLabel: 'Base Kore | vi-VN (Bắc)',
    gender: 'female',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Kore',
    speed: 1.05,
    pitch: '-5%',
    acousticProfile: 'Husky chest voice, candid realism.',
    badgeColor: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    sampleSentence: 'Đừng mơ mộng viển vông, thực tế cuộc sống chỉ công nhận những gì bạn thật sự tạo ra.'
  },
  {
    id: 'voice_08',
    category: 'narrative',
    label: '08. Nữ Kể Chuyện & Tản Văn',
    subLabel: 'Base Leda | vi-VN (Bắc)',
    gender: 'female',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Leda',
    speed: 0.90,
    pitch: '0%',
    acousticProfile: 'Poetic lyrical cadence, tranquil, soft airflow.',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    sampleSentence: 'Cơn mưa chiều buông xuống như nhắc nhở về một miền ký ức đã ngủ yên từ rất lâu.'
  },
  {
    id: 'voice_09',
    category: 'tiktok',
    label: '09. Nữ Chốt Đơn Bùng Nổ',
    subLabel: 'Base Aoede | vi-VN (Nam/Bắc)',
    gender: 'female',
    region: 'vi-VN (Nam/Bắc)',
    baseVoice: 'Aoede',
    speed: 1.25,
    pitch: '+15%',
    acousticProfile: 'High tempo, punchy projection, sharp urgency.',
    badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    sampleSentence: 'Cơ hội duy nhất trong phiên hôm nay, nhấn ngay giỏ hàng trước khi hết sạch suất ưu đãi!'
  },
  {
    id: 'voice_10',
    category: 'tiktok',
    label: '10. Nữ Hóng Biến Xéo Xắt',
    subLabel: 'Base Aoede | vi-VN (Nam)',
    gender: 'female',
    region: 'vi-VN (Nam)',
    baseVoice: 'Aoede',
    speed: 1.20,
    pitch: '+10%',
    acousticProfile: 'Sarcastic inflection, vocal fry, rapid cadence.',
    badgeColor: 'bg-red-500/10 text-red-300 border-red-500/30',
    sampleSentence: 'Mấy bà nghĩ tự nhiên mà mọi chuyện trót lọt như vậy hả, drama đằng sau còn dài tập lắm nha!'
  },
  {
    id: 'voice_12',
    category: 'tiktok',
    label: '12. Nữ POV Kiêu Kỳ',
    subLabel: 'Base Kore | vi-VN (Bắc)',
    gender: 'female',
    region: 'vi-VN (Bắc)',
    baseVoice: 'Kore',
    speed: 1.05,
    pitch: '+5%',
    acousticProfile: 'Haughty superior drawl, detached elegance.',
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-500/30',
    sampleSentence: 'Muốn ngồi cùng bàn tiệc với tôi, trước hết hãy chứng minh bạn có đủ tiêu chuẩn tối thiểu.'
  }
];