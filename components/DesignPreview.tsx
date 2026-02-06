
import React, { useState } from 'react';
import { DesignData, PageData } from '../types';

interface DesignPreviewProps {
  design: DesignData;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({ design }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const page = design.pages[currentPage];

  const renderPage = (p: PageData) => {
    switch (p.layout) {
      case 'cover':
        return (
          <div className="w-full h-full bg-[#020617] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
            
            <div className="z-10 space-y-10 animate-in fade-in zoom-in duration-1000">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto rounded-full"></div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight">
                {p.content.heading}
              </h1>
              <div className="h-px w-24 bg-slate-800 mx-auto"></div>
              <h3 className="text-xl text-slate-400 font-medium tracking-wide">
                {p.content.subheading}
              </h3>
              <div className="mt-16 text-xs text-slate-500 tracking-[0.4em] uppercase font-bold">
                {p.content.body}
              </div>
            </div>
            
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-30">
               <span className="text-[10px] font-mono tracking-widest text-slate-400 border border-slate-800 px-3 py-1 rounded-full uppercase">Professional Edition</span>
            </div>
          </div>
        );
      case 'content':
      default:
        return (
          <div className="w-full h-full bg-white text-slate-900 p-16 flex flex-col font-['Inter'] shadow-inner">
            <header className="border-b-2 border-slate-900 pb-6 mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{p.content.heading}</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{p.content.subheading}</p>
              </div>
              <span className="text-4xl font-black text-slate-200">0{currentPage + 1}</span>
            </header>
            
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="columns-2 gap-8 text-sm leading-relaxed text-slate-700 font-medium text-justify">
                {p.content.body || "Your content is professionally typeset here. Lumina ensures all layouts are perfectly balanced for high-quality export to Canva. Artifacts and design distortions are eliminated through our structured schema translation."}
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center group hover:bg-slate-100 transition-colors cursor-pointer">
                  <svg className="text-slate-300 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Image Asset Placeholder</span>
                </div>
                <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center group hover:bg-slate-100 transition-colors cursor-pointer">
                  <svg className="text-slate-300 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Visual Asset Placeholder</span>
                </div>
              </div>
            </div>
            
            <footer className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              <span>{design.title}</span>
              <div className="flex gap-2 items-center">
                 <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                 <span>PAGE {currentPage + 1}</span>
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col items-center p-8 bg-slate-900/30">
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden border border-slate-800 transition-all duration-500">
          {renderPage(page)}
        </div>
      </div>
      
      <div className="mt-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex items-center gap-6 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 shadow-xl">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="text-slate-400 hover:text-white disabled:opacity-20 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="flex gap-1">
            {design.pages.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentPage ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700'}`}></div>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(design.pages.length - 1, prev + 1))}
            disabled={currentPage === design.pages.length - 1}
            className="text-slate-400 hover:text-white disabled:opacity-20 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
           <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Active Palette</span>
              <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-slate-900 ring-2 ring-indigo-500/20"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-900"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-900"></div>
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-900"></div>
              </div>
           </div>
           <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Grid System</span>
              <span className="text-xs font-mono text-indigo-400">Canva A4 Std</span>
           </div>
        </div>
      </div>
    </div>
  );
};
