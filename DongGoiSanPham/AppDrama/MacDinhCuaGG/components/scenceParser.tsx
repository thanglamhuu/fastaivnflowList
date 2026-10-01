import { ScriptScene, SCENE_HEADING_REGEX, SCENE_ID_REGEX } from '../types';
export const TRANSITION_REGEX = /^(FADE IN|FADE OUT|FADE TO|CUT TO|DISSOLVE TO|SMASH CUT TO|MATCH CUT TO|JUMP CUT TO|WIPE TO|IRIS IN|IRIS OUT)[\s:.\-]*$/i;
export const generateId = () => `scene-${Math.random().toString(36).substr(2, 9)}`;
export const parseScriptToScenes = (markdown: string): ScriptScene[] => {
  if (!markdown) return [];
  // Aggressively normalize to single and double newlines only, and unescape markdown characters
  const normalizedMarkdown = markdown
    .replace(/\\([#*_\-\.>`])/g, '$1') // Unescape characters escaped by Turndown
    .replace(/\x0d\x0a/g, '\x0a')
    .replace(/\x0a{3,}/g, '\x0a\x0a');
    
  const rawLines = normalizedMarkdown.split('\x0a');
  const lines: string[] = [];
  
  // Pre-process lines to collapse empty lines after characters and parentheticals
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const prevLine = i > 0 ? rawLines[i - 1].trim() : '';
    const nextLine = i < rawLines.length - 1 ? rawLines[i + 1].trim() : '';
    
    if (line.trim() === '') {
      const isPrevTransition = TRANSITION_REGEX.test(prevLine.replace(/^#+\s*/, ''));
      const isPrevHeading = SCENE_HEADING_REGEX.test(prevLine);
      const isPrevAllCaps = !isPrevTransition && !isPrevHeading && /^[A-Z0-9\s.()'"\-]+$/.test(prevLine) && prevLine.length > 1 && prevLine.length < 45;
      const isPrevParenthetical = /^\(.+?\)$/.test(prevLine) || /^\*\(.+?\)\*$/.test(prevLine) || /^_.*_$/.test(prevLine);
      
      if ((isPrevAllCaps || isPrevParenthetical) && nextLine !== '') {
        continue; // Skip this empty line to snap dialogue to the character name
      }
    }
    lines.push(line);
  }
  const scenes: ScriptScene[] = [];
  
  let currentContent: string[] = [];
  let currentHeading = 'PREAMBLE';
  let currentId = 'scene-preamble';
  let sceneIndex = 0;
  const pushScene = () => {
    const content = currentContent.join('\x0a').trim();
    if (content || currentHeading !== 'PREAMBLE') {
      const idMatch = content.match(SCENE_ID_REGEX);
      const finalId = idMatch ? idMatch[1] : currentId;
      
      const baseContent = content.replace(SCENE_ID_REGEX, '').trim();
      const finalContent = `<!-- scene-id: ${finalId} -->\x0a${baseContent}`;
      
      scenes.push({
        id: finalId,
        heading: currentHeading,
        content: finalContent,
        order: sceneIndex++,
        isPreamble: currentHeading === 'PREAMBLE'
      });
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined || line === null) continue;
    
    const isHeading = SCENE_HEADING_REGEX.test(line);
    const isTransition = TRANSITION_REGEX.test(line.replace(/^#+\s*/, ''));
    if (isHeading && !isTransition) {
      pushScene();
      currentId = generateId();
      const rawHeading = line.replace(/^(#{1,3}\s*)?/, '').trim().toUpperCase();
      currentHeading = rawHeading;
      currentContent = [`### ${rawHeading}`];
    } else if (isTransition) {
      const rawTransition = line.replace(/^(#{1,5}\s*)?/, '').replace(/[\s:.\-]*$/, '').trim().toUpperCase();
      currentContent.push(`##### ${rawTransition}:`);
    } else {
      if (!SCENE_ID_REGEX.test(line)) {
        const trimmed = line.trim();
        const nextLine = lines[i + 1]?.trim();
        
        const isAllCaps = /^[A-Z0-9\s.()'"\-]+$/.test(trimmed) && trimmed.length > 1 && trimmed.length < 45;
        const isParenthetical = /^\(.+?\)$/.test(trimmed);
        
        if (isAllCaps && !trimmed.startsWith('**') && nextLine && nextLine !== '') {
          currentContent.push(`**${trimmed}**`);
        } else if (isParenthetical && !trimmed.startsWith('_') && !trimmed.startsWith('*')) {
          currentContent.push(`_(${trimmed.slice(1, -1)})_`);
        } else {
          currentContent.push(line);
        }
      }
    }
  }
  pushScene();
  return scenes;
};
export const validateAndCleanScenes = (scenes: ScriptScene[]): ScriptScene[] => {
  const seenIds = new Set<string>();
  return scenes.map(scene => {
    let id = scene.id;
    if (seenIds.has(id) || !id) {
      id = generateId();
    }
    seenIds.add(id);
    
    let content = scene.content.replace(/<!--\s*scene-id:\s*([a-zA-Z0-9-]+)\s*-->/g, '').trim();
    // Ensure internal scene whitespace is cleaned up
    content = content.replace(/\x0a{3,}/g, '\x0a\x0a');
    content = `<!-- scene-id: ${id} -->\x0a${content}`;
    
    return { ...scene, id, content };
  });
};
export const joinScenes = (scenes: ScriptScene[]): string => {
  return scenes
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(s => s.content.trim())
    .join('\x0a\x0a');
};