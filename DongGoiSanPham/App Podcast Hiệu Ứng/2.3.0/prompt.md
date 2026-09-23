https://flow.google.com/project/5103afed-065d-4de0-afd0-6a5a314c0809/tool/bbb16ef8-5f88-44e8-b223-796b67ea1d6c?mode=EDIT


Act as an Expert ReactJS Developer. I need you to fix three logic bugs in the App_2.tsx and constants_2.ts code regarding Flow SDK AI generation.

BUG 1: Veo 3.1 Model Generation Failure & Incorrect Parameter
In `constants_2.ts`, ensure the exact values for Veo models are correct. More importantly, in `App_2.tsx`, `Flow.generate.video` uses `referenceImageMediaIds` but for video generation, the primary image should ideally be passed. Ensure the parameters passed to `Flow.generate.video` are correct for the intended model. If the API fails with a Veo model, we need a fallback.
FIX REQUIRED IN `App_2.tsx` (inside `generateSingleVideo`):
- Wrap the video generation in a robust , `try...catch` block.
- If it fails, log the error. If `config.model` includes "Veo", automatically try again using `modelDisplayName: 'Omni 1.1 Flash'` before throwing an error.

BUG 2: Reference Image Confusion (Face blending with Outfit)
When generating a video with both `mainChar` and `outfitRef`, the AI loses the main character's face.
FIX REQUIRED IN `App_2.tsx`:
- When `outfitRef` exists, dynamically append this strict instruction to `fullPrompt` sent to `Flow.generate.video`:
"\n\nCRITICAL INSTRUCTION: You are receiving 2 reference images. Use the face identity and facial features STRICTLY from the FIRST reference image. Use the clothing and outfit STRICTLY from the SECOND reference image. Do not blend the faces. The final character must look exactly like the FIRST image."

BUG 3: "Tạo Lại" (Regenerate) button doesn't work.
In `App_2.tsx`, `generateSingleVideo` has a block: `if (shot.videoBase64 || shot.isGenerating) return;`. This prevents regeneration if a video already exists.
FIX REQUIRED IN `App_2.tsx`:
- Change the guard clause in `generateSingleVideo` to: `if (shot.isGenerating) return;`
- Before calling the API, clear the existing video string: `updatedShots[shotIndex].videoBase64 = undefined;` so the UI shows the loading state correctly.

Please provide the fully updated code for `App_2.tsx` incorporating these fixes. Hiện appversion và số credit của tài khoản đang còn ở màn hình Nhập license.