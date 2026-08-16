import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { Undo2, Redo2, Eraser } from 'lucide-react';

export const ColorPickerToolbar = () => {
  const {
    selectedColor,
    setSelectedColor,
    powerOn,
    past,
    future,
    undo,
    redo,
    isDeleteMode,
    toggleDeleteMode
  } = useSimulatorStore();

  const colors = [
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Brown', hex: '#78350f' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Black', hex: '#18181b' }
  ];

  const canUndo = past.length > 0 && !powerOn;
  const canRedo = future.length > 0 && !powerOn;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md">
      {/* Undo / Redo & Eraser Buttons */}
      <div className="flex items-center gap-1 pr-3 border-r border-zinc-800">
        <button
          onClick={() => undo()}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 rounded-lg transition-colors"
        >
          <Undo2 size={16} />
        </button>

        <button
          onClick={() => redo()}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 rounded-lg transition-colors"
        >
          <Redo2 size={16} />
        </button>

        {/* Eraser / Quick Delete Mode Toggle for Tablets */}
        <button
          onClick={toggleDeleteMode}
          disabled={powerOn}
          title={
            isDeleteMode
              ? 'Eraser Mode Active (Click any wire or IC to delete)'
              : 'Toggle Eraser Mode (Touch friendly)'
          }
          className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
            isDeleteMode
              ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/30 ring-2 ring-rose-400 animate-pulse'
              : 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80'
          } ${powerOn ? 'opacity-30 pointer-events-none' : ''}`}
        >
          <Eraser size={16} />
          {isDeleteMode && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1">
              Del Mode
            </span>
          )}
        </button>
      </div>

      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider select-none">
        Wire Color
      </span>

      <div className="flex items-center gap-1.5">
        {colors.map((c) => {
          const isSelected = selectedColor === c.hex;
          return (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(c.hex)}
              className={`w-6 h-6 rounded-full transition-all duration-150 relative ${
                isSelected
                  ? 'scale-125 ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          );
        })}
      </div>
    </div>
  );
};