import { useEffect } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

export const useKeyboardShortcuts = () => {
  const {
    selectedWireId,
    deleteWire,
    setSelectedWireId,
    wireStartHole,
    cancelWireCreation
  } = useSimulatorStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Escape key cancels wire drawing if active, otherwise clears wire selection
      if (e.key === 'Escape') {
        if (wireStartHole) {
          cancelWireCreation();
        } else if (selectedWireId) {
          setSelectedWireId(null);
        }
      }

      // 2. Delete / Backspace key deletes selected wire
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedWireId) {
        deleteWire(selectedWireId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWireId, deleteWire, setSelectedWireId, wireStartHole, cancelWireCreation]);
};