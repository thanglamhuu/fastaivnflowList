import React, { useState, useEffect } from 'react';
import { ProjectWizard } from './components/ProjectWizard';
import { DirectorWorkspace } from './components/DirectorWorkspace';
import { ProjectState } from './types';
import { checkLicense } from './license/aifastLicenseManager';
import { LicenseGate } from './components/LicenseGate';
export default function App() {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [isLicensed, setIsLicensed] = useState<boolean | null>(null);
  useEffect(() => {
    checkLicense().then(result => setIsLicensed(result.valid));
  }, []);
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:ital,wght@0,400;0,600;0,800;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
      
      @font-face {
        font-family: 'TH Legacy Sans';
        src: local('TH Legacy Sans'), local('TH-Legacy-Sans'),
             url('https://cdn.jsdelivr.net/gh/nvh95/vietnamese-fonts@master/TH/TH%20Legacy%20Sans.woff2') format('woff2'),
             url('https://cdn.jsdelivr.net/gh/nvh95/vietnamese-fonts@master/TH/TH%20Legacy%20Sans.woff') format('woff'),
             url('https://cdn.jsdelivr.net/gh/nvh95/vietnamese-fonts@master/TH/TH%20Legacy%20Sans.ttf') format('truetype');
        font-display: swap;
        font-weight: normal;
        font-style: normal;
      }
      .font-th-legacy {
        font-family: 'TH Legacy Sans', 'Montserrat', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
      }
      
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
  if (isLicensed === null) return null;
  if (isLicensed === false) return <LicenseGate onSuccess={() => setIsLicensed(true)} />;
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