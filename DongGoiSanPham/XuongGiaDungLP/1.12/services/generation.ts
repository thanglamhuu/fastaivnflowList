import { Flow } from 'flow-sdk';
import { MediaReference } from '../types';
/**
 * Scan product image and summarize branding + packaging using Flow.generate.text
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