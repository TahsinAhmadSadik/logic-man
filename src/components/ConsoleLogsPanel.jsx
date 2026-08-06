import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { Terminal, ShieldAlert, X, AlertTriangle, Info } from 'lucide-react';

export const ConsoleLogsPanel = () => {
  const { activePanel, togglePanel, circuitLogs, isShortCircuit, powerOn } = useSimulatorStore();

  if (activePanel !== 'console') return null;

  return (
    <div
      className="fixed top-20 left-6 z-50 w-96 h-[70vh] bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Diagnostic Console</h2>
        </div>
        <button onClick={() => togglePanel('console')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Short Circuit Alert Banner */}
      {isShortCircuit && (
        <div className="p-3 bg-rose-500/20 border-b border-rose-500/40 flex items-center gap-2.5 animate-pulse">
          <ShieldAlert size={20} className="text-rose-400 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-rose-300">CRITICAL SHORT CIRCUIT</h4>
            <p className="text-[11px] text-rose-200">VCC (+5V) is shorted directly to GND! Power supply tripped.</p>
          </div>
        </div>
      )}

      {/* Log Feed */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-black/40">
        {!powerOn ? (
          <div className="text-zinc-500 italic py-4 text-center">
            Turn POWER ON to view real-time circuit diagnostic logs.
          </div>
        ) : circuitLogs.length === 0 ? (
          <div className="text-zinc-500 italic py-4 text-center">No warnings detected. Circuit operating normally.</div>
        ) : (
          circuitLogs.map((log, idx) => {
            const isCritical = log.includes('CRITICAL') || log.includes('SHORT CIRCUIT');
            const isWarning = log.includes('Warning') || log.includes('Contention');
            const isFloating = log.includes('Floating');

            return (
              <div
                key={idx}
                className={`p-2 rounded-lg border leading-relaxed flex items-start gap-2 ${
                  isCritical
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : isFloating
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                }`}
              >
                {isCritical ? (
                  <ShieldAlert size={14} className="mt-0.5 flex-shrink-0 text-rose-400" />
                ) : isWarning ? (
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-400" />
                ) : (
                  <Info size={14} className="mt-0.5 flex-shrink-0 text-sky-400" />
                )}
                <span>{log}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};