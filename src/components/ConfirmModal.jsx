import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = () => {
  const { pendingConfirmAction, setPendingConfirmAction, clearCircuit, clearWires } = useSimulatorStore();

  if (!pendingConfirmAction) return null;

  const handleConfirm = () => {
    if (typeof pendingConfirmAction.onConfirm === 'function') {
      pendingConfirmAction.onConfirm();
    } else if (pendingConfirmAction.type === 'clearAll') {
      clearCircuit();
    } else if (pendingConfirmAction.type === 'clearWires') {
      clearWires();
    }
    setPendingConfirmAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle size={18} />
            <span>{pendingConfirmAction.title || 'Confirmation'}</span>
          </div>
          <button
            onClick={() => setPendingConfirmAction(null)}
            className="p-1 text-zinc-400 hover:text-white rounded-md"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-zinc-300 leading-relaxed">
          {pendingConfirmAction.message}
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-950/30 border-t border-zinc-800 flex items-center justify-end gap-2">
          <button
            onClick={() => setPendingConfirmAction(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};