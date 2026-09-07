import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Plus, 
  Star, 
  Heart, 
  CreditCard, 
  Bell, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function CustomerProfileSettingsView({ onSelectWorker }) {
  const { currentUser, updateUserSession } = useAuth();
  const { showToast } = useNotifications();

  const [name, setName] = useState(currentUser?.name || 'Rahul Verma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98450 77123');
  const [email, setEmail] = useState(currentUser?.email || 'rahul.verma@example.com');
  const [addresses, setAddresses] = useState(currentUser?.savedAddresses || [
    { id: 'addr-1', label: 'Home', addressLine1: 'Flat 304, Green Heights, 5th Cross', locality: 'Koramangala 4th Block', city: 'Bengaluru', postalCode: '560034', isDefault: true }
  ]);
  const [newLabel, setNewLabel] = useState('Office');
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserSession({ name, phone, email, savedAddresses: addresses });
    showToast('Profile & contact settings saved successfully.');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const item = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      addressLine1: newAddress,
      locality: 'Koramangala 6th Block',
      city: 'Bengaluru',
      postalCode: '560095',
      isDefault: false
    };
    const next = [...addresses, item];
    setAddresses(next);
    updateUserSession({ savedAddresses: next });
    setNewAddress('');
    setShowAddAddress(false);
    showToast('New service address added.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Account & Preferences</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your saved doorstep locations, emergency contacts, and notifications.</p>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="font-extrabold text-slate-900 text-sm">Personal Contact Info</h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone (for OTP & Dispatches)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 font-mono font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address (for Invoices & Bills)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 px-5 rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Save Account Settings
          </button>
        </form>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Saved Doorstep Service Locations</h3>
            <p className="text-xs text-slate-500">Fast checkout addresses for home, office or parents' home.</p>
          </div>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Label:</span>
              {['Home', 'Office', 'Other'].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setNewLabel(l)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    newLabel === l ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <input
              type="text"
              required
              placeholder="Enter full flat, building, cross road & locality..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
            />

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs cursor-pointer"
            >
              Save New Location
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                  {addr.label}
                </span>
                {addr.isDefault && <span className="text-[10px] text-emerald-800 font-bold">● Default</span>}
              </div>
              <p className="font-bold text-slate-900 text-xs">{addr.addressLine1}</p>
              <p className="text-slate-500 text-[11px]">{addr.locality}, {addr.city} - {addr.postalCode}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
