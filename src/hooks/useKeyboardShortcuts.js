import { useEffect, useRef } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

export const useKeyboardShortcuts = () => {
  const lastActionTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Ignore input fields
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const now = Date.now();
      
      // 2. STRICT DEBOUNCE: Ignore ANY repeated keydown within 250ms
      // This stops double-firing from React StrictMode & keyboard auto-repeat!
      if (now - lastActionTimeRef.current < 250) return;

      const store = useSimulatorStore.getState();

      // 3. Power Toggle: Alt + P (or single 'P' key when not typing)
      if ((e.shiftKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        lastActionTimeRef.current = now;
        store.togglePower();
        return;
      }

      // Disable layout editing shortcuts when Power is ON
      if (store.powerOn) return;

      // 4. Undo: Ctrl + Z / Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        lastActionTimeRef.current = now;
        store.undo();
        return;
      }

      // 5. Redo: Ctrl + Y OR Ctrl + Shift + Z / Cmd + Shift + Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        lastActionTimeRef.current = now;
        store.redo();
        return;
      }

      // 6. Clear Wires Only: Ctrl + Q / Cmd + Q
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        if (store.wires.length === 0) return;
        lastActionTimeRef.current = now;
        store.setPendingConfirmAction({
          type: 'clearWires',
          title: 'Clear All Wires?',
          message: 'This will remove all connected wires from the breadboard. You can Undo this action.'
        });
        return;
      }

      // 7. Clear Entire Circuit: Ctrl + R / Cmd + R
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        if (store.wires.length === 0 && store.placedIcs.length === 0) return;
        lastActionTimeRef.current = now;
        store.setPendingConfirmAction({
          type: 'clearAll',
          title: 'Reset Entire Breadboard?',
          message: 'This will clear all wires and placed ICs. You can Undo this action.'
        });
        return;
      }

      // 8. Delete Selected Wire or IC: Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.selectedWireId) {
          lastActionTimeRef.current = now;
          store.deleteWire(store.selectedWireId);
        } else if (store.selectedIcId) {
          lastActionTimeRef.current = now;
          store.deleteIc(store.selectedIcId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};