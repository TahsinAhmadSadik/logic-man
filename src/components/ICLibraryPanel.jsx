import React, { useState } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { IC_CATALOG } from '../data/icCatalog';
import { Cpu, Search, X, BookOpen } from 'lucide-react';
import { ICManualView } from './ICManualView'; // 1. Import ICManualView

export const ICLibraryPanel = () => {
  const {
    activePanel,
    togglePanel,
    setSpawningIcTypeId,
    powerOn,
    placedIcs,
    allowedICLimits
  } = useSimulatorStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManualIc, setSelectedManualIc] = useState(null); // 2. Add manual state

  if (activePanel !== 'library') return null;

  // 3. If a manual is selected, render ICManualView instead of the library list
  if (selectedManualIc) {
    return (
      <div
        className="fixed top-20 left-6 z-50 w-80 h-[70vh] bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
        onWheel={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ICManualView 
          ic={selectedManualIc} 
          onBack={() => setSelectedManualIc(null)} 
        />
      </div>
    );
  }

  // Filter catalog based on search query AND strict problem IC restrictions
  const filteredCatalog = IC_CATALOG.filter((ic) => {
    const matchesSearch =
      ic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ic.id.includes(searchQuery) ||
      ic.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (allowedICLimits !== null && allowedICLimits !== undefined) {
      return allowedICLimits[ic.id] !== undefined && allowedICLimits[ic.id] > 0;
    }

    return true;
  });

  return (
    <div
      className="fixed top-20 left-6 z-50 w-80 h-[70vh] bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">IC Library</h2>
        </div>
        <button onClick={() => togglePanel('library')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/20">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search IC name, number (e.g., 7404)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* IC List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {filteredCatalog.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs italic">
            No allowed ICs match your filter.
          </div>
        ) : (
          filteredCatalog.map((ic) => {
            const currentPlacedCount = placedIcs.filter((p) => p.icTypeId === ic.id).length;
            const maxAllowed = allowedICLimits?.[ic.id];
            const isLimitReached = maxAllowed !== undefined && currentPlacedCount >= maxAllowed;

            return (
              <div
                key={ic.id}
                onClick={() => {
                  if (powerOn || isLimitReached) return;
                  setSpawningIcTypeId(ic.id);
                  togglePanel('library');
                }}
                className={`p-3 rounded-xl border transition-all duration-150 ${
                  powerOn || isLimitReached
                    ? 'bg-zinc-900/40 border-zinc-800/50 opacity-50 cursor-not-allowed'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/80 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">{ic.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({ic.pins || 14} Pins)</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* 4. Manual Info Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Don't trigger IC placement
                        setSelectedManualIc(ic);
                      }}
                      title="View IC Manual"
                      className="p-1 hover:bg-zinc-700/60 text-zinc-400 hover:text-amber-400 rounded-md transition-colors"
                    >
                      <BookOpen size={14} />
                    </button>

                    {maxAllowed !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isLimitReached
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {currentPlacedCount}/{maxAllowed} Used
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{ic.description}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};