import { Flow } from 'flow-sdk';
import { FlowMedia, VideoModel, AspectRatio } from '../types';
export const VALID_MODELS: VideoModel[] = ['Omni 1.1 Flash', 'Veo 3.1 - Lite', 'Veo 3.1 - Fast', 'Veo 3.1 - Quality'];
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
  async generateImage(prompt: string, aspectRatio: AspectRatio, references?: string[]): Promise<FlowMedia | null> {
    const validAspects = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    const safeAspect = validAspects.includes(aspectRatio) ? (aspectRatio as any) : '16:9';
    // Lần 1: Thử tạo kèm reference IDs nếu có
    if (references && references.length > 0) {
      try {
        const result = await Flow.generate.image({
          prompt,
          aspectRatio: safeAspect,
          modelDisplayName: '🍌 Nano Banana 2.1',
          referenceImageMediaIds: references
        });
        return {
          mediaId: result.mediaId,
          base64: result.base64,
          mimeType: result.mimeType,
          url: `data:${result.mimeType};base64,${result.base64}`
        };
      } catch (err) {
        console.warn('Lỗi tạo ảnh với reference IDs, thử tạo ảnh trực tiếp:', err);
      }
    }
    // Lần 2 (hoặc không có references): Gọi trực tiếp không kèm references
    try {
      const result = await Flow.generate.image({
        prompt,
        aspectRatio: safeAspect,
        modelDisplayName: '🍌 Nano Banana 2.1'
      });
      return {
        mediaId: result.mediaId,
        base64: result.base64,
        mimeType: result.mimeType,
        url: `data:${result.mimeType};base64,${result.base64}`
      };
    } catch (error) {
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
    const safeModel: VideoModel = VALID_MODELS.includes(options.modelDisplayName) 
      ? options.modelDisplayName 
      : 'Veo 3.1 - Fast';
    const safeAspectRatio: '16:9' | '9:16' = options.aspectRatio === '9:16' ? '9:16' : '16:9';
    // Xác định resolution và durationSeconds phù hợp theo model
    // Omni 1.1 Flash hỗ trợ cả 360p và 720p, các thời lượng 4, 6, 8, 10
    // Các model Veo 3.1 yêu cầu 720p và thời lượng 8s cho Pro/Plus (hoặc 4,6,8 cho Ultra)
    let requestedDuration = options.durationSeconds;
    let requestedResolution: '360p' | '720p' = options.resolution === '360p' ? '360p' : '720p';
    if (safeModel.startsWith('Veo 3.1')) {
      // Veo 3.1 chỉ hỗ trợ 720p
      requestedResolution = '720p';
      // Với Pro/Plus trên I2V, Veo hỗ trợ 8s (hoặc 8s mặc định)
      if (requestedDuration && ![4, 6, 8].includes(requestedDuration)) {
        requestedDuration = 8;
      }
    } else if (safeModel === 'Omni 1.1 Flash') {
      // Omni 1.1 Flash hỗ trợ 4, 6, 8, 10
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
      // Nếu có base64 của startFrame, thử Flow.upload để đăng ký mediaId mới trong phiên hiện tại
      let reUploadedMediaId: string | undefined = undefined;
      if (options.startFrameBase64) {
        try {
          console.info('Đang đồng bộ lại start frame vào phiên làm việc Flow hiện tại...');
          const uploaded = await Flow.upload({
            base64: options.startFrameBase64,
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
        console.info(`Thử lại tạo video (safeModel: ${safeModel})...`);
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
        // Lần 3: Thử fallback qua Omni 1.1 Flash nếu mô hình Veo gặp giới hạn
        if (safeModel !== 'Omni 1.1 Flash') {
          console.info('Thử fallback qua Omni 1.1 Flash...');
          try {
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