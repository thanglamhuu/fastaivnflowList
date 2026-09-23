export const STYLING_BOARD_PROMPT = `
Create a high-end fashion styling board / outfit breakdown board from the uploaded outfit image.
The board should look like a professional editorial fashion presentation.
Use a clean neutral studio background with structured layout panels.
Show the complete outfit clearly: Front view, Back view, Side view, Close-up of top, Close-up of bottom, Shoes, Bag, Accessories, Fabric texture, and Color palette.
Keep the outfit accurate. Do not invent extra items or fake logos.
`;

export const ESCALATOR_BG_PROMPT = `
Create a clean vertical 9:16 background plate of a modern luxury shopping mall with two parallel escalators.
Fixed camera at the bottom, looking upward. Symmetrical composition with clear central divider.
Grey steps, glass railings, metal handrails, bright professional mall lighting.
The left escalator is for downward movement, the right escalator is for upward movement.
No people, no crowds, no logos, no text. Clean, high-end background plate.
`;

export const VIDEO_GENERATION_PROMPT = (regenMode?: string) => {
  let modeSpecific = "";
  if (regenMode === 'face') modeSpecific = "CRITICAL: The KOC's face must perfectly match the provided KOC reference image. Maintain high facial detail and identity consistency throughout the 6 seconds.";
  if (regenMode === 'outfit') modeSpecific = "CRITICAL: Focus on the clothes. Every detail from the Styling Board (texture, color, fit) must be identical on both KOC instances.";
  if (regenMode === 'view') modeSpecific = "ENHANCE PERSPECTIVE: Ensure the left KOC is clearly walking forward/descending and the right KOC is clearly moving away/ascending. Sharp silhouettes.";
  if (regenMode === 'movement') modeSpecific = "SMOOTH MOTION: Make the walking and posing more fluid, elegant, and realistic. No robotic movements.";

  return `
[SCENE COMPOSITION]: A symmetrical vertical 9:16 cinematic fashion video in a modern luxury mall. Two parallel escalators dominate the frame.
[SUBJECT]: Exactly two identical instances of the same KOC model (from reference) wearing the exact same outfit (from Styling Board).
[ACTION - LEFT SIDE]: The KOC is on the left escalator, moving downwards toward the camera. She is front-facing, performing light fashion poses and looking toward the lens.
[ACTION - RIGHT SIDE]: The KOC is on the right escalator, moving upwards away from the camera. She is back-facing, showing the rear silhouette and gait.
[ENVIRONMENT]: Use the provided Escalator Background. Bright, clean, professional studio-quality lighting. High contrast between model and background.
[TECHNICAL]: 6 seconds, 9:16 aspect ratio, 30fps. Photorealistic, 8k resolution, stable video, no flickering, no morphing, no text, no watermarks.
[CONSISTENCY]: Preserve KOC identity (face, hair) and Outfit details (color, fabric, accessories) with 100% accuracy using the reference images.
${modeSpecific}
`;
};