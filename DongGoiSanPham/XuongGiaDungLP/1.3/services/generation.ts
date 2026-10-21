import { Flow } from 'flow-sdk';
import { DirectorConfig, MediaReference } from '../types';
import { MATRIX_12_VOICES } from '../voicePresets';
export const ENV_MAP: Record<string, string> = {
  'Tự động': 'Modern automated commercial logistics and production facility with authentic industrial scale and lighting',
  'Kho hàng lớn': 'Vast e-commerce fulfillment warehouse with massive metal storage racks, conveyor belts, and logistical infrastructure',
  'Kho thành phẩm': 'Finished goods warehouse with organized pallet racking, shrink-wrapped cartons, and immaculate industrial concrete flooring',
  'Dây chuyền sản xuất': 'High-tech automated production assembly line with stainless steel machinery, conveyor belts, and robotic arms',
  'Khu vực đóng gói': 'Active commercial packing station equipped with packaging benches, labeling systems, and carton boxes',
  'Khu vực lắp ráp': 'Precision manufacturing assembly workstations with component trays, bright overhead task lighting, and clean benches',
  'Nhà máy chế biến': 'Certified food or consumer goods processing factory with hygienic stainless steel surfaces and filtered ambient air',
  'Khu trưng bày / Kiểm định': 'Industrial quality assurance testing laboratory and product showroom adjacent to active factory floor',
};
export const DENSITY_MAP: Record<string, string> = {
  'Bình thường': 'Balanced and orderly warehouse stocking with organized shelf bays and visible clear pathways',
  'Dày đặc': 'High-density shelving filled with tiered boxed inventory, packed industrial racks extending high up',
  'Khổng lồ': 'Colossal monumental stacks of pallets and tiered inventory towers stretching into atmospheric industrial depth',
};
export const ACTION_MAP: Record<string, string> = {
  'Tự động': 'Naturally interacting with the factory environment while presenting the commercial product convincingly',
  'Cử chỉ thuyết trình': 'Enthusiastically gesturing towards the manufacturing inventory while presenting the product to the viewer',
  'Cầm sản phẩm chính': 'Holding the hero product prominently in front of the camera with authentic grip and proud expression',
  'Trình diễn sản phẩm': 'Demonstrating the packaging and features of the product with professional presenter posture',
  'Kiểm tra sản phẩm': 'Carefully inspecting the product quality and packaging condition like an authentic quality control manager',
  'Mở hộp sản phẩm': 'Unboxing the retail packaging, revealing the hero contents in an exciting live demonstration stance',
  'Đứng cạnh kho hàng': 'Standing confidently between soaring warehouse storage racks with product in hand',
  'Đứng sau bàn sản phẩm': 'Standing authoritatively behind a heavy-duty industrial staging workbench displaying the product line',
};
export const SPACE_STYLE_MAP: Record<string, string> = {
  'Tự động': 'Clean industrial aesthetics with high-bay LED floodlights, atmospheric volumetric depth, and real depth of field',
  'Kho hàng Thành phẩm Chuyên nghiệp': 'Immaculate commercial inventory depot, polished epoxy floors reflecting overhead strip lights',
  'Showroom Trưng bày Nhà máy': 'Modern architectural corporate showroom integrated inside an industrial production campus',
  'Khu vực Dây chuyền Sản xuất': 'Raw, active manufacturing floor with warning stripe markings, machinery hum, and motion blur background elements',
  'Tối giản / Không gian mở': 'Architectural open-plan industrial warehouse with clean concrete walls, high ceilings, and minimal clutter',
};
export const OUTFIT_MAP: Record<string, string> = {
  'Tự động': 'Professional business casual attire suited for corporate factory oversight with modern clean look',
  'Giữ nguyên trang phục gốc': 'Keep the exact garments and clothing style seen in the original model reference image',
  'Mặc đồng phục nhà xưởng': 'Modern industrial supervisor uniform with sleek safety vest or polo shirt and clean protective badge',
  'Mặc/Đeo trực tiếp sản phẩm': 'Wearing or sporting the featured product directly on body or apparel if wearable',
};
export const CAMERA_ANGLES = [
  'Góc cao toàn cảnh',
  'Chính diện nâng cao',
  'Ngang mắt trung cảnh',
  'Toàn cảnh nhà máy',
  'Sản phẩm tiền cảnh',
  'Lối đi kho hàng',
  'Dây chuyền sản xuất',
  'Trình diễn tại bàn',
  'Sản phẩm tiêu biểu',
];
export const CAMERA_MAP: Record<string, string> = {
  'Trộn tự động': 'Dynamic commercial angle highlighting subject and scale of the industrial facility',
  'Góc cao toàn cảnh': 'High-angle bird-eye cinematic crane shot capturing vast warehouse floor scale and overhead trusses',
  'Chính diện nâng cao': 'Elevated three-quarters eye-level medium hero portrait, crisp separation between model and backdrop',
  'Ngang mắt trung cảnh': 'Cinematic waist-up medium portrait shot at direct eye level with creamy cinematic bokeh',
  'Toàn cảnh nhà máy': 'Wide-angle establishing commercial view showing the expansive working factory operations and model',
  'Sản phẩm tiền cảnh': 'Extreme foreground macro focus on the product with model smiling warmly in the soft-focused background',
  'Lối đi kho hàng': 'Deep linear perspective tracking down a long illuminated warehouse aisle lined with pallet racks',
  'Dây chuyền sản xuất': 'Side-profile cinematic medium shot framed beside active robotic conveyors and stainless machines',
  'Trình diễn tại bàn': 'Eye-level workbench presentation angle with clear foreground visibility of the merchandise setup',
  'Sản phẩm tiêu biểu': 'Low-angle commercial hero power shot making both model and product look commanding and premium',
};
/**
 * Scan product image and summarize branding + packaging
 */
export async function scanProductWithAI(productMedia: MediaReference): Promise<{ brandName: string; productSummary: string }> {
  const prompt = `Analyze this commercial product image thoroughly.
Extract the visible brand or company name (if none is visible, provide a fitting industrial brand name).
Provide a concise English summary (1-2 sentences) of the exact product type, shape, packaging materials, dominant colors, and distinctive graphic elements.
Return strictly valid JSON with this exact format:
{
  "brandName": "Brand Name Here",
  "productSummary": "Concise description of product shape, color, packaging and materials"
}`;
  const response = await Flow.generate.text(prompt, {
    images: [{ base64: productMedia.base64, mimeType: productMedia.mimeType }],
    systemInstruction: 'You are an expert e-commerce industrial packaging and visual product analyst. Always respond with pure JSON only, without markdown backticks.',
  });
  try {
    let cleanText = response.text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    const parsed = JSON.parse(cleanText);
    return {
      brandName: parsed.brandName || 'Authentic Goods',
      productSummary: parsed.productSummary || 'High quality commercial retail packaged product',
    };
  } catch (e) {
    return {
      brandName: 'Industrial Brand',
      productSummary: response.text.slice(0, 150),
    };
  }
}
/**
 * Build rigorous image prompt avoiding prefix duplication
 */
export function buildPrompt(
  config: DirectorConfig,
  currentCamera: string
): string {
  let brandDesc = 'Subtle commercial packaging with authentic branding elements';
  if (config.brandSource === 'Không gắn thương hiệu') {
    brandDesc = 'Clean minimalist unbranded commercial appearance, neutral sleek modern packaging';
  } else if (config.brandName?.trim()) {
    brandDesc = `Proudly featuring the official brand name "${config.brandName.trim()}" integrated naturally on the product packaging, labels, and warehouse signage`;
  }
  const cameraDesc = CAMERA_MAP[currentCamera] || CAMERA_MAP['Ngang mắt trung cảnh'];
  const envDesc = ENV_MAP[config.environment] || ENV_MAP['Kho hàng lớn'];
  const densityDesc = DENSITY_MAP[config.density] || DENSITY_MAP['Bình thường'];
  const actionDesc = ACTION_MAP[config.action] || ACTION_MAP['Cầm sản phẩm chính'];
  const spaceDesc = SPACE_STYLE_MAP[config.spaceStyle] || SPACE_STYLE_MAP['Tự động'];
  const outfitDesc = OUTFIT_MAP[config.outfit] || OUTFIT_MAP['Tự động'];
  const productDetail = config.productSummary ? ` Product specifications: ${config.productSummary}.` : '';
  const directorNote = config.customNote?.trim() ? `\nADDITIONAL DIRECTOR INSTRUCTIONS: ${config.customNote.trim()}` : '';
  return `MODEL IDENTITY: Mandatory maintenance of the exact person from the first reference image (facial features, hair style, skin tone, body shape, and proportions).
PRODUCT IDENTITY: Mandatory maintenance of the exact product from the second reference image (exact shape, color, packaging materials, labels, logo placement, and design).${productDetail}
ENVIRONMENT: ${envDesc}
INVENTORY DENSITY: ${densityDesc}
MODEL ACTION: ${actionDesc}
BRANDING: ${brandDesc}
SPATIAL STYLE: ${spaceDesc}
OUTFIT: ${outfitDesc}
CAMERA ANGLE: ${cameraDesc}${directorNote}
Every explicitly selected option is mandatory. Do not ignore, weaken, replace, or reinterpret an explicitly selected option. Only options set to Auto may be decided freely by the AI.
STYLE: Photorealistic industrial commercial photography, 8k resolution, cinematic lighting, sharp focus, authentic textures, real working factory/warehouse atmosphere. No studio backdrops.`;
}
/**
 * Generate image for a specific slot using Nano Banana Pro
 */
export async function generateSlotImage(
  config: DirectorConfig,
  cameraAngle: string,
  modelMedia: MediaReference,
  productMedia: MediaReference
): Promise<{ mediaId: string; base64: string; mimeType: string }> {
  const prompt = buildPrompt(config, cameraAngle);
  // Aspect ratio mapping
  const validAspectRatio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' =
    config.aspectRatio === '4:5' ? '3:4' : config.aspectRatio;
  const result = await Flow.generate.image({
    prompt,
    referenceImageMediaIds: [modelMedia.mediaId, productMedia.mediaId],
    modelDisplayName: '🍌 Nano Banana Pro',
    aspectRatio: validAspectRatio,
  });
  return {
    mediaId: result.mediaId,
    base64: result.base64,
    mimeType: result.mimeType,
  };
}
/**
 * Generate cinematic video from image using Omni 1.1 Flash with Voice Profile support
 */
export async function generateSlotVideo(
  imageMediaId: string,
  config: DirectorConfig,
  cameraAngle: string,
  options?: {
    selectedVoiceId?: string;
    dialogueLine?: string;
    characterName?: string;
    emotion?: string;
  }
): Promise<{ mediaId: string; base64: string; mimeType: string }> {
  const videoAspect: '16:9' | '9:16' = config.aspectRatio === '16:9' ? '16:9' : '9:16';
  let videoPrompt = `Cinematic commercial video in a real working industrial factory and warehouse. The camera executes a smooth controlled ${cameraAngle} motion, with natural volumetric dust motes caught in industrial LED rays, subtle machinery hum vibrations, and natural human motion presenting the product proudly. Cinematic 24fps motion blur, high dynamic range.`;
  const voiceId = options?.selectedVoiceId || config.selectedVoiceId;
  const characterVoice = MATRIX_12_VOICES.find((v) => v.id === voiceId);
  const dialogueLine = options?.dialogueLine || config.dialogueLine || characterVoice?.sampleSentence;
  const characterName = options?.characterName || config.characterName;
  const emotion = options?.emotion || config.emotion || 'Natural';
  if (characterVoice && dialogueLine) {
    const voiceInfo = `[Voice Profile: ${characterVoice.label} (${characterVoice.subLabel}), Base Voice: ${characterVoice.baseVoice}, Gender: ${characterVoice.gender}, Speed: ${characterVoice.speed}, Pitch: ${characterVoice.pitch}, Acoustic: ${characterVoice.acousticProfile}, Emotion: ${emotion || 'Natural'}]`;
    videoPrompt += ` ${voiceInfo} ${characterName ? `${characterName} nói: ` : ''}"${dialogueLine}"`;
  }
  const video = await Flow.generate.video({
    prompt: videoPrompt,
    firstFrameImageMediaId: imageMediaId,
    modelDisplayName: 'Omni 1.1 Flash',
    aspectRatio: videoAspect,
    durationSeconds: 4,
    resolution: '720p',
  });
  return {
    mediaId: video.mediaId,
    base64: video.base64,
    mimeType: video.mimeType,
  };
}