import React from 'react';
import { HoleCanvas } from './components/HoleCanvas';
import { ColorPickerToolbar } from './components/ColorPickerToolbar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  useKeyboardShortcuts();

  return (
    <div className="w-screen h-screen bg-zinc-950 flex flex-col overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="w-full bg-zinc-900/90 backdrop-blur border-b border-zinc-800 pt-4 pb-3 px-6 flex justify-between items-center text-white z-30 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-wide text-amber-500">
            LogicMan <span className="text-xs text-zinc-400 font-normal">| SB-700 DLD Simulator</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-200">Scroll</kbd> Zoom</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-200">Drag / Middle-Click</kbd> Pan</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-200">Delete</kbd> Remove Wire</span>
          <span><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-200">Ctrl+Z</kbd> Undo</span>
        </div>
      </header>

      {/* Simulator Workspace */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-zinc-950">
        <HoleCanvas />
      </main>

      {/* Floating Figma-Style Color Palette */}
      <ColorPickerToolbar />
    </div>
  );
}