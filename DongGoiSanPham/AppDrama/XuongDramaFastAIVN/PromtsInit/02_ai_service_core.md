# BƯỚC 2: XÂY DỰNG TẦNG GIAO TIẾP FLOW SDK (AI SERVICES)

## Mục tiêu:
Tạo file `services/ai.ts` chuyên trách việc gọi `Flow.generate.text`, `Flow.generate.image`, và `Flow.upload` với prompt tối ưu cho drama.

## Prompt dán vào Flow Tool Chat:
Hãy tạo file `services/ai.ts` kết nối với `flow-sdk` để xử lý 4 tác vụ cốt lõi:

1. `generateDramaScript(params: { premise: string; duration: DramaDuration; style: DramaStyle; characters?: CharacterAsset[] })`:
   - Dùng `Flow.generate.text` với model `Gemini 3.0 Flash Preview`.
   - System Instruction đóng vai đạo diễn phim ngắn drama:
     + Chia nhịp rõ ràng: Hook 3s đầu -> Đẩy mâu thuẫn -> Climax đối đầu -> Cú lật kết tập.
     + Kịch bản format theo dạng:
       Tên cảnh: [INT/EXT...]
       Mô tả hành động
       **TÊN NHÂN VẬT** (Cảm xúc): Lời thoại
       [[SFX: Âm thanh giật gân]]
   - Trả về text kịch bản hoàn chỉnh.

2. `extractDramaAssets(script: string)`:
   - Dùng Gemini phân tích kịch bản và trích xuất danh sách JSON gồm:
     * `characters`: [{ name, physicalDescription, defaultOutfit, voiceTone }]
     * `locations`: [{ name, description }]
     * `props`: [{ name, description }]
   - Có hàm parse an toàn để chống lỗi cú pháp JSON.

3. `breakdownScriptToShots(script: string, duration: DramaDuration, characters: CharacterAsset[])`:
   - Tính toán số shot (VD: 30s = 8-10 shots; 60s = 14-18 shots; 90s = 20-25 shots).
   - Gemini trả về mảng JSON `DramaShot[]` chứa đầy đủ: `shotNumber`, `cameraAngle`, `visualPrompt`, `videoMotionPrompt`, `dialogue`, `sfxAudioCue`.

4. `generateShotImage(shot: DramaShot, characters: CharacterAsset[], locations: LocationAsset[], style: DramaStyle, aspectRatio: AspectRatio)`:
   - Gom `referenceImageMediaIds` từ các nhân vật xuất hiện trong shot (để giữ mặt và đồ).
   - Gọi `Flow.generate.image` với model `🍌 Nano Banana 2`, truyền đúng `aspectRatio` ('9:16' hoặc '16:9').
   - Trả về URL dạng blob/base64 an toàn.