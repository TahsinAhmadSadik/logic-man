import { create } from 'zustand';

const MAX_HISTORY = 30;

export const useSimulatorStore = create((set, get) => ({
  // --- HISTORY STATE ---
  history: [],
  future: [],

  // --- SELECTION & TOOLS ---
  selectedColor: '#ef4444', // Default Red wire
  selectedWireId: null,
  
  // --- INTERACTION STATES ---
  wireStartHole: null,      // First hole clicked when creating a wire
  hoveredHole: null,        // Hole currently under cursor
  draggingEndpoint: null,   // { wireId, endpoint: 'start' | 'end' }

  // --- CIRCUIT DATA ---
  wires: [],                // [{ id, startHole, endHole, color }]
  placedICs: [],            // [{ id, type, position: { row, col }, faultyPins: [] }]

  // --- HARDWARE STATES ---
  powerOn: true,
  switches: Array(8).fill(0), // Data Switches 0-7
  leds: Array(8).fill(0),     // LEDs 0-7

  // --- UNDO / REDO SYSTEM ---
  saveHistory: () => {
    const { wires, placedICs, history } = get();
    const snapshot = {
      wires: JSON.parse(JSON.stringify(wires)),
      placedICs: JSON.parse(JSON.stringify(placedICs))
    };
    set({
      history: [...history.slice(-MAX_HISTORY), snapshot],
      future: []
    });
  },

  undo: () => {
    const { history, future, wires, placedICs } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    const current = { wires, placedICs };

    set({
      wires: previous.wires,
      placedICs: previous.placedICs,
      history: newHistory,
      future: [current, ...future]
    });
  },

  redo: () => {
    const { history, future, wires, placedICs } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);
    const current = { wires, placedICs };

    set({
      wires: next.wires,
      placedICs: next.placedICs,
      history: [...history, current],
      future: newFuture
    });
  },

  // --- HOLE & WIRE ACTIONS ---
  setSelectedColor: (color) => set({ selectedColor: color }),
  setHoveredHole: (holeId) => set({ hoveredHole: holeId }),
  selectWire: (wireId) => set({ selectedWireId: wireId }),

  handleHoleClick: (holeId) => {
    const { wireStartHole, selectedColor, wires, saveHistory, draggingEndpoint } = get();

    // Helper: Check if a hole already has a wire endpoint connected
    const isHoleOccupied = (hId, ignoreWireId = null) => {
      return wires.some(w => 
        w.id !== ignoreWireId && (w.startHole === hId || w.endHole === hId)
      );
    };

    // Handling Endpoint Dragging
    if (draggingEndpoint) {
      if (isHoleOccupied(holeId, draggingEndpoint.wireId)) {
        alert("This hole already has a wire connected!");
        return;
      }
      saveHistory();
      const updatedWires = wires.map(w => {
        if (w.id === draggingEndpoint.wireId) {
          return {
            ...w,
            [draggingEndpoint.endpoint === 'start' ? 'startHole' : 'endHole']: holeId
          };
        }
        return w;
      });
      set({ wires: updatedWires, draggingEndpoint: null });
      return;
    }

    // First Hole Clicked
    if (!wireStartHole) {
      if (isHoleOccupied(holeId)) {
        alert("This hole already has a wire connected!");
        return;
      }
      set({ wireStartHole: holeId });
      return;
    }

    // Second Hole Clicked (Complete Wire)
    if (wireStartHole !== holeId) {
      if (isHoleOccupied(holeId)) {
        return;
      }
      saveHistory();
      const newWire = {
        id: `wire-${Date.now()}`,
        startHole: wireStartHole,
        endHole: holeId,
        color: selectedColor
      };
      set({ wires: [...wires, newWire], wireStartHole: null });
    } else {
      set({ wireStartHole: null }); // Cancel selection if clicked same hole twice
    }
  },

  deleteSelectedWire: () => {
    const { selectedWireId, wires, saveHistory } = get();
    if (!selectedWireId) return;

    saveHistory();
    set({
      wires: wires.filter(w => w.id !== selectedWireId),
      selectedWireId: null
    });
  },

  startDraggingEndpoint: (wireId, endpoint) => {
    set({ draggingEndpoint: { wireId, endpoint } });
  },

  // --- HARDWARE CONTROLS ---
  togglePower: () => set((state) => ({ powerOn: !state.powerOn })),

  toggleSwitch: (index) => set((state) => {
    const newSwitches = [...state.switches];
    newSwitches[index] = newSwitches[index] === 0 ? 1 : 0;
    return { switches: newSwitches };
  }),

  setLeds: (newLeds) => set({ leds: newLeds })
}));