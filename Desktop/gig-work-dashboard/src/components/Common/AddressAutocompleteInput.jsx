import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Loader2, Check } from 'lucide-react';
import { searchAddressSuggestions } from '../../services/googleMapsService';

export default function AddressAutocompleteInput({ 
  value, 
  onChange, 
  onSelectAddress, 
  placeholder = Enter house/flat no., street, or sector 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    onChange(query);
    if (query.length > 2) {
      setIsSearching(true);
      setIsOpen(true);
      try {
        const results = await searchAddressSuggestions(query);
        setSuggestions(results);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const detectedAddr = Current GPS Location (, );
        onChange(detectedAddr);
        if (onSelectAddress) {
          onSelectAddress({
            description: detectedAddr,
            locality: 'Live Location',
            city: 'Lucknow',
            lat,
            lng
          });
        }
      },
      (err) => {
        setIsLocating(false);
        // Fallback default
        const fallback = 'Gomti Nagar, Lucknow, Uttar Pradesh 226010';
        onChange(fallback);
        if (onSelectAddress) {
          onSelectAddress({
            description: fallback,
            locality: 'Gomti Nagar',
            city: 'Lucknow',
            lat: 26.8500,
            lng: 80.9950
          });
        }
      },
      { timeout: 8000 }
    );
  };

  return (
    <div ref={wrapperRef} className=relative w-full>
      <div className=relative flex items-center>
        <MapPin className=w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none />
        <input
          type=text
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && value.length > 2 && setIsOpen(true)}
          placeholder={placeholder}
          className=w-full text-xs p-3.5 pl-10 pr-24 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden font-medium text-slate-900 transition-all
          required
        />
        
        <button
          type=button
          onClick={handleDetectLiveLocation}
          disabled={isLocating}
          className=absolute right-2 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-emerald-200 transition-all cursor-pointer
          title=Detect Current GPS Location
        >
          {isLocating ? (
            <Loader2 className=w-3 h-3 animate-spin text-emerald-600 />
          ) : (
            <Navigation className=w-3 h-3 text-emerald-600 />
          )}
          <span>{isLocating ? 'Locating...' : 'GPS'}</span>
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className=absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type=button
              onClick={() => {
                onChange(item.description);
                if (onSelectAddress) onSelectAddress(item);
                setIsOpen(false);
              }}
              className=w-full text-left p-3 hover:bg-emerald-50/70 flex items-start gap-2.5 transition-colors cursor-pointer group
            >
              <MapPin className=w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5 />
              <div className=flex-1 min-w-0>
                <p className=text-xs font-bold text-slate-900 group-hover:text-emerald-950 truncate>
                  {item.locality || item.description.split(',')[0]}
                </p>
                <p className=text-[10px] text-slate-500 truncate>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
