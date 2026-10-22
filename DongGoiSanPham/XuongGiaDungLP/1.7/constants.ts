import { SceneData } from './types';
export const BG_SETTINGS = [
  'Kho hàng tổng rộng lớn với giá kệ kim loại nhiều tầng',
  'Kho thành phẩm đóng gói hộp carton xếp ngăn nắp',
  'Dây chuyền máy móc sản xuất tự động hiện đại',
  'Khu vực kiểm định chất lượng xuất xưởng',
  'Khu vực bàn đóng gói đơn hàng xuất kho dán tem',
  'Xưởng đúc và gia công chi tiết cơ khí',
  '14. Tự nhập bối cảnh tùy chỉnh',
];
export const CAMERA_ANGLES = [
  'Ngang mắt trung cảnh',
  'Cận cảnh ngực cầm sản phẩm',
  'Chính diện nâng cao',
  'Góc cao toàn cảnh xưởng',
  'Tiền cảnh macro sản phẩm',
];
export const OUTFIT_OPTIONS = [
  'Giữ nguyên trang phục gốc',
  'Đồng phục xưởng áo polo tối màu',
  'Áo thun năng động bán hàng online',
  'Áo bảo hộ quản lý kho hiện đại',
];
export const SCRIPT_TEMPLATES = [
  'Bằng vài cốc trà đá',
  'Mẫu 5: Mỗi tài khoản 1 lần',
  'Mẫu 6: Giá rẻ giật mình',
  'So sánh hàng thị trường',
  'Không hiểu xưởng làm gì',
  'Đừng ra ngoài mua',
  'Lời đồn không đúng',
  'Không như mong đợi',
  'Đừng lướt',
];
export const VOICE_ACTORS = [
  'Giọng Bắc chuẩn (Nữ)',
  'Giọng Bắc chuẩn (Nam)',
  'Giọng Miền Nam (Nữ)',
  'Giọng Miền Nam (Nam)',
  'Giọng Miền Trung (Nữ)',
  'Giọng Miền Trung (Nam)',
];
export const DEFAULT_SCENES: SceneData[] = [
  {
    id: 'SCENE_1',
    index: 0,
    label: 'SCENE_1',
    stageName: '01. Mở Đầu Thu Hút (Hook)',
    dialogue: '',
    actionPrompt: 'Person energetically holds up the product right towards the camera, smiling directly with a surprised persuasive expression.',
    status: 'idle',
    wordCount: 0,
    isWordCountValid: false,
  },
  {
    id: 'SCENE_2',
    index: 1,
    label: 'SCENE_2',
    stageName: '02. Chi Tiết & Chất Liệu',
    dialogue: '',
    actionPrompt: 'Presenter taps their knuckles firmly on the sturdy product surface, turning it around slowly to show the immaculate build quality and texture.',
    status: 'idle',
    wordCount: 0,
    isWordCountValid: false,
  },
  {
    id: 'SCENE_3',
    index: 2,
    label: 'SCENE_3',
    stageName: '03. Trải Nghiệm Công Năng',
    dialogue: '',
    actionPrompt: 'Presenter demonstrates pressing down firmly on the helmet, smiling with authentic confidence in its extreme durability and water resistance.',
    status: 'idle',
    wordCount: 0,
    isWordCountValid: false,
  },
  {
    id: 'SCENE_4',
    index: 3,
    label: 'SCENE_4',
    stageName: '04. Kêu Gọi Hành Động (CTA)',
    dialogue: '',
    actionPrompt: 'Presenter points enthusiastically down towards the lower left corner of the screen, raising the product with a warm inviting smile.',
    status: 'idle',
    wordCount: 0,
    isWordCountValid: false,
  },
];