import TurndownService from 'turndown';
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});
// CRITICAL: Disable escaping so scene-id comments and markdown symbols stay intact
turndownService.escape = (text) => text;
// Preserve existing scene comments if they are already in the DOM
turndownService.addRule('sceneComments', {
  filter: (node) => node.nodeType === 8, // Comment node
  replacement: (content) => `<!--${content}-->`
});
// Convert data-scene-id attributes back to markdown comments
turndownService.addRule('preserveSceneIds', {
  filter: (node) => node.nodeName === 'H3' && node.hasAttribute('data-scene-id'),
  replacement: (content, node) => {
    const element = node as HTMLElement;
    const sceneId = element.getAttribute('data-scene-id');
    return `\x0a<!-- scene-id: ${sceneId} -->\x0a### ${content}\x0a`;
  }
});
// Convert <br> back to newlines properly
turndownService.addRule('lineBreaks', {
  filter: 'br',
  replacement: () => '\x0a'
});
export { turndownService };