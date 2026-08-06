import React, { useState } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { FileText, Table, X } from 'lucide-react';

export const LabSpecPanel = () => {
  const { activePanel, togglePanel } = useSimulatorStore();
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'truthtable'

  if (activePanel !== 'spec') return null;

  return (
    <div
      className="fixed top-20 left-6 z-50 w-80 h-[70vh] bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Lab Manual</h2>
        </div>
        <button onClick={() => togglePanel('spec')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Dual Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/30">
        <button
          onClick={() => setActiveTab('problem')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'problem'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText size={14} /> Problem
        </button>
        <button
          onClick={() => setActiveTab('truthtable')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'truthtable'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Table size={14} /> Truth Table
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto text-xs">
        {activeTab === 'problem' ? (
          <div className="space-y-3">
            <h3 className="font-bold text-amber-400 uppercase text-[11px] tracking-wide">Experiment Specification</h3>
            <p className="text-zinc-300 leading-relaxed">
              Design and implement a combinational logic circuit to evaluate the boolean function:
            </p>
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-center font-mono font-bold text-amber-300">
              F(A, B, C) = AB + C'
            </div>
            <p className="text-zinc-400 text-[11px]">
              Use DATA SWITCHES 0, 1, 2 for inputs A, B, C and LED 0 for output F.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-bold text-amber-400 uppercase text-[11px] tracking-wide">Expected Truth Table</h3>
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full text-center font-mono text-[11px]">
                <thead className="bg-zinc-950 text-zinc-400">
                  <tr>
                    <th className="p-1.5 border-b border-zinc-800">A</th>
                    <th className="p-1.5 border-b border-zinc-800">B</th>
                    <th className="p-1.5 border-b border-zinc-800">C</th>
                    <th className="p-1.5 border-b border-zinc-800 text-amber-400">F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {[[0,0,0,1], [0,0,1,0], [0,1,0,1], [0,1,1,0], [1,0,0,1], [1,0,1,0], [1,1,0,1], [1,1,1,1]].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-800/40">
                      <td className="p-1.5 text-zinc-300">{row[0]}</td>
                      <td className="p-1.5 text-zinc-300">{row[1]}</td>
                      <td className="p-1.5 text-zinc-300">{row[2]}</td>
                      <td className="p-1.5 font-bold text-amber-400">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};