import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  X, 
  Calendar, 
  Coins, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationCenter({ onClose, onSelectEntity }) {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="absolute top-14 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-800" />
          <h4 className="font-extrabold text-slate-900 text-xs">Notifications</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id);
                if (onSelectEntity) onSelectEntity(n);
              }}
              className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                n.isRead ? 'opacity-70 bg-white' : 'bg-emerald-50/30'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                n.type === 'payment' ? 'bg-emerald-100 text-emerald-800' :
                n.type === 'booking_status' ? 'bg-blue-100 text-blue-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {n.type === 'payment' ? <Coins className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-xs">{n.title}</h5>
                  <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
