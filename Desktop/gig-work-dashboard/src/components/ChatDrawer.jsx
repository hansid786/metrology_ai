import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  CheckCheck, 
  Clock, 
  User, 
  Wrench,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { apiGetMessages, apiSendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatDrawer({ booking, onClose }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isCustomer = currentUser?.role === 'customer';
  const partnerName = isCustomer ? booking.workerName : booking.customerName;
  const partnerPhone = isCustomer ? booking.workerPhone : booking.customerPhone;

  const fetchChat = async () => {
    const list = await apiGetMessages(booking.id);
    setMessages(list);
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 4000);
    return () => clearInterval(interval);
  }, [booking.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await apiSendMessage({
        bookingId: booking.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: isCustomer ? booking.workerId : booking.customerId,
        text: inputMessage.trim()
      });

      if (res.success) {
        setMessages(prev => [...prev, res.message]);
        setInputMessage('');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-sm">
            {partnerName ? partnerName.charAt(0) : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-white text-sm">{partnerName}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Order #{booking.bookingRef} • {booking.serviceTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {partnerPhone && (
            <a
              href={`tel:${partnerPhone}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
              title="Call directly"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc] text-xs">
        
        <div className="text-center py-2">
          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold">
            🔒 Booking-Linked Private Communication
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 shadow-xs ${
                  isMe
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <span className="text-[10px] font-bold block opacity-70">
                  {isMe ? 'You' : msg.senderName}
                </span>
                <p className="text-xs leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] opacity-60 pt-0.5">
                  <span>{msg.createdAt}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder={`Message ${partnerName}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
        />
        <button
          type="submit"
          disabled={isSending || !inputMessage.trim()}
          className="p-2.5 bg-slate-900 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
