export const SUGGESTED_THEMES = [
  "Người que cô đơn tìm thấy một người bạn trong cơn mưa giấy",
  "Câu chuyện về chiếc bóng không chịu rời đi giữa đêm trăng",
  "Một người que nhỏ bé xây dựng tòa lâu đài từ những mảnh giấy vụn",
  "Người que học cách tha thứ cho chính mình",
  "Câu chuyện về tờ giấy nhàu mang trong mình một giấc mơ bay",
  "Một cuộc gặp gỡ kỳ lạ trong thế giới giấy nhăn",
  "Người que đi tìm ý nghĩa của hạnh phúc qua từng nếp gấp",
  "Câu chuyện buồn về một lời hứa bị gió cuốn đi",
  "Người que và cánh cửa bí mật dẫn đến thế giới màu sắc",
  "Một ngày thế giới giấy mất đi những đường kẻ ô"
];

export const PAPER_STYLES = ['Giấy trắng nhăn', 'Giấy cũ ngả vàng', 'Giấy học sinh', 'Giấy ghi chú', 'Giấy rách mép'];
export const STICKMAN_TYPES = ['Mực đen tối giản', 'Bóng chiếu', 'Vẽ bút chì', 'Cắt giấy đen', 'Phấn trắng'];
export const RHYTHMS = ['Nhẹ nhàng', 'Buồn sâu lắng', 'Hài hước', 'Truyền cảm hứng', 'Bí ẩn', 'Thiếu nhi'];
export const VOICE_TYPES = ['Giọng Nam Trầm', 'Giọng Nữ Ngọt Ngào', 'Giọng Truyền Cảm', 'Giọng Kể Chuyện'];
export const ASPECT_RATIOS = [{ value: '9:16', label: '9:16' }, { value: '16:9', label: '16:9' }, { value: '1:1', label: '1:1' }, { value: '4:3', label: '4:3' }];
export const PARALLEL_OPTIONS = ['1', '2', '3', '4'];
export const GET_SYSTEM_PROMPT = (hasProduct: boolean, productName?: string, productDesc?: string) => {
  const productContext = hasProduct 
    ? `Cảnh cuối cùng (Cảnh 6) PHẢI là một cảnh quảng bá sản phẩm "${productName}". 
       Nội dung cảnh 6 phải liên kết logic với ý tưởng cốt truyện của 5 cảnh trước đó.
       Trong voiceScript của Cảnh 6, BẮT BUỘC phải nhắc đến tên sản phẩm "${productName}". 
       Mô tả sản phẩm: ${productDesc}.`
    : `Viết kịch bản gồm 5 cảnh.`;
  return `Bạn là biên kịch chuyên nghiệp. Hãy viết kịch bản kể chuyện người que trên nền giấy.
${productContext}
Yêu cầu phong cách chung: Nhân vật là người que (stickman) đen, nền giấy nhàu có texture cực kỳ chi tiết, ánh sáng cinematic, bóng đổ thực tế.
Trả về JSON là mảng các đối tượng cảnh:
- textVi: Phụ đề ngắn gọn.
- voiceScript: Lời thuyết minh TIẾNG VIỆT.
- action: Mô tả hành động.
- emotion: Cảm xúc chủ đạo.
- promptEn: Prompt visual chi tiết.
- isProductAd: boolean.`;
};