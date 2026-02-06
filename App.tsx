
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { DesignPreview } from './components/DesignPreview';
import { Message, Role, ChatHistory, DesignData } from './types';
import { gemini } from './services/gemini';

const App: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [currentDesign, setCurrentDesign] = useState<DesignData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    const saved = localStorage.getItem('lumina_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (parsed.length > 0) setActiveChatId(parsed[0].id);
      } catch (e) {
        initializeFirstChat();
      }
    } else {
      initializeFirstChat();
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('lumina_chats', JSON.stringify(chats));
    }
  }, [chats]);

  const initializeFirstChat = () => {
    const initialChat: ChatHistory = {
      id: '1',
      title: 'مساحة عمل جديدة',
      messages: [{ role: Role.MODEL, text: 'أهلاً بك في Lumina AI. أنا هنا لمساعدتك في إنشاء محتوى متطور، تصميم كتب، أو حتى البرمجة. ماذا سننجز اليوم؟' }],
      createdAt: Date.now()
    };
    setChats([initialChat]);
    setActiveChatId('1');
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() || !activeChatId) return;

    const userMsg: Message = { role: Role.USER, text: textToSend };
    
    // Update local state immediately
    setChats(prev => prev.map(c => 
      c.id === activeChatId ? { ...c, messages: [...c.messages, userMsg] } : c
    ));
    
    setInputText('');
    setIsTyping(true);

    try {
      const fullResponse = await gemini.streamMessage(
        activeChat?.messages || [],
        textToSend,
        (currentText) => {
          setChats(prev => prev.map(c => 
            c.id === activeChatId ? {
              ...c,
              messages: [
                ...c.messages.filter((m, i) => i < c.messages.length),
                { role: Role.MODEL, text: currentText }
              ]
            } : c
          ));
        }
      );

      const jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          const designData = JSON.parse(jsonMatch[1]);
          setCurrentDesign(designData);
          setShowDesign(true);
        } catch (e) {
          console.error("Failed to parse design JSON", e);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const createNewChat = () => {
    const id = Date.now().toString();
    const newChat: ChatHistory = {
      id,
      title: 'مشروع إبداعي جديد',
      messages: [{ role: Role.MODEL, text: 'أهلاً بك! دعنا نبدأ العمل على فكرتك القادمة.' }],
      createdAt: Date.now()
    };
    setChats([newChat, ...chats]);
    setActiveChatId(id);
    setCurrentDesign(null);
    setShowDesign(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-['Inter','IBM_Plex_Sans_Arabic']">
      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId} 
        onNewChat={createNewChat} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <main className="flex-1 flex relative h-full">
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${showDesign ? 'w-[45%]' : 'w-full'} h-full flex flex-col relative bg-gradient-to-br from-slate-900 via-[#020617] to-slate-900`}>
          <ChatWindow 
            messages={activeChat?.messages || []} 
            isTyping={isTyping} 
            inputText={inputText}
            setInputText={setInputText}
            onSend={() => handleSend()}
            onMagicAction={(act) => handleSend(act)}
          />
        </div>

        {showDesign && currentDesign && (
          <div className="w-[55%] h-full border-l border-slate-800/60 bg-slate-950/40 backdrop-blur-3xl flex flex-col animate-in slide-in-from-right duration-500">
            <header className="px-6 py-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">Lumina Design Studio</h2>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDesign(false)}
                  className="text-xs px-4 py-2 hover:bg-slate-800 text-slate-400 rounded-full border border-slate-800 transition-all active:scale-95"
                >
                  إغلاق
                </button>
                <button className="text-xs px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                  تصدير لـ Canva
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              <DesignPreview design={currentDesign} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
