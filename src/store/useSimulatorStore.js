import { create } from 'zustand';

export const useSimulatorStore = create((set, get) => ({
  powerOn: false,
  selectedColor: '#ef4444',
  wireStartHole: null,
  hoveredHole: null,
  selectedWireId: null,
  selectedIcId: null,
  spawningIcTypeId: null, // 1. IC type currently following the cursor
  wires: [],
  placedIcs: [], // Array of { id, icTypeId, blockId, startCol }
  switches: [0, 0, 0, 0, 0, 0, 0, 0],
  leds: [0, 0, 0, 0, 0, 0, 0, 0],

  // Panel View States
  activePanel: null, // 'library' | 'timer' | 'problem' | 'truthtable'
  allowedICLimits: null,

  // --- TIMER & STOPWATCH STATE ---
  stopwatchTime: 0, // in seconds
  isStopwatchRunning: false,

  timerInitialTime: 300, // default 5 mins (in seconds)
  timerRemainingTime: 300,
  isTimerRunning: false,
  isTimerAlarmActive: false,

  togglePower: () => set((state) => ({ powerOn: !state.powerOn })),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setHoveredHole: (holeId) => set({ hoveredHole: holeId }),
  setSelectedWireId: (wireId) => set({ selectedWireId: wireId, selectedIcId: null }),
  setSelectedIcId: (icId) => set({ selectedIcId: icId, selectedWireId: null }),
  setSpawningIcTypeId: (icTypeId) => set({ spawningIcTypeId: icTypeId, wireStartHole: null }),

  setAllowedICLimits: (limits) => set({ allowedICLimits: limits }),

  togglePanel: (panelName) =>
    set((state) => ({
      activePanel: state.activePanel === panelName ? null : panelName
    })),

  cancelWireCreation: () => set({ wireStartHole: null, spawningIcTypeId: null }),

  toggleSwitch: (index) =>
    set((state) => {
      const nextSwitches = [...state.switches];
      nextSwitches[index] = nextSwitches[index] === 1 ? 0 : 1;
      return { switches: nextSwitches };
    }),

  handleHoleClick: (holeId) => {
    const { wireStartHole, spawningIcTypeId, selectedColor, wires, placeIc, cancelWireCreation } = get();

    // 1. If spawning an IC, clicking a hole attempts to place Pin 1 there
    if (spawningIcTypeId) {
      const match = holeId.match(/^BB_([A-Z]+)(\d+)$/);
      if (!match) return; // Prevent placing on power rails or switches/LEDs

      const row = match[1];
      const col = parseInt(match[2], 10);

      // Identify block
      let blockId = 'M1';
      if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(row)) blockId = 'M1';
      else if (['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'].includes(row)) blockId = 'M2';
      else blockId = 'M3';

      const success = placeIc(spawningIcTypeId, blockId, col);
      if (success) {
        set({ spawningIcTypeId: null });
      }
      return;
    }

    if (!wireStartHole) {
      set({ wireStartHole: holeId, selectedWireId: null, selectedIcId: null });
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
  },

  // 1 & 2. Place IC & Collision Validation
  placeIc: (icTypeId, blockId, startCol) => {
    const { placedIcs, allowedICLimits } = get();

    // Limit check
    if (allowedICLimits && allowedICLimits[icTypeId] !== undefined) {
      const currentCount = placedIcs.filter((ic) => ic.icTypeId === icTypeId).length;
      if (currentCount >= allowedICLimits[icTypeId]) {
        alert(`Limit reached for IC ${icTypeId}!`);
        return false;
      }
    }

    // Determine pins per side
    const pinCount = icTypeId === '74154' ? 24 : 16; // Standard 14/16/24 pins
    const pinsPerSide = pinCount / 2;

    // Boundary check (Column 1 to 64)
    if (startCol + pinsPerSide - 1 > 64) {
      alert("IC extends past the right edge of the breadboard!");
      return false;
    }

    // Collision check against existing ICs in the same block
    const isOccupied = placedIcs.some((existingIc) => {
      if (existingIc.blockId !== blockId) return false;
      const existingPins = (existingIc.icTypeId === '74154' ? 24 : 16) / 2;
      const existingEnd = existingIc.startCol + existingPins - 1;
      const newEnd = startCol + pinsPerSide - 1;

      return Math.max(existingIc.startCol, startCol) <= Math.min(existingEnd, newEnd);
    });

    if (isOccupied) {
      alert("Space occupied by another IC!");
      return false;
    }

    const newIc = {
      id: `ic_placed_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      icTypeId,
      blockId,
      startCol
    };

    set((state) => ({
      placedIcs: [...state.placedIcs, newIc]
    }));
    return true;
  },

  // 2. Delete Selected IC
  deleteIc: (icId) => {
    set((state) => ({
      placedIcs: state.placedIcs.filter((ic) => ic.id !== icId),
      selectedIcId: state.selectedIcId === icId ? null : state.selectedIcId
    }));
  },

  // --- STOPWATCH ACTIONS ---
  setStopwatchTime: (time) => set({ stopwatchTime: time }),
  setIsStopwatchRunning: (running) => set({ isStopwatchRunning: running }),
  resetStopwatch: () => set({ stopwatchTime: 0, isStopwatchRunning: false }),

  // --- TIMER ACTIONS ---
  setTimerInitialTime: (seconds) =>
    set({
      timerInitialTime: seconds,
      timerRemainingTime: seconds,
      isTimerRunning: false,
      isTimerAlarmActive: false
    }),

  setIsTimerRunning: (running) => set({ isTimerRunning: running }),

  tickTimer: () =>
    set((state) => {
      if (!state.isTimerRunning) return state;
      if (state.timerRemainingTime <= 1) {
        return {
          timerRemainingTime: 0,
          isTimerRunning: false,
          isTimerAlarmActive: true
        };
      }
      return { timerRemainingTime: state.timerRemainingTime - 1 };
    }),

  tickStopwatch: () =>
    set((state) => {
      if (!state.isStopwatchRunning) return state;
      return { stopwatchTime: state.stopwatchTime + 1 };
    }),

  resetTimer: () =>
    set((state) => ({
      timerRemainingTime: state.timerInitialTime,
      isTimerRunning: false,
      isTimerAlarmActive: false
    })),

  dismissTimerAlarm: () => set({ isTimerAlarmActive: false })
}));