import { GenrePreset, CameraRig } from './types';
export const GENRE_PRESETS: GenrePreset[] = [
  {
    id: 'dating',
    name: 'Hẹn hò và tâm lý',
    lighting: 'Warm cinematic 3200K, soft pink accents, intimate podcast room, wooden wall',
    wordsPerSec: 3.4,
    cameraBias: ['CAM_FRONT_MCU', 'CAM_SIDE_45', 'CAM_TIGHT_CU'],
    description: 'Thấu hiểu, điềm tĩnh, bóc tách tâm lý sâu sắc.',
    icon: 'favorite',
    color: '#E11D48'
  },
  {
    id: 'business',
    name: 'Kinh doanh và tài chính',
    lighting: 'Crisp professional studio, sharp lighting, corporate podcast set, Shure mic visible',
    wordsPerSec: 3.4,
    cameraBias: ['CAM_FRONT_MCU', 'CAM_LOW_ANGLE', 'CAM_SLIDER_LATERAL'],
    description: 'Đanh thép, thực tế, logic số liệu, tư duy thực chiến.',
    icon: 'payments',
    color: '#0D9488'
  },
  {
    id: 'growth',
    name: 'Phát triển và kỷ luật',
    lighting: 'High-contrast lighting, bold shadows, minimal modern podcast studio',
    wordsPerSec: 3.4,
    cameraBias: ['CAM_FRONT_MCU', 'CAM_TIGHT_CU', 'CAM_EXTREME_CU'],
    description: 'Nghiêm khắc, truyền cảm hứng hành động, dứt khoát.',
    icon: 'local_fire_department',
    color: '#EA580C'
  },
  {
    id: 'communication',
    name: 'Giao tiếp và ứng xử',
    lighting: 'Balanced soft box lighting, warm atmosphere, approachable studio vibe',
    wordsPerSec: 3.4,
    cameraBias: ['CAM_FRONT_MCU', 'CAM_SIDE_45', 'CAM_WIDE_DESK'],
    description: 'Khéo léo, đĩnh đạc, ấm áp, tinh tế.',
    icon: 'forum',
    color: '#6366F1'
  },
  {
    id: 'confiding',
    name: 'Tâm sự và tri kỷ',
    lighting: 'Low-key warm tungsten, table lamp glow, intimate night-time studio',
    wordsPerSec: 3.4,
    cameraBias: ['CAM_SIDE_45', 'CAM_BOKEH_MIC', 'CAM_TIGHT_CU'],
    description: 'Gần gũi, chia sẻ, hạ thấp nhịp thở, không gian an toàn.',
    icon: 'coffee',
    color: '#B45309'
  },
  {
    id: 'healing',
    name: 'Chữa lành và sống chậm',
    lighting: 'Ethereal diffused natural light, zen aesthetics, soft green accents',
    wordsPerSec: 3.4,
    cameraBias: ['CAM_FRONT_MCU', 'CAM_SIDE_45', 'CAM_TIGHT_CU'],
    description: 'Tĩnh tại, nhẹ nhàng, từ tốn, giọng nói xoa dịu.',
    icon: 'potted_plant',
    color: '#16A34A'
  }
];
export const CAMERA_RIG_SYSTEM: { id: CameraRig; label: string; description: string }[] = [
  { id: 'CAM_FRONT_MCU', label: 'CAM_FRONT_MCU', description: 'Trung cận chính diện ngang tầm mắt' },
  { id: 'CAM_SIDE_45', label: 'CAM_SIDE_45', description: 'Góc nghiêng 45 độ, thấy rõ micro Shure' },
  { id: 'CAM_TIGHT_CU', label: 'CAM_TIGHT_CU', description: 'Cận cảnh siết chặt vào khuôn mặt' },
  { id: 'CAM_LOW_ANGLE', label: 'CAM_LOW_ANGLE', description: 'Góc thấp hất nhẹ 10-15 độ uy quyền' },
  { id: 'CAM_BOKEH_MIC', label: 'CAM_BOKEH_MIC', description: 'Cận cảnh xóa phông đuôi micro Shure' },
  { id: 'CAM_SLIDER_LATERAL', label: 'CAM_SLIDER_LATERAL', description: 'Trượt ngang chậm biên độ hẹp' },
  { id: 'CAM_WIDE_DESK', label: 'CAM_WIDE_DESK', description: 'Toàn trung bao quát mặt bàn và cử chỉ tay' },
  { id: 'CAM_EXTREME_CU', label: 'CAM_EXTREME_CU', description: 'Siêu cận đôi mắt và chân mày' }
];