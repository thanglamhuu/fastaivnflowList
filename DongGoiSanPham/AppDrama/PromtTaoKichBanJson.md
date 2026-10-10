Bạn là chuyên gia biên kịch và trợ lý đạo diễn storyboard AI. Tôi có một kịch bản phim ngắn dưới đây và cần bạn chuyển đổi toàn bộ thành một file JSON chuẩn để tôi nhập vào hệ thống sản xuất storyboard (khi chưa có ảnh/video).

=== NỘI DUNG KỊCH BẢN THÔ CỦA TÔI ===
[Dán kịch bản của bạn vào đây]
====================================

YÊU CẦU ĐẦU RA:
- Trả về DUY NHẤT một khối mã JSON hợp lệ (không kèm theo văn bản giải thích thừa).
- Cấu trúc JSON bắt buộc phải tuân theo định dạng sau:

{
  "project": {
    "title": "Tên dự án phim",
    "style": "Cinematic Photorealistic", 
    "aspectRatio": "9:16",
    "duration": "60s",
    "premise": "Tóm tắt ý tưởng phim",
    "scriptMarkdown": "Kịch bản đầy đủ đã định dạng lại",
    "characters": [
      {
        "id": "char-1",
        "name": "Tên nhân vật",
        "physicalDescription": "Mô tả chi tiết gương mặt, mắt, tóc, vóc dáng, độ tuổi để AI giữ nhất quán",
        "defaultOutfit": "Trang phục mặc định",
        "voiceTone": "Giọng đọc (VD: Nam Tri Kỷ (miền Nam) hoặc Nữ Trầm Bản Lĩnh (miền Bắc))"
      }
    ],
    "locations": [
      {
        "id": "loc-1",
        "name": "Tên bối cảnh",
        "description": "Mô tả chi tiết không gian, ánh sáng, đồ đạc"
      }
    ],
    "props": [],
    "shots": [
      {
        "id": "shot-1",
        "shotNumber": 1,
        "durationSeconds": 6,
        "title": "Tiêu đề ngắn cho shot",
        "cameraAngle": "Góc quay (VD: Close-up, Medium Shot, Wide Shot, Over-the-shoulder)",
        "visualPrompt": "Mô tả hình ảnh chi tiết bằng tiếng Việt hoặc tiếng Anh để AI tạo ảnh đẹp (gồm nhân vật, bối cảnh, ánh sáng)",
        "videoMotionPrompt": "Mô tả chuyển động máy quay và hành động nhân vật cho AI video (VD: Subtle camera pan left, character blinks)",
        "characterNames": ["Tên nhân vật có mặt trong shot này"],
        "dialogue": {
          "characterName": "Tên nhân vật nói",
          "line": "Câu thoại tiếng Việt",
          "emotion": "Cảm xúc (VD: tức giận, ngạc nhiên, xúc động)"
        },
        "sfxAudioCue": "Mô tả âm thanh hiệu ứng nếu có"
      }
    ]
  },
  "config": {
    "ratio": "9:16",
    "speed": "1x",
    "model": "Omni 1.1 Flash",
    "threads": 2,
    "resolution": "360p"
  }
}

QUY TẮC PHÂN RÃ SHOT:
1. durationSeconds mỗi shot PHẢI là một trong các giá trị: 4, 6, 8, hoặc 10.
2. style PHẢI chọn một trong các giá trị: "Cinematic Photorealistic", "3D Pixar", "Anime Drama", "K-Drama Tone".
3. aspectRatio PHẢI chọn một trong: "9:16", "16:9", "1:1", "4:3", "3:4".
4. TUYỆT ĐỐI KHÔNG thêm các trường imageUrl hay videoUrl.

