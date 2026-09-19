import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare, X, Send, Bot, Sparkles,
  Volume2, RotateCcw, MessageCircle, Copy, Mic, ThumbsUp, ThumbsDown, Camera, FileWarning
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { generateChatbotResponse, ChatInspectionContext } from '../../services/chatbotEngine';
import { persistenceService } from '../../services/persistenceService';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedFollowups?: string[];
  feedback?: 'up' | 'down';
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
  const navigate = useNavigate();
  const location = useLocation();

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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Do not render the chatbot (neither button nor modal) on login / gateway pages
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  const copyMessage = async (text: string) => {
    try { await navigator.clipboard.writeText(text.replace(/\*\*/g, '')); } catch { /* clipboard may be unavailable */ }
  };

  const getLatestScanContext = (): ChatInspectionContext | undefined => {
    const latest = persistenceService.getConsumerInspections()[0];
    if (!latest) return undefined;
    const result = latest.result;
    return {
      productName: result.product.name || latest.metadata.productName,
      category: result.product.category || latest.metadata.productCategory,
      overallStatus: result.overallStatus,
      compliancePercentage: result.compliancePercentage,
      mrpAmount: result.pricing.mrpAmount,
      quantity: `${result.pricing.netQuantityValue || 'Not detected'} ${result.pricing.netQuantityUnit || ''}`.trim(),
      expiry: result.manufacturingDates?.expiryDate || result.manufacturingDates?.bestBefore || 'Not detected',
      discrepancy: result.pricing.hasPrintedUSP ? `${result.pricing.printedUSPText || 'Declared'} (${result.pricing.differencePercentage}% difference)` : 'Not detected',
      findings: result.findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'WARNING').map(f => f.title),
    };
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages(prev => prev.map(message => message.id === messageId ? { ...message, feedback } : message));
    try { localStorage.setItem(`metrologylens_chat_feedback_${messageId}`, feedback); } catch { /* optional feedback */ }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInputValue(lang === 'hi' ? 'Voice input इस browser में उपलब्ध नहीं है।' : 'Voice input is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => setInputValue(event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
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
      const response = generateChatbotResponse(query, lang, getLatestScanContext());

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
  const latestScan = persistenceService.getConsumerInspections()[0];

  return (
    <>
      {/* Floating Circular Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 p-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-full shadow-2xl shadow-blue-900/50 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 group ${
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

      {/* Full-Page Dedicated Chat Modal View */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="w-full h-full max-w-5xl bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Top Bar Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 px-5 py-4 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-2">
                    <span>AI Legal Metrology Assistant</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI
                    </span>
                  </h3>
                  <p className="text-xs text-blue-300 font-medium">
                    {lang === 'hi' ? 'विधिक मापविज्ञान अधिनियम, 2009 एवं पीसीआर नियम 2011' : 'Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  title={lang === 'hi' ? 'चैट रीसेट करें' : 'Restart Chat'}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'hi' ? 'नई बातचीत' : 'New Chat'}</span>
                </button>
                <button
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setSpeakingId(null);
                    setIsOpen(false);
                  }}
                  className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/10 hover:bg-rose-500/80 transition-all cursor-pointer"
                  title="Close Full Page Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Navigation Strip */}
            <div className="px-5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Quick Actions:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/consumer/scan');
                  }}
                  className="shrink-0 px-3 py-1 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Scan Product</span>
                </button>
                <button
                  onClick={() => handleSend('Explain my latest scan')}
                  disabled={!latestScan}
                  className="shrink-0 px-3 py-1 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all disabled:opacity-40"
                >
                  <FileWarning className="w-3.5 h-3.5 text-blue-600" />
                  <span>Explain Latest Scan</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/consumer/history');
                  }}
                  className="shrink-0 px-3 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>My Scans</span>
                </button>
              </div>
            </div>

            {/* Messages Feed (Full Height Spacious Scroll) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/70">
              <div className="max-w-3xl w-full mx-auto space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-md'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-sm'
                      }`}
                    >
                      <div className="font-normal space-y-1">
                        {renderMessageText(msg.text)}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[10px]">
                        <span className={msg.sender === 'user' ? 'text-blue-100 font-mono' : 'text-slate-400 font-mono'}>
                          {msg.timestamp}
                        </span>

                        {msg.sender === 'bot' && (
                          <div className="flex items-center gap-3 ml-2">
                            <button onClick={() => copyMessage(msg.text)} className="text-slate-400 hover:text-blue-600 cursor-pointer flex items-center gap-1" title="Copy response">
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                            <button onClick={() => handleSpeak(msg.id, msg.text)} className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer" title="Read out loud">
                              <Volume2 className={`w-3.5 h-3.5 ${speakingId === msg.id ? 'text-blue-600 animate-pulse' : ''}`} />
                              <span>{speakingId === msg.id ? (lang === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (lang === 'hi' ? 'सुनें' : 'Listen')}</span>
                            </button>
                            <button onClick={() => handleFeedback(msg.id, 'up')} className={msg.feedback === 'up' ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'} title="Helpful">
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleFeedback(msg.id, 'down')} className={msg.feedback === 'down' ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'} title="Not helpful">
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start items-center animate-in fade-in">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs font-medium text-slate-500 ml-1">
                        {lang === 'hi' ? 'कानूनी धारा उद्धृत कर रहा है...' : 'Searching Legal Metrology Act & PCR 2011...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Prompt Citations Bar */}
            {latestFollowups.length > 0 && !isTyping && (
              <div className="px-5 py-2.5 bg-white border-t border-slate-200 shrink-0">
                <div className="max-w-3xl w-full mx-auto">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Suggested Legal Citations:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {latestFollowups.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/90 rounded-xl text-xs font-bold text-blue-900 text-left transition-all cursor-pointer hover:scale-[1.01] active:scale-98"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Input Dock */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="max-w-3xl w-full mx-auto space-y-2"
              >
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-white'
                    }`}
                    title="Voice Input (Hindi / English)"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      lang === 'hi'
                        ? 'विधिक मापविज्ञान का कोई भी प्रश्न पूछें (उदा. MRP अधिक वसूली, Rule 6, Section 36)...'
                        : 'Ask any legal metrology question (e.g. Rule 6 declarations, Section 36 penalties, USP rules)...'
                    }
                    className="flex-1 bg-transparent border-0 px-2 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`p-2.5 rounded-xl shadow-md transition-all flex items-center justify-center ${
                      inputValue.trim()
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer hover:scale-105 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Enter</kbd> to ask</span>
                  <span>Legal Metrology Act, 2009 • Knowledge Base Active</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
