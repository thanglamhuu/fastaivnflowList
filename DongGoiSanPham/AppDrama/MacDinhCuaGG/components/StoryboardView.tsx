import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StoryboardFrame, Asset, ViewMode, VisualStyle, ParsedScene, CharacterAsset, LocationAsset, PropAsset } from '../types';
import { FrameCard } from './FrameCard';
import { FrameEditPanel } from './FrameEditPanel';
import { StoryboardAssistModal } from './StoryboardAssistModal';
import { DeleteAllFramesModal } from './DeleteAllFramesModal';
import { GenerationQueueToast } from './GenerationQueueToast';
import { ImageLightbox } from './ImageLightbox';
import { Flow } from 'flow-sdk';
import { SortableFrame } from './SortableFrame';
import { PillButton } from './DesignSystem';
import { Icon } from './Icon';
import { base64ToBlobUrl, suggestSceneBreakdown, VISUAL_STYLE_PROMPTS } from '../services/ai';
import { runRollingQueue, withRetry } from '../services/queue';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, defaultDropAnimationSideEffects, Modifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { toTitleCase } from '../services/utils';
const generateId = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
};
/** Check if a scene ID is ephemeral (not persisted in the script text) */
const isUnpersistedSceneId = (id?: string) => !id || id.startsWith('unpersisted-');
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
const snapToCursor: Modifier = ({ transform, active, activatorEvent, activeNodeRect }) => {
  if (!active || !activeNodeRect || !activatorEvent) return transform;
  const mouseEvent = activatorEvent as MouseEvent;
  if (typeof mouseEvent.clientX === 'number' && typeof mouseEvent.clientY === 'number') {
    const initialCursorOffset = {
      x: mouseEvent.clientX - activeNodeRect.left,
      y: mouseEvent.clientY - activeNodeRect.top,
    };
    return {
      ...transform,
      x: transform.x + initialCursorOffset.x - 80,
      y: transform.y + initialCursorOffset.y - 45,
    };
  }
  return transform;
};
interface StoryboardViewProps {
  script: string;
  assets: Asset[];
  frames: StoryboardFrame[];
  globalStyle: string;
  customStylePrompts: Record<string, string>;
  onGlobalStyleChange: (style: string) => void;
  onFramesChange: (frames: StoryboardFrame[] | ((prev: StoryboardFrame[]) => StoryboardFrame[])) => void;
  onScriptChange: (script: string) => void;
  onOpenCustomStyleModal?: (editingName?: string) => void;
  onRemoveCustomStyle?: (name: string) => void;
}
export function StoryboardView({ script, assets, frames, globalStyle, customStylePrompts, onGlobalStyleChange, onFramesChange, onScriptChange, onOpenCustomStyleModal, onRemoveCustomStyle }: StoryboardViewProps) {
  const aspectRatio: '16:9' | '9:16' = '16:9';
  const [processingSceneIds, setProcessingSceneIds] = useState<Set<string>>(new Set());
  const [showAssistModal, setShowAssistModal] = useState(false);
  const [parsedScenes, setParsedScenes] = useState<ParsedScene[]>([]);
  const [frameToDeleteId, setFrameToDeleteId] = useState<string | null>(null);
  const [selectedSceneForAssist, setSelectedSceneForAssist] = useState<ParsedScene | null>(null);
  const [selectedSceneNumberForAssist, setSelectedSceneNumberForAssist] = useState<string>('');
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [autofillingIds, setAutofillingIds] = useState<Set<string>>(new Set());
  const [openMenuSceneId, setOpenMenuSceneId] = useState<string | null>(null);
  const [deletingSceneFramesId, setDeletingSceneFramesId] = useState<string | null>(null);
  const [pendingFrameReduction, setPendingFrameReduction] = useState<{ sceneId: string, targetCount: number, framesToDelete: StoryboardFrame[] } | null>(null);
  const [queueProgress, setQueueProgress] = useState<{ completed: number; total: number; failed: number } | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedGenIds, setFailedGenIds] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  const genAbortControllersRef = useRef<Set<AbortController>>(new Set());
  const cancelledGenRef = useRef<Set<string>>(new Set());
  // Fix #2: Keep a ref to frames so generateFrameVisual always reads current state
  const framesRef = useRef(frames);
  useEffect(() => { framesRef.current = frames; }, [frames]);
  const handleQueueStop = useCallback(() => {
    // Abort ALL active assist runs
    genAbortControllersRef.current.forEach(c => c.abort());
    genAbortControllersRef.current.clear();
    setGeneratingIds(new Set());
    setAutofillingIds(new Set());
    setProcessingSceneIds(new Set());
    setQueueProgress(null);
  }, []);
  const handleQueueDismiss = useCallback(() => setQueueProgress(null), []);
  // Close scene dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuSceneId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const selectedFrame = useMemo(() => 
    frames.find(f => f.id === selectedFrameId) || null
  , [frames, selectedFrameId]);
  const handleSelectFrame = (id: string | null) => {
    setSelectedFrameId(id);
  };
  const reindexFrames = (rawFrames: StoryboardFrame[]) => {
    const groups: Record<string, StoryboardFrame[]> = {};
    rawFrames.forEach(f => {
      const num = f.sceneNumber || '00';
      if (!groups[num]) groups[num] = [];
      groups[num].push(f);
    });
    const reindexed: StoryboardFrame[] = [];
    Object.keys(groups).sort().forEach(num => {
      groups[num].forEach((f, idx) => {
        reindexed.push({ ...f, shotNumber: (idx + 1).toString().padStart(2, '0') });
      });
    });
    return reindexed;
  };
  const performDelete = useCallback((id: string) => {
    onFramesChange(prev => reindexFrames(prev.filter(f => f.id !== id)));
    if (selectedFrameId === id) setSelectedFrameId(null);
    setFrameToDeleteId(null);
  }, [selectedFrameId, onFramesChange]);
  const handleDeleteAllFrames = (sceneId: string) => {
    onFramesChange(prev => reindexFrames(prev.filter(f => {
      // Orphan group: key format is 'orphan-scene-xxx', extract real sceneId
      if (sceneId.startsWith('orphan-')) {
        const realSceneId = sceneId.replace('orphan-', '');
        return f.sceneId !== realSceneId;
      }
      if (f.sceneId === sceneId) return false;
      return true;
    })));
    setDeletingSceneFramesId(null);
  };
  const initiateDelete = useCallback((id: string) => {
    setFrameToDeleteId(id);
  }, []);
  const addFrame = useCallback((sceneNumber?: string, sceneTitle?: string, sceneId?: string, shouldSelect = true) => {
    onFramesChange(prev => {
      let nextSceneNum = sceneNumber;
      let nextSceneTitle = sceneTitle;
      if (!nextSceneNum) {
        const currentNums = prev.map(f => parseInt(f.sceneNumber || '0')).filter(n => !isNaN(n));
        const max = currentNums.length > 0 ? Math.max(...currentNums) : 0;
        nextSceneNum = (max + 1).toString().padStart(2, '0');
        nextSceneTitle = nextSceneTitle || 'Untitled Scene';
      }
      nextSceneTitle = toTitleCase(nextSceneTitle || '');
      const sceneFrames = prev.filter(f => f.sceneNumber === nextSceneNum);
      const nextShotNum = (sceneFrames.length + 1).toString().padStart(2, '0');
      const locationAsset = assets.find(a => 
        a.type === 'location' && nextSceneTitle && 
        (nextSceneTitle.toLowerCase().includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(nextSceneTitle.toLowerCase()))
      );
      const newFrame: StoryboardFrame = {
        id: generateId(),
        sceneId: sceneId,
        sceneNumber: nextSceneNum,
        sceneTitle: nextSceneTitle,
        shotNumber: nextShotNum,
        title: 'New Shot',
        visualDescription: '',
        motionDescription: '',
        audioDescription: '',
        linkedAssetIds: locationAsset ? [locationAsset.id] : [],
        imageHistory: []
      };
      const updated = [...prev, newFrame];
      if (shouldSelect) {
        setSelectedFrameId(newFrame.id);
      }
      return updated;
    });
  }, [assets, onFramesChange]);
  const updateFrame = useCallback((id: string, updates: Partial<StoryboardFrame>) => {
    onFramesChange(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, [onFramesChange]);
  const getParsedScenesFromScript = useCallback(() => {
    const sceneRegex = /^(###\s+)(.*)$/im;
    const firstMatch = script.match(sceneRegex);
    if (!firstMatch) return [];
    const actualScript = script.slice(firstMatch.index || 0);
    const parts = actualScript.split(sceneRegex);
    const scenes: ParsedScene[] = [];
    let prevText = script.slice(0, firstMatch.index || 0);
    for (let i = 1; i < parts.length; i += 3) {
      const heading = (parts[i+1] || '').trim();
      const content = parts[i+2]?.trim() || '';
      if (!heading) continue;
      const idMatch = prevText.match(/<!--\s*scene-id:\s*([a-zA-Z0-9_-]+)\s*-->\s*$/i);
      // Use persisted ID if present; otherwise generate a stable UUID.
      // The ID injection effect below will write it back into the script.
      const sceneId = idMatch ? idMatch[1] : `unpersisted-${(i - 1) / 3}-${heading.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
      const paragraphs = content.split(/\x0a\x0a+/).filter(p => p.trim().length > 0);
      let beatCount = 0;
      paragraphs.forEach(p => {
        const lines = p.split('\x0a').filter(l => l.trim().length > 0);
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
            beatCount += 1;
          } else {
            const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 2);
            if (sentences.length > 0) {
              beatCount += Math.max(1, Math.ceil(sentences.length / 4));
            }
          }
        });
      });
      const suggestedCount = Math.min(Math.max(Math.ceil(beatCount / 2), 3), 6);
      scenes.push({ id: sceneId, title: heading, content, suggestedFrameCount: suggestedCount });
      prevText = content;
    }
    return scenes;
  }, [script]);
  // ID Injection: if any scenes lack persisted IDs (unpersisted-*), generate
  // stable UUIDs and write them into the script text. This is a fallback for
  // scripts that arrive without ID comments (imported text, AI-generated, etc.).
  // The Tiptap editor handles this natively via the CustomHeading plugin.
  useEffect(() => {
    const parsed = getParsedScenesFromScript();
    const scenesNeedingIds = parsed.filter(s => isUnpersistedSceneId(s.id));
    if (scenesNeedingIds.length > 0) {
      // Inject <!-- scene-id: xxx --> comments using line-by-line processing
      // to correctly handle duplicate-titled headings (regex .replace() would
      // always match the first occurrence, stacking IDs on the wrong heading).
      const lines = script.split('\x0a');
      const newLines: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^###\s+/.test(line)) {
          // Walk backward to find the actual non-empty previous line
          // (there may be blank lines between the ID comment and the heading)
          let prevLine = '';
          for (let j = newLines.length - 1; j >= 0; j--) {
            if (newLines[j].trim() !== '') {
              prevLine = newLines[j].trim();
              break;
            }
          }
          if (!/<!--\s*scene-id:/.test(prevLine)) {
            const newId = generateId();
            newLines.push(`<!-- scene-id: ${newId} -->`);
          }
        }
        newLines.push(line);
      }
      const updatedScript = newLines.join('\x0a');
      if (updatedScript !== script) {
        onScriptChange(updatedScript);
        return; // Wait for the re-run with IDs injected
      }
    }
    setParsedScenes(parsed);
    onFramesChange(prev => {
      // Pure ID-based matching — no title or position fallbacks needed
      let hasUpdates = false;
      const updatedExisting = prev.map(f => {
        const scene = parsed.find(s => f.sceneId === s.id);
        if (scene) {
          const num = (parsed.indexOf(scene) + 1).toString().padStart(2, '0');
          // Only create a new object if values actually changed
          if (f.sceneTitle !== scene.title || f.sceneNumber !== num) {
            hasUpdates = true;
            return { ...f, sceneId: scene.id, sceneTitle: scene.title, sceneNumber: num };
          }
        }
        return f; // Unchanged or orphaned
      });
      // One-time migration for legacy frames with unpersisted-* IDs:
      // Try to match them to a scene by title or position, then lock in the new ID.
      const parsedSceneIdSet = new Set(parsed.map(s => s.id));
      const migratedFrames = updatedExisting.map(f => {
        if (!isUnpersistedSceneId(f.sceneId)) return f; // Already has a stable ID
        if (parsedSceneIdSet.has(f.sceneId)) return f; // Already matched
        // Try title match
        const byTitle = parsed.find(s => s.title.toLowerCase() === f.sceneTitle?.toLowerCase());
        if (byTitle) {
          hasUpdates = true;
          const num = (parsed.indexOf(byTitle) + 1).toString().padStart(2, '0');
          return { ...f, sceneId: byTitle.id, sceneTitle: byTitle.title, sceneNumber: num };
        }
        // Try position match
        const sceneIdx = parseInt(f.sceneNumber, 10) - 1;
        if (!isNaN(sceneIdx) && sceneIdx >= 0 && sceneIdx < parsed.length) {
          hasUpdates = true;
          const byPos = parsed[sceneIdx];
          const num = (sceneIdx + 1).toString().padStart(2, '0');
          return { ...f, sceneId: byPos.id, sceneTitle: byPos.title, sceneNumber: num };
        }
        return f;
      });
      // Auto-prune orphan frames: if a scene was deleted from the script,
      // remove its frames ONLY if ALL frames for that scene are empty.
      // If ANY frame has content (images, descriptions), keep the entire scene.
      const orphanSceneIds = new Set(
        migratedFrames.filter(f => f.sceneId && !parsedSceneIdSet.has(f.sceneId)).map(f => f.sceneId as string)
      );
      const orphanScenesWithContent = new Set<string>();
      orphanSceneIds.forEach(sceneId => {
        const sceneFrames = migratedFrames.filter(f => f.sceneId === sceneId);
        const anyHasContent = sceneFrames.some(f => f.imageUrl || f.visualDescription || f.audioDescription || f.motionDescription);
        if (anyHasContent) orphanScenesWithContent.add(sceneId);
      });
      const prunedFrames = migratedFrames.filter(f => {
        if (!f.sceneId) return true; // Keep frames without sceneId (e.g. manually added)
        if (parsedSceneIdSet.has(f.sceneId)) return true; // Active scene — keep
        return orphanScenesWithContent.has(f.sceneId); // Keep entire scene if any frame has content
      });
      if (prunedFrames.length !== migratedFrames.length) hasUpdates = true;
      const sceneIdsWithFrames = new Set(prunedFrames.map(f => f.sceneId).filter(Boolean));
      const newPlaceholders: StoryboardFrame[] = [];
      parsed.forEach((scene, sceneIdx) => {
        if (!sceneIdsWithFrames.has(scene.id)) {
          const sceneNum = (sceneIdx + 1).toString().padStart(2, '0');
          const sceneTitle = toTitleCase(scene.title);
          for (let i = 0; i < scene.suggestedFrameCount; i++) {
            newPlaceholders.push({
              id: generateId(),
              sceneId: scene.id,
              sceneNumber: sceneNum,
              sceneTitle: sceneTitle,
              shotNumber: (i + 1).toString().padStart(2, '0'),
              title: `Shot ${i + 1}`,
              visualDescription: '',
              motionDescription: '',
              audioDescription: '',
              linkedAssetIds: [],
              imageHistory: []
            });
          }
        }
      });
      if (newPlaceholders.length > 0) return [...prunedFrames, ...newPlaceholders];
      if (hasUpdates) return prunedFrames;
      return prev;
    });
  }, [script, getParsedScenesFromScript, onFramesChange, onScriptChange]);
  const initializeSceneBreakdown = async (sceneId: string) => {
    const scene = parsedScenes.find(s => s.id === sceneId);
    if (!scene) return;
    setProcessingSceneIds(prev => { const next = new Set(prev); next.add(sceneId); return next; });
    try {
      const count = scene.suggestedFrameCount;
      const suggestions = await suggestSceneBreakdown(scene.title, scene.content, count);
      const sceneNum = (parsedScenes.indexOf(scene) + 1).toString().padStart(2, '0');
      const sceneTitle = toTitleCase(scene.title);
      const newFrames: StoryboardFrame[] = Array.from({ length: count }).map((_, i) => ({
        id: generateId(),
        sceneId: scene.id,
        sceneNumber: sceneNum,
        sceneTitle: sceneTitle,
        shotNumber: (i + 1).toString().padStart(2, '0'),
        title: suggestions?.[i]?.title || `Shot ${i + 1}`,
        visualDescription: '',
        motionDescription: '',
        audioDescription: '',
        linkedAssetIds: [],
        imageHistory: []
      }));
      onFramesChange(prev => {
        const others = prev.filter(f => f.sceneId !== sceneId);
        return [...others, ...newFrames];
      });
    } catch (e) { console.error(e); } finally { setProcessingSceneIds(prev => { const next = new Set(prev); next.delete(sceneId); return next; }); }
  };
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);
  // Cache for re-uploaded media IDs: maps stale mediaId -> fresh mediaId.
  // Shared across all frames in a batch so each asset is only re-uploaded once.
  const freshMediaIdCacheRef = useRef<Map<string, string>>(new Map());
  const generateFrameVisual = async (id: string, initialFrame?: StoryboardFrame, forcedStyle?: VisualStyle, signal?: AbortSignal) => {
    const f = initialFrame || framesRef.current.find(frame => frame.id === id);
    if (!f) return;
    setGeneratingIds(prev => new Set(prev).add(f.id));
    setFailedGenIds(prev => { const next = new Set(prev); next.delete(f.id); return next; });
    // Show toast for standalone single-frame generations (no signal = not part of a batch)
    const isSingleGeneration = !signal;
    if (isSingleGeneration) {
      // Add to existing queue if one is running, otherwise start a new 1/1 toast
      setQueueProgress(prev => prev
        ? { ...prev, total: prev.total + 1 }
        : { completed: 0, total: 1, failed: 0 }
      );
    }
    try {
      const activeAssets = assets.filter(a => f.linkedAssetIds.includes(a.id));
      const activeStyle = forcedStyle || globalStyle;
      const currentStyleCopy = customStylePrompts[activeStyle] || VISUAL_STYLE_PROMPTS[activeStyle] || VISUAL_STYLE_PROMPTS['3D-Animation'];
      const systemInstruction = `You are an expert at creating detailed image generation prompts for storyboard frames. Analyze frame description and assets to generate a comprehensive image prompt.
CRITICAL RULES:
1. ALWAYS include the location, prioritizing most specific.
2. For identified assets, copy its EXACT description - do NOT paraphrase.
3. Remove "[best guess]" markers.
4. Keep it focused, use proper sentence formatting.
Output format:
FrameDescription: [prose]
Locations: [Name]: [prose]
Characters: [Name]: [prose]
Props: [Name]: [prose]
## FRAME CONTEXT:
Scene: ${f.sceneTitle}
Visual: ${f.visualDescription}
Audio: ${f.audioDescription}
Style: ${activeStyle}
Script Excerpt: ${script.slice(0, 8000)}
## LINKED ASSETS:
Characters:
${assets.filter(a => a.type === 'character' && f.linkedAssetIds.includes(a.id))
  .map(a => `- ${a.name}: ${((a as CharacterAsset).physicalCharacteristics || '').replace(/\[best guess\]/gi, '').trim()} ${((a as CharacterAsset).clothingAccessories || '').replace(/\[best guess\]/gi, '').trim()}`)
  .join('\x0a') || 'None linked'}
Locations:
${assets.filter(a => a.type === 'location' && (f.linkedAssetIds.includes(a.id) || (f.sceneTitle?.toLowerCase() || '').includes(a.name.toLowerCase())))
  .map(a => `- ${a.name}: ${((a as LocationAsset).physicalCharacteristics || '').replace(/\[best guess\]/gi, '').trim()}`)
  .join('\x0a') || 'None linked'}
Props:
${assets.filter(a => a.type === 'prop' && f.linkedAssetIds.includes(a.id))
  .map(a => `- ${a.name}: ${((a as PropAsset).physicalCharacteristics || '').replace(/\[best guess\]/gi, '').trim()}`)
  .join('\x0a') || 'None linked'}`;
      const userPrompt = `Generate a comprehensive image generation prompt for the storyboard frame described above.`;
      // Check signal before expensive AI call
      if (signal?.aborted) return;
      const promptGenResponse: any = await withRetry(
        () => Flow.generate.text(userPrompt, { 
          systemInstruction,
          modelDisplayName: 'Gemini 3.0 Flash Preview',
          thinkingLevel: 'low'
        }),
        2,
        signal
      );
      // Check signal after AI call — if aborted mid-flight, bail without writing
      if (signal?.aborted) return;
      
      const styleAppend = `\x0a\x0aVisual Style: ${currentStyleCopy}`;
      const maxPromptLength = 3950; // Flow SDK limit is 4000, leave small buffer
      const availableForPrompt = Math.max(0, maxPromptLength - styleAppend.length);
      const truncatedPromptText = promptGenResponse.text.length > availableForPrompt
        ? promptGenResponse.text.slice(0, availableForPrompt - 3) + '...'
        : promptGenResponse.text;
      const finalEnhancedPrompt = `${truncatedPromptText}${styleAppend}`;
      // Collect reference image media IDs, preferring cached fresh IDs over potentially stale ones
      const referenceImageMediaIds: string[] = [];
      activeAssets.forEach(asset => {
        const bestRef = asset.supportingImages.find(img => img.id === asset.referenceImageId) || asset.supportingImages[0];
        if (bestRef?.mediaId) {
          // Use cached fresh ID if we already re-uploaded this asset in a previous frame
          const freshId = freshMediaIdCacheRef.current.get(bestRef.mediaId);
          referenceImageMediaIds.push(freshId || bestRef.mediaId);
        }
      });
      // Check signal before image generation (the most expensive call)
      if (signal?.aborted) return;
      const { blobUrl } = await (async () => {
        // SDK has no internal retries. Add 1 retry for transient errors.
        // Skip retries on timeouts (they'd just waste another 180s).
        const refs = referenceImageMediaIds;
        try {
          const result: any = await withRetry(
            () => Flow.generate.image({ 
              prompt: finalEnhancedPrompt, 
              aspectRatio,
              referenceImageMediaIds: refs.length > 0 ? refs : undefined,
              modelDisplayName: '🍌 Nano Banana 2'
            }),
            1,
            signal
          );
          const url = await base64ToBlobUrl(result.base64, result.mimeType);
          (result as any).base64 = null;
          return { blobUrl: url };
        } catch (refErr: any) {
          // If the error is due to stale/expired media IDs (e.g. after project reload),
          // re-upload asset images from local blob URLs to get fresh IDs, then retry.
          // Fresh IDs are cached so subsequent frames reuse them without re-uploading.
          const msg = (refErr?.message || '').toLowerCase();
          if (refs.length > 0 && (msg.includes('not found') || msg.includes('media item'))) {
            console.warn(`Stale reference image IDs detected, re-uploading asset images: ${refErr.message}`);
            const freshRefs: string[] = [];
            for (const asset of activeAssets) {
              if (signal?.aborted) break;
              const bestRef = asset.supportingImages.find(img => img.id === asset.referenceImageId) || asset.supportingImages[0];
              if (!bestRef?.mediaId || !bestRef?.dataUrl) continue;
              // Skip if we already have a cached fresh ID for this exact mediaId
              const alreadyCached = freshMediaIdCacheRef.current.get(bestRef.mediaId);
              if (alreadyCached) {
                freshRefs.push(alreadyCached);
                continue;
              }
              try {
                // Fetch the blob from the local blob URL and convert to base64
                const res = await fetch(bestRef.dataUrl);
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
                // Cache the fresh ID so other frames skip the re-upload
                freshMediaIdCacheRef.current.set(bestRef.mediaId, upload.mediaId);
                freshRefs.push(upload.mediaId);
              } catch (uploadErr) {
                console.warn(`Failed to re-upload reference for ${asset.name}, skipping:`, uploadErr);
              }
            }
            if (signal?.aborted) throw new Error('Aborted');
            try {
              const result = await Flow.generate.image({ 
                prompt: finalEnhancedPrompt, 
                aspectRatio,
                referenceImageMediaIds: freshRefs.length > 0 ? freshRefs.slice(0, 5) : undefined,
                modelDisplayName: '🍌 Nano Banana 2'
              });
              const url = await base64ToBlobUrl(result.base64, result.mimeType);
              (result as any).base64 = null;
              return { blobUrl: url };
            } catch (retryErr: any) {
              // Cached fresh IDs may also have expired (very long sessions).
              // Evict them so the next frame re-uploads instead of reusing stale cache.
              for (const fId of freshRefs) {
                for (const [oldId, cachedId] of freshMediaIdCacheRef.current.entries()) {
                  if (cachedId === fId) freshMediaIdCacheRef.current.delete(oldId);
                }
              }
              // Fall back to generation without references
              const result = await Flow.generate.image({ 
                prompt: finalEnhancedPrompt, 
                aspectRatio,
                modelDisplayName: '🍌 Nano Banana 2'
              });
              const url = await base64ToBlobUrl(result.base64, result.mimeType);
              (result as any).base64 = null;
              return { blobUrl: url };
            }
          }
          // If the SDK timed out specifically because of reference image processing
          // (the HTTP request returned 200 but the SDK's internal timer fired first),
          // retry once without references as a last resort — a degraded image is
          // better than no image at all.
          const isTimeout = msg.includes('timed out') || msg.includes('timeout');
          if (refs.length > 0 && isTimeout) {
            console.warn(`Reference-based generation timed out, retrying without references: ${refErr.message}`);
            const result = await Flow.generate.image({ 
              prompt: finalEnhancedPrompt, 
              aspectRatio,
              modelDisplayName: '🍌 Nano Banana 2'
            });
            const url = await base64ToBlobUrl(result.base64, result.mimeType);
            (result as any).base64 = null;
            return { blobUrl: url };
          }
          throw refErr; // Re-throw non-reference errors
        }
      })();
      // Snapshot cancel state before checking abort — prevents race where
      // signal aborts between the two checks, skipping the cancel cleanup
      const wasCancelled = cancelledGenRef.current.has(id);
      if (wasCancelled) cancelledGenRef.current.delete(id);
      // Final check: if aborted while image was generating, revoke blob and bail
      if (signal?.aborted) {
        if (blobUrl?.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
        return;
      }
      // Check if user cancelled this specific item while it was in-flight
      if (wasCancelled) {
        if (blobUrl?.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
        return;
      }
      if (!isMountedRef.current) return;
      onFramesChange(prev => prev.map(frame => {
        if (frame.id !== id) return frame;
        const oldHistory = frame.imageHistory || [];
        const newHistory = [blobUrl, ...oldHistory];
        return { ...frame, imageUrl: blobUrl, imageHistory: newHistory };
      }));
      setQueueProgress(prev => prev ? { ...prev, completed: prev.completed + 1 } : null);
    } catch (err: any) {
      // Don't log abort-related errors or mark as failed if user cancelled
      if (signal?.aborted || err?.message === 'Aborted') return;
      console.error(err);
      if (!isMountedRef.current) return;
      setFailedGenIds(prev => new Set(prev).add(id));
      setQueueProgress(prev => prev ? { ...prev, failed: prev.failed + 1 } : null);
    } finally {
      if (isMountedRef.current) setGeneratingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      cancelledGenRef.current.delete(id);
    }
  };
  const handleStopGenerate = (id: string) => {
    cancelledGenRef.current.add(id);
    setGeneratingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    // Don't add to failedGenIds — this was intentional, not a failure
  };
  const handleGenerateFromAssist = async (input?: string | { sceneId: string, frameCount: number }[], mode: 'all' | 'descriptions' | 'images' = 'all') => {
    setShowAssistModal(false);
    const assetLibraryContext = assets.map(a => `- ${a.name} (${a.type}) [id:${a.id}]`).join('\x0a');
    const systemInstruction = `You are an AI assistant that creates storyboard frames for screenplays. 
AVAILABLE ASSETS:
${assetLibraryContext}
GUIDELINES:
- Title: 3-4 words, human-readable.
- Frame Visual: 3-5 sentences describing the visual composition. Use CHARACTER NAMES (e.g. "Eva"), NOT asset IDs. Write naturally.
- Frame Audio: 2-4 sentences describing sound design. Use plain English, NO IDs.
- Frame Motion: 2-3 sentences describing camera movement. Use plain English, NO IDs.
- linkedAssetIds: An array of raw ID strings (the value inside the [id:...] markers, e.g. "a1b2c3d4"). Do NOT include the "[id:" prefix or "]" suffix.
CRITICAL: The frameVisual, frameAudio, and frameMotion fields must contain ONLY human-readable prose. NEVER include asset IDs, UUIDs, or bracketed identifiers in text fields. Reference characters, locations, and props by their NAMES only.
IMPORTANT: You MUST generate EXACTLY the number of frames requested.
Respond ONLY with valid JSON: { "frames": [{ "title", "frameVisual", "frameAudio", "frameMotion", "linkedAssetIds" }] }`;
    const targets: { sceneId: string, targetCount: number }[] = [];
    if (typeof input === 'string') {
      const scene = parsedScenes.find(s => s.id === input);
      const currentCount = frames.filter(f => f.sceneId === input).length;
      targets.push({ sceneId: input, targetCount: currentCount > 0 ? currentCount : (scene?.suggestedFrameCount || 3) });
    } else if (Array.isArray(input)) {
      input.forEach(sel => targets.push({ sceneId: sel.sceneId, targetCount: sel.frameCount }));
    } else {
      parsedScenes.forEach(scene => {
        const currentCount = frames.filter(f => f.sceneId === scene.id).length;
        targets.push({ sceneId: scene.id, targetCount: currentCount > 0 ? currentCount : scene.suggestedFrameCount });
      });
    }
    
    const framesToGen: StoryboardFrame[] = [];
    const targetSceneIds = new Set(targets.map(t => t.sceneId));
    // Each run gets its own controller — concurrent runs coexist
    // Declared outside try/catch so it's accessible in the finally block
    const abortController = new AbortController();
    genAbortControllersRef.current.add(abortController);
    setProcessingSceneIds(prev => {
      const next = new Set(prev);
      targetSceneIds.forEach(id => next.add(id));
      return next;
    });
    try {
      if (mode !== 'images') {
        // Mark ALL existing frames across ALL target scenes as autofilling upfront
        const allTargetFrameIds = targets.flatMap(target => {
          return frames
            .filter(f => f.sceneId === target.sceneId)
            .map(f => f.id);
        });
        if (allTargetFrameIds.length > 0) {
          // Accumulate into existing autofilling IDs so concurrent runs don't clobber each other
          setAutofillingIds(prev => {
            const next = new Set(prev);
            allTargetFrameIds.forEach(id => next.add(id));
            return next;
          });
        }
        for (const target of targets) {
          // Abort check: if user stopped the queue, bail out of the metadata loop
          if (abortController.signal.aborted) break;
          const scene = parsedScenes.find(s => s.id === target.sceneId);
          if (!scene) continue;
          const existingSceneFrameIds = frames
            .filter(f => f.sceneId === scene.id)
            .map(f => f.id);
          const currentSceneNum = (parsedScenes.indexOf(scene) + 1).toString().padStart(2, '0');
          try {
            // Per-scene systemInstruction includes the full scene content (no char limit)
            // so we don't have to truncate at 1500 chars and risk losing important context
            const sceneSystemInstruction = `${systemInstruction}\x0a\x0a## SCENE TO BREAK DOWN:\x0aSCENE TITLE: ${scene.title}\x0aSCENE CONTENT:\x0a${scene.content}`;
            const userPrompt = `Create a visual storyboard breakdown with EXACTLY ${target.targetCount} shots for the scene described above.`;
            const response: any = await withRetry(
              () => Flow.generate.text(userPrompt, { systemInstruction: sceneSystemInstruction, modelDisplayName: 'Gemini 3.0 Flash Preview', thinkingLevel: 'low' }),
              2,
              abortController.signal
            );
            // Abort check after AI call — if cancelled mid-flight, don't write stale state
            if (abortController.signal.aborted) break;
            const jsonMatch = response.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              console.warn(`Scene "${scene.title}": AI response did not contain valid JSON, skipping`);
              // Clear stuck autofilling loaders for this scene's existing frames
              setAutofillingIds(prev => {
                const next = new Set(prev);
                existingSceneFrameIds.forEach(id => next.delete(id));
                return next;
              });
              continue;
            }
            const parsed = JSON.parse(jsonMatch[0]);
            if (isMountedRef.current && parsed && parsed.frames) {
              const mappedFrames = parsed.frames.slice(0, target.targetCount).map((f: any, index: number) => ({
                id: generateId(), sceneId: scene!.id, sceneNumber: currentSceneNum, sceneTitle: toTitleCase(scene!.title),
                shotNumber: (index + 1).toString().padStart(2, '0'), title: f.title || 'Untitled Shot',
                visualDescription: f.frameVisual || '', audioDescription: f.frameAudio || '', motionDescription: f.frameMotion || '',
                linkedAssetIds: Array.isArray(f.linkedAssetIds) ? f.linkedAssetIds : [], imageHistory: []
              }));
              framesToGen.push(...mappedFrames);
              // Clear autofilling for old frames, they're being replaced
              setAutofillingIds(prev => {
                const next = new Set(prev);
                existingSceneFrameIds.forEach(id => next.delete(id));
                return next;
              });
              onFramesChange(prev => {
                const others = prev.filter(p => p.sceneId !== scene!.id);
                return [...others, ...mappedFrames];
              });
              // Pre-mark these frames as generating NOW so loaders appear immediately
              // instead of waiting for the entire scene loop to finish
              // Only do this when images will actually be generated
              if (mode !== 'descriptions') {
                setGeneratingIds(prev => {
                  const next = new Set(prev);
                  mappedFrames.forEach(f => next.add(f.id));
                  return next;
                });
              }
            }
          } catch (sceneErr: any) {
            // Don't log abort-related errors
            if (!abortController.signal.aborted) {
              console.error(`Scene "${scene.title}" text generation failed:`, sceneErr);
            }
            // Clear stuck autofilling loaders for this scene's existing frames
            setAutofillingIds(prev => {
              const next = new Set(prev);
              existingSceneFrameIds.forEach(id => next.delete(id));
              return next;
            });
            // Mark existing frames as failed so the user sees visual feedback
            if (existingSceneFrameIds.length > 0) {
              setFailedGenIds(prev => {
                const next = new Set(prev);
                existingSceneFrameIds.forEach(id => next.add(id));
                return next;
              });
            }
            // Continue to next scene — don't kill the entire pipeline
          }
      }
      } else {
        // mode === 'images': collect existing frames for the targeted scenes
        for (const target of targets) {
          const scene = parsedScenes.find(s => s.id === target.sceneId);
          if (!scene) continue;
          const existingFrames = frames.filter(f => f.sceneId === scene.id);
          framesToGen.push(...existingFrames);
        }
      }
      // Phase 2: Image generation (reuses the same abort controller)
      if (mode !== 'descriptions' && framesToGen.length > 0 && !abortController.signal.aborted) {
        setGeneratingIds(prev => {
          const next = new Set(prev);
          framesToGen.forEach(f => next.add(f.id));
          return next;
        });
        // Clear stale reference ID cache from any previous batch run
        freshMediaIdCacheRef.current.clear();
        // Accumulate into existing queue progress so concurrent runs share one toast
        setQueueProgress(prev => prev
          ? { ...prev, total: prev.total + framesToGen.length }
          : { completed: 0, total: framesToGen.length, failed: 0 }
        );
        // Run frames through a lightweight concurrency pool (2 at a time).
        // No semaphore/slot management — each frame fires its API calls directly.
        // Concurrency tuned to 2 to reduce server-side contention and 180s SDK timeouts,
        // while still being faster than fully serial processing.
        await runRollingQueue(
          framesToGen,
          async (frame, signal) => {
            await generateFrameVisual(frame.id, frame, globalStyle, signal);
          },
          2,
          abortController.signal,
          () => {}, // progress tracked per-frame inside generateFrameVisual
          false     // no slot management — API calls fire directly
        );
      }
    } catch (err) { console.error(err); } finally {
      // Remove this run's controller
      genAbortControllersRef.current.delete(abortController);
      if (isMountedRef.current) {
        setProcessingSceneIds(prev => {
          const next = new Set(prev);
          targetSceneIds.forEach(id => next.delete(id));
          return next;
        });
        // Only clear autofilling IDs owned by THIS run (not a global reset)
        const allTargetFrameIds = new Set(
          targets.flatMap(target => {
            return framesRef.current
              .filter(f => f.sceneId === target.sceneId)
              .map(f => f.id);
          })
        );
        setAutofillingIds(prev => {
          const next = new Set(prev);
          allTargetFrameIds.forEach(id => next.delete(id));
          return next;
        });
        // Only clear generating IDs that this pipeline owns — don't wipe
        // manually-triggered generations that may be running concurrently
        const pipelineIds = new Set(framesToGen.map(f => f.id));
        setGeneratingIds(prev => {
          if (pipelineIds.size === 0) return prev;
          const next = new Set(prev);
          pipelineIds.forEach(id => next.delete(id));
          return next;
        });
      }
    }
  };
  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
  const handleDragCancel = () => setActiveId(null);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      onFramesChange(prev => {
        const activeFrame = prev.find(f => f.id === active.id);
        const overFrame = prev.find(f => f.id === over.id);
        if (!activeFrame || !overFrame) return prev;
        let nextFrames: StoryboardFrame[] = [];
        if (activeFrame.sceneNumber === overFrame.sceneNumber) {
          const sceneFrames = prev.filter(f => f.sceneNumber === activeFrame.sceneNumber);
          const otherFrames = prev.filter(f => f.sceneNumber !== activeFrame.sceneNumber);
          const oldIdx = sceneFrames.findIndex(f => f.id === active.id);
          const newIdx = sceneFrames.findIndex(f => f.id === over.id);
          const sortedSceneFrames = arrayMove(sceneFrames, oldIdx, newIdx);
          const sceneOrder = Array.from(new Set(prev.map(f => f.sceneNumber)));
          sceneOrder.forEach(num => {
            if (num === activeFrame.sceneNumber) nextFrames.push(...sortedSceneFrames);
            else nextFrames.push(...otherFrames.filter(f => f.sceneNumber === num));
          });
        } else {
          const updatedActiveFrame = { ...activeFrame, sceneNumber: overFrame.sceneNumber, sceneTitle: overFrame.sceneTitle, sceneId: overFrame.sceneId };
          const filtered = prev.filter(f => f.id !== active.id);
          const overIdx = filtered.findIndex(f => f.id === over.id);
          nextFrames = [...filtered];
          nextFrames.splice(overIdx, 0, updatedActiveFrame);
        }
        return reindexFrames(nextFrames);
      });
    }
  };
  const groupedFrames = useMemo(() => {
    const groups: { [key: string]: StoryboardFrame[] } = {};
    parsedScenes.forEach((scene, index) => {
      const num = (index + 1).toString().padStart(2, '0');
      const key = `${num}|||${toTitleCase(scene.title)}|||${scene.id}`;
      if (!groups[key]) groups[key] = [];
    });
    // Include frames belonging to current scenes, plus orphan scenes with content
    const parsedSceneIds = new Set(parsedScenes.map(s => s.id));
    // Pre-compute which orphan sceneIds have any content (scene-level decision)
    const orphanSceneIdsWithContent = new Set<string>();
    frames.forEach(f => {
      if (!f.sceneId) return;
      if (parsedSceneIds.has(f.sceneId)) return;
      if (f.imageUrl || f.visualDescription || f.audioDescription || f.motionDescription) {
        orphanSceneIdsWithContent.add(f.sceneId);
      }
    });
    [...frames].forEach(f => {
      const scene = parsedScenes.find(s => f.sceneId === s.id);
      if (scene) {
        // Active scene — group normally
        const num = (parsedScenes.indexOf(scene) + 1).toString().padStart(2, '0');
        const title = toTitleCase(scene.title);
        const key = `${num}|||${title}|||${scene.id}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(f);
      } else if (f.sceneId && orphanSceneIdsWithContent.has(f.sceneId)) {
        // Orphan scene with content — show ALL its frames (including empty ones)
        const title = toTitleCase(f.sceneTitle || 'Deleted Scene');
        const key = `99|||${title} (Removed)|||orphan-${f.sceneId}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(f);
      }
      // Orphan scene with NO content — skip entirely (auto-pruned)
    });
    return Object.entries(groups).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  }, [frames, parsedScenes]);
  const orderedFramesWithImages = useMemo(() => {
    const result: StoryboardFrame[] = [];
    groupedFrames.forEach(([_, sceneFrames]) => {
      sceneFrames.forEach(f => {
        if (f.imageUrl) {
          result.push(f);
        }
      });
    });
    return result;
  }, [groupedFrames]);
  const activeFrame = useMemo(() => frames.find(f => f.id === activeId), [frames, activeId]);
  return (
    <div className="flex h-full w-full text-white overflow-hidden font-sans">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex overflow-hidden">
          <main 
            className="flex-1 overflow-y-auto refined-scrollbar"
            onClick={() => handleSelectFrame(null)}
          >
            <div className="h-full py-6 px-6">
              {!(script.trim() === '' || assets.length === 0) ? (
                <>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
                    <div className="space-y-12 pb-32">
                      {groupedFrames.map(([key, sceneFrames]) => {
                        const [num, title, keySceneId] = key.split('|||');
                        const isOrphanScene = keySceneId.startsWith('orphan-');
                        return (
                          <SortableContext key={key} items={sceneFrames.map(f => f.id)} strategy={rectSortingStrategy}>
                            <div className="space-y-4">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-0" onClick={e => e.stopPropagation()}>
                                <div className="flex flex-col gap-0.5 max-w-full">
                                  {isOrphanScene ? (
                                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#DADCE0]/[0.48]">
                                      <Icon name="warning" size={13} className="opacity-60" />
                                      Removed
                                    </span>
                                  ) : (
                                    <span className="text-[13px] font-medium text-[#DADCE0]/[0.48]">Scene {String(num).padStart(2, '0')}</span>
                                  )}
                                  <h2 className="text-[20px] font-medium text-white/90 truncate">{title}</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                  {isOrphanScene ? (
                                    /* Orphan scenes: only show delete button */
                                    <button
                                      onClick={() => {
                                        setDeletingSceneFramesId(key);
                                      }}
                                      className="px-3 py-[0.4rem] rounded-[40px] bg-[#DADCE0]/[0.08] border border-[#DADCE0]/[0.12] text-[#DADCE0]/[0.64] text-[13px] font-bold hover:bg-[#DADCE0]/[0.16] hover:text-white/80 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
                                    >
                                      <Icon name="delete" size={18} className="opacity-60" />
                                      Delete all frames
                                    </button>
                                  ) : (
                                  <>
                                  {/* 1. Frames Dropdown */}
                                  <div className="flex items-center gap-2">
                                    <input 
                                      key={sceneFrames.length}
                                      type="number"
                                      min="1"
                                      max="20"
                                      defaultValue={sceneFrames.length}
                                      onInput={(e) => {
                                        if (e.currentTarget.value.length > 2) {
                                          e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (isNaN(val)) return;
                                        let targetCount = val;
                                        if (val > 20) {
                                          setToastMessage("Maximum 20 frames per scene");
                                          targetCount = 20;
                                        } else if (val < 1) {
                                          targetCount = 1;
                                        }
                                        const currentCount = sceneFrames.length;
                                        const scene = parsedScenes.find(s => s.id === keySceneId);
                                        
                                        if (targetCount > currentCount) {
                                          for (let i = 0; i < targetCount - currentCount; i++) addFrame(num, title, scene?.id, false);
                                        } else if (targetCount < currentCount) {
                                          const framesToDelete = sceneFrames.slice(targetCount);
                                          const hasContent = framesToDelete.some(f => f.imageUrl || f.visualDescription || f.audioDescription || f.motionDescription);
                                          
                                          if (hasContent) {
                                            setPendingFrameReduction({ sceneId: scene?.id || '', targetCount, framesToDelete });
                                          } else {
                                            const removeIds = new Set(framesToDelete.map(r => r.id));
                                            onFramesChange(prev => reindexFrames(prev.filter(f => !removeIds.has(f.id))));
                                          }
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      className="w-14 bg-transparent border border-[#DADCE0]/[0.40] rounded-[8px] py-[0.4rem] px-2 text-[12px] text-white/90 focus:outline-none font-sans transition-all text-center"
                                    />
                                    <span className="text-[12px] text-[#DADCE0]/[0.48] font-sans">frames</span>
                                  </div>
                                  {/* 2. Autofill Scene Button */}
                                  <button
                                    onClick={() => {
                                      const scene = parsedScenes.find(s => s.id === keySceneId);
                                      if (scene) handleGenerateFromAssist(scene.id);
                                    }}
                                    disabled={(() => {
                                      const scene = parsedScenes.find(s => s.id === keySceneId);
                                      return scene ? processingSceneIds.has(scene.id) : false;
                                    })()}
                                    className="px-3 py-[0.4rem] rounded-[40px] bg-[#DADCE0]/[0.72] text-black/90 text-[13px] font-bold hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95 whitespace-nowrap"
                                  >
                                    {(() => {
                                      const scene = parsedScenes.find(s => s.id === keySceneId);
                                      return scene && processingSceneIds.has(scene.id)
                                        ? <Loader2 size={20} className="animate-spin text-black/90" />
                                        : <Icon name="astrophotography_mode" size={20} invert={false} className="opacity-90" />;
                                    })()}
                                    Autofill Scene
                                  </button>
                                  {/* 3. Three-dot Menu */}
                                  <div className="relative">
                                    <button
                                      onClick={() => setOpenMenuSceneId(openMenuSceneId === key ? null : key)}
                                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                        openMenuSceneId === key ? 'bg-[#DADCE0]/[0.08]' : 'hover:bg-[#DADCE0]/[0.08]'
                                      }`}
                                    >
                                      <Icon name="more_vert" size={20} className={openMenuSceneId === key ? 'opacity-100' : 'opacity-[0.48] hover:opacity-100 transition-opacity'} />
                                    </button>
                                    {openMenuSceneId === key && (
                                      <div 
                                        ref={menuRef}
                                        className="absolute top-full mt-2 right-0 w-[200px] bg-[#000000] border border-[#DADCE0]/[0.24] rounded-xl shadow-2xl overflow-hidden z-50 animate-dropdown origin-top-right py-1.5"
                                      >
                                        <button
                                          onClick={() => {
                                            const scene = parsedScenes.find(s => s.id === keySceneId);
                                            addFrame(num, title, scene?.id);
                                            setOpenMenuSceneId(null);
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                          <Icon name="add" size={20} className="opacity-[0.48]" />
                                          Add Frame
                                        </button>
                                        <button
                                          onClick={() => {
                                            const scene = parsedScenes.find(s => s.id === keySceneId);
                                            if (scene) handleGenerateFromAssist(scene.id, 'descriptions');
                                            setOpenMenuSceneId(null);
                                          }}
                                          disabled={(() => {
                                            const scene = parsedScenes.find(s => s.id === keySceneId);
                                            return scene ? processingSceneIds.has(scene.id) : false;
                                          })()}
                                          className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors disabled:opacity-50"
                                        >
                                          <Icon name="notes" size={20} className="opacity-[0.48]" />
                                          Autofill descriptions
                                        </button>
                                        <button
                                          onClick={() => {
                                            const scene = parsedScenes.find(s => s.id === keySceneId);
                                            if (scene) handleGenerateFromAssist(scene.id, 'images');
                                            setOpenMenuSceneId(null);
                                          }}
                                          disabled={(() => {
                                            const scene = parsedScenes.find(s => s.id === keySceneId);
                                            return scene ? processingSceneIds.has(scene.id) : false;
                                          })()}
                                          className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors disabled:opacity-50"
                                        >
                                          <Icon name="image" size={20} className="opacity-[0.48]" />
                                          Autocreate images
                                        </button>
                                        <div className="h-px bg-white/5 my-1 mx-2" />
                                        <button
                                          onClick={() => {
                                            setDeletingSceneFramesId(key);
                                            setOpenMenuSceneId(null);
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                          <Icon name="delete" size={20} className="opacity-[0.48]" />
                                          Delete all frames
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  </>
                                  )}
                                </div>
                              </div>
                              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                                {sceneFrames.map(frame => (
                                  <SortableFrame key={frame.id} id={frame.id}>
                                    <FrameCard frame={frame} aspectRatio={aspectRatio} isActive={selectedFrameId === frame.id} onClick={() => handleSelectFrame(frame.id)} onDelete={initiateDelete} onGenerate={(id) => generateFrameVisual(id, undefined, globalStyle)} isGenerating={generatingIds.has(frame.id)} isAutofilling={autofillingIds.has(frame.id)} generationFailed={failedGenIds.has(frame.id)} onStop={() => handleStopGenerate(frame.id)} onDismissFailure={() => setFailedGenIds(prev => { const next = new Set(prev); next.delete(frame.id); return next; })} onExpand={frame.imageUrl ? () => {
                                      const idx = orderedFramesWithImages.findIndex(f => f.id === frame.id);
                                      if (idx >= 0) setLightboxIndex(idx);
                                    } : undefined} />
                                  </SortableFrame>
                                ))}
                                {sceneFrames.length === 0 && (
                                  <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                    <div className="mb-6 opacity-[0.24]">
                                      <Icon name="movie" size={64} />
                                    </div>
                                    <p className="text-[14px] font-medium text-[#DADCE0]/[0.48] font-sans">No frames in this scene</p>
                                    <button 
                                      onClick={() => {
                                        const scene = parsedScenes.find(s => s.id === keySceneId);
                                        addFrame(num, title, scene?.id);
                                      }}
                                      className="mt-4 px-3 py-[0.4rem] rounded-[40px] border border-[#DADCE0]/[0.40] text-white/90 text-[13px] font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                                    >
                                      <Icon name="add" size={20} className="opacity-[0.48]" />
                                      Create your first frame
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </SortableContext>
                        );
                      })}
                    </div>
                    <DragOverlay modifiers={[snapToCursor]} dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                      {activeFrame ? <div className="w-40 aspect-video rounded-xl bg-zinc-900 overflow-hidden border-2 border-white shadow-2xl opacity-90 scale-105 pointer-events-none">{activeFrame.imageUrl ? <img src={activeFrame.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-800"><Icon name="image" size={20} className="opacity-30" /></div>}</div> : null}
                    </DragOverlay>
                  </DndContext>
                </>
              ) : (
                <div className="absolute top-0 left-0 right-0 bottom-[160px] flex flex-col items-center justify-center pointer-events-none text-center p-6 font-sans">
                  <div className="mb-6">
                    <Icon name="dashboard_customize" size={64} className="opacity-[0.24]" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-4">Build your storyboard</h3>
                  <p className="text-[14px] text-[rgba(218,220,224,0.6)] max-w-sm leading-relaxed font-sans">
                    Create a Script and Asset before building your storyboard.
                  </p>
                </div>
              )}
            </div>
          </main>
          <div 
            className={`fixed top-[56px] bottom-0 right-0 z-[90] transition-all duration-300 ease-in-out md:relative md:top-0 md:z-50 md:border-l md:border-[#DADCE0]/[0.16] ${
              selectedFrame ? 'translate-x-0 w-full md:w-[420px]' : 'translate-x-full md:w-0'
            }`}
          >
            {selectedFrame && (
              <FrameEditPanel 
                frame={selectedFrame} 
                frames={frames} 
                assets={assets} 
                script={script} 
                style={globalStyle} 
                customStyleLibrary={customStylePrompts} 
                onStyleChange={onGlobalStyleChange} 
                aspectRatio={aspectRatio} 
                onUpdate={updateFrame} 
                onDelete={performDelete} 
                onGenerate={generateFrameVisual} 
                onSelectFrame={handleSelectFrame} 
                isGenerating={generatingIds.has(selectedFrame?.id || '')} 
                onOpenCustomStyleModal={onOpenCustomStyleModal} 
                onRemoveCustomStyle={onRemoveCustomStyle}
                onExpand={() => {
                  const idx = orderedFramesWithImages.findIndex(f => f.id === selectedFrame?.id);
                  if (idx >= 0) setLightboxIndex(idx);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {frameToDeleteId && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setFrameToDeleteId(null)}>
          <div className="bg-black border border-[rgba(218,220,224,0.15)] w-full max-w-[380px] rounded-[24px] p-6 pt-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <Icon name="delete" size={48} className="opacity-[0.24] mx-auto" />
            <div>
              <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">Delete frame?</h3>
              <p className="text-[14px] text-zinc-500 font-sans leading-relaxed">
                Do you want to delete "{frames.find(f => f.id === frameToDeleteId)?.title || 'this frame'}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFrameToDeleteId(null)} className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]">Cancel</button>
              <button 
                onClick={() => performDelete(frameToDeleteId!)} 
                className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 font-bold hover:bg-white transition-all font-sans text-[13px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {showAssistModal && <StoryboardAssistModal scene={selectedSceneForAssist} sceneNumber={selectedSceneNumberForAssist} onClose={() => { setShowAssistModal(false); setSelectedSceneForAssist(null); setSelectedSceneNumberForAssist(''); }} onGenerate={(selections, autoGen) => handleGenerateFromAssist(selections, autoGen ? 'all' : 'descriptions')} isProcessing={processingSceneIds.has(selectedSceneForAssist?.id || '')} />}
      
      <DeleteAllFramesModal 
        isOpen={!!deletingSceneFramesId}
        onClose={() => setDeletingSceneFramesId(null)}
        sceneTitle={deletingSceneFramesId ? deletingSceneFramesId.split('|||')[1] : ''}
        onConfirm={() => {
          if (!deletingSceneFramesId) return;
          const parts = deletingSceneFramesId.split('|||');
          const title = parts[1];
          const sceneId = parts[2];
          if (sceneId) handleDeleteAllFrames(sceneId);
        }}
      />
      {pendingFrameReduction && createPortal(
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto" onClick={() => setPendingFrameReduction(null)}>
          <div className="bg-black border border-[rgba(218,220,224,0.15)] w-full max-w-sm rounded-[24px] p-6 pt-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <Icon name="delete" size={48} className="opacity-[0.24] mx-auto" />
              <div>
                <h3 className="text-[18px] font-bold text-white font-sans tracking-tight mb-2">Delete populated frames?</h3>
                <p className="text-[14px] text-zinc-500 font-sans leading-relaxed">
                  Reducing the frame count will delete frames that have content (images or descriptions). This action cannot be undone.
                </p>
              </div>
              {/* Thumbnails of frames to delete */}
              <div className="flex flex-wrap justify-center gap-3 max-h-[120px] overflow-y-auto refined-scrollbar py-2">
                {pendingFrameReduction.framesToDelete.map(frame => (
                  <div key={frame.id} className="relative w-20 aspect-video rounded-lg overflow-hidden border border-white/10 bg-zinc-900 flex-shrink-0">
                    {frame.imageUrl ? (
                      <img src={frame.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Icon name="image" size={16} className="opacity-30" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white/70 text-center py-0.5">
                      {frame.shotNumber}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setPendingFrameReduction(null)}
                  className="flex-1 h-10 rounded-full border border-[#595959] text-[rgba(218,220,224,0.9)] font-bold hover:border-zinc-400 transition-all font-sans text-[13px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const { framesToDelete } = pendingFrameReduction;
                    const removeIds = new Set(framesToDelete.map(r => r.id));
                    onFramesChange(prev => reindexFrames(prev.filter(f => !removeIds.has(f.id))));
                    setPendingFrameReduction(null);
                  }}
                  className="flex-1 h-10 rounded-full bg-[#DADCE0]/[0.72] text-black/90 font-bold hover:bg-white transition-all font-sans text-[13px]"
                >
                  Delete Frames
                </button>
              </div>
          </div>
        </div>,
        document.getElementById('story-studio-modal-root') || document.body
      )}
      {queueProgress && queueProgress.total > 0 && (
        <GenerationQueueToast
          completed={queueProgress.completed}
          total={queueProgress.total}
          failed={queueProgress.failed}
          onStop={handleQueueStop}
          onDismiss={handleQueueDismiss}
        />
      )}
      {lightboxIndex !== null && (() => {
        return (
          <ImageLightbox
            items={orderedFramesWithImages.map(f => ({
              id: f.id,
              imageUrl: f.imageUrl!,
              label: f.title || `Frame ${f.shotNumber}`,
            }))}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        );
      })()}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] transition-all duration-300 opacity-100 translate-y-0">
          <div className="flex items-center gap-3 bg-black border border-[#DADCE0]/[0.24] rounded-2xl px-5 py-3 shadow-2xl">
            <svg width={16} height={16} viewBox="0 0 16 16" className="shrink-0 text-white">
              <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1z" fill="currentColor" />
            </svg>
            <span className="text-[13px] text-white font-sans">
              {toastMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}