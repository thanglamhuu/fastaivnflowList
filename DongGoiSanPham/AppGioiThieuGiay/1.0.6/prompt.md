Hãy cập nhật file App.tsx để biến nó thành một ứng dụng tạo video review sản phẩm (cụ thể là giày), với các yêu cầu thay đổi sau:

YÊU CẦU BẮT BUỘC: Giữ nguyên 100% các hàm logic (Flow.generate, ffmpegService...), các state hiện có, và cơ chế giao diện Sidebar/Main hiện hành. Không xóa bất kỳ chức năng render video hay logic nối file nào.

Vui lòng thực hiện các thay đổi chi tiết sau:

1. Bổ sung State mới:

Thêm state const [productName, setProductName] = useState(''); để lưu tên sản phẩm.

Thêm state const [productDesc, setProductDesc] = useState(''); để lưu mô tả sản phẩm.

2. Chỉnh sửa Sidebar (Cột trái):

 Bên trong khu vực này, thêm 2 thẻ input (cho Tên sản phẩm) và textarea (cho Mô tả sản phẩm). Bind các input này với state tương ứng vừa tạo. Thêm class styling giống với textarea hiện tại (w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs focus:border-purple-500 outline-none).

3. Cập nhật nút Phân tích ảnh để thêm cả dựa theo thông tin Tên Sản Phẩm, Mô tả sản phẩn để Video promt đưa vào voice đi kèm cảnh có  giới thiệu sản phẩm phù hợp nội dung ảnh và thông tin sản phẩm.


JavaScript
const audioInstr = `VIETNAMESE AUDIO NARRATION ONLY. Voice Actor: 24-year-old nữ người miền nam Vietnam accent. Style: Energetic, convincing, sales-oriented product review voice. Spoken Text: "${shot.transcript}".`;
