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
import { useAuth } from '../context/AuthContext';
import { getBookingById, sendBookingMessage, subscribeHommieState } from '../services/hommieState';

export default function ChatDrawer({ booking, onClose, userRole }) {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const currentRole = userRole || role || 'customer';
  const isCustomer = currentRole === 'customer';
  const partnerName = isCustomer ? booking?.workerName : booking?.customerName;
  const partnerPhone = isCustomer ? booking?.workerPhone : booking?.customerPhone;
  const partnerAvatar = isCustomer ? booking?.workerAvatar : null;

  const refreshMessages = () => {
    if (!booking) return;
    const latest = getBookingById(booking.id);
    if (latest && latest.messages) {
      setMessages(latest.messages);
    } else if (booking.messages) {
      setMessages(booking.messages);
    } else {
      setMessages([
        {
          id: 'm-seed-1',
          senderRole: 'system',
          senderName: 'HOMMIE Support',
          text: `Booking ${booking.bookingRef} confirmed. Connect directly with ${partnerName}.`,
          timestamp: 'Just now'
        }
      ]);
    }
  };

  useEffect(() => {
    refreshMessages();
    const unsub = subscribeHommieState(refreshMessages);
    return unsub;
  }, [booking?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !booking) return;

    const senderName = isCustomer ? (user?.name || 'Hanzala Siddiqui') : (booking.workerName || 'Arjun Singh');
    sendBookingMessage(booking.id, currentRole, senderName, inputMessage.trim());
    setInputMessage('');
    refreshMessages();
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              {partnerAvatar ? (
                <img
                  src={partnerAvatar}
                  alt={partnerName}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-base">
                  {partnerName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-slate-900"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white truncate max-w-[160px] sm:max-w-[200px]">
                  {partnerName}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Ref: {booking.bookingRef}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {partnerPhone && (
              <a
                href={`tel:${partnerPhone}`}
                className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 border border-emerald-500/30 transition"
                title="Call Directly"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Keep communications on HOMMIE for 30-day warranty protection.</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((msg, idx) => {
            const isMe = msg.senderRole === currentRole;
            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <div key={msg.id || idx} className="text-center my-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-[10px] font-semibold max-w-xs">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs ${
                    isMe
                      ? 'bg-slate-950 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  <span className="block font-bold text-[10px] opacity-70 mb-0.5">
                    {msg.senderName}
                  </span>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[9px] opacity-60 text-right mt-1 font-mono">
                    {msg.timestamp || 'Now'}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message (e.g. I am waiting at the gate)..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-amber-500 transition"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center hover:bg-amber-400 disabled:opacity-50 transition shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
