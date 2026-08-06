import { create } from 'zustand';

export const useSimulatorStore = create((set, get) => ({
  powerOn: false,
  selectedColor: '#ef4444',
  wireStartHole: null,
  hoveredHole: null,
  selectedWireId: null,
  wires: [],
  switches: [0, 0, 0, 0, 0, 0, 0, 0],
  leds: [0, 0, 0, 0, 0, 0, 0, 0],

  togglePower: () => set((state) => ({ powerOn: !state.powerOn })),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setHoveredHole: (holeId) => set({ hoveredHole: holeId }),
  setSelectedWireId: (wireId) => set({ selectedWireId: wireId }),

  // Action to cancel wire creation
  cancelWireCreation: () => set({ wireStartHole: null }),

  toggleSwitch: (index) =>
    set((state) => {
      const nextSwitches = [...state.switches];
      nextSwitches[index] = nextSwitches[index] === 1 ? 0 : 1;
      return { switches: nextSwitches };
    }),

  handleHoleClick: (holeId) => {
    const { wireStartHole, selectedColor, wires } = get();

    if (!wireStartHole) {
      set({ wireStartHole: holeId, selectedWireId: null });
    } else if (wireStartHole === holeId) {
      set({ wireStartHole: null });
    } else {
      const duplicateExists = wires.some(
        (w) =>
          (w.startHole === wireStartHole && w.endHole === holeId) ||
          (w.startHole === holeId && w.endHole === wireStartHole)
      );

      if (!duplicateExists) {
        const newWire = {
          id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          startHole: wireStartHole,
          endHole: holeId,
          color: selectedColor
        };

        set((state) => ({
          wires: [...state.wires, newWire],
          wireStartHole: null
        }));
      } else {
        set({ wireStartHole: null });
      }
    }
  },

  deleteWire: (wireId) => {
    set((state) => ({
      wires: state.wires.filter((w) => w.id !== wireId),
      selectedWireId: state.selectedWireId === wireId ? null : state.selectedWireId
    }));
  }
}));