import { ScriptScene } from '../types';
const SCENE_HEADING_PATTERN = /^(#{1,3}\s*)?(EXT\.|INT\.|EXT\/INT\.|I\/E\.)/i;
const TRANSITION_REGEX = /^(FADE IN|FADE OUT|FADE TO|CUT TO|DISSOLVE TO|SMASH CUT TO|MATCH CUT TO|JUMP CUT TO|WIPE TO|IRIS IN|IRIS OUT)[\s:.\-]*$/i;
const SCENE_ID_COMMENT_PATTERN = /^<!--\s*scene-id:\s*([a-zA-Z0-9-]+)\s*-->/;
export const parseScript = (text: string): ScriptScene[] => {
  const lines = text.split('\x0a');
  const scenes: ScriptScene[] = [];
  
  let currentScene: Partial<ScriptScene> = {
    id: 'scene-preamble',
    slugline: 'PREAMBLE',
    content: '',
    isPreamble: true
  };
  
  let nextSceneId: string | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for ID comment
    const idMatch = line.match(SCENE_ID_COMMENT_PATTERN);
    if (idMatch) {
      nextSceneId = idMatch[1];
      continue;
    }
    // Check for scene heading
    const isHeading = SCENE_HEADING_PATTERN.test(line);
    const isTransition = TRANSITION_REGEX.test(line);
    if (isHeading && !isTransition) {
      // Save previous scene
      if (currentScene.content?.trim() || currentScene.id !== 'scene-preamble') {
        scenes.push(currentScene as ScriptScene);
      }
      // Start new scene
      currentScene = {
        id: nextSceneId || crypto.randomUUID(),
        slugline: line.replace(/^#{1,3}\s*/, '').toUpperCase(),
        content: '',
        isPreamble: false
      };
      nextSceneId = null;
    } else {
      currentScene.content += (currentScene.content ? '\x0a' : '') + lines[i];
    }
  }
  // Push final scene
  if (currentScene.content?.trim() || !currentScene.isPreamble) {
    scenes.push(currentScene as ScriptScene);
  }
  return scenes;
};
/**
 * Sanitizes script text for AI consumption.
 * Now strips double newlines and extra spaces to maximize context density.
 */
export const sanitizeForAI = (text: string): string => {
  return text
    .split('\x0a')
    .filter(line => {
      const l = line.trim();
      if (!l) return false; // Strip empty lines to save characters
      // Allow scene headings (### INT. ...) but strip main title (# ...)
      if (l.startsWith('# ') || l.startsWith('## ')) return false; 
      if (l.startsWith('>')) return false; 
      if (l.startsWith('<!--')) return false; 
      return true;
    })
    .map(line => line.trim()) // Strip indentation
    .join('\x0a');
};