import React, { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  Wrench,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import {
  getCustomerHomeAssets,
  addHomeAsset,
  deleteHomeAsset,
  getCategories
} from '../../services/hommieState';

export default function MyHomeView({ onOpenBookingModal, onNavigate }) {
  const [assets, setAssets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // New Asset Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ac-service');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('Master Bedroom');
  const [purchaseDate, setPurchaseDate] = useState('2024-03-15');
  const [warrantyTill, setWarrantyTill] = useState('2027-03-15');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setAssets(getCustomerHomeAssets());
    setCategories(getCategories());
  }, []);

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!name || !brand) return;

    const newAsset = addHomeAsset({
      name,
      category,
      brand,
      modelNumber: model,
      location,
      purchaseDate,
      warrantyTill,
      notes: notes || 'Installed and operating normally.'
    });

    setAssets(getCustomerHomeAssets());
    setShowAddModal(false);
    setName('');
    setBrand('');
    setModel('');
    setNotes('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this appliance from your home log?')) {
      deleteHomeAsset(id);
      setAssets(getCustomerHomeAssets());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-400/30">
              <Home className="w-3.5 h-3.5" />
              <span>Digital Home Passport</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Home Maintenance Hub</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track appliances, warranty papers, and verified service history. Book maintenance without re-explaining model specs.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition self-start md:self-auto shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Home Appliance</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assets Grid */}
        {assets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Home className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No appliances logged yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your Air Conditioners, RO Water Purifiers, Geysers, and Washing Machines to keep records and get timely service reminders.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
            >
              Log Your First Appliance
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                        {asset.location}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-2">
                        {asset.brand} {asset.name}
                      </h3>
                      <p className="text-xs text-slate-500">{asset.modelNumber || 'Model: Standard'}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Remove appliance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Warranty & Purchase Info */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Purchased</span>
                      <p className="font-semibold text-slate-800">{asset.purchaseDate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Warranty Till</span>
                      <p className="font-semibold text-emerald-700">{asset.warrantyTill || 'Expired'}</p>
                    </div>
                  </div>

                  {/* Notes & Last Service */}
                  <div className="mt-3 text-xs text-slate-600">
                    <p className="line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{asset.notes}"
                    </p>
                  </div>

                  {/* History Timeline */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">Service History</span>
                    {asset.serviceHistory && asset.serviceHistory.length > 0 ? (
                      <div className="space-y-2">
                        {asset.serviceHistory.map((hist, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-800">{hist.service}</span>
                              <span className="text-slate-400 text-[10px] block">
                                {hist.date} by {hist.technician} • ₹{hist.cost}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">No previous service logged via HOMMIE</p>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('discovery', { category: asset.category })}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Book Service / Tune-up</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Add Appliance to Home Hub</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Appliance Type / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1.5 Ton Split AC, 15L Geyser"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Service Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daikin, Havells, LG"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Model Number / Tonnage</label>
                  <input
                    type="text"
                    placeholder="e.g. FTKF50TV"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Room / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Bedroom, Kitchen"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Warranty Expiration</label>
                  <input
                    type="date"
                    value={warrantyTill}
                    onChange={(e) => setWarrantyTill(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Maintenance Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Copper piping replaced in 2025, regular coil cleaning required..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition shadow-sm"
                >
                  Save Appliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
