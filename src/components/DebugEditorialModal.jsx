import React from 'react';
import { Wrench, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';

export const DebugEditorialModal = ({ solution, onClose }) => {
  if (!solution || !solution.debugChanges) return null;

  const { summary, fixes } = solution.debugChanges;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Wrench size={18} />
            <span>Editorial: Debugging Breakdown</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Summary Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-400">
              <Sparkles size={14} /> Fix Summary:
            </div>
            {summary}
          </div>

          {/* List of Applied Fixes */}
          {fixes && fixes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
                Applied Corrections ({fixes.length})
              </h4>
              <div className="space-y-2">
                {fixes.map((fix, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          fix.type === 'added'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        }`}
                      >
                        {fix.type}
                      </span>
                      {fix.wireId && (
                        <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[150px]">
                          {fix.wireId}
                        </span>
                      )}
                    </div>

                    {fix.original && fix.corrected && (
                      <div className="flex items-center gap-2 font-mono text-[10px] bg-zinc-950 px-2 py-1 rounded border border-zinc-800/50 text-zinc-300">
                        <span className="text-rose-400">
                          {fix.original.startHole}→{fix.original.endHole}
                        </span>
                        <ArrowRight size={12} className="text-zinc-500" />
                        <span className="text-emerald-400 font-bold">
                          {fix.corrected.startHole}→{fix.corrected.endHole}
                        </span>
                      </div>
                    )}

                    <p className="text-zinc-300 leading-snug">{fix.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-lg shadow-amber-500/20"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};