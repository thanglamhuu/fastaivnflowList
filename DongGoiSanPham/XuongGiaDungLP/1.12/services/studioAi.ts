import { Flow } from 'flow-sdk';
import { MediaReference, SceneData, StudioConfig } from '../types';
import { MATRIX_12_VOICES } from '../voicePresets';
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
/**
 * Sinh kịch bản 4 phân cảnh bán hàng chuẩn Affiliate Việt Nam
 */
export async function generateScript4Scenes(
  config: StudioConfig,
  productMedias: MediaReference[],
  backgroundMedia?: MediaReference | null
): Promise<{ scenes: Array<{ dialogue: string; actionPrompt: string }> }> {
  const bgDescription = backgroundMedia
    ? 'Bối cảnh đồng nhất được cố định theo hình ảnh bối cảnh thực tế do người dùng tải lên'
    : (config.bgSetting === '14. Tự nhập bối cảnh tùy chỉnh' ? config.customBgSetting : config.bgSetting);
  const prompt = `Viết kịch bản video bán hàng TikTok/Reels Affiliate chuẩn phong cách xưởng sản xuất Việt Nam.
Sản phẩm: "${config.productNameAndSpecs || 'Sản phẩm gia dụng chất lượng cao chuẩn xưởng'}"
Mẫu Hook kịch bản được chọn: "${config.scriptTemplate}"
Bối cảnh quay: "${bgDescription}"
QUY TẮC BẮT BUỘC:
1. Trả về đúng 4 phân cảnh ứng với 4 giai đoạn bán hàng:
   - Cảnh 1 (Hook): Thu hút chú ý, khơi dậy tò mò theo đúng phong cách mẫu "${config.scriptTemplate}".
   - Cảnh 2 (Chất liệu): Cận cảnh chất liệu, độ hoàn thiện tinh tế, độ dày dặn, cảm giác cầm nắm.
   - Cảnh 3 (Công năng): Thử nghiệm độ bền, khả năng chống nước, chịu lực hoặc tính năng vượt trội.
   - Cảnh 4 (Kêu gọi hành động CTA): Kêu gọi nhấn giỏ hàng góc trái, chính sách kiểm tra hàng trước khi thanh toán.
2. Lời thoại tiếng Việt tự nhiên, đời thường, dân dã gần gũi, xưng hô "em - các bác" hoặc "bên em - anh chị".
3. ĐỘ DÀI MỖI ĐOẠN THOẠI BẮT BUỘC TỪ 20 ĐẾN 25 TỪ (tuyệt đối không viết quá 26 từ hay dưới 16 từ) để đọc vừa khít 8 giây video.
4. actionPrompt: Mô tả hành động và biểu cảm của người mẫu bằng tiếng Anh tự nhiên, hướng ống kính camera, tương tác với sản phẩm.
Trả về duy nhất định dạng JSON thuần không bọc markdown backtick:
{
  "scenes": [
    { "dialogue": "lời thoại cảnh 1...", "actionPrompt": "English action description..." },
    { "dialogue": "lời thoại cảnh 2...", "actionPrompt": "English action description..." },
    { "dialogue": "lời thoại cảnh 3...", "actionPrompt": "English action description..." },
    { "dialogue": "lời thoại cảnh 4...", "actionPrompt": "English action description..." }
  ]
}`;
  const textOptions: any = {
    systemInstruction: 'Bạn là chuyên gia viết kịch bản video ngắn TikTok/Reels triệu view bán hàng Affiliate tại Việt Nam. Bạn luôn xuất ra JSON hợp lệ thuần túy.',
  };
  const imagesInput: Array<{ base64: string; mimeType: string }> = [];
  productMedias.forEach((pm) => {
    imagesInput.push({ base64: pm.base64, mimeType: pm.mimeType });
  });
  if (backgroundMedia) {
    imagesInput.push({ base64: backgroundMedia.base64, mimeType: backgroundMedia.mimeType });
  }
  if (imagesInput.length > 0) {
    textOptions.images = imagesInput;
  }
  const res = await Flow.generate.text(prompt, textOptions);
  let clean = res.text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  try {
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed.scenes) && parsed.scenes.length >= 4) {
      return parsed;
    }
  } catch (err) {
    console.warn('Lỗi phân tích JSON kịch bản, sử dụng fallback', err);
  }
  // Fallback nếu JSON lỗi
  return {
    scenes: [
      {
        dialogue: `Chỉ bằng vài cốc trà đá mà nhận ngay một ${config.productNameAndSpecs.slice(0, 20) || 'sản phẩm xịn'}, ở đâu nói thế các bác chớ vội tin ngay nhé!`,
        actionPrompt: 'Person energetically holds up the hero product towards the camera with an expressive engaging smile.',
      },
      {
        dialogue: 'Hàng chuẩn xưởng em đúc gia công đanh chắc, từng đường may tỉ mỉ, các bác nhận hàng cầm trên tay là ưng ý liền.',
        actionPrompt: 'Presenter taps the solid product material firmly, showing seamless edges and pristine finishing.',
      },
      {
        dialogue: 'Thiết kế chịu va đập và kháng nước siêu bền, dùng quăng quật thoải mái nhiều năm trời mà không lo trầy xước hay móp méo.',
        actionPrompt: 'Presenter tests the product sturdiness enthusiastically, demonstrating reliability and comfort.',
      },
      {
        dialogue: 'Đủ màu sắc cho các bác lựa chọn, nhấn ngay giỏ hàng góc trái màn hình nhận giá khuyến mãi xuất xưởng hôm nay!',
        actionPrompt: 'Presenter warmly points towards the lower-left shopping cart area, holding the product with welcoming expression.',
      },
    ],
  };
}
/**
 * Tạo ảnh Keyframe 9:16 cho 1 cảnh bằng 🍌 Nano Banana Pro với cơ chế khóa hình ảnh người mẫu, các góc sản phẩm và bối cảnh
 */
export async function generateKeyframeImage(
  scene: SceneData,
  config: StudioConfig,
  modelMedia: MediaReference,
  productMedias: MediaReference[],
  backgroundMedia?: MediaReference | null
): Promise<MediaReference> {
  const hasBgImage = !!backgroundMedia;
  const bg = config.bgSetting === '14. Tự nhập bối cảnh tùy chỉnh' ? config.customBgSetting : config.bgSetting;
  const bgInstruction = hasBgImage
    ? `ABSOLUTE BACKGROUND CONSISTENCY DIRECTIVE:
- BACKGROUND REPLICA LOCK: The scene background MUST BE AN EXACT 1:1 CONSISTENT REPLICA of the physical environment, walls, room architecture, shelves, surface textures, and spatial lighting shown in the background reference image.
- ZERO BACKGROUND DRIFT: Maintain the exact same background environment across all generated scenes for perfect visual continuity.`
    : `ENVIRONMENT & STAGING:
- Bối cảnh: ${bg}. Authentic industrial inventory shelves, pallet stacks, soft volumetric overhead warehouse lighting.`;
  const prompt = `A vertical 9:16 high-end commercial e-commerce advertising keyframe photograph set in an authentic factory warehouse.
ABSOLUTE 100% PRODUCT LOCK & ZERO VISUAL DRIFT DIRECTIVE:
- PRODUCT RIGID PRESERVATION: The physical product demonstrated by the presenter MUST BE AN EXACT 1:1 REPLICA of the product provided in the product reference images (showing front, angles, packaging, and details).
- ZERO VARIATION: Do NOT alter, hallucinate, redesign, embellish, or modify any aspect of the product. The geometry, contours, proportions, exact silhouette, physical surface material, color palette, texture, typography, brand logo placement, markings, and finish must match the product reference images with zero deviation.
- PRODUCT FOCUS: Product name & specifications: "${config.productNameAndSpecs}". Ensure the product remains crisp, completely in focus, and naturally integrated without artifacts or distortions.
MODEL PRESERVATION:
- Maintain the exact facial features, hairstyle, skin tone, body proportions, and identity of the person in the model reference image. Outfit: ${config.outfit}.
${bgInstruction}
CAMERA & POSE: ${config.cameraAngle}. ${scene.actionPrompt}. Direct eye contact, warm confident smile, persuasive commercial host presence.
STYLE: Ultra-photorealistic 8k commercial photography, razor-sharp focus on model face and product packaging, clean cinematic color grading, natural depth of field.`;
  // Gom các reference images: model -> background (nếu có) -> các ảnh sản phẩm
  const referenceImageMediaIds: string[] = [modelMedia.mediaId];
  if (hasBgImage && backgroundMedia) {
    referenceImageMediaIds.push(backgroundMedia.mediaId);
  }
  productMedias.forEach((pm) => {
    if (!referenceImageMediaIds.includes(pm.mediaId)) {
      referenceImageMediaIds.push(pm.mediaId);
    }
  });
  const result = await Flow.generate.image({
    prompt,
    referenceImageMediaIds: referenceImageMediaIds.slice(0, 10), // tối đa 10 ảnh tham chiếu
    modelDisplayName: '🍌 Nano Banana Pro',
    aspectRatio: '9:16',
  });
  return {
    mediaId: result.mediaId,
    base64: result.base64,
    mimeType: result.mimeType,
    name: `Keyframe_${scene.id}.png`,
  };
}
/**
 * Render Video 8s:
 * - NẾU CẢNH ĐÃ CÓ ẢNH (scene.keyframeMedia): Sử dụng trực tiếp ảnh của Scene card đó làm firstFrameImageMediaId (I2V),
 *   KHÔNG đưa các ảnh mẫu, ảnh sản phẩm, ảnh bối cảnh vào reference nữa để đảm bảo tính đồng nhất tuyệt đối từ ảnh đã tạo.
 * - NẾU CẢNH CHƯA CÓ ẢNH: Sử dụng chế độ R2V với model, product, background media references.
 */
export async function renderSceneVideo(
  scene: SceneData,
  config: StudioConfig,
  modelMediaId?: string | null,
  productMediaIds?: string[],
  backgroundMediaId?: string | null
): Promise<MediaReference> {
  const noiseInstruction = config.filterNoise
    ? 'Clean studio-grade voice recording with ambient warehouse background noise suppression.'
    : 'Natural authentic factory acoustic ambient recording.';
  // Kiểm tra xem Scene card này đã có ảnh hay chưa
  const hasSceneKeyframe = !!scene.keyframeMedia?.mediaId;
  let videoPrompt = '';
  if (hasSceneKeyframe) {
    // Luồng có sẵn ảnh của Scene card: Animate trực tiếp từ ảnh này
    videoPrompt = `A seamless realistic vertical 9:16 commercial video starting exactly from the first frame image.
The person in the initial frame comes alive smoothly and speaks directly and naturally to the camera with precise lip-sync, subtle expressive facial movements, and convincing hand gestures.
ACTION: ${scene.actionPrompt}
CAMERA: ${config.cameraAngle}, smooth cinematic motion.
VOICE & ACCENT: Native Vietnamese speaker, ${config.voiceActor} (clear, enthusiastic commercial presenter tone, no background music, ${noiseInstruction}).`;
  } else {
    // Luồng chưa có ảnh của Scene card: Dùng R2V tham chiếu
    const hasBgImage = !!backgroundMediaId;
    const bg = config.bgSetting === '14. Tự nhập bối cảnh tùy chỉnh' ? config.customBgSetting : config.bgSetting;
    const envPromptSection = hasBgImage
      ? `ABSOLUTE RIGID BACKGROUND CONTINUITY: The background environment in this video clip MUST STRICTLY MATCH the physical scene and surroundings shown in the background reference. Keep the background completely consistent, uniform, and coherent across all scenes.`
      : `ENVIRONMENT: ${bg}.`;
    videoPrompt = `A realistic vertical 9:16 commercial video in a real product warehouse.
ABSOLUTE ZERO-DRIFT PRODUCT LOCK & RIGID IDENTITY CONSISTENCY:
- PRODUCT HARD FREEZE: The product in the video MUST REMAIN AN EXACT 100% IDENTICAL COPY of the product provided in the product reference images throughout the entire video clip.
- STRICT PROHIBITION: Zero product distortion, zero visual drift, zero alteration of logo, text, colors, material texture, shape, or structural dimensions. The product must retain its authentic physical rigidity and exact branding elements without warping.
- PRESENTER LOCK: The person in the video must strictly match the model from the model reference image (facial features, hairstyle, skin tone, body build, and outfit: ${config.outfit}).
${envPromptSection}
The presenter speaks directly and naturally to the camera with clear lip-sync, expressive facial movements, and confident hand gestures showcasing the unchanged product.
ACTION IN THIS SCENE: ${scene.actionPrompt}
CAMERA: ${config.cameraAngle}, smooth cinematic motion.
VOICE & ACCENT: Native Vietnamese speaker, ${config.voiceActor} (clear, enthusiastic commercial presenter tone, no background music, ${noiseInstruction}).`;
  }
  // Tra cứu giọng đọc Matrix 12 Voices & nối chuỗi chỉ thị chuẩn kỹ thuật
  const characterVoice = MATRIX_12_VOICES.find((v) => v.id === config.selectedVoiceId);
  const dialogueLine = scene.dialogue;
  const characterName = config.characterName;
  const emotion = config.emotion || 'Natural';
  if (characterVoice) {
    const voiceInfo = `[Voice Profile: ${characterVoice.label} (${characterVoice.subLabel}), Base Voice: ${characterVoice.baseVoice}, Gender: ${characterVoice.gender}, Speed: ${characterVoice.speed}, Pitch: ${characterVoice.pitch}, Acoustic: ${characterVoice.acousticProfile}, Emotion: ${emotion || 'Natural'}]`;
    videoPrompt += ` ${voiceInfo} ${characterName ? `${characterName} nói: ` : ''}"${dialogueLine}"`;
  } else {
    videoPrompt += ` EXACT SPOKEN DIALOGUE IN VIETNAMESE: "${dialogueLine}"`;
  }
  let videoResult;
  if (hasSceneKeyframe) {
    // 🌟 Khi Scene card ĐÃ CÓ ẢNH: lấy trực tiếp ảnh đó làm firstFrameImageMediaId (I2V),
    // TUYỆT ĐỐI KHÔNG truyền referenceImageMediaIds (không lấy ảnh mẫu, ảnh SP, bối cảnh vào nữa)
    videoResult = await Flow.generate.video({
      prompt: videoPrompt,
      firstFrameImageMediaId: scene.keyframeMedia!.mediaId,
      modelDisplayName: 'Omni 1.1 Flash',
      aspectRatio: '9:16',
      durationSeconds: 8,
      resolution: '720p',
    });
  } else {
    // Khi Scene card CHƯA CÓ ẢNH: Fallback sử dụng chế độ R2V với các ảnh mẫu, bối cảnh, sản phẩm
    const referenceImageMediaIds: string[] = [];
    if (modelMediaId) referenceImageMediaIds.push(modelMediaId);
    if (backgroundMediaId) referenceImageMediaIds.push(backgroundMediaId);
    if (productMediaIds) {
      productMediaIds.forEach((pid) => {
        if (!referenceImageMediaIds.includes(pid)) {
          referenceImageMediaIds.push(pid);
        }
      });
    }
    videoResult = await Flow.generate.video({
      prompt: videoPrompt,
      referenceImageMediaIds: referenceImageMediaIds.slice(0, 7),
      modelDisplayName: 'Omni 1.1 Flash',
      aspectRatio: '9:16',
      durationSeconds: 8,
      resolution: '720p',
    });
  }
  return {
    mediaId: videoResult.mediaId,
    base64: videoResult.base64,
    mimeType: videoResult.mimeType,
    name: `Video_${scene.id}.mp4`,
  };
}