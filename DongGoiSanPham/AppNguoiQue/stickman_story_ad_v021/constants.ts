export const SUGGESTED_THEMES = [
  "Người que cô đơn tìm thấy một người bạn trong cơn mưa giấy",
  "Câu chuyện về chiếc bóng không chịu rời đi giữa đêm trăng",
  "Một người que nhỏ bé xây dựng tòa lâu đài từ những mảnh giấy vụn",
  "Người que học cách tha thứ cho chính mình",
  "Câu chuyện về tờ giấy nhàu mang trong mình một giấc mơ bay"
];
export const PAPER_STYLES = [
  'Giấy trắng nhăn',
  'Giấy cũ ngả vàng',
  'Giấy học sinh',
  'Giấy ghi chú',
  'Giấy rách mép'
];
export const STICKMAN_TYPES = [
  'Mực đen tối giản',
  'Bóng chiếu',
  'Vẽ bút chì',
  'Cắt giấy đen',
  'Phấn trắng'
];
export const RHYTHMS = [
  'Nhẹ nhàng',
  'Buồn sâu lắng',
  'Hài hước',
  'Truyền cảm hứng',
  'Bí ẩn',
  'Thiếu nhi'
];
export const VOICE_TYPES = [
  { 
    label: 'Đạo lý (Nam 40t, Bắc)', 
    prompt: 'A 40-year-old Northern Vietnamese male, deep, warm, and philosophical voice' 
  },
  { 
    label: 'Bán sách (Nữ 34t, Bắc)', 
    prompt: 'A 34-year-old Northern Vietnamese female (Mien Bac), deep, warm, and philosophical voice' 
  },
  { 
    label: 'Bán sách (Nữ 34t, Tây)', 
    prompt: 'A 34-year-old Western Vietnamese female (Mien Tay), sweet, inspiring, and expressive voice' 
  },
  { 
    label: 'Kể chuyện (Nam 25t, Nam)', 
    prompt: 'A 25-year-old Southern Vietnamese male, dynamic, friendly, and narrative voice' 
  },
  { 
    label: 'Thiếu nhi (Nữ 10t, Bắc)', 
    prompt: 'A 10-year-old Northern Vietnamese female, cute, energetic, and storytelling voice for kids' 
  }
];
export const AUDIO_MODES = [
  'Chỉ thuyết minh',
  'Thuyết minh & Nhạc nền'
];
export const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' }
];
export const PARALLEL_OPTIONS = ['1', '2', '4', '6'];
export const GET_SYSTEM_PROMPT = (hasProduct: boolean, productName?: string, productDesc?: string) => {
  const productContext = hasProduct 
    ? `Cảnh cuối cùng (Cảnh 6) PHẢI là một cảnh quảng bá sản phẩm "${productName}". 
       Nội dung cảnh 6 phải liên kết logic với ý tưởng cốt truyện của 5 cảnh trước đó.
       Trong voiceScript của Cảnh 6, BẮT BUỘC phải nhắc đến tên sản phẩm "${productName}". 
       Mô tả sản phẩm: ${productDesc}.`
    : `Viết kịch bản gồm 5 cảnh.`;
  return `Bạn là biên kịch chuyên nghiệp. Hãy viết kịch bản kể chuyện người que trên nền giấy.
${productContext}
Yêu cầu phong cách chung:
Nhân vật là người que (stickman) đen, nền giấy nhàu có texture cực kỳ chi tiết.
Trả về JSON là mảng các đối tượng cảnh:
- textVi: Tên cảnh/Phụ đề ngắn gọn (dưới 10 từ).
- voiceScript: Lời thuyết minh bằng TIẾNG VIỆT. Độ dài từ 15-20 từ. KHÔNG dùng tiếng Anh.
- action: Mô tả hành động chi tiết.
- emotion: Cảm xúc chủ đạo.
- promptEn: Prompt tiếng Anh chi tiết để tạo visual (chỉ mô tả hình ảnh, không mô tả âm thanh).
- isProductAd: (boolean) true nếu là cảnh cuối.`;
};