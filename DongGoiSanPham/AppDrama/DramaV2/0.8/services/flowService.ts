import { Flow } from 'flow-sdk';
import { FlowMedia, VideoModel, AspectRatio } from '../types';
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
    try {
      // Default to Nano Banana 2.1 as it is reliable and supports I2I
      const result = await Flow.generate.image({
        prompt,
        aspectRatio: aspectRatio as any,
        modelDisplayName: '🍌 Nano Banana 2.1',
        referenceImageMediaIds: references
      });
      return {
        mediaId: result.mediaId,
        base64: result.base64,
        mimeType: result.mimeType,
        url: `data:${result.mimeType};base64,${result.base64}`
      };
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  },
  async generateVideo(options: {
    prompt: string,
    firstFrameImageMediaId?: string,
    modelDisplayName: VideoModel,
    aspectRatio: '16:9' | '9:16',
    durationSeconds?: number
  }): Promise<FlowMedia | null> {
    try {
      const result = await Flow.generate.video({
        prompt: options.prompt,
        firstFrameImageMediaId: options.firstFrameImageMediaId,
        modelDisplayName: options.modelDisplayName,
        aspectRatio: options.aspectRatio,
        durationSeconds: options.durationSeconds,
        resolution: '720p'
      });
      return {
        mediaId: result.mediaId,
        base64: result.base64,
        mimeType: result.mimeType,
        url: `data:${result.mimeType};base64,${result.base64}`
      };
    } catch (error) {
      console.error('Error generating video:', error);
      return null;
    }
  }
};