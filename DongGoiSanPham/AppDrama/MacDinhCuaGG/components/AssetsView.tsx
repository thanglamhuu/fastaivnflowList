import React, { useState, useCallback, useMemo } from 'react';
import { Asset, AssetType, ImageHistoryItem } from '../types';
import { AssetGridCard } from './AssetGridCard';
import { AssetEditPanel } from './AssetEditPanel';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { GenerationQueueToast } from './GenerationQueueToast';
import { ImageLightbox } from './ImageLightbox';
import { suggestAssets, autofillAsset, generateImage, batchAutofillAssets } from '../services/ai';
import { runRollingQueue, withRetry } from '../services/queue';
import { Icon } from './Icon';
import { toTitleCase } from '../services/utils';
const Loader2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
interface AssetsViewProps {
  script: string;
  assets: Asset[];
  globalStyle: string;
  customStyles: Record<string, string>;
  onAssetsChange: (assets: Asset[] | ((prev: Asset[]) => Asset[])) => void;
  onGlobalStyleChange: (style: string) => void;
  onManualAssistChange?: (isAssistRunning: boolean) => void;
  onAssetDelete?: (name: string) => void;
  isExtracting?: boolean;
}
export function AssetsView({ script, assets, globalStyle, customStyles, onAssetsChange, onGlobalStyleChange, onManualAssistChange, onAssetDelete, isExtracting }: AssetsViewProps) {
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  const [suggestingTypes, setSuggestingTypes] = useState<Set<AssetType>>(new Set());
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);
  const [openMenuType, setOpenMenuType] = useState<AssetType | null>(null);
  const [queueProgress, setQueueProgress] = useState<{ completed: number; total: number; failed: number } | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedGenIds, setFailedGenIds] = useState<Set<string>>(new Set());
  const abortControllersRef = React.useRef<Set<AbortController>>(new Set());
  const activeRunsRef = React.useRef(0);
  const cancelledGenRef = React.useRef<Set<string>>(new Set());
  const orderedAssetsWithImages = useMemo(() => {
    const orderedTypes: AssetType[] = ['character', 'location', 'prop'];
    const result: Asset[] = [];
    orderedTypes.forEach(type => {
      const typeList = assets.filter(a => a.type === type);
      typeList.forEach(a => {
        const t = a.supportingImages.find(img => img.id === a.referenceImageId) || a.supportingImages[0];
        if (t?.dataUrl) {
          result.push(a);
        }
      });
    });
    return result;
  }, [assets]);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const handleQueueStop = useCallback(() => {
    // Abort ALL active assist runs
    abortControllersRef.current.forEach(c => c.abort());
    abortControllersRef.current.clear();
    activeRunsRef.current = 0;
    onAssetsChange(prev => prev.map(a => ({ ...a, isGenerating: false, isAutofilling: false } as Asset)));
    setSuggestingTypes(new Set());
    onManualAssistChange?.(false);
    setQueueProgress(null);
  }, [onAssetsChange, onManualAssistChange]);
  const handleQueueDismiss = useCallback(() => setQueueProgress(null), []);
  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuType(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const handleAssetAssist = async (config: { types: AssetType[]; autoFill: boolean; autoGenerate: boolean }) => {
    // Each run gets its own controller — concurrent runs coexist
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    activeRunsRef.current += 1;
    setSuggestingTypes(prev => {
      const next = new Set(prev);
      config.types.forEach(t => next.add(t));
      return next;
    });
    onManualAssistChange?.(true);
    try {
      // Autofill only operates on EXISTING assets — no re-discovery.
      // Asset discovery is handled by the auto-extract effect in App.tsx.
      // Re-running suggestAssets here would resurrect assets the user manually deleted.
      // Immediately mark ONLY assets matching the target types as autofilling
      if (config.autoFill && assets.length > 0) {
        const targetTypeSet = new Set(config.types);
        onAssetsChange(prev => prev.map(a => 
          targetTypeSet.has(a.type) && !a.isAutofilling ? { ...a, isAutofilling: true } as Asset : a
        ));
      }
      const assetPool = assets.filter(a => config.types.includes(a.type));
      // Local accumulator: guarantees autofill data is available for image generation
      // regardless of React state flush timing or Object.assign edge cases.
      const autofillDataMap = new Map<string, Partial<Asset>>();
      if (config.autoFill) {
        // Batch autofill: ONE text call per type group instead of N serial calls.
        // Falls back to individual autofillAsset for any assets the batch missed.
        try {
          const batchResults = await withRetry(
            () => batchAutofillAssets(script, assetPool), 2, controller.signal
          );
          if (controller.signal.aborted) return;
          // Populate local accumulator synchronously before triggering React state
          for (const a of assetPool) {
            const details = batchResults.get(a.id);
            if (details) {
              autofillDataMap.set(a.id, details);
            }
          }
          // Apply batch results to all matched assets via React state
          onAssetsChange(prev => prev.map(a => {
            const details = batchResults.get(a.id);
            if (details) {
              return { ...a, ...details, isAutofilling: false, ...(config.autoGenerate ? { isGenerating: true } : {}) } as Asset;
            }
            return a;
          }));
          // Fallback: any assets not covered by the batch get individual autofill
          const missedAssets = assetPool.filter(a => !batchResults.has(a.id));
          for (const asset of missedAssets) {
            if (controller.signal.aborted) break;
            try {
              const details = await withRetry(
                () => autofillAsset(script, asset), 2, controller.signal
              );
              if (details) autofillDataMap.set(asset.id, details);
              onAssetsChange(prev => prev.map(a => {
                if (a.id !== asset.id) return a;
                if (details) {
                  return { ...a, ...details, isAutofilling: false, ...(config.autoGenerate ? { isGenerating: true } : {}) } as Asset;
                }
                return { ...a, isAutofilling: false, ...(config.autoGenerate ? { isGenerating: true } : {}) } as Asset;
              }));
            } catch (err) {
              console.error(`Fallback autofill failed for ${asset.name}:`, err);
              onAssetsChange(prev => prev.map(a =>
                a.id === asset.id ? { ...a, isAutofilling: false } as Asset : a
              ));
            }
          }
        } catch (err) {
          console.error('Batch autofill failed, falling back to serial:', err);
          // Full fallback: serial autofill for all assets
          for (const asset of assetPool) {
            if (controller.signal.aborted) break;
            try {
              const details = await withRetry(
                () => autofillAsset(script, asset), 2, controller.signal
              );
              if (details) autofillDataMap.set(asset.id, details);
              onAssetsChange(prev => prev.map(a => {
                if (a.id !== asset.id) return a;
                if (details) {
                  return { ...a, ...details, isAutofilling: false, ...(config.autoGenerate ? { isGenerating: true } : {}) } as Asset;
                }
                return { ...a, isAutofilling: false, ...(config.autoGenerate ? { isGenerating: true } : {}) } as Asset;
              }));
            } catch (innerErr) {
              console.error(`Failed to autofill asset ${asset.name}:`, innerErr);
              onAssetsChange(prev => prev.map(a =>
                a.id === asset.id ? { ...a, isAutofilling: false } as Asset : a
              ));
            }
          }
        }
      }
      // Phase 2: Parallel Image Generation (rolling queue, 4 at a time)
      if (config.autoGenerate) {
        // Build the generation pool: if autofill was enabled, skip assets that
        // got NO autofill data AND still have no description — generating from
        // just the asset name produces random/irrelevant images.
        const hasDescription = (a: Asset, autofill?: Partial<Asset>): boolean => {
          const merged = autofill ? { ...a, ...autofill } : a;
          if (merged.description) return true;
          if ('physicalCharacteristics' in merged && (merged as any).physicalCharacteristics) return true;
          return false;
        };
        const genPool = config.autoFill
          ? assetPool.filter(a => hasDescription(a, autofillDataMap.get(a.id)))
          : assetPool;
        const genPoolIds = new Set(genPool.map(a => a.id));
        // Single state update: mark genPool as generating, clear skipped assets
        onAssetsChange(prev => prev.map(a => {
          if (genPoolIds.has(a.id)) return { ...a, isGenerating: true } as Asset;
          // Clear isGenerating for skipped assets (set during autofill phase)
          if (assetPool.some(p => p.id === a.id) && a.isGenerating) return { ...a, isGenerating: false } as Asset;
          return a;
        }));
        // Accumulate into existing queue progress so concurrent runs share one toast
        setQueueProgress(prev => prev
          ? { ...prev, total: prev.total + genPool.length }
          : { completed: 0, total: genPool.length, failed: 0 }
        );
        // Run asset generations through a lightweight concurrency pool (2 at a time).
        // No semaphore/slot management — each call fires directly.
        // Concurrency tuned to 2 to reduce server-side contention and 180s SDK timeouts.
        await runRollingQueue(
          genPool,
          async (asset, signal) => {
            // Merge locally-accumulated autofill data to guarantee descriptions
            // are present even if React state hasn't flushed yet
            const autofillData = autofillDataMap.get(asset.id);
            const enrichedAsset = autofillData ? { ...asset, ...autofillData } as Asset : asset;
            await handleGenerate(asset.id, enrichedAsset, undefined, signal);
          },
          2,
          controller.signal,
          () => {}, // progress tracked per-asset inside handleGenerate
          false     // no slot management
        );
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') console.error('Assist failed:', e);
    } finally {
      // Remove this run's controller and decrement active count
      abortControllersRef.current.delete(controller);
      activeRunsRef.current = Math.max(0, activeRunsRef.current - 1);
      setSuggestingTypes(prev => {
        const next = new Set(prev);
        config.types.forEach(t => next.delete(t));
        return next;
      });
      // Only release the manual-assist lock when ALL concurrent runs are done
      if (activeRunsRef.current === 0) {
        onManualAssistChange?.(false);
      }
      // Safety net: clear any stuck isAutofilling/isGenerating flags for targeted assets
      // Only clear flags that THIS run was responsible for setting
      const targetTypeSet = new Set(config.types);
      onAssetsChange(prev => prev.map(a => {
        if (!targetTypeSet.has(a.type)) return a;
        
        let nextA = { ...a };
        let changed = false;
        
        if (config.autoFill && nextA.isAutofilling) {
          nextA.isAutofilling = false;
          changed = true;
        }
        if (config.autoGenerate && nextA.isGenerating) {
          nextA.isGenerating = false;
          changed = true;
        }
        
        return changed ? nextA as Asset : a;
      }));
    }
  };
  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    onAssetsChange(prev => prev.map(a => a.id === id ? { ...a, ...updates } as Asset : a));
  }, [onAssetsChange]);
  const deleteAsset = useCallback((id: string) => {
    const assetToDelete = assets.find(a => a.id === id);
    if (assetToDelete && onAssetDelete) {
      onAssetDelete(assetToDelete.name);
    }
    onAssetsChange(prev => prev.filter(a => a.id !== id));
    if (activeAssetId === id) setActiveAssetId(null);
    setDeletingAssetId(null);
  }, [activeAssetId, onAssetsChange, assets, onAssetDelete]);
  const handleAutofill = async (id: string, forcedAsset?: Asset) => {
    const targetAsset = forcedAsset || assets.find(a => a.id === id);
    if (!targetAsset) return null;
    updateAsset(id, { isAutofilling: true });
    try {
      const data = await autofillAsset(script, targetAsset);
      if (data) {
        updateAsset(id, data);
      }
    } catch (e: any) {
      console.error('Autofill failed:', e);
    } finally {
      updateAsset(id, { isAutofilling: false });
    }
    return null;
  };
  const handleGenerate = async (id: string, forcedAsset?: Asset, forcedStyle?: string, signal?: AbortSignal) => {
    const targetAsset = forcedAsset || assets.find(a => a.id === id);
    if (!targetAsset) return;
    updateAsset(id, { isGenerating: true });
    setFailedGenIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    // Show toast for standalone single-image generations (no signal = not part of a batch)
    const isSingleGeneration = !signal;
    if (isSingleGeneration) {
      // Add to existing queue if one is running, otherwise start a new 1/1 toast
      setQueueProgress(prev => prev
        ? { ...prev, total: prev.total + 1 }
        : { completed: 0, total: 1, failed: 0 }
      );
    }
    try {
      // Check signal before expensive generation call
      if (signal?.aborted) return;
      const activeStyle = forcedStyle || globalStyle;
      const genResult = await generateImage(targetAsset, activeStyle, customStyles[activeStyle]);
      // Check if user cancelled this specific item while it was in-flight
      if (cancelledGenRef.current.has(id)) {
        cancelledGenRef.current.delete(id);
        if (genResult?.dataUrl?.startsWith('blob:')) URL.revokeObjectURL(genResult.dataUrl);
        return;
      }
      // Check signal after generation — if aborted mid-flight, bail without writing
      if (signal?.aborted) {
        if (genResult?.dataUrl?.startsWith('blob:')) URL.revokeObjectURL(genResult.dataUrl);
        return;
      }
      if (!genResult) {
        setFailedGenIds(prev => new Set(prev).add(id));
        setQueueProgress(prev => prev ? { ...prev, failed: prev.failed + 1 } : null);
        return;
      }
      const newImage: ImageHistoryItem = {
        id: crypto.randomUUID(),
        mediaId: genResult.mediaId,
        dataUrl: genResult.dataUrl
      };
      onAssetsChange(prev => prev.map(a => {
        if (a.id !== id) return a;
        const oldHistory = a.supportingImages || [];
        const newHistory = [newImage, ...oldHistory];
        return {
          ...a,
          referenceImageId: newImage.id,
          supportingImages: newHistory,
        } as Asset;
      }));
      setQueueProgress(prev => prev ? { ...prev, completed: prev.completed + 1 } : null);
    } catch (e: any) {
      if (!signal?.aborted) console.error('Gen failed:', e);
      setFailedGenIds(prev => new Set(prev).add(id));
      setQueueProgress(prev => prev ? { ...prev, failed: prev.failed + 1 } : null);
    } finally {
      // Always clear isGenerating so assets don't get stuck with a loader
      updateAsset(id, { isGenerating: false });
      cancelledGenRef.current.delete(id);
    }
  };
  const handleStopGenerate = (id: string) => {
    cancelledGenRef.current.add(id);
    updateAsset(id, { isGenerating: false });
    // Don't add to failedGenIds — this was intentional, not a failure
  };
  const addAsset = (type: AssetType) => {
    const newAsset = {
      id: crypto.randomUUID(), type, name: `New ${toTitleCase(type)}`,
      supportingImages: [], includeInspirationInImageGen: true,
      ...(type === 'character' ? { physicalCharacteristics: '', clothingAccessories: '', backstory: '' } : {}),
      ...(type === 'location' ? { physicalCharacteristics: '', timeOfDay: '' } : {}),
      ...(type === 'prop' ? { physicalCharacteristics: '' } : {}),
    } as Asset;
    onAssetsChange(prev => [...prev, newAsset]);
    setActiveAssetId(newAsset.id);
  };
  const activeAsset = assets.find(a => a.id === activeAssetId);
  const deletingAsset = assets.find(a => a.id === deletingAssetId);
  const assetsRef = React.useRef(assets);
  React.useEffect(() => { assetsRef.current = assets; }, [assets]);
  React.useEffect(() => {
    return () => {
      assetsRef.current.forEach(a => {
        a.supportingImages.forEach(img => {
          if (img.dataUrl?.startsWith('blob:')) URL.revokeObjectURL(img.dataUrl);
        });
      });
    };
  }, []);
  return (
    <div className="flex h-full w-full overflow-hidden font-sans">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main
          className="flex-1 overflow-y-auto refined-scrollbar px-6 pt-7 pb-6"
          onClick={() => setActiveAssetId(null)}
        >
          {(['character', 'location', 'prop'] as AssetType[]).map((type) => {
            const list = assets.filter(a => a.type === type);
            const isMenuOpen = openMenuType === type;
            return (
              <section key={type} className="w-full mb-10">
                <div className="mb-4 pl-1 flex items-center justify-between group/header" onClick={e => e.stopPropagation()}>
                  <span className="text-[20px] font-medium text-white/90 capitalize font-sans">{type}s</span>
                  <div className="flex items-center gap-2">
                    {list.length > 0 && (
                      <button
                        onClick={() => handleAssetAssist({ types: [type], autoFill: true, autoGenerate: true })}
                        disabled={suggestingTypes.has(type) || isExtracting}
                        className="px-3 py-[0.4rem] rounded-[40px] bg-[#DADCE0]/[0.72] text-black/90 text-[13px] font-bold hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95 whitespace-nowrap"
                      >
                        {suggestingTypes.has(type) || isExtracting ? <Loader2 size={20} className="animate-spin text-black/90" /> : <Icon name="astrophotography_mode" size={20} invert={false} className="opacity-90 text-black/90" />}
                        Autofill {toTitleCase(type)}s
                      </button>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuType(isMenuOpen ? null : type)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isMenuOpen ? 'bg-[#DADCE0]/[0.08]' : 'hover:bg-[#DADCE0]/[0.08]'
                          }`}
                      >
                        <Icon name="more_vert" size={20} className={isMenuOpen ? 'opacity-100' : 'opacity-[0.48] hover:opacity-100 transition-opacity'} />
                      </button>
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute top-full mt-2 right-0 w-[200px] bg-[#000000] border border-[#DADCE0]/[0.24] rounded-xl shadow-2xl overflow-hidden z-50 animate-dropdown origin-top-right py-1.5"
                        >
                          <button
                            onClick={() => { addAsset(type); setOpenMenuType(null); }}
                            className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                          >
                            <Icon name="add" size={20} className="opacity-[0.48]" />
                            Add {toTitleCase(type)}
                          </button>
                          {list.length > 0 && (
                            <>
                              <div className="h-px bg-white/5 my-1 mx-2" />
                              <button
                                onClick={() => { handleAssetAssist({ types: [type], autoFill: true, autoGenerate: false }); setOpenMenuType(null); }}
                                disabled={suggestingTypes.has(type) || isExtracting}
                                className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors disabled:opacity-50"
                              >
                                <Icon name="notes" size={20} className="opacity-[0.48]" />
                                Autofill descriptions
                              </button>
                              <button
                                onClick={() => { handleAssetAssist({ types: [type], autoFill: false, autoGenerate: true }); setOpenMenuType(null); }}
                                disabled={suggestingTypes.has(type) || isExtracting}
                                className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors disabled:opacity-50"
                              >
                                <Icon name="image" size={20} className="opacity-[0.48]" />
                                Autocreate images
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                  {list.map(asset => {
                    const thumbnail = asset.supportingImages.find(img => img.id === asset.referenceImageId) || asset.supportingImages[0];
                    return (
                      <AssetGridCard
                        key={asset.id}
                        asset={asset}
                        isActive={activeAssetId === asset.id}
                        onClick={() => setActiveAssetId(asset.id)}
                        onDelete={() => setDeletingAssetId(asset.id)}
                        onGenerate={() => handleGenerate(asset.id)}
                        onExpand={thumbnail?.dataUrl ? () => {
                          const idx = orderedAssetsWithImages.findIndex(a => a.id === asset.id);
                          if (idx >= 0) setLightboxIndex(idx);
                        } : undefined}
                        generationFailed={failedGenIds.has(asset.id)}
                        onStop={() => handleStopGenerate(asset.id)}
                        onDismissFailure={() => setFailedGenIds(prev => { const next = new Set(prev); next.delete(asset.id); return next; })}
                      />
                    );
                  })}
                  {list.length === 0 && (
                    <div className="col-span-full h-[100px] px-8 flex flex-row items-center justify-center gap-6 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                      <div className="opacity-[0.24]">
                        <Icon name={type === 'character' ? 'person' : type === 'location' ? 'map' : 'deployed_code'} size={48} />
                      </div>
                      <div className="flex flex-col items-start gap-3">
                        <p className="text-[14px] font-medium text-[#DADCE0]/[0.48] font-sans">No {type}s added</p>
                        <button
                          onClick={() => addAsset(type)}
                          className="px-3 py-[0.4rem] rounded-[40px] border border-[#DADCE0]/[0.40] text-white/90 text-[12px] font-medium hover:bg-white/5 transition-all flex items-center gap-2"
                        >
                          <Icon name="add" size={20} className="opacity-[0.48]" />
                          {type === 'character' ? 'Add Character' : type === 'location' ? 'Add Location' : 'Add Prop'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>
      <div
        className={`fixed top-[56px] bottom-0 right-0 z-[90] transition-all duration-300 ease-in-out md:relative md:top-0 md:z-50 md:border-l md:border-[#DADCE0]/[0.16] ${activeAsset ? 'translate-x-0 w-full md:w-[420px]' : 'translate-x-full md:w-0'
          }`}
      >
        {activeAsset && (
          <AssetEditPanel
            asset={activeAsset}
            globalStyle={globalStyle}
            customStyleLibrary={customStyles}
            onGlobalStyleChange={onGlobalStyleChange}
            onUpdate={(updates) => updateAsset(activeAsset.id, updates)}
            onAutofill={() => handleAutofill(activeAsset.id)}
            onCreateImage={(style) => handleGenerate(activeAsset.id, undefined, style)}
            onClose={() => setActiveAssetId(null)}
            onExpand={() => {
              const idx = orderedAssetsWithImages.findIndex(a => a.id === activeAsset.id);
              if (idx >= 0) setLightboxIndex(idx);
            }}
          />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={!!deletingAssetId}
        onClose={() => setDeletingAssetId(null)}
        onConfirm={() => deletingAssetId && deleteAsset(deletingAssetId)}
        assetName={deletingAsset?.name || ''}
      />
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
            items={orderedAssetsWithImages.map(a => {
              const t = a.supportingImages.find(img => img.id === a.referenceImageId) || a.supportingImages[0];
              return { id: a.id, imageUrl: t!.dataUrl!, label: a.name };
            })}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        );
      })()}
    </div>
  );
}