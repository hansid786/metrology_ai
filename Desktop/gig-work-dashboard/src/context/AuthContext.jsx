import React, { createContext, useContext, useState, useEffect } from 'react';
import { HOMMIE_SEED_CUSTOMER, HOMMIE_PROFESSIONALS } from '../data/hommieData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hommie_auth_user_v1');
      return saved ? JSON.parse(saved) : HOMMIE_SEED_CUSTOMER;
    } catch (e) {
      return HOMMIE_SEED_CUSTOMER;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (phoneOrEmail, password, roleHint = 'customer') => {
    setIsLoading(true);
    try {
      let user = null;
      if (roleHint === 'worker' || roleHint === 'professional') {
        const pro = HOMMIE_PROFESSIONALS[0];
        user = {
          id: pro.userId,
          proId: pro.id,
          name: pro.name,
          phone: pro.phone,
          email: pro.email,
          role: 'professional',
          trade: pro.trade,
          avatar: pro.avatar,
          kycStatus: pro.kycStatus,
          isAvailable: pro.isAvailable
        };
      } else if (roleHint === 'admin') {
        user = {
          id: 'u-admin-1',
          name: 'HOMMIE Operations Lead',
          phone: '+91 99000 11223',
          email: 'ops@hommie.in',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        };
      } else {
        user = { ...HOMMIE_SEED_CUSTOMER, role: 'customer' };
      }

      setCurrentUser(user);
      localStorage.setItem('hommie_auth_user_v1', JSON.stringify(user));
      return { success: true, user };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const newUser = {
        id: 'u-' + Date.now(),
        name: userData.fullName || 'New Homeowner',
        phone: userData.phone || '+91 98450 00000',
        email: userData.email || 'user@example.com',
        role: userData.role || 'customer',
        city: userData.city || 'Bengaluru',
        activeLocality: userData.locality || 'Indiranagar',
        trade: userData.trade,
        kycStatus: userData.role === 'professional' ? 'pending' : 'verified',
        savedAddresses: [
          {
            id: 'addr-' + Date.now(),
            label: 'Home',
            addressLine1: userData.locality || '12th Main Road',
            locality: userData.locality || 'Indiranagar',
            city: userData.city || 'Bengaluru',
            pincode: '560038',
            isDefault: true
          }
        ]
      };
      setCurrentUser(newUser);
      localStorage.setItem('hommie_auth_user_v1', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const guestCustomer = { ...HOMMIE_SEED_CUSTOMER };
    setCurrentUser(guestCustomer);
    localStorage.setItem('hommie_auth_user_v1', JSON.stringify(guestCustomer));
  };

  const switchRole = (newRole) => {
    if (newRole === 'professional') {
      const pro = HOMMIE_PROFESSIONALS[0];
      const proUser = {
        id: pro.userId,
        proId: pro.id,
        name: pro.name,
        phone: pro.phone,
        email: pro.email,
        role: 'professional',
        trade: pro.trade,
        avatar: pro.avatar,
        kycStatus: pro.kycStatus,
        isAvailable: pro.isAvailable
      };
      setCurrentUser(proUser);
      localStorage.setItem('hommie_auth_user_v1', JSON.stringify(proUser));
    } else if (newRole === 'admin') {
      const adminUser = {
        id: 'u-admin-1',
        name: 'HOMMIE Operations Lead',
        phone: '+91 99000 11223',
        email: 'ops@hommie.in',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('hommie_auth_user_v1', JSON.stringify(adminUser));
    } else {
      const custUser = { ...HOMMIE_SEED_CUSTOMER, role: 'customer' };
      setCurrentUser(custUser);
      localStorage.setItem('hommie_auth_user_v1', JSON.stringify(custUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: Boolean(currentUser),
      role: currentUser?.role || 'customer',
      isLoading,
      login,
      register,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
