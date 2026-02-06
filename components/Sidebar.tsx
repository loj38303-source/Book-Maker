
import React from 'react';
import { ChatHistory } from '../types';

interface SidebarProps {
  chats: ChatHistory[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onSelectChat, onNewChat, collapsed, setCollapsed }) => {
  return (
    <div className={`transition-all duration-300 ease-in-out bg-[#020617] border-r border-slate-800/50 flex flex-col h-full shrink-0 relative ${collapsed ? 'w-16' : 'w-72'}`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Lumina AI</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/> : <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/>}
          </svg>
        </button>
      </div>

      <div className="px-3 mb-4">
        <button 
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 py-3 px-3 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-xl text-sm font-semibold transition-all group overflow-hidden ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="text-indigo-400 text-xl font-light group-hover:rotate-90 transition-transform duration-300">+</span>
          {!collapsed && <span className="text-indigo-100">دردشة جديدة</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-right p-3 rounded-xl text-sm transition-all flex items-center gap-3 group relative ${
              activeChatId === chat.id ? 'bg-slate-800/60 text-indigo-400 shadow-sm' : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-300'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${activeChatId === chat.id ? 'bg-indigo-500 scale-125' : 'bg-slate-700'}`}></div>
            {!collapsed && (
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="truncate font-medium">{chat.title}</span>
                <span className="text-[10px] text-slate-600 font-mono">
                  {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
            {activeChatId === chat.id && !collapsed && (
               <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
               </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-900">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-500/20">
            LA
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Lumina Studio Pro</p>
              <p className="text-[10px] text-indigo-400/80 font-semibold tracking-wider uppercase">Enterprise Mode</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
