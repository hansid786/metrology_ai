import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, User, Sparkles, PhoneCall,
  ShieldCheck, HelpCircle, ChevronRight, Volume2, RotateCcw, Check, MessageCircle, Copy, Trash2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { generateChatbotResponse } from '../../services/chatbotEngine';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedFollowups?: string[];
}

const DEFAULT_PROMPTS = [
  'Is Unit Sale Price mandatory on electronic items?',
  'How to file an overcharging complaint under Rule 6?',
  'What are the penalty rules under Section 36(1)?',
];

const CHAT_STORAGE_KEY = 'metrologylens_chat_history_v2';

function renderMessageText(text: string): React.ReactNode {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={`${line}-${index}`}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
          : part
      )}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
}

export const MetrologyChatBot: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Message[];
    } catch { /* use welcome state */ }
    return [{
      id: 'welcome',
      sender: 'bot' as const,
      text: lang === 'hi'
        ? 'नमस्ते! 🙏 मैं **AI Legal Assistant** हूँ।\nविधिक मापविज्ञान अधिनियम, 2009 और उपभोक्ता अधिकारों पर तुरंत कानूनी जानकारी पाने के लिए नीचे दिए गए प्रॉम्प्ट्स पर टैप करें या अपना प्रश्न पूछें:'
        : 'Hello! 👋 I am the **AI Legal Assistant** under the Legal Metrology Act, 2009.\nTap a prompt chip below or type any legal query for instant statutory citations:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: DEFAULT_PROMPTS,
    }];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch { /* chat remains usable if storage is unavailable */ }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const copyMessage = async (text: string) => {
    try { await navigator.clipboard.writeText(text.replace(/\*\*/g, '')); } catch { /* clipboard may be unavailable */ }
  };

  // Text to Speech
  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateChatbotResponse(query, lang);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: response.suggestedFollowups || DEFAULT_PROMPTS,
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 300);
  };

  const handleResetChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: lang === 'hi'
          ? 'नमस्ते! 🙏 नई बातचीत शुरू हो गई है। आप कोई भी कानूनी या उपभोक्ता प्रश्न पूछ सकते हैं:'
          : 'Hello! 👋 Chat restarted. Tap a prompt or ask any Legal Metrology question:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: DEFAULT_PROMPTS,
      },
    ]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const latestFollowups = messages[messages.length - 1]?.suggestedFollowups || DEFAULT_PROMPTS;

  return (
    <>
      {/* Floating Circular Chat Bubble with Non-Overlapping Offset */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 p-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-full shadow-xl shadow-blue-900/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 group ${
          isOpen ? 'hidden' : 'flex'
        }`}
        title="AI Legal Assistant"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
        </div>
        <span className="text-xs font-black tracking-tight hidden sm:inline">
          💬 AI Legal Assistant
        </span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-2 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[430px] h-[560px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black flex items-center gap-1.5">
                  <span>💬 AI Legal Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-blue-300 font-medium">
                  {lang === 'hi' ? 'विधिक मापविज्ञान अधिनियम, 2009' : 'Legal Metrology Act, 2009 & PCR 2011'}
                </p>
                <span className="text-[9px] text-emerald-300 font-bold">{lang === 'hi' ? 'ऑफलाइन सहायता • चैट सेव है' : 'Offline assistant • chat saved'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setSpeakingId(null);
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="font-normal">
                    {renderMessageText(msg.text)}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 text-[9px]">
                    <span className={msg.sender === 'user' ? 'text-blue-100 font-mono' : 'text-slate-400 font-mono'}>
                      {msg.timestamp}
                    </span>

                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-2 ml-2">
                        <button onClick={() => copyMessage(msg.text)} className="text-slate-400 hover:text-blue-600 cursor-pointer" title="Copy response"><Copy className="w-3 h-3" /></button>
                        <button onClick={() => handleSpeak(msg.id, msg.text)} className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer" title="Read out loud">
                          <Volume2 className={`w-3 h-3 ${speakingId === msg.id ? 'text-blue-600 animate-pulse' : ''}`} />
                          <span>{speakingId === msg.id ? (lang === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (lang === 'hi' ? 'सुनें' : 'Listen')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium text-slate-400 ml-1">
                    {lang === 'hi' ? 'कानूनी धारा उद्धृत कर रहा है...' : 'Fetching statutory citation...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pre-Set Quick Prompt Chips (Checklist Specification) */}
          {latestFollowups.length > 0 && !isTyping && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Quick Legal Citations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {latestFollowups.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1.5 bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 rounded-xl text-[11px] font-bold text-blue-900 text-left transition-all cursor-pointer hover:scale-[1.01] active:scale-98"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={lang === 'hi' ? 'कानूनी प्रश्न पूछें (उदा. Section 36 penalty)...' : 'Type legal query (e.g. Rule 6 overcharging)...'}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center ${
                inputValue.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
