import React from 'react';
import { Flow } from 'flow-sdk';
import { DramaProject } from '../types';
interface ExportStepProps {
  project: DramaProject;
  onShowToast: (msg: string) => void;
}
export const ExportStep: React.FC<ExportStepProps> = ({ project, onShowToast }) => {
  
  const sanitize = (text: string) => text.replace(/"/g, '""').replace(/\n/g, ' ');
  const downloadCSV = async () => {
    const headers = ["Shot", "Duration", "Angle", "Dialogue", "SFX", "Image Prompt", "Motion Prompt"];
    const rows = project.shots.map(s => [
      s.shotNumber,
      `${s.durationSeconds}s`,
      s.cameraAngle,
      s.dialogue ? `${s.dialogue.characterName}: ${s.dialogue.line}` : '',
      s.sfxAudioCue || '',
      s.visualPrompt,
      s.videoMotionPrompt
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${sanitize(String(cell))}"`).join(','))
    ].join('\n');
    const base64 = btoa(unescape(encodeURIComponent(csvContent)));
    await Flow.download({
      base64,
      mimeType: 'text/csv',
      filename: `${project.title.replace(/\s+/g, '_')}_production_sheet.csv`
    });
    onShowToast("Đã tải xuống bảng kịch bản (CSV)");
  };
  const downloadPromptsMarkdown = async () => {
    let md = `# PROMPT LIST: ${project.title}\n\n`;
    project.shots.forEach(s => {
      md += `## SHOT ${s.shotNumber} (${s.cameraAngle})\n`;
      md += `**Image Prompt:** ${s.visualPrompt}\n\n`;
      md += `**Motion Prompt:** ${s.videoMotionPrompt}\n\n`;
      md += `---\n\n`;
    });
    const base64 = btoa(unescape(encodeURIComponent(md)));
    await Flow.download({
      base64,
      mimeType: 'text/markdown',
      filename: `${project.title.replace(/\s+/g, '_')}_prompts.md`
    });
    onShowToast("Đã tải xuống bộ prompts (Markdown)");
  };
  const downloadProjectJson = async () => {
    const data = JSON.stringify(project, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(data)));
    await Flow.download({
      base64,
      mimeType: 'application/json',
      filename: `${project.title.replace(/\s+/g, '_')}_project.json`
    });
    onShowToast("Đã lưu file dự án (.json)");
  };
  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
      {/* Header Success */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <span className="material-symbols-outlined text-4xl text-emerald-500">task_alt</span>
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase">Dự án sẵn sàng đóng gói</h2>
        <p className="text-slate-500 text-sm font-mono uppercase tracking-[0.2em]">Sẵn sàng cho giai đoạn hậu kỳ & sinh video</p>
      </div>
      {/* Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <button 
          onClick={downloadCSV}
          className="group p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-red-500/50 transition-all text-left flex items-start gap-4"
        >
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">table_view</span>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase">Kịch bản (CSV)</h4>
            <p className="text-[10px] text-slate-500 mt-1">Dành cho Google Sheets / Excel</p>
          </div>
        </button>
        <button 
          onClick={downloadPromptsMarkdown}
          className="group p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-red-500/50 transition-all text-left flex items-start gap-4"
        >
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase">Bộ Prompts (MD)</h4>
            <p className="text-[10px] text-slate-500 mt-1">Dành cho các công cụ AI Video</p>
          </div>
        </button>
        <button 
          onClick={downloadProjectJson}
          className="group p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-red-500/50 transition-all text-left flex items-start gap-4"
        >
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase">Dự án Gốc (JSON)</h4>
            <p className="text-[10px] text-slate-500 mt-1">Để nạp lại vào Xưởng Drama</p>
          </div>
        </button>
      </div>
      {/* Production Sheet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
          <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-sm">list_alt</span>
            Production Shot List
          </h3>
          <span className="text-[10px] font-mono text-slate-500">{project.shots.length} SHOTS TOTAL</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 font-mono">
                <th className="p-4 border-b border-slate-800">NO</th>
                <th className="p-4 border-b border-slate-800">ANGLE</th>
                <th className="p-4 border-b border-slate-800">DIALOGUE & SFX</th>
                <th className="p-4 border-b border-slate-800">MOTION PROMPT</th>
                <th className="p-4 border-b border-slate-800 text-right">MEDIA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {project.shots.map((shot) => (
                <tr key={shot.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-black text-red-500">#{shot.shotNumber}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold uppercase">{shot.cameraAngle}</span>
                    <div className="text-[9px] text-slate-500 mt-1">{shot.durationSeconds}s</div>
                  </td>
                  <td className="p-4 space-y-2 max-w-xs">
                    {shot.dialogue && (
                      <div className="font-serif italic text-slate-300">
                        "{shot.dialogue.line}"
                        <span className="block text-[10px] font-bold text-red-500 mt-0.5 uppercase">({shot.dialogue.characterName})</span>
                      </div>
                    )}
                    {shot.sfxAudioCue && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                        {shot.sfxAudioCue}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed font-mono italic">
                      {shot.videoMotionPrompt}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    {shot.imageUrl ? (
                      <img src={shot.imageUrl} className="w-16 h-10 object-cover rounded border border-slate-700 ml-auto" />
                    ) : (
                      <span className="text-[9px] text-slate-700 italic">No image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};