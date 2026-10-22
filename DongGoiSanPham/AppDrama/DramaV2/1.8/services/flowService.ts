import { Flow } from 'flow-sdk';
import { FlowMedia, VideoModel, AspectRatio } from '../types';
export const VALID_MODELS: VideoModel[] = ['Omni 1.1 Flash', 'Veo 3.1 - Lite', 'Veo 3.1 - Fast', 'Veo 3.1 - Quality'];
// Giữ khoảng nghỉ tối thiểu giữa các lệnh gọi AI để không kích hoạt bot-detection của hệ thống
let lastApiCallTimestamp = 0;
const MIN_API_INTERVAL_MS = 2500;
async function rateLimitDelay(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastApiCallTimestamp;
  if (elapsed < MIN_API_INTERVAL_MS) {
    await new Promise(res => setTimeout(res, MIN_API_INTERVAL_MS - elapsed));
  }
  lastApiCallTimestamp = Date.now();
}
export const flowService = {
  async selectMedia(filter: 'image' | 'video' | 'all' = 'image'): Promise<FlowMedia | null> {
    try {
      const media = await Flow.media.select({ filter });
      return {
        mediaId: media.mediaId,
        base64: media.base64,
        mimeType: media.mimeType,
        url: `data:${media.mimeType};base64,${media.base64}`
      };
    } catch (error) {
      console.error('Error selecting media:', error);
      return null;
    }
  },
  /**
   * Tạo ảnh với model mặc định 🍌 Nano Banana Pro và cơ chế pacing an toàn
   */
  async generateImage(
    prompt: string, 
    aspectRatio: AspectRatio, 
    references?: (string | FlowMedia)[]
  ): Promise<FlowMedia | null> {
    const validAspects = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    const safeAspect = validAspects.includes(aspectRatio) ? (aspectRatio as any) : '16:9';
    // Model chuẩn mặc định theo quy chuẩn hệ thống
    const DEFAULT_IMAGE_MODEL = '🍌 Nano Banana Pro';
    // Chuẩn hóa danh sách đối tượng FlowMedia
    const refMedias: FlowMedia[] = [];
    const initialMediaIds: string[] = [];
    if (references && references.length > 0) {
      for (const item of references) {
        if (typeof item === 'string') {
          if (item.trim()) {
            initialMediaIds.push(item);
            refMedias.push({ mediaId: item, base64: '', mimeType: 'image/jpeg' });
          }
        } else if (item && typeof item === 'object') {
          refMedias.push(item);
          if (item.mediaId) {
            initialMediaIds.push(item.mediaId);
          }
        }
      }
    }
    // Lần 1: Gọi Flow.generate.image với referenceImageMediaIds hiện có
    if (initialMediaIds.length > 0) {
      try {
        await rateLimitDelay();
        const result = await Flow.generate.image({
          prompt,
          aspectRatio: safeAspect,
          modelDisplayName: DEFAULT_IMAGE_MODEL,
          referenceImageMediaIds: initialMediaIds.slice(0, 5) // Giới hạn số lượng tham chiếu vừa phải
        });
        return {
          mediaId: result.mediaId,
          base64: result.base64,
          mimeType: result.mimeType,
          url: `data:${result.mimeType};base64,${result.base64}`
        };
      } catch (err: any) {
        console.warn('Lần 1 tạo ảnh với reference IDs cũ thất bại:', err?.message || err);
        // Nếu dính cờ kiểm duyệt bot, chờ một nhịp ngắn trước khi retry
        if (err?.message?.includes('bất thường') || err?.message?.includes('unusual')) {
          await new Promise(r => setTimeout(r, 3000));
        }
      }
    }
    // Lần 2: Nếu có ảnh mang dữ liệu base64, re-upload vào phiên Flow hiện tại để lấy mediaId mới
    const mediasWithBase64 = refMedias.filter(m => m.base64 && m.base64.trim().length > 0);
    if (mediasWithBase64.length > 0) {
      try {
        console.info(`Đang re-upload ${mediasWithBase64.length} ảnh tham chiếu nhân vật vào phiên Flow hiện tại...`);
        const reUploadedMediaIds: string[] = [];
        for (let i = 0; i < Math.min(mediasWithBase64.length, 3); i++) {
          const m = mediasWithBase64[i];
          const cleanBase64 = m.base64.includes(',') ? m.base64.split(',')[1] : m.base64;
          const mime = m.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
          try {
            await rateLimitDelay();
            const uploaded = await Flow.upload({
              base64: cleanBase64,
              mimeType: mime,
              name: `Char_Ref_${i + 1}`
            });
            reUploadedMediaIds.push(uploaded.mediaId);
            m.mediaId = uploaded.mediaId;
          } catch (uploadErr) {
            console.warn(`Lỗi re-upload ảnh tham chiếu #${i + 1}:`, uploadErr);
          }
        }
        if (reUploadedMediaIds.length > 0) {
          await rateLimitDelay();
          const result = await Flow.generate.image({
            prompt,
            aspectRatio: safeAspect,
            modelDisplayName: DEFAULT_IMAGE_MODEL,
            referenceImageMediaIds: reUploadedMediaIds
          });
          return {
            mediaId: result.mediaId,
            base64: result.base64,
            mimeType: result.mimeType,
            url: `data:${result.mimeType};base64,${result.base64}`
          };
        }
      } catch (reuploadErr: any) {
        console.warn('Tạo ảnh với reUploaded references thất bại:', reuploadErr?.message || reuploadErr);
        if (reuploadErr?.message?.includes('bất thường')) {
          await new Promise(r => setTimeout(r, 3500));
        }
      }
    }
    // Lần 3: Fallback tạo ảnh không kèm referenceImageMediaIds
    try {
      console.info('Fallback tạo ảnh không kèm reference IDs...');
      await rateLimitDelay();
      const result = await Flow.generate.image({
        prompt,
        aspectRatio: safeAspect,
        modelDisplayName: DEFAULT_IMAGE_MODEL
      });
      return {
        mediaId: result.mediaId,
        base64: result.base64,
        mimeType: result.mimeType,
        url: `data:${result.mimeType};base64,${result.base64}`
      };
    } catch (error: any) {
      console.error('Lỗi tạo ảnh sau khi retry:', error);
      throw error;
    }
  },
  async generateVideo(options: {
    prompt: string;
    firstFrameImageMediaId?: string;
    startFrameBase64?: string;
    startFrameMimeType?: string;
    modelDisplayName: VideoModel;
    aspectRatio: '16:9' | '9:16';
    durationSeconds?: number;
    resolution?: '360p' | '720p';
  }): Promise<FlowMedia | null> {
    await rateLimitDelay();
    const safeModel: VideoModel = VALID_MODELS.includes(options.modelDisplayName) 
      ? options.modelDisplayName 
      : 'Veo 3.1 - Fast';
    const safeAspectRatio: '16:9' | '9:16' = options.aspectRatio === '9:16' ? '9:16' : '16:9';
    let requestedDuration = options.durationSeconds;
    let requestedResolution: '360p' | '720p' = options.resolution === '360p' ? '360p' : '720p';
    if (safeModel.startsWith('Veo 3.1')) {
      requestedResolution = '720p';
      if (requestedDuration && ![4, 6, 8].includes(requestedDuration)) {
        requestedDuration = 8;
      }
    } else if (safeModel === 'Omni 1.1 Flash') {
      if (requestedDuration && ![4, 6, 8, 10].includes(requestedDuration)) {
        requestedDuration = requestedDuration <= 4 ? 4 : requestedDuration <= 6 ? 6 : requestedDuration <= 8 ? 8 : 10;
      }
    }
    const videoParams: any = {
      prompt: options.prompt,
      firstFrameImageMediaId: options.firstFrameImageMediaId,
      modelDisplayName: safeModel,
      aspectRatio: safeAspectRatio,
      resolution: requestedResolution,
      ...(requestedDuration ? { durationSeconds: requestedDuration } : {})
    };
    // Lần 1: Thử tạo video với firstFrameImageMediaId đã có
    try {
      const result = await Flow.generate.video(videoParams);
      return {
        mediaId: result.mediaId,
        base64: result.base64,
        mimeType: result.mimeType,
        url: `data:${result.mimeType};base64,${result.base64}`
      };
    } catch (err: any) {
      console.warn('Lần 1 tạo video thất bại:', err?.message || err);
      let reUploadedMediaId: string | undefined = undefined;
      if (options.startFrameBase64) {
        try {
          await rateLimitDelay();
          const cleanBase64 = options.startFrameBase64.includes(',') 
            ? options.startFrameBase64.split(',')[1] 
            : options.startFrameBase64;
          const uploaded = await Flow.upload({
            base64: cleanBase64,
            mimeType: (options.startFrameMimeType === 'image/png' ? 'image/png' : 'image/jpeg'),
            name: 'ReUploaded_StartFrame'
          });
          reUploadedMediaId = uploaded.mediaId;
        } catch (uploadErr) {
          console.warn('Không thể upload lại start frame:', uploadErr);
        }
      }
      // Lần 2: Thử lại với reUploadedMediaId
      try {
        await rateLimitDelay();
        const result = await Flow.generate.video({
          ...videoParams,
          firstFrameImageMediaId: reUploadedMediaId || options.firstFrameImageMediaId
        });
        return {
          mediaId: result.mediaId,
          base64: result.base64,
          mimeType: result.mimeType,
          url: `data:${result.mimeType};base64,${result.base64}`
        };
      } catch (retryErr: any) {
        if (safeModel !== 'Omni 1.1 Flash') {
          console.info('Thử fallback qua Omni 1.1 Flash...');
          try {
            await rateLimitDelay();
            const fallbackResult = await Flow.generate.video({
              prompt: options.prompt,
              firstFrameImageMediaId: reUploadedMediaId || options.firstFrameImageMediaId,
              modelDisplayName: 'Omni 1.1 Flash',
              aspectRatio: safeAspectRatio,
              resolution: requestedResolution,
              durationSeconds: requestedDuration || 8
            });
            return {
              mediaId: fallbackResult.mediaId,
              base64: fallbackResult.base64,
              mimeType: fallbackResult.mimeType,
              url: `data:${fallbackResult.mimeType};base64,${fallbackResult.base64}`
            };
          } catch (omniErr) {
            console.error('Fallback Omni thất bại:', omniErr);
          }
        }
        console.error('Tạo video thất bại hoàn toàn sau các lượt thử:', retryErr);
        throw retryErr;
      }
    }
  }
};