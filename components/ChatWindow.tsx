
import React, { useRef, useEffect, useState } from 'react';
import { Message, Role } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  inputText: string;
  setInputText: (val: string) => void;
  onSend: () => void;
  onMagicAction: (action: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, inputText, setInputText, onSend, onMagicAction }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMagic, setShowMagic] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const magicActions = [
    { label: '📘 تصميم كتاب PDF', prompt: 'صمم لي كتاب PDF احترافي من 3 صفحات عن موضوع ' },
    { label: '📝 تلخيص متقدم', prompt: 'قم بتلخيص هذا النص بشكل نقاط مع تحليل للعناصر الرئيسية: ' },
    { label: '🎨 لوحة إلهام', prompt: 'أنشئ لي لوحة إلهام تصميمية (Mood board) لعلامة تجارية تعمل في ' },
    { label: '💻 كود نظيف', prompt: 'اكتب كود React احترافي مع Tailwind CSS لـ ' }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full relative">
      {/* Header Info Bar */}
      <div className="h-14 border-b border-slate-800/40 flex items-center px-6 justify-between bg-slate-900/10 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
           <span className="text-xs font-medium text-slate-500">Gemini 3 Pro + Design Engine</span>
        </div>
        <div className="flex items-center gap-4">
           <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:px-12 md:py-8 space-y-8 scroll-smooth"
      >
        {messages.length === 1 && showMagic && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {magicActions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(action.prompt);
                  setShowMagic(false);
                }}
                className="p-4 bg-slate-900/40 border border-slate-800/60 hover:border-indigo-500/50 hover:bg-slate-800/60 rounded-2xl text-right transition-all group flex flex-col items-end gap-2"
              >
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Quick Action</span>
                <span className="text-sm font-semibold text-slate-200 rtl">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${msg.role === Role.USER ? 'items-end' : 'items-start'} group`}
          >
            <div className={`relative max-w-[90%] md:max-w-[80%] p-5 rounded-3xl ${
              msg.role === Role.USER 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10 rounded-tr-none' 
                : 'bg-slate-900/40 text-slate-200 rounded-tl-none border border-slate-800/60 backdrop-blur-sm'
            } ${isArabic(msg.text) ? 'rtl' : 'ltr'}`}>
              
              {/* Message Role Label */}
              <div className={`absolute -top-6 text-[10px] font-bold uppercase tracking-widest text-slate-600 ${msg.role === Role.USER ? 'right-0' : 'left-0'}`}>
                {msg.role === Role.USER ? 'You' : 'Lumina AI'}
              </div>

              <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base selection:bg-indigo-500/30">
                {msg.text.includes('```json') ? (
                  <div className="flex flex-col gap-4">
                     <p>{msg.text.split('```json')[0]}</p>
                     <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                           </div>
                           <span className="text-sm font-bold text-indigo-100">تم إنشاء التصميم بنجاح!</span>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-mono">CANVA OPTIMIZED</span>
                     </div>
                  </div>
                ) : msg.text}
              </div>

              {/* Message Actions */}
              <div className={`absolute bottom-[-28px] opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 ${msg.role === Role.USER ? 'right-0 flex-row-reverse' : 'left-0'}`}>
                <button 
                  onClick={() => copyToClipboard(msg.text)}
                  className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 transition-colors"
                  title="Copy"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                {msg.role === Role.MODEL && (
                  <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 transition-colors" title="Read Aloud">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/40 p-5 rounded-2xl rounded-tl-none border border-slate-800/60 flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 md:px-12 md:pb-10">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative bg-slate-950/80 border border-slate-800/60 focus-within:border-indigo-500/50 rounded-2xl overflow-hidden shadow-2xl transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="اطلب أي شيء... تصميم كتاب، تلخيص، أو مساعدة برمجية"
              className="w-full bg-transparent px-5 py-5 pr-32 text-sm md:text-base resize-none outline-none min-h-[64px] max-h-48 scrollbar-hide rtl"
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button 
                className="p-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                title="Attach file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <button 
                onClick={onSend}
                disabled={!inputText.trim()}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-30 disabled:grayscale"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
