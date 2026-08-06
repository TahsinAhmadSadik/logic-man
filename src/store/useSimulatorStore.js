import { create } from 'zustand';
import { evaluateCircuit } from '../utils/circuitEngine';
import { generateBoardCoordinates } from '../utils/boardCoordinates';

const holeCoords = generateBoardCoordinates();

export const useSimulatorStore = create((set, get) => ({
  powerOn: false,
  selectedColor: '#ef4444',
  wireStartHole: null,
  hoveredHole: null,
  selectedWireId: null,
  selectedIcId: null,
  spawningIcTypeId: null,
  wires: [],
  placedIcs: [],
  switches: [0, 0, 0, 0, 0, 0, 0, 0],
  leds: [0, 0, 0, 0, 0, 0, 0, 0],

  // --- CONFIRMATION MODAL STATE ---
  pendingConfirmAction: null, // { type: 'clearAll' | 'clearWires', title: string, message: string }
  setPendingConfirmAction: (action) => set({ pendingConfirmAction: action }),

  // --- CUSTOM UNDO / REDO HISTORY STACKS ---
  past: [],
  future: [],

  saveSnapshot: () => {
    const { wires, placedIcs, past } = get();
    set({
      past: [...past, { wires: [...wires], placedIcs: [...placedIcs] }],
      future: []
    });
  },

  undo: () => {
    const { past, future, wires, placedIcs, powerOn } = get();
    if (past.length === 0 || powerOn) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      wires: previous.wires,
      placedIcs: previous.placedIcs,
      past: newPast,
      future: [{ wires: [...wires], placedIcs: [...placedIcs] }, ...future],
      selectedWireId: null,
      selectedIcId: null
    });
  },

  redo: () => {
    const { past, future, wires, placedIcs, powerOn } = get();
    if (future.length === 0 || powerOn) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      wires: next.wires,
      placedIcs: next.placedIcs,
      past: [...past, { wires: [...wires], placedIcs: [...placedIcs] }],
      future: newFuture,
      selectedWireId: null,
      selectedIcId: null
    });
  },

  // --- CLEAR ACTIONS (PRESERVES HISTORY) ---
  clearCircuit: () => {
    if (get().powerOn) return;
    const { wires, placedIcs, saveSnapshot } = get();
    if (wires.length === 0 && placedIcs.length === 0) return;

    saveSnapshot();
    set({
      wires: [],
      placedIcs: [],
      selectedWireId: null,
      selectedIcId: null,
      wireStartHole: null,
      spawningIcTypeId: null,
      pendingConfirmAction: null
    });
  },

  clearWires: () => {
    if (get().powerOn) return;
    const { wires, saveSnapshot } = get();
    if (wires.length === 0) return;

    saveSnapshot();
    set({
      wires: [],
      selectedWireId: null,
      wireStartHole: null,
      pendingConfirmAction: null
    });
  },

  // --- ENGINE LOGS & STATUS ---
  circuitLogs: [],
  isShortCircuit: false,

  // Panel View States
  activePanel: null,
  allowedICLimits: null,

  // --- TIMER & STOPWATCH STATE ---
  stopwatchTime: 0,
  isStopwatchRunning: false,

  timerInitialTime: 300,
  timerRemainingTime: 300,
  isTimerRunning: false,
  isTimerAlarmActive: false,

  reevaluate: () => {
    const { powerOn, wires, placedIcs, switches } = get();
    const result = evaluateCircuit({
      powerOn,
      wires,
      placedIcs,
      switches,
      holeCoords
    });

    set({
      leds: result.leds,
      isShortCircuit: result.isShortCircuit,
      circuitLogs: result.logs
    });
  },

  togglePower: () => {
    set((state) => ({
      powerOn: !state.powerOn,
      wireStartHole: null,
      spawningIcTypeId: null
    }));
    get().reevaluate();
  },

  toggleSwitch: (index) => {
    set((state) => {
      const nextSwitches = [...state.switches];
      nextSwitches[index] = nextSwitches[index] === 1 ? 0 : 1;
      return { switches: nextSwitches };
    });
    get().reevaluate();
  },

  setSelectedColor: (color) => set({ selectedColor: color }),
  setHoveredHole: (holeId) => set({ hoveredHole: holeId }),
  setSelectedWireId: (wireId) => set({ selectedWireId: wireId, selectedIcId: null }),
  setSelectedIcId: (icId) => set({ selectedIcId: icId, selectedWireId: null }),
  setSpawningIcTypeId: (icTypeId) => {
    if (get().powerOn) return;
    set({ spawningIcTypeId: icTypeId, wireStartHole: null });
  },

  setAllowedICLimits: (limits) => set({ allowedICLimits: limits }),

  togglePanel: (panelName) =>
    set((state) => ({
      activePanel: state.activePanel === panelName ? null : panelName
    })),

  cancelWireCreation: () => set({ wireStartHole: null, spawningIcTypeId: null }),

  handleHoleClick: (holeId) => {
    const { powerOn, wireStartHole, spawningIcTypeId, selectedColor, wires, placeIc, saveSnapshot } = get();

    if (powerOn) return;

    if (spawningIcTypeId) {
      const match = holeId.match(/^BB_([A-Z]+)(\d+)$/);
      if (!match) return;

      const row = match[1];
      const col = parseInt(match[2], 10);

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
      const isStartOccupied = wires.some(
        (w) => w.startHole === holeId || w.endHole === holeId
      );

      if (isStartOccupied) return;

      set({ wireStartHole: holeId, selectedWireId: null, selectedIcId: null });
    } else if (wireStartHole === holeId) {
      set({ wireStartHole: null });
    } else {
      const isTargetOccupied = wires.some(
        (w) => w.startHole === holeId || w.endHole === holeId
      );

      if (isTargetOccupied) {
        set({ wireStartHole: null });
        return;
      }

      const duplicateExists = wires.some(
        (w) =>
          (w.startHole === wireStartHole && w.endHole === holeId) ||
          (w.startHole === holeId && w.endHole === wireStartHole)
      );

      if (!duplicateExists) {
        saveSnapshot();
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
    if (get().powerOn) return;
    get().saveSnapshot();
    set((state) => ({
      wires: state.wires.filter((w) => w.id !== wireId),
      selectedWireId: state.selectedWireId === wireId ? null : state.selectedWireId
    }));
  },

  placeIc: (icTypeId, blockId, startCol) => {
    if (get().powerOn) return false;
    const { placedIcs, allowedICLimits, saveSnapshot } = get();

    // STRICT CHECK: If limits are active, block ICs that aren't defined in allowedICLimits
    if (allowedICLimits !== null && allowedICLimits !== undefined) {
      if (allowedICLimits[icTypeId] === undefined) {
        alert(`IC ${icTypeId} is not allowed in this experiment!`);
        return false;
      }

      const currentCount = placedIcs.filter((ic) => ic.icTypeId === icTypeId).length;
      if (currentCount >= allowedICLimits[icTypeId]) {
        alert(`Limit reached for IC ${icTypeId}! (${allowedICLimits[icTypeId]} max allowed)`);
        return false;
      }
    }

    const pinCount = icTypeId === '74154' ? 24 : 16;
    const pinsPerSide = pinCount / 2;

    if (startCol + pinsPerSide - 1 > 64) {
      alert("IC extends past the right edge of the breadboard!");
      return false;
    }

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

    saveSnapshot();
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

  deleteIc: (icId) => {
    if (get().powerOn) return;
    get().saveSnapshot();
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

  dismissTimerAlarm: () => set({ isTimerAlarmActive: false }),

  // --- PROBLEM & AUTO-GRADER STATE ---
  currentProblem: null,
  completedProblemIds: JSON.parse(localStorage.getItem('logicman_completed_probs') || '[]'),

  loadProblem: (problemData) => {
    if (!problemData) return;

    set({
      currentProblem: problemData,
      allowedICLimits: problemData.allowedICLimits || null,
      wires: problemData.initialCircuit?.wires || [],
      placedIcs: problemData.initialCircuit?.placedIcs || [],
      past: [],
      future: [],
      powerOn: false,
      activePanel: 'spec'
    });
  },

  markProblemCompleted: (problemId) => {
    set((state) => {
      if (state.completedProblemIds.includes(problemId)) return state;
      const updated = [...state.completedProblemIds, problemId];
      localStorage.setItem('logicman_completed_probs', JSON.stringify(updated));
      return { completedProblemIds: updated };
    });
  },

  // --- EXPORT & IMPORT CIRCUIT ---
  exportCircuit: () => {
    const { wires, placedIcs, currentProblem } = get();
    const circuitData = {
      version: '1.0',
      problemId: currentProblem?.id || 'custom',
      exportedAt: new Date().toISOString(),
      wires,
      placedIcs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(circuitData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `circuit_${currentProblem?.id || 'custom'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importCircuit: (jsonString) => {
    if (get().powerOn) {
      alert('Please turn OFF power before importing a circuit!');
      return false;
    }

    try {
      const parsed = JSON.parse(jsonString);

      // Validate schema format
      if (!Array.isArray(parsed.wires) || !Array.isArray(parsed.placedIcs)) {
        alert('Invalid circuit file format! Missing "wires" or "placedIcs" arrays.');
        return false;
      }

      // Check IC limits if problem limits are active
      const limits = get().allowedICLimits;
      if (limits) {
        const counts = {};
        for (const ic of parsed.placedIcs) {
          counts[ic.icTypeId] = (counts[ic.icTypeId] || 0) + 1;
          if (limits[ic.icTypeId] !== undefined && counts[ic.icTypeId] > limits[ic.icTypeId]) {
            alert(`Import failed: Circuit exceeds allowed limit for IC ${ic.icTypeId}.`);
            return false;
          }
        }
      }

      get().saveSnapshot(); // Save current layout to history before replacing

      set({
        wires: parsed.wires,
        placedIcs: parsed.placedIcs,
        selectedWireId: null,
        selectedIcId: null,
        wireStartHole: null,
        spawningIcTypeId: null
      });

      alert('Circuit imported successfully!');
      return true;
    } catch (err) {
      alert('Failed to parse circuit JSON file: ' + err.message);
      return false;
    }
  }
}));