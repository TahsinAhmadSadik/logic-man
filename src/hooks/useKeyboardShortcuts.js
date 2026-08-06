import { useEffect } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

export const useKeyboardShortcuts = () => {
  const {
    selectedWireId,
    deleteWire,
    setSelectedWireId,
    selectedIcId,
    deleteIc,
    setSelectedIcId,
    wireStartHole,
    spawningIcTypeId,
    cancelWireCreation
  } = useSimulatorStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key cancels active placement or clears selection
      if (e.key === 'Escape') {
        if (wireStartHole || spawningIcTypeId) {
          cancelWireCreation();
        } else {
          setSelectedWireId(null);
          setSelectedIcId(null);
        }
      }

      // Delete / Backspace key deletes selected wire or selected IC
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedWireId) {
          deleteWire(selectedWireId);
        } else if (selectedIcId) {
          deleteIc(selectedIcId); // 2. Delete selected IC
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedWireId,
    deleteWire,
    setSelectedWireId,
    selectedIcId,
    deleteIc,
    setSelectedIcId,
    wireStartHole,
    spawningIcTypeId,
    cancelWireCreation
  ]);
};