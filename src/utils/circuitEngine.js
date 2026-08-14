import { IC_CATALOG } from '../data/icCatalog';

class UnionFind {
  constructor() {
    this.parent = {};
  }

  find(i) {
    if (!this.parent[i]) this.parent[i] = i;
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
    }
  }
}

export const evaluateCircuit = ({
  powerOn,
  wires,
  placedIcs,
  switches,
  holeCoords
}) => {
  if (!powerOn) {
    return {
      leds: [0, 0, 0, 0, 0, 0, 0, 0],
      isShortCircuit: false,
      logs: ['[System]: Power OFF. Circuit solver dormant.']
    };
  }

  const logs = ['[System]: Power turned ON. Running circuit evaluation...'];
  const uf = new UnionFind();

  // 1. Merge internal physical node groups
  Object.entries(holeCoords).forEach(([holeId, coord]) => {
    if (coord.nodeGroup) {
      uf.union(holeId, coord.nodeGroup);
    }
  });

  // 2. Merge user wires
  wires.forEach((wire) => {
    uf.union(wire.startHole, wire.endHole);
  });

  const getNode = (holeId) => uf.find(holeId);

  // Set of nodes that have at least one wire connected
  const activeWiredNodes = new Set();
  wires.forEach((w) => {
    activeWiredNodes.add(getNode(w.startHole));
    activeWiredNodes.add(getNode(w.endHole));
  });

  // 3. Identify Hard Power Sources
  const vccNode = getNode('PWR_VCC_1');
  const gndNode = getNode('PWR_GND_1');

  // Short Circuit Check
  if (vccNode === gndNode) {
    return {
      leds: [0, 0, 0, 0, 0, 0, 0, 0],
      isShortCircuit: true,
      logs: [
        ...logs,
        '[CRITICAL SHORT CIRCUIT]: VCC (+5V) is connected directly to GND! Power supply tripped.'
      ]
    };
  }

  const nodeStates = {};
  const nodeDrivers = {}; // Track which pin or source actively drives each node

  nodeStates[vccNode] = 1;
  nodeDrivers[vccNode] = 'PWR_VCC';

  nodeStates[gndNode] = 0;
  nodeDrivers[gndNode] = 'PWR_GND';

  // Assign Data Switch output states
  for (let i = 0; i < 8; i++) {
    const swNode = getNode(`SWITCH_OUT_${i}`);
    const swVal = switches[i] === 1 ? 1 : 0;
    const swKey = `SWITCH_${i}`;

    if (nodeDrivers[swNode] && nodeDrivers[swNode] !== swKey && nodeStates[swNode] !== swVal) {
      nodeStates[swNode] = 'X';
      logs.push(`[Contention]: Switch ${i} conflicts with another driver on the same node!`);
    } else {
      nodeStates[swNode] = swVal;
      nodeDrivers[swNode] = swKey;
    }
  }

  // 4. Map IC Pins to Nodes
  const icPinNodes = {};

  placedIcs.forEach((ic) => {
    const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
    if (!icType) return;

    icPinNodes[ic.id] = {};
    const pinsPerSide = (icType.pins || 14) / 2;

    const topRow = ic.blockId === 'M1' ? 'E' : ic.blockId === 'M2' ? 'O' : 'Y';
    const botRow = ic.blockId === 'M1' ? 'F' : ic.blockId === 'M2' ? 'P' : 'Z';

    // Bottom Pins: Pin 1 to Pin N/2
    for (let i = 0; i < pinsPerSide; i++) {
      const pinNum = i + 1;
      const holeId = `BB_${botRow}${ic.startCol + i}`;
      icPinNodes[ic.id][pinNum] = getNode(holeId);
    }

    // Top Pins: Pin N down to Pin (N/2 + 1)
    for (let i = 0; i < pinsPerSide; i++) {
      const pinNum = icType.pins - i;
      const holeId = `BB_${topRow}${ic.startCol + i}`;
      icPinNodes[ic.id][pinNum] = getNode(holeId);
    }
  });

  // Track logged warnings to avoid duplicate messages per evaluation
  const loggedWarnings = new Set();

  // 5. Multi-Pass Gate Evaluation Loop
  let changed = true;
  let pass = 0;

  while (changed && pass < 20) {
    changed = false;
    pass++;

    placedIcs.forEach((ic) => {
      const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
      if (!icType) return;

      const pinNodes = icPinNodes[ic.id];
      if (!pinNodes) return;

      const isVccConnected = nodeStates[pinNodes[icType.vccPin]] === 1;
      const isGndConnected = nodeStates[pinNodes[icType.gndPin]] === 0;
      const isPowerValid = isVccConnected && isGndConnected;

      // Read Pin Signal with TTL default HIGH
      const getPinVal = (inputPinNum) => {
        const n = pinNodes[inputPinNum];
        const val = nodeStates[n];
        if (val === undefined || val === 'Z') return 1; // TTL default HIGH
        if (val === 'X') return 0;
        return val;
      };

      const setPinVal = (pinNum, val) => {
        const n = pinNodes[pinNum];
        const driverKey = `${ic.id}_pin_${pinNum}`;

        if (!isPowerValid) {
          val = 0;
        }

        // True Contention Check: only trigger if a DIFFERENT driver is pushing a conflicting value
        if (
          nodeDrivers[n] &&
          nodeDrivers[n] !== driverKey &&
          nodeStates[n] !== undefined &&
          nodeStates[n] !== val &&
          nodeStates[n] !== 'Z'
        ) {
          const clashMsg = `[Contention]: IC ${icType.name} Pin ${pinNum} caused signal clash on node!`;
          if (!loggedWarnings.has(clashMsg)) {
            loggedWarnings.add(clashMsg);
            logs.push(clashMsg);
          }
          if (nodeStates[n] !== 'X') {
            nodeStates[n] = 'X';
            changed = true;
          }
        } else {
          nodeDrivers[n] = driverKey;
          if (nodeStates[n] !== val) {
            nodeStates[n] = val;
            changed = true;
          }
        }
      };

      switch (icType.id) {
        // --- BASIC GATES ---
        case '7400': // Quad 2-Input NAND
          setPinVal(3, ~(getPinVal(1) & getPinVal(2)) & 1);
          setPinVal(6, ~(getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, ~(getPinVal(9) & getPinVal(10)) & 1);
          setPinVal(11, ~(getPinVal(12) & getPinVal(13)) & 1);
          break;

        case '7404': // Hex NOT Inverter
          setPinVal(2, ~getPinVal(1) & 1);
          setPinVal(4, ~getPinVal(3) & 1);
          setPinVal(6, ~getPinVal(5) & 1);
          setPinVal(8, ~getPinVal(9) & 1);
          setPinVal(10, ~getPinVal(11) & 1);
          setPinVal(12, ~getPinVal(13) & 1);
          break;

        case '7408': // Quad 2-Input AND
          setPinVal(3, (getPinVal(1) & getPinVal(2)) & 1);
          setPinVal(6, (getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) & getPinVal(10)) & 1);
          setPinVal(11, (getPinVal(12) & getPinVal(13)) & 1);
          break;

        case '7410': // Triple 3-Input NAND
          setPinVal(12, ~(getPinVal(1) & getPinVal(2) & getPinVal(13)) & 1);
          setPinVal(6, ~(getPinVal(3) & getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, ~(getPinVal(9) & getPinVal(10) & getPinVal(11)) & 1);
          break;

        case '7411': // Triple 3-Input AND
          setPinVal(12, (getPinVal(1) & getPinVal(2) & getPinVal(13)) & 1);
          setPinVal(6, (getPinVal(3) & getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) & getPinVal(10) & getPinVal(11)) & 1);
          break;

        case '7420': // Dual 4-Input NAND
          setPinVal(6, ~(getPinVal(1) & getPinVal(2) & getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, ~(getPinVal(9) & getPinVal(10) & getPinVal(12) & getPinVal(13)) & 1);
          break;

        case '7421': // Dual 4-Input AND
          setPinVal(6, (getPinVal(1) & getPinVal(2) & getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) & getPinVal(10) & getPinVal(12) & getPinVal(13)) & 1);
          break;

        case '7425': { // Dual 4-Input NOR with Strobe
          const g1 = getPinVal(3);
          const g2 = getPinVal(11);
          setPinVal(6, g1 === 1 ? (~(getPinVal(1) | getPinVal(2) | getPinVal(4) | getPinVal(5)) & 1) : 1);
          setPinVal(8, g2 === 1 ? (~(getPinVal(9) | getPinVal(10) | getPinVal(12) | getPinVal(13)) & 1) : 1);
          break;
        }

        case '7427': // Triple 3-Input NOR
          setPinVal(12, ~(getPinVal(1) | getPinVal(2) | getPinVal(13)) & 1);
          setPinVal(6, ~(getPinVal(3) | getPinVal(4) | getPinVal(5)) & 1);
          setPinVal(8, ~(getPinVal(9) | getPinVal(10) | getPinVal(11)) & 1);
          break;

        case '7430': { // 8-Input NAND
          const nand8 = ~(
            getPinVal(1) &
            getPinVal(2) &
            getPinVal(3) &
            getPinVal(4) &
            getPinVal(5) &
            getPinVal(6) &
            getPinVal(11) &
            getPinVal(12)
          ) & 1;
          setPinVal(8, nand8);
          break;
        }

        case '7432': // Quad 2-Input OR
          setPinVal(3, (getPinVal(1) | getPinVal(2)) & 1);
          setPinVal(6, (getPinVal(4) | getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) | getPinVal(10)) & 1);
          setPinVal(11, (getPinVal(12) | getPinVal(13)) & 1);
          break;

        case '7486': // Quad 2-Input XOR
          setPinVal(3, (getPinVal(1) ^ getPinVal(2)) & 1);
          setPinVal(6, (getPinVal(4) ^ getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) ^ getPinVal(10)) & 1);
          setPinVal(11, (getPinVal(12) ^ getPinVal(13)) & 1);
          break;

        // --- ARITHMETIC ---
        case '7483': { // 4-Bit Binary Full Adder
          const a = (getPinVal(1) << 3) | (getPinVal(3) << 2) | (getPinVal(8) << 1) | getPinVal(10);
          const b = (getPinVal(16) << 3) | (getPinVal(4) << 2) | (getPinVal(7) << 1) | getPinVal(11);
          const cin = getPinVal(13);
          const sum = a + b + cin;

          setPinVal(9, sum & 1);          // S1
          setPinVal(6, (sum >> 1) & 1);   // S2
          setPinVal(2, (sum >> 2) & 1);   // S3
          setPinVal(15, (sum >> 3) & 1);  // S4
          setPinVal(14, (sum >> 4) & 1);  // COUT
          break;
        }

        // --- DECODERS & ENCODERS ---
        case '74138': { // 3-to-8 Line Decoder
          const e1 = getPinVal(4);
          const e2 = getPinVal(5);
          const e3 = getPinVal(6);
          const enabled = e1 === 0 && e2 === 0 && e3 === 1;

          const addr = (getPinVal(3) << 2) | (getPinVal(2) << 1) | getPinVal(1);
          const outPins = [15, 14, 13, 12, 11, 10, 9, 7];

          for (let i = 0; i < 8; i++) {
            setPinVal(outPins[i], enabled ? (i === addr ? 0 : 1) : 1);
          }
          break;
        }

        case '74145': { // BCD-to-Decimal Decoder
          const addr = (getPinVal(12) << 3) | (getPinVal(13) << 2) | (getPinVal(14) << 1) | getPinVal(15);
          const outPins = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11];

          for (let i = 0; i < 10; i++) {
            setPinVal(outPins[i], i === addr ? 0 : 1);
          }
          break;
        }

        case '74148': { // 8-Line to 3-Line Priority Encoder
          const ei = getPinVal(5);
          if (ei === 1) {
            setPinVal(9, 1);
            setPinVal(7, 1);
            setPinVal(6, 1);
            setPinVal(14, 1);
            setPinVal(15, 1);
            break;
          }

          const inPins = [10, 11, 12, 13, 1, 2, 3, 4];
          let activeIndex = -1;

          for (let i = 7; i >= 0; i--) {
            if (getPinVal(inPins[i]) === 0) {
              activeIndex = i;
              break;
            }
          }

          if (activeIndex === -1) {
            setPinVal(9, 1);
            setPinVal(7, 1);
            setPinVal(6, 1);
            setPinVal(14, 1);
            setPinVal(15, 0);
          } else {
            const code = ~activeIndex & 7;
            setPinVal(9, code & 1);
            setPinVal(7, (code >> 1) & 1);
            setPinVal(6, (code >> 2) & 1);
            setPinVal(14, 0);
            setPinVal(15, 1);
          }
          break;
        }

        case '74154': { // 4-to-16 Line Decoder
          const e0 = getPinVal(18);
          const e1 = getPinVal(19);
          const enabled = e0 === 0 && e1 === 0;

          const addr = (getPinVal(20) << 3) | (getPinVal(21) << 2) | (getPinVal(22) << 1) | getPinVal(23);
          const outPins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17];

          for (let i = 0; i < 16; i++) {
            setPinVal(outPins[i], enabled ? (i === addr ? 0 : 1) : 1);
          }
          break;
        }

        // --- MULTIPLEXERS ---
        case '74151': { // 8-Input Multiplexer
          const e = getPinVal(7);
          if (e === 1) {
            setPinVal(5, 0);
            setPinVal(6, 1);
            break;
          }

          const sel = (getPinVal(9) << 2) | (getPinVal(10) << 1) | getPinVal(11);
          const inPins = [4, 3, 2, 1, 15, 14, 13, 12];
          const selectedVal = getPinVal(inPins[sel]);

          setPinVal(5, selectedVal & 1);
          setPinVal(6, ~selectedVal & 1);
          break;
        }

        case '74153': { // Dual 4-Input Multiplexer
          const s0 = getPinVal(14);
          const s1 = getPinVal(2);
          const sel = (s1 << 1) | s0;

          // MUX 1
          const e1 = getPinVal(1);
          if (e1 === 1) {
            setPinVal(7, 0);
          } else {
            const in1Pins = [6, 5, 4, 3];
            setPinVal(7, getPinVal(in1Pins[sel]) & 1);
          }

          // MUX 2
          const e2 = getPinVal(15);
          if (e2 === 1) {
            setPinVal(9, 0);
          } else {
            const in2Pins = [10, 11, 12, 13];
            setPinVal(9, getPinVal(in2Pins[sel]) & 1);
          }
          break;
        }

        case '74157': { // Quad 2-Input Multiplexer
          const e = getPinVal(15);
          const s = getPinVal(1);

          if (e === 1) {
            setPinVal(4, 0);
            setPinVal(7, 0);
            setPinVal(9, 0);
            setPinVal(12, 0);
            break;
          }

          setPinVal(4, getPinVal(s === 1 ? 3 : 2) & 1);
          setPinVal(7, getPinVal(s === 1 ? 6 : 5) & 1);
          setPinVal(9, getPinVal(s === 1 ? 10 : 11) & 1);
          setPinVal(12, getPinVal(s === 1 ? 13 : 14) & 1);
          break;
        }

        default:
          break;
      }
    });
  }

  // 6. Post-Evaluation Sanity Checks (Clean Diagnostics Reporting)
  placedIcs.forEach((ic) => {
    const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
    if (!icType) return;

    const pinNodes = icPinNodes[ic.id];
    if (!pinNodes) return;

    const isVccConnected = nodeStates[pinNodes[icType.vccPin]] === 1;
    const isGndConnected = nodeStates[pinNodes[icType.gndPin]] === 0;

    if (!isVccConnected || !isGndConnected) {
      logs.push(`[IC Warning]: IC ${icType.name} (${ic.blockId}-Col ${ic.startCol}) lacks proper VCC/GND connections.`);
    }

    // Only flag pins that are truly floating after evaluation has stabilized
    if (Array.isArray(icType.pinout)) {
      icType.pinout.forEach((pinDef) => {
        if (pinDef.type === 'input') {
          const n = pinNodes[pinDef.pin];
          const hasDriver = !!nodeDrivers[n];
          if (!hasDriver && activeWiredNodes.has(n)) {
            logs.push(`[TTL Floating]: Pin ${pinDef.pin} (${pinDef.label}) on IC ${icType.name} is unconnected -> Pulled HIGH.`);
          }
        }
      });
    }
  });

  // 7. Output LEDs
  const newLeds = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 8; i++) {
    const ledNode = getNode(`LED_IN_${i}`);
    const val = nodeStates[ledNode];
    newLeds[i] = val === 1 ? 1 : 0;
  }

  return {
    leds: newLeds,
    isShortCircuit: false,
    logs
  };
};