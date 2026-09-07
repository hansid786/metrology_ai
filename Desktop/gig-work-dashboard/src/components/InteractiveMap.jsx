import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ShieldCheck, Star, Phone, User, Wrench } from 'lucide-react';

export default function InteractiveMap({ workers, selectedWorker, onSelectWorker }) {
  const [activePin, setActivePin] = useState(selectedWorker || workers[0]);

  // Realistic coordinates projection onto SVG canvas
  const customerLoc = { name: 'Your Location (Koramangala 4th Block)', x: 50, y: 50 };

  const workerCoordinates = [
    { id: 'w-101', name: 'Ramesh Sharma', trade: 'Electrician', x: 42, y: 38, dist: '1.2 km', available: true },
    { id: 'w-102', name: 'Sunita Devi', trade: 'Cleaning', x: 65, y: 62, dist: '2.4 km', available: true },
    { id: 'w-103', name: 'Anand Murthy', trade: 'Plumber', x: 35, y: 68, dist: '1.8 km', available: false },
    { id: 'w-104', name: 'Arshad Khan', trade: 'AC Tech', x: 54, y: 32, dist: '0.9 km', available: true },
    { id: 'w-105', name: 'Rajesh Patil', trade: 'Carpenter', x: 70, y: 35, dist: '3.1 km', available: true }
  ];

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 text-white space-y-4 shadow-xl overflow-hidden relative">
      
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          <h3 className="font-extrabold text-sm text-white">Hyperlocal Geolocation Radar</h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-mono">
          Live GPS Wards (Bengaluru)
        </span>
      </div>

      {/* SVG Canvas Simulation of Map */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden select-none">
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        {/* Radar concentric pulse circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-emerald-500/20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-emerald-500/10 pointer-events-none"></div>

        {/* Customer Location Pin (Center) */}
        <div 
          style={{ top: `${customerLoc.y}%`, left: `${customerLoc.x}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
        >
          <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>
          <span className="text-[9px] font-extrabold bg-indigo-900/90 text-white px-2 py-0.5 rounded-md mt-1 border border-indigo-400/40 shadow-xs whitespace-nowrap">
            You (Koramangala 4th Block)
          </span>
        </div>

        {/* Worker Pins */}
        {workerCoordinates.map((pin) => {
          const isSelected = activePin?.id === pin.id;
          return (
            <div
              key={pin.id}
              style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
              onClick={() => {
                const fullWorker = workers.find(w => w.id === pin.id) || workers[0];
                setActivePin(fullWorker);
                if (onSelectWorker) onSelectWorker(fullWorker);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group flex flex-col items-center transition-transform hover:scale-110"
            >
              <div className={`p-2 rounded-2xl shadow-xl flex items-center gap-1 border-2 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-white scale-110'
                  : pin.available
                  ? 'bg-slate-900 text-white border-emerald-400 hover:bg-slate-800'
                  : 'bg-slate-800 text-slate-400 border-slate-600'
              }`}>
                <Wrench className="w-3.5 h-3.5" />
                <span className="text-[10px] font-extrabold font-mono">{pin.dist}</span>
              </div>
              <span className="text-[9px] font-bold bg-slate-900/90 text-slate-300 px-1.5 py-0.5 rounded mt-0.5 border border-slate-700 whitespace-nowrap">
                {pin.name.split(' ')[0]} ({pin.trade})
              </span>
            </div>
          );
        })}

      </div>

      {/* Selected Worker Mini Card */}
      {activePin && (
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={activePin.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
              alt={activePin.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-600"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-white text-xs">{activePin.name}</h4>
                <span className="text-[10px] text-emerald-400 font-bold">● {activePin.isAvailableNow ? 'Available' : 'Offline'}</span>
              </div>
              <p className="text-[11px] text-slate-400">{activePin.trade} • {activePin.distanceKm || '1.2 km away'}</p>
            </div>
          </div>

          <button
            onClick={() => onSelectWorker && onSelectWorker(activePin)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 px-3.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
          >
            Select Profile
          </button>
        </div>
      )}

    </div>
  );
}
