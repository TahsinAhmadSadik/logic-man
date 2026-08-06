import React, { useState } from 'react';
import { IC_CATALOG } from '../data/icCatalog';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { ICManualView } from './ICManualView';
import { Search, HelpCircle, Lock, Cpu, X } from 'lucide-react';

export const ICLibraryPanel = () => {
  const { activePanel, togglePanel, placedIcs, allowedICLimits, setSpawningIcTypeId } = useSimulatorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManualIc, setSelectedManualIc] = useState(null);

  if (activePanel !== 'library') return null;

  const filterQuery = searchTerm.toLowerCase().trim();
  const filteredIcs = IC_CATALOG.filter(
    (ic) =>
      ic.name.toLowerCase().includes(filterQuery) ||
      ic.description.toLowerCase().includes(filterQuery) ||
      ic.category.toLowerCase().includes(filterQuery)
  );

  return (
    <div
      className="fixed top-20 left-6 z-50 w-80 h-[78vh] bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">IC Library</h2>
        </div>
        <button onClick={() => togglePanel('library')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {selectedManualIc ? (
        <ICManualView ic={selectedManualIc} onBack={() => setSelectedManualIc(null)} />
      ) : (
        <div className="flex flex-col h-full p-3 overflow-hidden">
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ICs (7408, AND, MUX)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredIcs.map((ic) => {
              const placedCount = placedIcs.filter((p) => p.icTypeId === ic.id).length;
              const limit = allowedICLimits ? allowedICLimits[ic.id] : null;
              const isLimitReached = limit !== null && limit !== undefined && placedCount >= limit;
              const isDisabled = ic.disabled || isLimitReached;

              return (
                <div
                  key={ic.id}
                  // 1. Click card to select IC and attach ghost to cursor
                  onClick={() => {
                    if (isDisabled) return;
                    setSpawningIcTypeId(ic.id);
                  }}
                  className={`relative group p-3 rounded-xl border transition-all duration-150 ${
                    isDisabled
                      ? 'bg-zinc-950/40 border-zinc-800/40 opacity-60 cursor-not-allowed'
                      : 'bg-zinc-950 border-zinc-800 hover:border-amber-500/50 hover:shadow-lg cursor-pointer'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedManualIc(ic);
                    }}
                    title="Open Manual"
                    className="absolute top-2.5 right-2.5 p-1 text-zinc-500 hover:text-amber-400 rounded-md transition-colors"
                  >
                    <HelpCircle size={15} />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 bg-zinc-900 border border-zinc-700 rounded flex flex-col items-center justify-center p-1 shadow-inner">
                      <div className="w-2 h-1 bg-zinc-950 rounded-b-full border-b border-x border-zinc-700 absolute top-0" />
                      <span className="text-[10px] font-mono font-bold text-amber-400 mt-1">{ic.name}</span>
                    </div>

                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-white font-mono">{ic.name}</h3>
                        {ic.disabled && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                            <Lock size={10} /> Locked
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-1">{ic.description}</p>

                      {limit !== null && limit !== undefined && (
                        <span
                          className={`inline-block mt-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                            isLimitReached
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          Used: {placedCount} / {limit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};