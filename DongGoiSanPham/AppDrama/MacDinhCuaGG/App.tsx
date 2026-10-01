import React, { useState, useCallback, useEffect, Suspense, useRef } from 'react';
import { Flow } from 'flow-sdk';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Icon } from './components/Icon';
import { Asset, ScriptScene, StoryboardFrame } from './types';
import { suggestAssets, VISUAL_STYLE_PROMPTS } from './services/ai';
import { CustomStyleModal } from './components/CustomStyleModal';
import { ClearProjectModal } from './components/ClearProjectModal';
import { StyleSelector } from './components/StyleSelector';
import { toTitleCase, isAssetEmpty, findOrphanedAssets } from './services/utils';
// Lazy-load each view so a crash in one doesn't take down the whole app
const ScriptView = React.lazy(() => import('./components/ScriptView').then(m => ({ default: m.ScriptView })));
const AssetsView = React.lazy(() => import('./components/AssetsView').then(m => ({ default: m.AssetsView })));
const StoryboardView = React.lazy(() => import('./components/StoryboardView').then(m => ({ default: m.StoryboardView })));
const EditableTitle: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    onChange(e.target.value.trim() || 'Untitled Story');
  };
  const commit = () => {
    setEditing(false);
    if (!draft.trim()) {
      setDraft(value);
      onChange(value);
    }
  };
  if (!editing) {
    return (
      <h2
        onClick={() => setEditing(true)}
        className="text-[18px] font-medium text-white tracking-tight font-sans truncate cursor-text hover:bg-white/5 rounded-md px-1.5 -mx-1.5 transition-colors"
      >
        {toTitleCase(value)}
      </h2>
    );
  }
  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={handleChange}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === 'Enter') { e.currentTarget.blur(); }
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
      }}
      className="text-[18px] font-medium text-white tracking-tight font-sans bg-transparent outline-none px-1.5 -mx-1.5 w-full"
      autoFocus
    />
  );
};
interface StyleToast { id: string; styleName: string; dismissing?: boolean }
const StyleToastItem: React.FC<{ toast: StyleToast; index: number; onDismiss: (id: string) => void }> = ({ toast, index, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 50);
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);
    return () => { clearTimeout(enterTimer); clearTimeout(dismissTimer); };
  }, [toast.id, onDismiss]);
  return (
    <div
      className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ marginBottom: index > 0 ? 8 : 0 }}
    >
      <div className="flex items-center gap-3 bg-black border border-[#DADCE0]/[0.24] rounded-2xl px-5 py-3 shadow-2xl">
        <svg width={16} height={16} viewBox="0 0 16 16" className="shrink-0 text-white">
          <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1z" fill="currentColor" />
        </svg>
        <span className="text-[13px] text-white font-sans">
          Using <strong className="font-bold">{toast.styleName}</strong> for all future images
        </span>
      </div>
    </div>
  );
};
// Global styles injected via JS (Flow runtime does not support .css file imports)
const GLOBAL_STYLES = `
  :root {
    font-family: 'Google Sans Text', 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    color-scheme: dark;
    background-color: #000000;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: 0.1px;
  }
  .font-flex {
    font-family: 'Google Sans Flex', sans-serif;
    font-feature-settings: 'ss02';
  }
  .font-gsans {
    font-family: 'Google Sans', sans-serif;
  }
  .google-symbols {
    font-family: 'Google Symbols';
    font-weight: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }
  @keyframes dropdown-enter {
    from { opacity: 0; transform: scale(0.95) translateY(-5px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-dropdown { animation: dropdown-enter 0.15s ease-out forwards; }
  .dark-scrollbar::-webkit-scrollbar,
  .refined-scrollbar::-webkit-scrollbar {
    width: 6px; height: 6px;
  }
  .dark-scrollbar::-webkit-scrollbar-track,
  .refined-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .dark-scrollbar::-webkit-scrollbar-thumb,
  .refined-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1); border-radius: 10px;
  }
  .dark-scrollbar::-webkit-scrollbar-thumb:hover,
  .refined-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.2);
  }
  .ProseMirror { outline: none; }
  /* Show the "The scene begins..." placeholder ONLY when the editor is entirely empty */
  .ProseMirror p[data-placeholder]:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: rgba(255, 255, 255, 0.34);
    pointer-events: none;
    height: 0;
    white-space: nowrap;
  }
  .ProseMirror h1 { text-align: center; font-size: 18px; font-weight: 800; margin-top: 1.25em; margin-bottom: 1.25em; color: white; text-transform: uppercase; }
  .ProseMirror h1:first-child { margin-top: 0; }
  .ProseMirror h3 { font-size: 17px; font-weight: 800; margin-top: 1.25em; margin-bottom: 1.25em; color: white; text-transform: uppercase; letter-spacing: 0.05em; }
  .ProseMirror h3:first-child { margin-top: 0; }
  .ProseMirror h5 { text-align: right; text-transform: uppercase; color: #71717a; margin-top: 1.25em; margin-bottom: 1.25em; font-size: 16px; }
  .ProseMirror p { margin-top: 1.25em; margin-bottom: 1.25em; line-height: 1.6; font-size: 16px; color: #d4d4d8; }
  .ProseMirror strong { color: white; font-weight: 800; display: block; margin-top: 1.2rem; margin-bottom: 0; font-size: 16px; letter-spacing: 0.05em; text-transform: uppercase; text-align: center; }
  /* Character name (bold-only paragraph) — centered, collapse ALL spacing so dialogue sits directly below */
  .ProseMirror p:has(> strong:only-child) { margin-top: 1.25em; margin-bottom: 0 !important; padding-bottom: 0; text-align: center; }
  .ProseMirror p:has(> strong:only-child):first-child { margin-top: 0 !important; }
  .ProseMirror p:has(> strong:only-child) > strong { margin-top: 0; margin-bottom: 0; }
  /* Dialog line after character name — indented by 1 inch */
  .ProseMirror p:has(> strong:only-child) + p { margin-top: 0 !important; margin-bottom: 0.25rem; padding-left: 96px !important; padding-right: 96px !important; }
  
  /* Inline parenthetical (e.g. **VESPERA**_(purring)_) */
  .ProseMirror p:has(> strong + em) { margin-top: 1.25em; margin-bottom: 0 !important; padding-bottom: 0; text-align: center; }
  .ProseMirror p:has(> strong + em) + p { margin-top: 0 !important; margin-bottom: 0.25rem; padding-left: 96px; padding-right: 96px; }
  
  /* Parenthetical after character name — also tight */
  .ProseMirror p:has(> strong:only-child) + p:has(> em:only-child) { margin-bottom: 0 !important; text-align: center; padding-left: 96px; padding-right: 96px; }
  /* Dialogue line after parenthetical — indented */
  .ProseMirror p:has(> em:only-child) + p { margin-top: 0 !important; margin-bottom: 0.25rem; padding-left: 96px; padding-right: 96px; }
  .ProseMirror em { display: inline; opacity: 0.7; font-size: 16px; font-style: italic; margin-right: 4px; }
  .ProseMirror blockquote { background: rgba(234, 179, 8, 0.1); border-left: 4px solid #eab308; padding: 12px 20px; padding-right: 36px; margin: 1.25em 0; color: rgba(254, 240, 138, 0.9); font-style: italic; border-radius: 0 8px 8px 0; quotes: none !important; position: relative; }
  .ProseMirror blockquote::before, .ProseMirror blockquote p::before, .ProseMirror blockquote p::after,
  .prose blockquote p:first-of-type::before, .prose blockquote p:last-of-type::after { content: none !important; display: none !important; }
  .ProseMirror blockquote::after { content: '✕' !important; display: flex !important; position: absolute; top: 8px; right: 8px; width: 20px; height: 20px; align-items: center; justify-content: center; font-size: 11px; font-style: normal; color: rgba(254, 240, 138, 0.5); cursor: pointer; border-radius: 4px; transition: all 0.15s; }
  .ProseMirror blockquote:hover::after { color: rgba(254, 240, 138, 0.9); background: rgba(255, 255, 255, 0.08); }
  .ProseMirror blockquote p { margin: 0; quotes: none !important; }
  
  [data-scene-id], [id^="scene-"] { scroll-margin-top: 2rem; transition: background-color 0.8s ease; }
  .scene-flash { background-color: rgba(255, 255, 255, 0.08); border-radius: 4px; }
`;
const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
    Loading...
  </div>
);
function AppContent() {
  const [activeTab, setActiveTab] = useState<'script' | 'assets' | 'storyboard'>('script');
  const [projectTitle, setProjectTitle] = useState('Untitled Story');
  const [fullMarkdown, setFullMarkdown] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [frames, setFrames] = useState<StoryboardFrame[]>([]);
  const [globalStyle, setGlobalStyle] = useState('Realistic');
  const [customStyleLibrary, setCustomStyleLibrary] = useState<Record<string, string>>({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [isManualAssistRunning, setIsManualAssistRunning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCustomStyleModalOpen, setIsCustomStyleModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [editingStyleName, setEditingStyleName] = useState<string | null>(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [pruneMessage, setPruneMessage] = useState<string | null>(null);
  const [styleToasts, setStyleToasts] = useState<StyleToast[]>([]);
  const handleStyleChange = useCallback((style: string) => {
    setGlobalStyle(style);
    setStyleToasts(prev => [...prev, { id: crypto.randomUUID(), styleName: style }]);
  }, []);
  const dismissStyleToast = useCallback((id: string) => {
    setStyleToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastExtractedScriptRef = useRef('');
  const isExtractingRef = useRef(false);
  const assetsRef = useRef<Asset[]>([]);
  const isUnmountedRef = useRef(false);
  
  const [deletedAssetNames, setDeletedAssetNames] = useState<Set<string>>(new Set());
  const deletedAssetNamesRef = useRef<Set<string>>(new Set());
  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  // Track unmount separately from effect cleanup
  useEffect(() => {
    return () => { isUnmountedRef.current = true; };
  }, []);
  // Keep assetsRef in sync
  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);
  useEffect(() => {
    deletedAssetNamesRef.current = deletedAssetNames;
  }, [deletedAssetNames]);
  // Auto-extract assets when script changes or when switching to Assets tab
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const markdown = fullMarkdown.trim();
    if (!markdown || markdown.length < 10) return;
    if (isExtractingRef.current || isManualAssistRunning) return;
    const lengthDiff = Math.abs(markdown.length - lastExtractedScriptRef.current.length);
    const isSignificantChange = lengthDiff > 20 || (activeTab === 'assets' && markdown !== lastExtractedScriptRef.current);
    const hasNoAssets = assetsRef.current.length === 0;
    // Only auto-suggest if we have no assets yet (initial generation), or if the script has significantly changed.
    if (hasNoAssets || isSignificantChange) {
      const delay = hasNoAssets ? 300 : (activeTab === 'assets' ? 300 : 4000);
      debounceTimer = setTimeout(async () => {
        if (isUnmountedRef.current || isExtractingRef.current) return;
        isExtractingRef.current = true;
        setIsExtracting(true);
        // --- The Forgetful Blacklist ---
        // If a blacklisted name is completely removed from the script, we drop it from the blacklist.
        // This allows the AI to suggest it again if it's re-introduced later as a conceptually new entity.
        setDeletedAssetNames(prev => {
          if (prev.size === 0) return prev;
          const next = new Set(prev);
          let changed = false;
          const lowerMarkdown = markdown.toLowerCase();
          for (const name of next) {
            if (!lowerMarkdown.includes(name)) {
              next.delete(name);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
        try {
          const scriptToAnalyze = markdown;
          const suggestions = await suggestAssets(scriptToAnalyze, assetsRef.current, ['character', 'location', 'prop']);
          if (!isUnmountedRef.current && suggestions) {
            // --- Prune empty orphaned assets ---
            // Before adding new assets, remove any that:
            // 1. No longer appear in the script (orphaned)
            // 2. Have no user/AI content (empty)
            const orphaned = findOrphanedAssets(assetsRef.current, scriptToAnalyze);
            const emptyOrphans = orphaned.filter(isAssetEmpty);
            const emptyOrphanIds = new Set(emptyOrphans.map(a => a.id));
            // Show notification if we pruned anything
            if (emptyOrphans.length > 0) {
              const names = emptyOrphans.map(a => a.name).join(', ');
              setPruneMessage(`Removed ${emptyOrphans.length} unused asset${emptyOrphans.length > 1 ? 's' : ''}: ${names}`);
              setTimeout(() => setPruneMessage(null), 4000);
              // Clean stale linkedAssetIds from storyboard frames
              setFrames(prevFrames => prevFrames.map(frame => {
                const cleanedIds = frame.linkedAssetIds.filter(id => !emptyOrphanIds.has(id));
                return cleanedIds.length !== frame.linkedAssetIds.length
                  ? { ...frame, linkedAssetIds: cleanedIds }
                  : frame;
              }));
            }
            setAssets(prev => {
              // Remove empty orphans first
              const surviving = emptyOrphanIds.size > 0
                ? prev.filter(a => !emptyOrphanIds.has(a.id))
                : prev;
              const existingNames = new Set(surviving.map(a => a.name.toLowerCase()));
              const newAssets: Asset[] = [];
              const processList = (names: string[], type: 'character' | 'location' | 'prop') => {
                if (!Array.isArray(names)) return;
                names.forEach(name => {
                  const clean = name?.trim();
                  if (clean && !existingNames.has(clean.toLowerCase()) && !deletedAssetNamesRef.current.has(clean.toLowerCase())) {
                    newAssets.push({
                      id: crypto.randomUUID(), type, name: clean,
                      supportingImages: [], includeInspirationInImageGen: true,
                      ...(type === 'character' ? { physicalCharacteristics: '', clothingAccessories: '', backstory: '' } : {}),
                      ...(type === 'location' ? { physicalCharacteristics: '', timeOfDay: '' } : {}),
                      ...(type === 'prop' ? { physicalCharacteristics: '' } : {}),
                    } as Asset);
                    existingNames.add(clean.toLowerCase());
                  }
                });
              };
              processList(suggestions.characters || [], 'character');
              processList(suggestions.locations || [], 'location');
              processList(suggestions.props || [], 'prop');
              return newAssets.length > 0 ? [...surviving, ...newAssets] : surviving;
            });
            lastExtractedScriptRef.current = scriptToAnalyze;
          }
        } catch (e) {
          console.error("Auto asset extraction failed:", e);
        } finally {
          if (!isUnmountedRef.current) {
            isExtractingRef.current = false;
            setIsExtracting(false);
          }
        }
      }, delay);
    }
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [fullMarkdown, activeTab, isManualAssistRunning]);
  // Inject global styles into the DOM
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = GLOBAL_STYLES;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);
  const handleTitleUpdate = useCallback((title: string) => {
    setProjectTitle(title || 'Untitled Story');
  }, []);
  const handleHeaderTitleChange = useCallback((newTitle: string) => {
    const title = newTitle.trim() || 'Untitled Story';
    setProjectTitle(title);
    // Sync the H1 in the script markdown
    setFullMarkdown(prev => {
      const hasH1 = /^#\s+.+$/m.test(prev);
      if (hasH1) {
        return prev.replace(/^#\s+.+$/m, `# ${title}`);
      }
      // No H1 exists yet — prepend one
      return `# ${title}\x0a\x0a${prev}`;
    });
  }, []);
  const handleRemoveCustomStyle = useCallback((name: string) => {
    setCustomStyleLibrary(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (globalStyle === name) {
      setGlobalStyle('Realistic');
    }
  }, [globalStyle]);
  const handleSaveProject = useCallback(async () => {
    const getBase64 = async (url?: string): Promise<string | undefined> => {
      if (!url || !url.startsWith('blob:')) return undefined;
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = () => resolve(undefined);
          reader.readAsDataURL(blob);
        });
      } catch (e) { return undefined; }
    };
    const projectData = {
      version: '1.2',
      projectTitle,
      fullMarkdown,
      globalStyle,
      customStyleLibrary,
      assets: await Promise.all(assets.map(async a => {
        const { isAutofilling, isGenerating, ...rest } = a as any;
        return {
          ...rest,
          base64: await getBase64(a.imageUrl),
          supportingImages: await Promise.all((a.supportingImages || []).map(async img => ({
            ...img,
            base64: await getBase64(img.dataUrl),
            dataUrl: img.dataUrl?.startsWith('http') && !img.dataUrl.includes('blob:') ? img.dataUrl : undefined
          })))
        };
      })),
      frames: await Promise.all(frames.map(async f => {
        return {
          ...f,
          base64: await getBase64(f.imageUrl),
          imageHistoryData: await Promise.all((f.imageHistory || []).map(url => getBase64(url)))
        };
      }))
    };
    const jsonString = JSON.stringify(projectData, null, 2);
    // Convert JSON string to base64 for Flow.download()
    // Use TextEncoder for proper UTF-8 handling (unescape is deprecated)
    // Process in chunks to avoid stack overflow on large projects
    const encoder = new TextEncoder();
    const bytes = encoder.encode(jsonString);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }
    const base64 = btoa(binary);
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    await Flow.download({
      base64,
      mimeType: 'application/json',
      filename: `${projectTitle.replace(/[/\\:*?"<>|]/g, '_')} - ${timestamp}.json`,
    });
  }, [projectTitle, fullMarkdown, assets, frames, globalStyle, customStyleLibrary]);
  const handleClearProject = useCallback(() => {
    setProjectTitle('Untitled Story');
    setFullMarkdown('');
    setAssets([]);
    setFrames([]);
    setGlobalStyle('Realistic');
    setCustomStyleLibrary({});
    setDeletedAssetNames(new Set());
    setActiveTab('script');
    setIsMenuOpen(false);
  }, []);
  const handleLoadProject = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (re) => {
        try {
          const content = re.target?.result as string;
          const data = JSON.parse(content);
          if (data.projectTitle) setProjectTitle(data.projectTitle);
          if (data.fullMarkdown) setFullMarkdown(data.fullMarkdown);
          if (data.globalStyle) setGlobalStyle(data.globalStyle);
          if (data.customStyleLibrary) setCustomStyleLibrary(data.customStyleLibrary);
          setDeletedAssetNames(new Set());
          if (data.assets) {
            const hydratedAssets = await Promise.all(data.assets.map(async (a: any) => {
              const { base64, supportingImages, ...rest } = a;
              let mainUrl = a.imageUrl;
              if (base64) {
                const res = await fetch(`data:image/png;base64,${base64}`);
                const blob = await res.blob();
                mainUrl = URL.createObjectURL(blob);
              }
              const hydratedSupporting = await Promise.all((supportingImages || []).map(async (img: any) => {
                let url = img.dataUrl;
                if (img.base64) {
                  const res = await fetch(`data:image/png;base64,${img.base64}`);
                  const blob = await res.blob();
                  url = URL.createObjectURL(blob);
                }
                return { ...img, dataUrl: url };
              }));
              return { ...rest, imageUrl: mainUrl, supportingImages: hydratedSupporting };
            }));
            setAssets(hydratedAssets);
          }
          if (data.frames) {
            const hydratedFrames = await Promise.all(data.frames.map(async (f: any) => {
              const { base64, imageHistoryData, ...rest } = f;
              let mainUrl = f.imageUrl;
              if (base64) {
                const res = await fetch(`data:image/png;base64,${base64}`);
                const blob = await res.blob();
                mainUrl = URL.createObjectURL(blob);
              }
              const hydratedHistory = await Promise.all((imageHistoryData || []).map(async (b64: string | undefined) => {
                if (!b64) return '';
                const res = await fetch(`data:image/png;base64,${b64}`);
                const blob = await res.blob();
                return URL.createObjectURL(blob);
              }));
              return { ...rest, imageUrl: mainUrl, imageHistory: hydratedHistory.filter(Boolean) };
            }));
            setFrames(hydratedFrames);
          }
          setActiveTab('script');
          setIsMenuOpen(false);
        } catch (err) {
          console.error("Failed to parse project file:", err);
          alert("Invalid project file format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);
  const allStylePrompts = { ...VISUAL_STYLE_PROMPTS, ...customStyleLibrary };
  return (
    <div className="flex flex-col h-screen text-white overflow-hidden font-sans bg-[#000000] relative">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 border-b border-[#DADCE0]/[0.16] flex items-center py-3 px-6 relative z-[100]">
        {/* Project Title Area */}
        <div className="flex items-center w-1/3 min-w-0">
          {/* Desktop Title */}
          <div className="hidden md:flex items-baseline min-w-0">
            <EditableTitle value={projectTitle} onChange={handleHeaderTitleChange} />
          </div>
          {/* Mobile Tabs Dropdown */}
          <div className="block md:hidden relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-transparent border border-[#DADCE0]/[0.40] rounded-[8px] py-[0.4rem] px-3 pr-8 text-[14px] text-white/90 focus:outline-none appearance-none cursor-pointer font-sans"
            >
              <option value="script" className="bg-zinc-900">1. Script</option>
              <option value="assets" className="bg-zinc-900">2. Assets</option>
              <option value="storyboard" className="bg-zinc-900">3. Storyboard</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="expand_more" size={16} className="opacity-[0.48]" />
            </div>
          </div>
        </div>
        {/* Numbered Navigation Tabs - Desktop (Row) */}
        <div className="hidden md:flex items-center justify-center w-1/3">
          <div className="flex items-center gap-[2px] bg-[#DADCE0]/[0.12] rounded-full">
            <button
              onClick={() => setActiveTab('script')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1 font-sans text-white ${activeTab === 'script' ? 'bg-[#DADCE0]/[0.24] shadow-sm' : 'hover:bg-white/5'
                }`}
            >
              <span className="text-[#DADCE0]/[0.48] font-medium">1.</span> Script
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1 font-sans text-white ${activeTab === 'assets' ? 'bg-[#DADCE0]/[0.24] shadow-sm' : 'hover:bg-white/5'
                }`}
            >
              <span className="text-[#DADCE0]/[0.48] font-medium">2.</span> Assets
            </button>
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1 font-sans text-white ${activeTab === 'storyboard' ? 'bg-[#DADCE0]/[0.24] shadow-sm' : 'hover:bg-white/5'
                }`}
            >
              <span className="text-[#DADCE0]/[0.48] font-medium">3.</span> Storyboard
            </button>
          </div>
        </div>
        {/* Right Actions Area */}
        <div className="flex items-center justify-end gap-[0.5em] flex-1 md:w-1/3 md:flex-none font-sans">
          {/* Global Style Dropdown */}
          <StyleSelector
            globalStyle={globalStyle}
            onGlobalStyleChange={handleStyleChange}
            customStyleLibrary={customStyleLibrary}
            onOpenCustomStyleModal={(name) => {
              setEditingStyleName(name || null);
              setIsCustomStyleModalOpen(true);
            }}
            onRemoveCustomStyle={handleRemoveCustomStyle}
          />
          {/* Project Actions Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center transition-colors rounded-full ${isMenuOpen ? 'bg-[#DADCE0]/[0.08]' : 'hover:bg-[#DADCE0]/[0.08]'
                }`}
            >
              <Icon name="more_vert" size={20} className={isMenuOpen ? 'opacity-100' : 'opacity-[0.48] hover:opacity-100 transition-opacity'} />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-[200px] bg-[#000000] border border-[#DADCE0]/[0.24] rounded-2xl shadow-2xl overflow-hidden z-[110] animate-dropdown origin-top-right py-2">
                <button
                  onClick={() => { handleSaveProject(); setIsMenuOpen(false); }}
                  className="w-full px-5 py-3 text-left text-[13px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <Icon name="save" size={20} className="opacity-[0.48]" />
                  Save Story
                </button>
                <button
                  onClick={() => { handleLoadProject(); }}
                  className="w-full px-5 py-3 text-left text-[13px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <Icon name="folder" size={20} className="opacity-[0.48]" />
                  Open Story
                </button>
                <div className="h-px bg-white/5 my-1 mx-2" />
                <button
                  onClick={() => { setIsClearModalOpen(true); setIsMenuOpen(false); }}
                  className="w-full px-5 py-3 text-left text-[13px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <Icon name="delete" size={20} className="opacity-[0.48]" />
                  Clear Story
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'script' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <ScriptView
                onTitleChange={handleTitleUpdate}
                fullMarkdown={fullMarkdown}
                onMarkdownChange={setFullMarkdown}
                assets={assets}
                globalStyle={globalStyle}
                onGlobalStyleChange={setGlobalStyle}
                customStyleLibrary={customStyleLibrary}
                onOpenCustomStyleModal={(name) => {
                  setEditingStyleName(name || null);
                  setIsCustomStyleModalOpen(true);
                }}
                onRemoveCustomStyle={handleRemoveCustomStyle}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'assets' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <AssetsView
                script={fullMarkdown}
                assets={assets}
                globalStyle={globalStyle}
                customStyles={allStylePrompts}
                onAssetsChange={setAssets}
                onGlobalStyleChange={setGlobalStyle}
                onManualAssistChange={setIsManualAssistRunning}
                onAssetDelete={(name) => setDeletedAssetNames(prev => new Set(prev).add(name.toLowerCase()))}
                isExtracting={isExtracting}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'storyboard' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <StoryboardView
                script={fullMarkdown}
                assets={assets}
                frames={frames}
                globalStyle={globalStyle}
                customStylePrompts={allStylePrompts}
                onGlobalStyleChange={setGlobalStyle}
                onFramesChange={setFrames}
                onScriptChange={setFullMarkdown}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <CustomStyleModal
        isOpen={isCustomStyleModalOpen}
        onClose={() => {
          setIsCustomStyleModalOpen(false);
          setEditingStyleName(null);
        }}
        initialName={editingStyleName || ''}
        initialPrompt={editingStyleName ? customStyleLibrary[editingStyleName] : ''}
        onSave={(name, prompt) => {
          setCustomStyleLibrary(prev => {
            const next = { ...prev };
            // If the name changed, remove the old one
            if (editingStyleName && editingStyleName !== name) {
              delete next[editingStyleName];
            }
            next[name] = prompt;
            return next;
          });
          setGlobalStyle(name);
          setEditingStyleName(null);
        }}
      />
      <ClearProjectModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearProject}
      />
      {/* Internal Modal Root for Portals to stay within the applet bounds */}
      <div id="story-studio-modal-root" className="absolute inset-0 z-[9999] pointer-events-none"></div>
      {/* Welcome Modal */}
      {isWelcomeOpen && !fullMarkdown.trim() && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
          <div className="relative bg-black border border-[rgba(218,220,224,0.15)] rounded-[24px] p-6 pt-8 max-w-[380px] w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsWelcomeOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Icon name="close" size={18} className="text-white/40" />
            </button>
            <h3 className="text-[22px] font-bold text-white mb-6 text-center">Welcome to Story Studio</h3>
            {/* Style Picker */}
            <div className="mb-5">
              <p className="text-[14px] text-zinc-500 mb-3 font-medium text-center">Choose your storyboard style</p>
              <div className="flex justify-center">
                <StyleSelector
                  globalStyle={globalStyle}
                  onGlobalStyleChange={setGlobalStyle}
                  customStyleLibrary={customStyleLibrary}
                  onOpenCustomStyleModal={(name) => {
                    setEditingStyleName(name || null);
                    setIsCustomStyleModalOpen(true);
                    setIsWelcomeOpen(false);
                  }}
                  onRemoveCustomStyle={handleRemoveCustomStyle}
                  hideLabel
                />
              </div>
            </div>
            {/* Steps 1-3 */}
            <div className="flex justify-center mb-6">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-[14px] text-zinc-500">
                  <span className="text-[rgba(218,220,224,0.3)] font-medium text-[13px] w-4 shrink-0">1.</span>
                  <Icon name="description" size={20} className="opacity-[0.4] shrink-0" />
                  <span>Workshop your script</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-zinc-500">
                  <span className="text-[rgba(218,220,224,0.3)] font-medium text-[13px] w-4 shrink-0">2.</span>
                  <Icon name="person" size={20} className="opacity-[0.4] shrink-0" />
                  <span>Create your cast and locations</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-zinc-500">
                  <span className="text-[rgba(218,220,224,0.3)] font-medium text-[13px] w-4 shrink-0">3.</span>
                  <Icon name="grid_view" size={20} className="opacity-[0.4] shrink-0" />
                  <span>Visualize your storyboard</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsWelcomeOpen(false)}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-[13px] font-bold transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      {/* Asset prune notification toast */}
      {pruneMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300]">
          <div className="flex items-center gap-3 bg-black border border-[#DADCE0]/[0.24] rounded-2xl px-5 py-3 shadow-2xl animate-dropdown">
            <Icon name="auto_delete" size={16} className="shrink-0 text-white" />
            <span className="text-[13px] text-white font-sans">{pruneMessage}</span>
          </div>
        </div>
      )}
      {/* Style change toasts */}
      {styleToasts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] flex flex-col-reverse items-center">
          {styleToasts.map((toast, i) => (
            <StyleToastItem key={toast.id} toast={toast} index={i} onDismiss={dismissStyleToast} />
          ))}
        </div>
      )}
    </div>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}