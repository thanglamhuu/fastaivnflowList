import React, { useState, useEffect, useRef } from 'react';
import { Flow } from 'flow-sdk';
import JSZip from 'jszip';
import { AppState, VideoFrame, MediaAsset } from './types';
import { SectionLabel, PillButton, TextInput, TextArea, SegmentedToggle, FieldDropdown } from './components/Primitives';
import { ProgressCircle } from './components/ProgressCircle';
const MASTER_PROMPT_TEMPLATE = `A high-end professional lifestyle commercial photograph of a modern home essentials showroom.
CHARACTER:
A friendly and energetic young professional presenter with a warm smile. 
OUTFIT: Minimalist brown polo shirt and a clean neutral apron. 
ENVIRONMENT: Standing in a bright, organized industrial space with soft cinematic lighting.
PRESENTATION: [PRODUCT_INTERACTION]
PEOPLE REFERENCE:
[KOC_REFERENCE_LOGIC]
PRODUCT FIDELITY:
The scene features: [PRODUCT_INFO]. 
The objects should maintain the exact physical design, colors, and structural features seen in the provided references. High-fidelity rendering with natural studio reflections.
AESTHETIC STYLE:
Clean, modern, and unbranded. A sleek commercial look with a soft-focus background of organized warehouse shelves. 
NEGATIVE ATTRIBUTES:
No text, no labels, no logos, no signage, no writing, no symbols. Completely plain surfaces and clothing.
TECHNICAL: Ultra-realistic 8K, commercial photography, vertical 9:16 aspect ratio.`;
const INITIAL_VIDEO_FRAMES: VideoFrame[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  motionPrompt: '',
  voiceScript: '',
  promptStatus: 'idle',
  videoAsset: null,
  videoStatus: 'idle',
  videoProgress: 0,
}));
const VIDEO_MODELS = [
  'Omni Flash',
  'Veo 3.1 - Lite',
  'Veo 3.1 - Lite [Lower Priority]',
  'Veo 3.1 - Fast',
  'Veo 3.1 - Quality'
];
export default function App() {
  const [state, setState] = useState<AppState>({
    view: 'intro',
    products: [null, null, null],
    productInfo: '',
    bgMode: 'auto',
    kocImage: null,
    brandName: 'GIA DỤNG VIỆT',
    videoModel: 'Veo 3.1 - Lite [Lower Priority]',
    masterImage: null,
    masterImageStatus: 'idle',
    masterImageProgress: 0,
    videoFrames: INITIAL_VIDEO_FRAMES,
  });
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaAsset | null>(null);
  useEffect(() => {
    const id = 'flow-app-styles-light';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .custom-blur { backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }
      body { background: #f9fafb; color: #111827; margin: 0; font-family: 'Inter', sans-serif; }
      @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @keyframes dropdown-enter { from { opacity: 0; transform: scale(0.95) translateY(-5px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .animate-dropdown { animation: dropdown-enter 0.15s ease-out forwards; }
    `;
    document.head.appendChild(style);
  }, []);
  const handleSelectProduct = async (index: number) => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      const newProducts = [...state.products];
      newProducts[index] = { mediaId: media.mediaId, base64: media.base64, mimeType: media.mimeType };
      setState(s => ({ ...s, products: newProducts }));
    } catch (e) { console.error(e); }
  };
  const handleSelectKoc = async () => {
    try {
      const media = await Flow.media.select({ filter: 'image' });
      setState(s => ({ 
        ...s, 
        kocImage: { mediaId: media.mediaId, base64: media.base64, mimeType: media.mimeType },
        bgMode: 'reference'
      }));
    } catch (e) { console.error(e); }
  };
  const simulateProgress = (callback: (p: number) => void) => {
    let curr = 0;
    const itv = setInterval(() => {
      curr += Math.random() * 8;
      if (curr >= 98) clearInterval(itv);
      else callback(curr);
    }, 1000);
    return itv;
  };
  const generateMasterImage = async () => {
    const productIds = state.products.filter(p => p !== null).map(p => p!.mediaId);
    if (productIds.length === 0) return;
    setState(s => ({ ...s, masterImageStatus: 'generating', masterImageProgress: 0 }));
    const itv = simulateProgress((p) => setState(s => ({ ...s, masterImageProgress: p })));
    try {
      const cleanProductInfo = (state.productInfo || "modern household items")
        .replace(/Gia Dụng Việt/gi, "")
        .trim();
      let productInteraction = "The presenter is professionally showcasing the items on a clean wooden display surface.";
      if (productIds.length > 1) {
        productInteraction = "The presenter is standing gracefully behind a display table with the products arranged neatly in the foreground.";
      }
      let fullPrompt = MASTER_PROMPT_TEMPLATE
        .replace('[PRODUCT_INTERACTION]', productInteraction)
        .replace('[PRODUCT_INFO]', cleanProductInfo);
      const refs: string[] = [];
      refs.push(...productIds);
      if (state.bgMode === 'reference' && state.kocImage) {
        fullPrompt = fullPrompt.replace('[KOC_REFERENCE_LOGIC]', "Inspired by the physical likeness and appearance of the person in the provided reference, maintaining a consistent professional look.");
        refs.push(state.kocImage.mediaId);
      } else {
        fullPrompt = fullPrompt.replace('[KOC_REFERENCE_LOGIC]', "A professional Asian female presenter with a friendly demeanor.");
      }
      const res = await Flow.generate.image({
        prompt: fullPrompt,
        referenceImageMediaIds: refs,
        modelDisplayName: '🍌 Nano Banana Pro',
        aspectRatio: '9:16'
      });
      setState(s => ({ ...s, masterImage: res, masterImageStatus: 'done', masterImageProgress: 100 }));
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('policy')) {
        try {
          const fallbackPrompt = "A professional product photography of high-end home appliances on a clean table, industrial warehouse background, 8K, no text, no logos.";
          const res = await Flow.generate.image({
            prompt: fallbackPrompt,
            referenceImageMediaIds: productIds,
            modelDisplayName: '🍌 Nano Banana Pro',
            aspectRatio: '9:16'
          });
          setState(s => ({ ...s, masterImage: res, masterImageStatus: 'done', masterImageProgress: 100 }));
          return;
        } catch (e2) {
           setState(s => ({ ...s, masterImageStatus: 'error' }));
        }
      }
      setState(s => ({ ...s, masterImageStatus: 'error' }));
    } finally { clearInterval(itv); }
  };
  const generateKocScript = async () => {
    if (!state.masterImage || !state.productInfo) return;
    
    setState(s => ({ 
      ...s, 
      videoFrames: s.videoFrames.map(f => ({ ...f, promptStatus: 'generating' })) 
    }));
    
    try {
      const analysisPrompt = `Bạn là một chuyên gia viết kịch bản TikTok KOC (giọng miền Bắc).
Thông tin sản phẩm: ${state.productInfo}
Thương hiệu: ${state.brandName}
Hãy tạo 5 phân đoạn kịch bản video. 
Mỗi phân đoạn bao gồm:
1. voiceScript: Lời thoại bán hàng tiếng Việt ngắn gọn, súc tích (tối đa 25 từ).
2. motionPrompt: Mô tả hành động (bằng tiếng Anh). 
YÊU CẦU CHO MOTION PROMPT:
- Phải mô tả KOC đang trực tiếp nói câu thoại trong "voiceScript".
- Mô tả khẩu hình miệng (mouth movement) đang phát âm tiếng Việt liên tục và khớp với sắc thái lời thoại.
- Bối cảnh: KOC đứng trong showroom kho hàng, thao tác với sản phẩm một cách chuyên nghiệp.
Hãy trả về dưới định dạng JSON mảng gồm 5 đối tượng:
[{ "voiceScript": "...", "motionPrompt": "..." }]`;
      const { text } = await Flow.generate.text(analysisPrompt, {
        images: [{ base64: state.masterImage.base64, mimeType: state.masterImage.mimeType }]
      });
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const scriptData = JSON.parse(jsonMatch[0]);
        setState(s => ({ 
          ...s, 
          videoFrames: s.videoFrames.map((f, idx) => ({
            ...f,
            voiceScript: scriptData[idx]?.voiceScript || '',
            motionPrompt: scriptData[idx]?.motionPrompt || '',
            promptStatus: 'done'
          }))
        }));
      } else {
        throw new Error("Không thể phân tích kịch bản");
      }
    } catch (e) { 
      console.error(e);
      setState(s => ({ ...s, videoFrames: s.videoFrames.map(f => ({ ...f, promptStatus: 'error' })) }));
    }
  };
  const generateVideo = async (index: number) => {
    const frame = state.videoFrames[index];
    if (!state.masterImage || !frame.motionPrompt) return;
    const update = (obj: Partial<VideoFrame>) => setState(s => ({
      ...s, videoFrames: s.videoFrames.map((f, i) => i === index ? { ...f, ...obj } : f)
    }));
    update({ videoStatus: 'generating', videoProgress: 0 });
    const itv = simulateProgress((p) => update({ videoProgress: p }));
    try {
      const enhancedPrompt = `A professional presenter speaking to camera: "${frame.voiceScript}". ${frame.motionPrompt}. Visible mouth movement and continuous speech throughout. Clean unbranded background.`;
      // Gửi trực tiếp tên model đã chọn (bao gồm cả ngoặc nếu có) tới SDK
      const res = await Flow.generate.video({
        prompt: enhancedPrompt,
        firstFrameImageMediaId: state.masterImage.mediaId,
        modelDisplayName: state.videoModel,
        aspectRatio: '9:16',
        durationSeconds: 8
      });
      update({ videoAsset: res, videoStatus: 'done', videoProgress: 100 });
    } catch (e) { console.error(e); update({ videoStatus: 'error' }); }
    finally { clearInterval(itv); }
  };
  const handleDownloadAll = async () => {
    const videos = state.videoFrames.filter(f => f.videoAsset !== null);
    if (videos.length === 0) return;
    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      videos.forEach((v, i) => {
        const name = `KOC_GiaDung_Clip_0${v.id}.mp4`;
        zip.file(name, v.videoAsset!.base64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await Flow.download({
          base64,
          mimeType: 'application/zip',
          filename: `Video_KOC_ChotDon.zip`
        });
      };
      reader.readAsDataURL(blob);
    } catch (e) { console.error(e); }
    finally { setDownloadingAll(false); }
  };
  if (state.view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white p-6 text-center">
        <div className="animate-fade-in flex flex-col items-center gap-8">
          <div className="w-[280px] h-[280px] rounded-[60px] overflow-hidden border border-gray-100 shadow-2xl bg-gray-50 flex items-center justify-center">
             <span className="material-symbols-outlined text-[100px] text-gray-200">inventory_2</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-6xl font-black uppercase tracking-tight text-black">Xưởng Gia Dụng</h1>
            <p className="text-gray-400 font-semibold tracking-widest text-sm">HỆ THỐNG SẢN XUẤT VIDEO AI THẾ HỆ MỚI</p>
          </div>
          <button 
            onClick={() => setState(s => ({ ...s, view: 'main' }))}
            className="h-[72px] px-16 bg-black text-white font-bold uppercase tracking-widest rounded-3xl hover:bg-gray-900 active:scale-95 transition-all shadow-xl"
          >
            Bắt đầu sản xuất
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full bg-white text-black overflow-hidden">
      <aside className="w-[340px] h-full border-r border-gray-100 flex flex-col bg-white/80 custom-blur z-20">
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-black tracking-tighter uppercase">AI STUDIO</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Cấu hình sản xuất gia dụng</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col gap-8">
          <div className="space-y-3">
            <SectionLabel>1. Hình ảnh Sản phẩm</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {state.products.map((p, i) => (
                <div 
                  key={i} 
                  onClick={() => handleSelectProduct(i)}
                  className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-gray-300 shadow-sm"
                >
                  {p ? (
                    <img src={`data:${p.mimeType};base64,${p.base64}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-gray-300 text-[24px]">add</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <TextArea 
            label="2. Thông tin sản phẩm" 
            value={state.productInfo} 
            onChange={(v) => setState(s => ({ ...s, productInfo: v }))} 
            placeholder="Mô tả công dụng, tính năng, ưu đãi..." 
          />
          <div className="space-y-3">
            <SectionLabel>3. Nhân vật KOC</SectionLabel>
            <SegmentedToggle 
              value={state.bgMode}
              onChange={(v) => setState(s => ({ ...s, bgMode: v }))}
              items={[
                { value: 'auto', label: 'AI Tự Sinh', icon: <span className="material-symbols-outlined text-[16px]">smart_toy</span> },
                { value: 'reference', label: 'Dùng KOC Mẫu', icon: <span className="material-symbols-outlined text-[16px]">person</span> }
              ]}
            />
            {state.bgMode === 'reference' && (
              <div 
                onClick={handleSelectKoc}
                className="w-full h-[140px] bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-100 transition-colors shadow-sm"
              >
                {state.kocImage ? (
                  <img src={`data:${state.kocImage.mimeType};base64,${state.kocImage.base64}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <span className="material-symbols-outlined text-gray-300 text-[32px]">add_a_photo</span>
                    <p className="text-[9px] font-bold text-gray-300 uppercase mt-2">Tải ảnh KOC mẫu</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <SectionLabel>4. Thiết lập AI</SectionLabel>
            <TextInput 
              label="Tên Thương Hiệu" 
              value={state.brandName} 
              onChange={(v) => setState(s => ({ ...s, brandName: v }))} 
              placeholder="Ví dụ: HomeDecor" 
            />
            <FieldDropdown 
              label="Model Video"
              value={state.videoModel}
              options={VIDEO_MODELS}
              onChange={(v) => setState(s => ({ ...s, videoModel: v }))}
            />
          </div>
          <PillButton 
            variant="solid" 
            onClick={generateMasterImage} 
            loading={state.masterImageStatus === 'generating'}
            disabled={state.products.every(o => o === null)}
          >
            TẠO SHOWROOM GỐC
          </PillButton>
          <div className="pt-8 border-t border-gray-100 space-y-4 pb-12">
            <SectionLabel>5. Xuất bản nội dung</SectionLabel>
            <PillButton 
              variant="outline" 
              onClick={generateKocScript} 
              disabled={!state.masterImage || !state.productInfo || state.videoFrames.some(f => f.promptStatus === 'generating')}
              icon={<span className="material-symbols-outlined text-[18px]">psychology</span>}
              loading={state.videoFrames.some(f => f.promptStatus === 'generating')}
            >
              LÊN KỊCH BẢN KOC
            </PillButton>
            
            <PillButton 
              variant="filled" 
              onClick={() => { for(let i=0; i<5; i++) generateVideo(i); }} 
              disabled={state.videoFrames.some(f => !f.motionPrompt) || state.videoFrames.some(f => f.videoStatus === 'generating')}
              icon={<span className="material-symbols-outlined text-[18px]">auto_videocam</span>}
            >
              SẢN XUẤT TOÀN BỘ CLIPS
            </PillButton>
            
            <PillButton
              variant="outline"
              onClick={handleDownloadAll}
              disabled={!state.videoFrames.some(f => f.videoAsset) || downloadingAll}
              loading={downloadingAll}
              icon={<span className="material-symbols-outlined text-[18px]">download</span>}
            >
              TẢI GÓI ZIP (.ZIP)
            </PillButton>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto no-scrollbar p-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto space-y-24 pb-20">
          <section className="animate-fade-in">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-300">Preview Showroom</h3>
              <span className="h-px flex-1 bg-gray-100"></span>
            </div>
            
            <div className="flex justify-center">
              <div className="w-[320px] aspect-[9/16] bg-white rounded-[50px] border border-gray-100 relative overflow-hidden shadow-2xl flex items-center justify-center p-2">
                <div className="w-full h-full rounded-[42px] overflow-hidden bg-gray-50 flex items-center justify-center">
                  {state.masterImage ? (
                    <img src={`data:${state.masterImage.mimeType};base64,${state.masterImage.base64}`} className="w-full h-full object-cover" />
                  ) : state.masterImageStatus === 'generating' ? (
                    <ProgressCircle progress={state.masterImageProgress} size={100} color="#000" />
                  ) : (
                    <div className="text-center opacity-10">
                      <span className="material-symbols-outlined text-[120px] text-gray-400">photo</span>
                    </div>
                  )}
                </div>
                {state.masterImageStatus === 'error' && (
                  <div className="absolute inset-4 bg-red-50/90 backdrop-blur rounded-[42px] flex flex-col items-center justify-center p-8 text-center border border-red-100">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-3">report_gmailerrorred</span>
                    <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">Lỗi Policy</p>
                    <p className="text-[10px] text-red-600 font-medium">Vui lòng kiểm tra lại thông tin sản phẩm và thử lại.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-12">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-300">Phân đoạn Clip KOC</h3>
              <span className="h-px flex-1 bg-gray-100"></span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {state.videoFrames.map((frame, idx) => (
                <div key={frame.id} className="flex flex-col gap-5">
                  <div 
                    onClick={() => frame.videoAsset && setSelectedVideo(frame.videoAsset)}
                    className={`aspect-[9/16] bg-white rounded-[32px] border border-gray-100 relative overflow-hidden flex items-center justify-center shadow-md group ${frame.videoAsset ? 'cursor-pointer' : ''}`}
                  >
                    {frame.videoAsset ? (
                      <>
                        <video 
                          src={`data:${frame.videoAsset.mimeType};base64,${frame.videoAsset.base64}`} 
                          className="w-full h-full object-cover" 
                          autoPlay loop muted playsInline
                        />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-black text-3xl">play_arrow</span>
                          </div>
                        </div>
                      </>
                    ) : frame.videoStatus === 'generating' ? (
                      <ProgressCircle progress={frame.videoProgress} color="#000" />
                    ) : (
                      <div className="text-center opacity-20">
                        <span className="material-symbols-outlined text-4xl text-gray-400">videocam</span>
                        <p className="text-[10px] mt-2 font-black text-gray-400">0{frame.id}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 min-h-[140px] flex flex-col gap-3 shadow-sm overflow-hidden">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Kịch bản:</p>
                      {frame.promptStatus === 'generating' ? (
                        <div className="space-y-2 py-1">
                          <div className="h-2 w-full bg-gray-50 animate-pulse rounded"></div>
                          <div className="h-2 w-3/4 bg-gray-50 animate-pulse rounded"></div>
                        </div>
                      ) : (
                        <p className="text-[11px] font-medium leading-relaxed text-gray-700 italic">
                          {frame.voiceScript || "Đang đợi kịch bản..."}
                        </p>
                      )}
                    </div>
                  </div>
                  <PillButton 
                    variant="outline" 
                    className="!h-[38px] !text-[11px]"
                    onClick={() => generateVideo(idx)}
                    disabled={!frame.motionPrompt}
                    loading={frame.videoStatus === 'generating'}
                  >
                    {frame.videoAsset ? 'LÀM LẠI' : 'TẠO CLIP'}
                  </PillButton>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-xl"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[48px] overflow-hidden shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <video 
              src={`data:${selectedVideo.mimeType};base64,${selectedVideo.base64}`} 
              className="w-full h-full object-contain"
              autoPlay controls playsInline
            />
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}