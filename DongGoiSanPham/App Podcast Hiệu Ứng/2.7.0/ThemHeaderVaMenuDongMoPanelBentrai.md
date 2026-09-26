# thêm, sửa button menu

Hãy tái cấu trúc lại giao diện của file App.tsx hiện tại thành chuẩn "Sidebar trượt ngang (Responsive)".
YÊU CẦU TỐI THƯỢNG: Tuyệt đối giữ nguyên 100% các state (step, config, shots, mainChar...), logic xử lý (Flow.generate, ffmpegService...), các component con (ConfigButtonGroup, ShotEditorCard, ShotPreviewCard) và import hiện có. Bạn chỉ được phép cấu trúc lại phần return (...) chính theo các bước sau:

1. State quản lý UI:
Đổi tên state showConfig thành sidebarOpen (const [sidebarOpen, setSidebarOpen] = useState(true);). XÓA bỏ nút button toggle có class absolute z-[70] top-1/2....

2. Tạo Global Header (Mới):
Xóa thẻ <header> chứa Logo và "Podcast Studio" đang nằm bên trong <aside>. Thay vào đó, tạo một <header className="h-16 px-4 lg:px-6 border-b border-white/5 bg-[#12101a] flex items-center justify-between z-30 shrink-0"> nằm trên cùng nhất. Đưa Logo, tên App và Nút toggle (Icon menu hoặc menu_open xử lý setSidebarOpen(!sidebarOpen)) vào Header này.

3. Bố cục 2 cột (Sidebar & Main):
Wrap phần thân dưới Header bằng <div className="flex flex-1 overflow-hidden relative w-full">.

4. Cột trái (Sidebar):

Bọc toàn bộ Form nhập liệu (ConfigControls, phần Upload ảnh, nút Xử lý nhân vật, Textarea Transcript...) vào <aside>.

Áp dụng các class sau cho <aside>: fixed lg:sticky top-0 left-0 z-40 h-full w-[320px] bg-[#12101a] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out shrink-0.

Nếu sidebarOpen là true, class là translate-x-0, nếu false thêm -translate-x-full lg:hidden.

Thêm lớp phủ Mobile: <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"> có sự kiện onClick={() => setSidebarOpen(false)} khi sidebarOpen là true.

5. Cột phải (Main):
Đặt toàn bộ phần hiển thị trạng thái (status), màn hình chờ chưa có shots (!shots.length), và danh sách ShotEditorCard / ShotPreviewCard vào trong <main className="flex-1 flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-red-900/10 transition-all duration-300">.

Hãy sinh ra code hoàn chỉnh cho App.tsx với giao diện mới này, không làm hỏng bất kỳ chức năng render video hay logic nào.