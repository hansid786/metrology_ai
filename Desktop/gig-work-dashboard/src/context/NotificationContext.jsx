import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGetNotifications, apiMarkNotificationRead } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeChatBooking, setActiveChatBooking] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    const list = await apiGetNotifications(currentUser.id);
    setNotifications(list);
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const markAsRead = async (notifId) => {
    await apiMarkNotificationRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const openChatForBooking = (booking) => {
    setActiveChatBooking(booking);
  };

  const closeChat = () => {
    setActiveChatBooking(null);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toast,
      activeChatBooking,
      showToast,
      markAsRead,
      openChatForBooking,
      closeChat,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
