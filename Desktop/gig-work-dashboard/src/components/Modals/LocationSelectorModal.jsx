import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, AlertCircle, X, Search, Sparkles } from 'lucide-react';
import { getCities, setCustomerLocality } from '../../services/hommieState';

export default function LocationSelectorModal({ isOpen, onClose, activeLocality, activeCity }) {
  const [cities] = useState(getCities());
  const [selectedCityId, setSelectedCityId] = useState(activeCity?.id || 'blr');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const currentSelectedCity = cities.find((c) => c.id === selectedCityId) || cities[0];

  const filteredLocalities = currentSelectedCity.localities.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.pincode.includes(searchQuery)
  );

  const handleSelectLocality = (locality) => {
    if (!locality.active) return;
    setCustomerLocality(currentSelectedCity.name, locality.name);
    onClose();
  };

  const handleGpsAutoDetect = () => {
    setIsDetectingGps(true);
    setGpsSuccessMessage(null);

    setTimeout(() => {
      setIsDetectingGps(false);
      setCustomerLocality('Bengaluru', 'Indiranagar');
      setGpsSuccessMessage('GPS Verified: Indiranagar, Bengaluru (560038)');
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Select Your Location</h3>
              <p className="text-xs text-slate-500">HOMMIE dispatches pros within your local neighborhood</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="mt-4">
          <button
            onClick={handleGpsAutoDetect}
            disabled={isDetectingGps}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-slate-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition"
          >
            <Navigation className={`w-4 h-4 text-amber-600 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>{isDetectingGps ? 'Detecting Nearest Verified Sector...' : 'Use Current Device GPS Location'}</span>
          </button>
          {gpsSuccessMessage && (
            <p className="text-xs font-bold text-emerald-600 text-center mt-2 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{gpsSuccessMessage}</span>
            </p>
          )}
        </div>

        {/* City Switcher */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Active Launch Cities
          </label>
          <div className="grid grid-cols-2 gap-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCityId(city.id)}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                  selectedCityId === city.id
                    ? 'border-amber-500 bg-amber-50/50 text-slate-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="text-sm block font-bold">{city.name}</span>
                  <span className="text-[10px] text-slate-400">{city.state}</span>
                </div>
                {selectedCityId === city.id && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Locality Search & Grid */}
        <div className="mt-5">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search locality in ${currentSelectedCity.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {filteredLocalities.map((loc) => {
              const isCurrent = activeLocality?.name === loc.name && activeCity?.name === currentSelectedCity.name;
              return (
                <button
                  key={loc.id}
                  disabled={!loc.active}
                  onClick={() => handleSelectLocality(loc)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-50/70 text-slate-950 font-bold'
                      : loc.active
                      ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isCurrent ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">{loc.name}</span>
                      <span className="text-[10px] text-slate-400">PIN: {loc.pincode} • {loc.active ? `${loc.supportedCategories.length} services live` : 'Coming soon'}</span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      Active
                    </span>
                  ) : !loc.active ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-500">
                      Soon
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}