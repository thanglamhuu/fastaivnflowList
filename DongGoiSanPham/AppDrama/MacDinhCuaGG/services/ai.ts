import { Flow } from 'flow-sdk';
import { Asset, AssetType, AssetSuggestions, CharacterAsset, LocationAsset, PropAsset } from '../types';
import { sanitizeForAI } from './scriptParser';
const MAX_CONTEXT_LENGTH = 16000; // systemInstruction has no practical char limit — generous cap to balance context quality vs latency/token cost
export const VISUAL_STYLE_PROMPTS: Record<string, string> = {
  '3D-Animation': "Vibrant, premium cinematic 3D animation. Volumetric lighting, subsurface scattering, rich tactile textures. Exaggerated, highly expressive character designs with prominent facial features and vivid emotional depth. Characters ignore the camera. Uncropped full frame, textless, no letterboxing.",
  'Claymation': "Tactile stop-motion claymation. Crafted exclusively from pure plasticine and modeling clay, featuring hyper-detailed visible fingerprints and subtle sculpting marks. Sculpted characters boast distinct, chunky masses against a smooth, minimalist background. Frozen mid-action. Characters ignore the camera. Uncropped full frame, textless, no letterboxing.",
  'Concept-Sketch': "Dynamic concept-sketch using bold felt-tip markers on pristine white paper. Rapid, confident strokes and minimalist colors fade seamlessly into negative space, capturing raw kinetic energy. Proportions are realistic yet highly stylized. Characters ignore the camera. Uncropped full frame, textless, no letterboxing.",
  'Realistic': "Hyper-realistic cinematic film still. Shallow depth of field, atmospheric lighting, ultra-high-fidelity textures. Lifelike characters exhibit visible skin pores, natural flaws, and nuanced micro-expressions within a softly focused, immersive environment. Characters ignore the camera. Uncropped full frame, textless, no letterboxing.",
  'Charcoal': "Raw, heavily textured black-and-white charcoal sketch on coarse-grain paper. Striking chiaroscuro contrast between deep blacks and bright highlights. Loose gestural strokes, dramatic smudges, and erased voids define spontaneous forms. Characters ignore the camera. Uncropped full frame, textless, no letterboxing."
};
const extractJson = (text: string) => {
  if (typeof text !== 'string') return null;
  
  try {
    let processedText = text.trim();
    if (processedText.startsWith('```')) {
      processedText = processedText.replace(/^```[a-z]*\x0a/i, '').replace(/```$/m, '').trim();
    }
    const firstBrace = processedText.indexOf('{');
    const firstBracket = processedText.indexOf('[');
    let startIdx = -1;
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) startIdx = firstBrace;
    else if (firstBracket !== -1) startIdx = firstBracket;
    
    if (startIdx === -1) return null;
    const lastBrace = processedText.lastIndexOf('}');
    const lastBracket = processedText.lastIndexOf(']');
    let endIdx = Math.max(lastBrace, lastBracket);
    
    if (endIdx === -1 || endIdx <= startIdx) {
      endIdx = processedText.length;
    } else {
      endIdx += 1;
    }
    
    let cleanText = processedText.slice(startIdx, endIdx).trim();
    const normalize = (parsed: any): AssetSuggestions | any => {
      if (!parsed || typeof parsed !== 'object') return parsed;
      
      const normalized: any = { characters: [], locations: [], props: [] };
      let matched = false;
      
      Object.keys(parsed).forEach(key => {
        const lowerKey = key.toLowerCase();
        const val = parsed[key];
        if (Array.isArray(val)) {
          const cleanList = val.filter(v => typeof v === 'string' && v.trim().length > 0);
          if (lowerKey.includes('char')) { normalized.characters = cleanList; matched = true; }
          else if (lowerKey.includes('loc')) { normalized.locations = cleanList; matched = true; }
          else if (lowerKey.includes('prop')) { normalized.props = cleanList; matched = true; }
        }
      });
      
      return matched ? normalized : parsed;
    };
    // Pre-clean: strip trailing commas before } or ] (most common AI JSON error)
    const stripTrailingCommas = (s: string) => s.replace(/,\s*([}\]])/g, '$1');
    cleanText = stripTrailingCommas(cleanText);
    try {
      return normalize(JSON.parse(cleanText));
    } catch (e) {
      cleanText = cleanText.replace(/[\s`]+$/, '');
      cleanText = cleanText.replace(/[,\s:]+$/, '');
      cleanText = cleanText.replace(/,\s*"[^"]*"?\s*$/, ''); 
      
      let inString = false;
      for (let i = 0; i < cleanText.length; i++) {
        if (cleanText[i] === '"' && (i === 0 || cleanText[i-1] !== '\\')) inString = !inString;
      }
      if (inString) cleanText += '"';
      
      const stack: string[] = [];
      for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        if (char === '"' && (i === 0 || cleanText[i-1] !== '\\')) {
           // Skip strings
        } else if (char === '{' || char === '[') {
          stack.push(char === '{' ? '}' : ']');
        } else if (char === '}' || char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === char) stack.pop();
        }
      }
      while (stack.length > 0) cleanText += stack.pop();
      
      // Final trailing comma strip on the repaired text
      cleanText = stripTrailingCommas(cleanText);
      try {
        return normalize(JSON.parse(cleanText));
      } catch (innerE) {
        return null;
      }
    }
  } catch (e) {
    return null;
  }
};
export const suggestAssets = async (
  script: string, 
  existing: Asset[], 
  types: AssetType[]
): Promise<AssetSuggestions | null> => {
  const cleanScript = sanitizeForAI(script).slice(0, MAX_CONTEXT_LENGTH);
  const exclusions = existing.map(a => a.name).join(', ') || 'none';
  const assetTypesStr = types.join(', ');
  const systemInstruction = `You are an AI assistant that analyzes screenplay content to extract asset information.
## REQUESTED ASSET TYPES: 
${assetTypesStr}
## SCREENPLAY CONTENT:
${cleanScript}
Return a JSON object with this structure:
{
  "characters": ["Character Name 1", "Character Name 2"],
  "locations": ["Location Name 1", "Location Name 2"],
  "props": ["Prop Name 1", "Prop Name 2"]
}
Only include the requested asset types. Each array contains just the names as strings.
Your task is to identify assets ONLY from the SCREENPLAY CONTENT above. IGNORE any blockquote comments (lines starting with ">") — these are the writer's personal notes and brainstorming, NOT part of the story.
1. **Characters**: Any character names mentioned in the script (look for bold character names like **CHARACTER** and character names in action lines).
2. **Locations**: Any location names from scene headings (like "INT. COFFEE SHOP - DAY") or mentioned in action descriptions.
3. **Props**: ONLY significant objects that are central to the story or plot. Props should be:
   - Mentioned multiple times OR
   - Critical to a key scene or character for continuity across frames OR
   - Have story significance (e.g., a magical sword, an important letter, a murder weapon)
   - DO NOT include generic everyday items like "chair", "door", "cup" unless they have special importance in the screenplay action.
   - **CRITICAL**: Props are objects in the scene that characters interact with. DO NOT include clothing, wardrobe items, or personal accessories that a character wears (like hats, glasses, jewelry) as props. Those belong to the character's visual description.
Rules:
- Extract ONLY from actual screenplay content (scene headings, action lines, dialogue, character names)
- DO NOT extract names from comments, notes, or blockquotes — these are brainstorming notes
- For characters: Extract the character name only (e.g., "JOHN" or "EVA")
- For locations: Extract the location name only (e.g., "COFFEE SHOP" or "SPACESHIP COCKPIT")
- For props: Extract the prop name only for CENTRAL/IMPORTANT items (e.g., "MAGIC SWORD" or "LOCKET")
- Return names in title case (e.g., "John", "Coffee Shop", "Magic Sword")
- Do NOT include these existing assets: ${exclusions}
- Be selective: quality over quantity, especially for props
- ONLY return the asset types that were requested`;
  const prompt = `List NEW ${assetTypesStr}:`;
  const response = await Flow.generate.text(prompt, {
    systemInstruction,
    modelDisplayName: 'Gemini 3.0 Flash Preview',
    thinkingLevel: 'low'
  });
  
  return extractJson(response.text);
};
export const suggestSceneBreakdown = async (
  sceneTitle: string, 
  sceneContent: string, 
  frameCount: number
): Promise<{ title: string }[] | null> => {
  const systemInstruction = `You are a film director and storyboard artist. Given a scene from a screenplay, suggest exactly ${frameCount} cinematic shot titles that break down the action.
  
  Each title should be 3-6 words and describe the specific shot or camera setup.
## SCENE: ${sceneTitle}
## SCENE CONTENT:
${sceneContent}
  
  Return a JSON object with this structure:
  {
    "shots": [
      { "title": "Cinematic Title 1" },
      { "title": "Cinematic Title 2" }
    ]
  }
  Return ONLY valid JSON.`;
  const prompt = `Suggest ${frameCount} specific shots for the scene above.`;
  try {
    const response = await Flow.generate.text(prompt, { 
      systemInstruction,
      modelDisplayName: 'Gemini 3.0 Flash Preview',
      thinkingLevel: 'low'
    });
    const data = extractJson(response.text);
    return data?.shots || null;
  } catch (e) {
    return null;
  }
};
export const autofillAsset = async (script: string, asset: Asset): Promise<Partial<Asset> | null> => {
  const cleanScript = sanitizeForAI(script).slice(0, MAX_CONTEXT_LENGTH);
  let systemInstruction = "";
  let userPrompt = `Generate a detailed description for the asset "${asset.name}" based on the screenplay and existing description provided in the system instructions.`;
  if (asset.type === 'character') {
    systemInstruction = `You are a Character Writer that creates detailed, factually accurate descriptions of people, animals, or mythical creatures for screenplay storyboarding. Always inform your character descriptions based on script evidence when the script is available. If there are Existing Descriptions, take this into consideration to inform your descriptions.
## EXISTING DESCRIPTION:
${asset.description || 'Empty'}
## SCREENPLAY CONTENT:
${cleanScript}
## ASSET NAME: ${asset.name}
IGNORE any blockquote comments (lines starting with ">") — these are the writer's personal notes, not part of the story.
PHYSICAL CHARACTERISTICS GUIDELINES:
- Keep brief (2-3 sentences) but specific
- Include race/ethnicity, age (realistic range, not too young), body size and fitness
- Describe hair color, length, and style in detail (including facial hair or clean-shaven for men)
- Make definitive statements about features (e.g., "Their eyes are green" not "eyes are likely green")
- Embrace exaggerated features suitable for stylized character rendering
- Focus exclusively on observable visual details 
- NO personality, emotions, or thoughts
- Avoid descriptions of setting, background, posture, pose, or held items
- Use concise, direct language with specific adjectives
- Make sure you're trying to be inclusive by including a diverse range of characters
CLOTHING & ACCESSORIES GUIDELINES:
- Keep brief (1-2 sentences) but specific
- Describe fabric textures, patterns, and exact colors
- Include all visible clothing items from head to toe
- Detail exact jewelry, clothing, accessories, and shoes (including colors, patterns, fabrics, textures)
- If full frame isn't visible in script, make educated guesses about below-frame clothing
BACKSTAGE GUIDELINES:
- Keep brief (1-2 sentences) but specific
- Focus on relevant background that informs the character
CRITICAL RULES:
- Use plain text only - NO markdown formatting (no **, *, _, etc.)
- NEVER use null values or empty strings - always provide a suggestions
Respond ONLY with a flat JSON object in this EXACT format (do NOT nest under array indices or other keys):
{
  "physicalCharacteristics": "...",
  "clothingAccessories": "...",
  "backstory": "..."
}`;
  } else if (asset.type === 'location') {
    systemInstruction = `You are a Location Writer that creates detailed, factually accurate descriptions of settings and environments for screenplay storyboarding. Always inform your location descriptions based on script evidence when the script is available. If there are Existing Descriptions, take this into consideration to inform your descriptions.
## EXISTING DESCRIPTION:
${asset.description || 'Empty'}
## SCREENPLAY CONTENT:
${cleanScript}
## ASSET NAME: ${asset.name}
IGNORE any blockquote comments (lines starting with ">") — these are the writer's personal notes, not part of the story.
PHYSICAL CHARACTERISTICS GUIDELINES:
- Keep brief (2-3 sentences) but specific
- Space: Size and shape with specific measurements (e.g., "10 feet by 12 feet rectangular room")
- Architecture: Style, materials (walls, floors, ceiling, windows, doors) with colors and textures
- Furniture and Furnishings: List types, materials, colors, approximate numbers with specificity (e.g., "large brown leather sofa with two matching armchairs")
- Lighting: Types of fixtures and quality of light (e.g., "chrome pendant light casting warm yellow light")
- Decorations: Paintings, sculptures, plants, rugs, and other decorative elements
- Other Notable Features: Fireplace, built-in shelves, appliances, or exterior features
- Use direct, concise language with specific adjectives
TIME OF DAY GUIDELINES:
- Specify exact time of day based on script evidence
- If not evident, make educated guess based on context
CRITICAL RULES:
- Use plain text only - NO markdown formatting (no **, *, _, etc.)
- NEVER use null values or empty strings - always provide a suggestions
Respond ONLY with valid JSON in this exact format:
{
  "physicalCharacteristics": "...",
  "timeOfDay": "..."
}`;
  } else {
    systemInstruction = `You are a Prop Writer that creates detailed, factually accurate descriptions of objects for screenplay storyboarding. Always inform your prop descriptions based on script evidence when the script is available. If there are Existing Descriptions, take this into consideration to inform your descriptions.
## EXISTING DESCRIPTION:
${asset.description || 'Empty'}
## SCREENPLAY CONTENT:
${cleanScript}
## ASSET NAME: ${asset.name}
IGNORE any blockquote comments (lines starting with ">") — these are the writer's personal notes, not part of the story.
PHYSICAL CHARACTERISTICS GUIDELINES:
- Keep brief (1-2 sentences) but specific
- Focus exclusively on observable visual details
- Describe materials, textures, finishes, and colors in excruciating detail
- If object isn't fully visible in script, infer and describe complete object including hidden parts
- Make confident inferences - avoid equivocal descriptions (say "aged oak" not "seems old, likely oak or pine")
- Avoid descriptions of setting, background, placement, orientation, or character interactions
- More exaggerated descriptions of character or condition are better than plain ones
CRITICAL RULES:
- Use plain text only - NO markdown formatting (no **, *, _, etc.)
- NEVER use null values or empty strings - always provide a suggestions
Respond ONLY with valid JSON in this exact format:
{
  "physicalCharacteristics": "..."
}`;
  }
  const response = await Flow.generate.text(userPrompt, { 
    systemInstruction,
    modelDisplayName: 'Gemini 3.0 Flash Preview',
    thinkingLevel: 'low'
  });
  return extractJson(response.text);
};
/**
 * Batch autofill: groups assets by type and makes ONE text call per type group.
 * Preserves the full type-specific system instructions from autofillAsset.
 * Returns a Map<assetId, Partial<Asset>> with the autofilled details.
 * 
 * Used only for bulk "autofill all" — single-asset autofill still uses autofillAsset.
 */
export const batchAutofillAssets = async (
  script: string,
  assets: Asset[]
): Promise<Map<string, Partial<Asset>>> => {
  const cleanScript = sanitizeForAI(script).slice(0, MAX_CONTEXT_LENGTH);
  const results = new Map<string, Partial<Asset>>();
  // Group assets by type
  const groups: Record<string, Asset[]> = {};
  for (const asset of assets) {
    if (!groups[asset.type]) groups[asset.type] = [];
    groups[asset.type].push(asset);
  }
  for (const [type, typeAssets] of Object.entries(groups)) {
    if (typeAssets.length === 0) continue;
    const assetListStr = typeAssets.map(a => `- "${a.name}" (existing description: ${a.description || 'none'})`).join('\x0a');
    let systemInstruction = '';
    let responseFormat = '';
    if (type === 'character') {
      systemInstruction = `You are a Character Writer that creates detailed, factually accurate descriptions of people, animals, or mythical creatures for screenplay storyboarding. Always inform your character descriptions based on script evidence when the script is available.
PHYSICAL CHARACTERISTICS GUIDELINES:
- Keep brief (2-3 sentences) but specific
- Include race/ethnicity, age (realistic range, not too young), body size and fitness
- Describe hair color, length, and style in detail (including facial hair or clean-shaven for men)
- Make definitive statements about features (e.g., "Their eyes are green" not "eyes are likely green")
- Embrace exaggerated features suitable for stylized character rendering
- Focus exclusively on observable visual details 
- NO personality, emotions, or thoughts
- Avoid descriptions of setting, background, posture, pose, or held items
- Use concise, direct language with specific adjectives
- Make sure you're trying to be inclusive by including a diverse range of characters
CLOTHING & ACCESSORIES GUIDELINES:
- Keep brief (1-2 sentences) but specific
- Describe fabric textures, patterns, and exact colors
- Include all visible clothing items from head to toe
- Detail exact jewelry, clothing, accessories, and shoes (including colors, patterns, fabrics, textures)
- If full frame isn't visible in script, make educated guesses about below-frame clothing
BACKSTORY GUIDELINES:
- Keep brief (1-2 sentences) but specific
- Focus on relevant background that informs the character
CRITICAL RULES:
- Use plain text only - NO markdown formatting (no **, *, _, etc.)
- NEVER use null values or empty strings - always provide a suggestion
- Give EQUAL detail and attention to EVERY character listed`;
      responseFormat = `{
  "Character Name": { "physicalCharacteristics": "...", "clothingAccessories": "...", "backstory": "..." },
  ...
}`;
    } else if (type === 'location') {
      systemInstruction = `You are a Location Writer that creates detailed, factually accurate descriptions of settings and environments for screenplay storyboarding. Always inform your location descriptions based on script evidence when the script is available.
PHYSICAL CHARACTERISTICS GUIDELINES:
- Keep brief (2-3 sentences) but specific
- Space: Size and shape with specific measurements (e.g., "10 feet by 12 feet rectangular room")
- Architecture: Style, materials (walls, floors, ceiling, windows, doors) with colors and textures
- Furniture and Furnishings: List types, materials, colors, approximate numbers with specificity
- Lighting: Types of fixtures and quality of light
- Decorations: Paintings, sculptures, plants, rugs, and other decorative elements
- Other Notable Features: Fireplace, built-in shelves, appliances, or exterior features
- Use direct, concise language with specific adjectives
TIME OF DAY GUIDELINES:
- Specify exact time of day based on script evidence
- If not evident, make educated guess based on context
CRITICAL RULES:
- Use plain text only - NO markdown formatting (no **, *, _, etc.)
- NEVER use null values or empty strings - always provide a suggestion
- Give EQUAL detail and attention to EVERY location listed`;
      responseFormat = `{
  "Location Name": { "physicalCharacteristics": "...", "timeOfDay": "..." },
  ...
}`;
    } else {
      systemInstruction = `You are a Prop Writer that creates detailed, factually accurate descriptions of objects for screenplay storyboarding. Always inform your prop descriptions based on script evidence when the script is available.
PHYSICAL CHARACTERISTICS GUIDELINES:
- Keep brief (1-2 sentences) but specific
- Focus exclusively on observable visual details
- Describe materials, textures, finishes, and colors in excruciating detail
- If object isn't fully visible in script, infer and describe complete object including hidden parts
- Make confident inferences - avoid equivocal descriptions (say "aged oak" not "seems old, likely oak or pine")
- Avoid descriptions of setting, background, placement, orientation, or character interactions
- More exaggerated descriptions of character or condition are better than plain ones
CRITICAL RULES:
- Use plain text only - NO markdown formatting (no **, *, _, etc.)
- NEVER use null values or empty strings - always provide a suggestion
- Give EQUAL detail and attention to EVERY prop listed`;
      responseFormat = `{
  "Prop Name": { "physicalCharacteristics": "..." },
  ...
}`;
    }
    // Append screenplay + asset list context to systemInstruction (no char limit)
    // rather than in the prompt (4000 char limit)
    systemInstruction += `\x0a\x0a## SCREENPLAY CONTENT:\x0a${cleanScript}\x0a\x0a## ${type.toUpperCase()}S TO DESCRIBE:\x0a${assetListStr}\x0a\x0aIGNORE any blockquote comments (lines starting with ">") — these are the writer's personal notes, not part of the story.\x0a\x0aRespond ONLY with valid JSON keyed by EXACT asset name:\x0a${responseFormat}`;
    const userPrompt = `Generate detailed descriptions for ALL ${typeAssets.length} ${type}s listed in the system instructions.`;
    const response = await Flow.generate.text(userPrompt, {
      systemInstruction,
      modelDisplayName: 'Gemini 3.0 Flash Preview',
      thinkingLevel: 'low'
    });
    const parsed = extractJson(response.text);
    if (parsed && typeof parsed === 'object') {
      const responseKeys = Object.keys(parsed);
      // Match response keys to assets by name — try exact first, then fuzzy
      for (const asset of typeAssets) {
        const assetNameLower = asset.name.toLowerCase().trim();
        // Try exact case-insensitive match first
        let matchKey = responseKeys.find(k => k.toLowerCase().trim() === assetNameLower);
        // Fuzzy: AI may prepend "The" or append "(character)" — check if the key contains our asset name
        if (!matchKey) {
          matchKey = responseKeys.find(k => {
            const kLower = k.toLowerCase().trim();
            return kLower.includes(assetNameLower);
          });
        }
        if (matchKey && parsed[matchKey]) {
          results.set(asset.id, parsed[matchKey]);
        } else {
          // Unmatched — will fall back to individual autofill in the caller
        }
      }
    } else {
      // Parse failed — caller will fall back to individual autofill
    }
  }
  return results;
};
export const base64ToBlobUrl = async (base64: string, mimeType: string): Promise<string> => {
  if (!base64 || typeof base64 !== 'string' || base64.length === 0) {
    throw new Error('base64ToBlobUrl: received empty or invalid base64 data');
  }
  if (!mimeType) mimeType = 'image/jpeg';
  try {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('base64ToBlobUrl failed:', e);
    throw e;
  }
};
export const generateImage = async (asset: Asset, visualStyle: string = "3D-Animation", customStylePrompt?: string): Promise<{ dataUrl: string; mediaId: string } | null> => {
  let promptParts: string[] = [];
  const aspectRatio = '16:9';
  // 1. Base Frame Descriptions by Asset Type
  if (asset.type === 'character') {
    const a = asset as CharacterAsset;
    promptParts.push('Frame Description: A character sheet with a head and shoulders shot showing the characters face on the left and a full body shot of the character on the right wearing the same clothing and accessories against a seamless white background. Bright, even lighting clearly shows the individual\'s features with minimal shadow. Their expression is neutral and forward-facing, creating an objective "asset" shot for casting. No lines or text/words in the image.');
    promptParts.push(`Character: ${a.name}`);
    if (a.physicalCharacteristics) {
      promptParts.push(`Physical Characteristics: ${a.physicalCharacteristics}`);
    } else if (a.description) {
      promptParts.push(`Physical Characteristics: ${a.description}`);
    }
    if (a.clothingAccessories) promptParts.push(`Clothing and Accessories: ${a.clothingAccessories}`);
  } else if (asset.type === 'location') {
    const a = asset as LocationAsset;
    promptParts.push('Frame Description: Make a single image with 4 different 16:9 views of this same location with perfect continuity. One image should be a wide establishing shot of the environment, well-lit for the atmosphere of the film. There are no other people, animals, or characters in the image. No lines or text/words in the image. The other three shots of the location should be from different angles and perspectives, showing different parts of the environment.');
    promptParts.push(`Location: ${a.name}`);
    if (a.timeOfDay) promptParts.push(`Time of Day: ${a.timeOfDay}`);
    if (a.physicalCharacteristics) {
      promptParts.push(`Physical Characteristics: ${a.physicalCharacteristics}`);
    } else if (a.description) {
      promptParts.push(`Physical Characteristics: ${a.description}`);
    }
  } else if (asset.type === 'prop') {
    promptParts.push('Frame Description: A product image of just the item described against a white background. This should look like an ecommerce product shot for this used item. There are no other people, animals, or characters in the image. No lines or text/words in the image.');
    const a = asset as PropAsset;
    promptParts.push(`Prop: ${a.name}`);
    if (a.physicalCharacteristics) {
      promptParts.push(`Physical Characteristics: ${a.physicalCharacteristics}`);
    } else if (a.description) {
      promptParts.push(`Physical Characteristics: ${a.description}`);
    }
  }
  // 2. Visual Style
  const styleDescription = customStylePrompt || VISUAL_STYLE_PROMPTS[visualStyle] || VISUAL_STYLE_PROMPTS['3D-Animation'];
  promptParts.push(`Visual Style: ${styleDescription}`);
  // Construct final prompt with line breaks as per Gesso standard
  const finalPrompt = promptParts.join('\x0a');
  let referenceImageMediaIds: string[] | undefined;
  if (asset.inspirationImage && asset.includeInspirationInImageGen && asset.inspirationImage.dataUrl) {
    try {
      // inspirationImage has dataUrl (blob URL), not base64 — fetch and convert
      const res = await fetch(asset.inspirationImage.dataUrl);
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Strip data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const upload = await Flow.upload({
        base64,
        mimeType: blob.type || 'image/png',
        name: `Reference - ${asset.name}`
      });
      referenceImageMediaIds = [upload.mediaId];
    } catch (e) {
      console.warn("Failed to upload reference image, proceeding with text-to-image", e);
    }
  }
  try {
    const result = await Flow.generate.image({
      prompt: finalPrompt,
      aspectRatio: aspectRatio as any,
      referenceImageMediaIds,
      modelDisplayName: '🍌 Nano Banana 2'
    });
    if (!result.mimeType.startsWith('image/')) {
      throw new Error(`AI returned non-image content: ${result.mimeType}`);
    }
    const blobUrl = await base64ToBlobUrl(result.base64, result.mimeType);
    (result as any).base64 = null; // Free memory immediately
    return { dataUrl: blobUrl, mediaId: result.mediaId };
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    const hasRefs = referenceImageMediaIds && referenceImageMediaIds.length > 0;
    // Recovery 1: Stale/expired media IDs — retry without references
    if (hasRefs && (msg.includes('not found') || msg.includes('media item'))) {
      console.warn(`Stale reference image ID, retrying without references: ${err.message}`);
      const result = await Flow.generate.image({
        prompt: finalPrompt,
        aspectRatio: aspectRatio as any,
        modelDisplayName: '🍌 Nano Banana 2'
      });
      const blobUrl = await base64ToBlobUrl(result.base64, result.mimeType);
      (result as any).base64 = null;
      return { dataUrl: blobUrl, mediaId: result.mediaId };
    }
    // Recovery 2: SDK 180s timeout race condition — retry without references
    // The server likely returned 200 OK but the SDK's internal timer fired first.
    // Retrying without refs is faster and avoids the race condition.
    const isTimeout = msg.includes('timed out') || msg.includes('timeout');
    if (hasRefs && isTimeout) {
      console.warn(`Reference-based generation timed out, retrying without references: ${err.message}`);
      const result = await Flow.generate.image({
        prompt: finalPrompt,
        aspectRatio: aspectRatio as any,
        modelDisplayName: '🍌 Nano Banana 2'
      });
      const blobUrl = await base64ToBlobUrl(result.base64, result.mimeType);
      (result as any).base64 = null;
      return { dataUrl: blobUrl, mediaId: result.mediaId };
    }
    // All other errors (content filter, network, no-ref timeout) — propagate
    throw err;
  }
};
export const autofillFrameContent = async (
  script: string, 
  sceneTitle: string, 
  frameTitle: string, 
  assets: Asset[]
): Promise<{
  title: string;
  visualDescription: string;
  motionDescription: string;
  audioDescription: string;
  linkedAssetIds: string[];
} | null> => {
  const assetLibraryContext = assets.map(a => `- ${a.name} (${a.type})${a.description ? ': ' + a.description : ''} [id:${a.id}]`).join('\x0a');
  const cleanScript = sanitizeForAI(script).slice(0, MAX_CONTEXT_LENGTH);
  const systemInstruction = `You are an expert screenwriter and storyboard artist. Complete the details for this specific storyboard frame.
SCENE Heading: ${sceneTitle}
FRAME Title: ${frameTitle}
AVAILABLE ASSETS:
${assetLibraryContext}
## SCRIPT CONTEXT:
${cleanScript}
Return a JSON object with: 
- title: A concise, descriptive title for the shot (3-6 words)
- visualDescription: A detailed paragraph describing the visual composition, characters present, and action. Use CHARACTER NAMES (e.g. "Eva", "Arthur"), NOT asset IDs. Write naturally as a screenwriter would.
- motionDescription: Cinematic camera movement description. Use plain English, NO IDs.
- audioDescription: Description of sounds, music, or key dialogue snippets. Use plain English, NO IDs.
- linkedAssetIds: An array of raw ID strings (the value inside the [id:...] markers from AVAILABLE ASSETS, e.g. "a1b2c3d4"). Do NOT include the "[id:" prefix or "]" suffix — just the bare ID string. ONLY put IDs here, nowhere else.
CRITICAL: The visualDescription, motionDescription, and audioDescription fields must contain ONLY human-readable prose. NEVER include asset IDs, UUIDs, or bracketed identifiers in these text fields. Reference characters, locations, and props by their NAMES only.
Return ONLY valid JSON.`;
  const prompt = `Complete details for the shot "${frameTitle}" in scene "${sceneTitle}".`;
  const response = await Flow.generate.text(prompt, { 
    systemInstruction,
    modelDisplayName: 'Gemini 3.0 Flash Preview',
    thinkingLevel: 'low'
  });
  
  return extractJson(response.text);
};