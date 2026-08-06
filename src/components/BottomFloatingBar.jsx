import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { Cpu, Timer, FileText, Terminal } from 'lucide-react';

export const BottomFloatingBar = () => {
  const { activePanel, togglePanel, isShortCircuit } = useSimulatorStore();

  const panels = [
    { id: 'library', label: 'IC Library', icon: Cpu },
    { id: 'timer', label: 'Stopwatch', icon: Timer },
    { id: 'spec', label: 'Lab Spec', icon: FileText },
    { id: 'console', label: 'Diagnostics', icon: Terminal, alert: isShortCircuit }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md">
      {panels.map((p) => {
        const Icon = p.icon;
        const isActive = activePanel === p.id;

        return (
          <button
            key={p.id}
            onClick={() => togglePanel(p.id)}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
              isActive
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Icon size={16} />
            <span>{p.label}</span>

            {/* Red blinking dot when a short circuit occurs */}
            {p.alert && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>
        );
      })}
    </div>
  );
};