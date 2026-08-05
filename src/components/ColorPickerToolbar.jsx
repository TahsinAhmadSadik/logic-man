import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

const WIRE_COLORS = [
  { hex: '#ef4444', label: 'Red (VCC)' },
  { hex: '#3b82f6', label: 'Blue (GND)' },
  { hex: '#22c55e', label: 'Green' },
  { hex: '#eab308', label: 'Yellow' },
  { hex: '#f97316', label: 'Orange' },
  { hex: '#a855f7', label: 'Purple' },
  { hex: '#06b6d4', label: 'Cyan' },
  { hex: '#78350f', label: 'Brown' },
  { hex: '#f5f5f5', label: 'White' },
  { hex: '#171717', label: 'Black' }
];

export const ColorPickerToolbar = () => {
  const { selectedColor, setSelectedColor } = useSimulatorStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 p-2 rounded-2xl shadow-2xl backdrop-blur-md">
      <span className="text-[11px] font-semibold text-zinc-400 px-2 uppercase tracking-wider border-r border-zinc-800">
        Wire Color
      </span>

      <div className="flex items-center gap-2 px-1">
        {WIRE_COLORS.map((color) => {
          const isSelected = selectedColor === color.hex;

          return (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color.hex)}
              title={color.label}
              className={`relative group p-1 rounded-full transition-transform duration-150 hover:scale-110 active:scale-95 ${
                isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900 scale-105' : ''
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              
              {/* Tooltip on hover */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-200 text-[10px] font-medium py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700">
                {color.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};