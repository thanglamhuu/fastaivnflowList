import React, { useState, useEffect } from 'react';
import { ProjectWizard } from './components/ProjectWizard';
import { DirectorWorkspace } from './components/DirectorWorkspace';
import { ProjectState } from './types';
export default function App() {
  const [project, setProject] = useState<ProjectState | null>(null);
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      h1, h2, h3, .italic-condensed {
        font-family: 'Bebas Neue', sans-serif;
      }
      
      .font-mono {
        font-family: 'Space Mono', monospace;
      }
    `;
    document.head.appendChild(style);
  }, []);
  return (
    <div className="h-full w-full bg-[#101014] text-white overflow-hidden">
      {!project ? (
        <ProjectWizard onComplete={setProject} />
      ) : (
        <DirectorWorkspace project={project} onReset={() => setProject(null)} />
      )}
    </div>
  );
}