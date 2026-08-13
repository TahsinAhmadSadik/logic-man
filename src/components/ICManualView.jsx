import React from 'react';
import { ArrowLeft, Cpu } from 'lucide-react';

export const ICManualView = ({ ic, onBack }) => {
  if (!ic) return null;

  const totalPins = ic.pins || 14;
  const halfPins = totalPins / 2;

  // Left column: Pins 1 to N/2 (ascending)
  const leftPins = Array.from({ length: halfPins }, (_, i) => {
    const pinNum = i + 1;
    return ic.pinout.find((p) => p.pin === pinNum) || { pin: pinNum, label: 'NC', type: 'nc' };
  });

  // Right column: Pins (N/2 + 1) to N (descending so highest pin is at top-right)
  const rightPins = Array.from({ length: halfPins }, (_, i) => {
    const pinNum = totalPins - i;
    return ic.pinout.find((p) => p.pin === pinNum) || { pin: pinNum, label: 'NC', type: 'nc' };
  });

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-200 p-4 overflow-y-auto">
      {/* Header with Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Library
      </button>

      {/* IC Title */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3 mb-4">
        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
          <Cpu size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-mono">{ic.name}</h2>
          <p className="text-xs text-zinc-400">{ic.description}</p>
        </div>
      </div>

      {/* Pin Configuration Diagram */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Pin Configuration ({totalPins}-Pin DIP)
        </h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex justify-center">
          <div className="relative border-2 border-zinc-700 bg-zinc-900 rounded-md py-3 px-8 flex flex-col items-center gap-1.5 shadow-lg min-w-[220px]">
            {/* DIP Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-zinc-950 rounded-b-full border-b border-x border-zinc-700" />
            <span className="text-xs font-mono font-bold text-amber-400 my-1">{ic.name}</span>

            {/* Pins Diagram */}
            <div className="w-full flex justify-between gap-8 text-[11px] font-mono">
              {/* Left Column (Pins 1 -> N/2) */}
              <div className="flex flex-col gap-1.5 text-zinc-300">
                {leftPins.map((p) => (
                  <div key={p.pin} className="flex items-center gap-2">
                    <span className="text-zinc-500 w-3 font-bold">{p.pin}</span>
                    <span className={p.type === 'power' ? 'text-red-400 font-bold' : p.type === 'ground' ? 'text-sky-400 font-bold' : 'text-zinc-200'}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Column (Pins N -> N/2 + 1) */}
              <div className="flex flex-col gap-1.5 text-zinc-300 text-right">
                {rightPins.map((p) => (
                  <div key={p.pin} className="flex items-center justify-end gap-2">
                    <span className={p.type === 'power' ? 'text-red-400 font-bold' : p.type === 'ground' ? 'text-sky-400 font-bold' : 'text-zinc-200'}>
                      {p.label}
                    </span>
                    <span className="text-zinc-500 w-3 font-bold">{p.pin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Truth / Function Table */}
      {ic.manual?.functionTable && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Function Table</h3>
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-zinc-800/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-2">Inputs</th>
                  <th className="p-2 text-right">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {ic.manual.functionTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30">
                    <td className="p-2 text-zinc-300">
                      {Object.entries(row.inputs)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(', ')}
                    </td>
                    <td className="p-2 text-right font-bold text-amber-400">
                      {Object.entries(row.output)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};