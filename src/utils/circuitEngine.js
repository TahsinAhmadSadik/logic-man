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
  nodeStates[vccNode] = 1;
  nodeStates[gndNode] = 0;

  // Assign Data Switch output states
  for (let i = 0; i < 8; i++) {
    const swNode = getNode(`SWITCH_OUT_${i}`);
    const swVal = switches[i] === 1 ? 1 : 0;

    if (nodeStates[swNode] !== undefined && nodeStates[swNode] !== swVal) {
      nodeStates[swNode] = 'X';
      logs.push(`[Contention]: Switch ${i} conflicts with another driver on the same node!`);
    } else {
      nodeStates[swNode] = swVal;
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

    for (let i = 0; i < pinsPerSide; i++) {
      const pinNum = i + 1;
      const holeId = `BB_${topRow}${ic.startCol + i}`;
      icPinNodes[ic.id][pinNum] = getNode(holeId);
    }

    for (let i = 0; i < pinsPerSide; i++) {
      const pinNum = icType.pins - i;
      const holeId = `BB_${botRow}${ic.startCol + i}`;
      icPinNodes[ic.id][pinNum] = getNode(holeId);
    }
  });

  // 5. Multi-Pass Gate Evaluation Loop
  let changed = true;
  let pass = 0;

  while (changed && pass < 5) {
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

      if (!isPowerValid && pass === 1) {
        logs.push(
          `[IC Warning]: IC ${icType.name} (${ic.blockId}-Col ${ic.startCol}) lacks proper VCC/GND connections. Logic outputs may glitch.`
        );
      }

      const getPinVal = (pinNum) => {
        const n = pinNodes[pinNum];
        const val = nodeStates[n];
        if (val === undefined || val === 'Z') {
          if (pass === 1) {
            logs.push(`[TTL Floating]: Pin ${pinNum} on IC ${icType.name} is floating -> Treated as Logic 1.`);
          }
          return 1;
        }
        return val;
      };

      const setPinVal = (pinNum, val) => {
        const n = pinNodes[pinNum];
        if (!isPowerValid) {
          val = Math.random() > 0.5 ? 1 : 0;
        }

        if (nodeStates[n] !== val) {
          if (nodeStates[n] !== undefined && nodeStates[n] !== val && nodeStates[n] !== 'Z') {
            nodeStates[n] = 'X';
            logs.push(`[Contention]: IC ${icType.name} Pin ${pinNum} caused signal clash on node!`);
          } else {
            nodeStates[n] = val;
          }
          changed = true;
        }
      };

      switch (icType.id) {
        case '7400': // Quad 2-NAND
          setPinVal(3, ~(getPinVal(1) & getPinVal(2)) & 1);
          setPinVal(6, ~(getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, ~(getPinVal(9) & getPinVal(10)) & 1);
          setPinVal(11, ~(getPinVal(12) & getPinVal(13)) & 1);
          break;

        case '7404': // Hex NOT
          setPinVal(2, ~getPinVal(1) & 1);
          setPinVal(4, ~getPinVal(3) & 1);
          setPinVal(6, ~getPinVal(5) & 1);
          setPinVal(8, ~getPinVal(9) & 1);
          setPinVal(10, ~getPinVal(11) & 1);
          setPinVal(12, ~getPinVal(13) & 1);
          break;

        case '7408': // Quad 2-AND
          setPinVal(3, (getPinVal(1) & getPinVal(2)) & 1);
          setPinVal(6, (getPinVal(4) & getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) & getPinVal(10)) & 1);
          setPinVal(11, (getPinVal(12) & getPinVal(13)) & 1);
          break;

        case '7432': // Quad 2-OR
          setPinVal(3, (getPinVal(1) | getPinVal(2)) & 1);
          setPinVal(6, (getPinVal(4) | getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) | getPinVal(10)) & 1);
          setPinVal(11, (getPinVal(12) | getPinVal(13)) & 1);
          break;

        case '7486': // Quad 2-XOR
          setPinVal(3, (getPinVal(1) ^ getPinVal(2)) & 1);
          setPinVal(6, (getPinVal(4) ^ getPinVal(5)) & 1);
          setPinVal(8, (getPinVal(9) ^ getPinVal(10)) & 1);
          setPinVal(11, (getPinVal(12) ^ getPinVal(13)) & 1);
          break;

        case '7483': { // 4-Bit Full Adder
          const a = (getPinVal(1) << 3) | (getPinVal(3) << 2) | (getPinVal(8) << 1) | getPinVal(10);
          const b = (getPinVal(16) << 3) | (getPinVal(4) << 2) | (getPinVal(7) << 1) | getPinVal(11);
          const cin = getPinVal(13);
          const sum = a + b + cin;

          setPinVal(9, sum & 1);
          setPinVal(6, (sum >> 1) & 1);
          setPinVal(2, (sum >> 2) & 1);
          setPinVal(15, (sum >> 3) & 1);
          setPinVal(14, (sum >> 4) & 1);
          break;
        }

        default:
          break;
      }
    });
  }

  // 6. Output LEDs
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