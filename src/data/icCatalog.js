export const IC_CATALOG = [
  // --- BASIC LOGIC GATES ---
  {
    id: '7400',
    name: '7400',
    description: 'Quad 2-Input NAND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: {
      logicSymbol: 'Quad 2-Input NAND',
      functionTable: [
        { inputs: { A: 'L', B: 'L' }, output: { Y: 'H' } },
        { inputs: { A: 'L', B: 'H' }, output: { Y: 'H' } },
        { inputs: { A: 'H', B: 'L' }, output: { Y: 'H' } },
        { inputs: { A: 'H', B: 'H' }, output: { Y: 'L' } }
      ]
    },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '4B', type: 'input' },
      { pin: 3, label: '1Y', type: 'output' },  { pin: 12, label: '4A', type: 'input' },
      { pin: 4, label: '2A', type: 'input' },   { pin: 11, label: '4Y', type: 'output' },
      { pin: 5, label: '2B', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },
  {
    id: '7404',
    name: '7404',
    description: 'Hex Inverter (NOT Gate)',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: {
      logicSymbol: 'Hex NOT Inverter',
      functionTable: [
        { inputs: { A: 'L' }, output: { Y: 'H' } },
        { inputs: { A: 'H' }, output: { Y: 'L' } }
      ]
    },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1Y', type: 'output' },  { pin: 13, label: '6A', type: 'input' },
      { pin: 3, label: '2A', type: 'input' },   { pin: 12, label: '6Y', type: 'output' },
      { pin: 4, label: '2Y', type: 'output' },  { pin: 11, label: '5A', type: 'input' },
      { pin: 5, label: '3A', type: 'input' },   { pin: 10, label: '5Y', type: 'output' },
      { pin: 6, label: '3Y', type: 'output' },  { pin: 9, label: '4A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '4Y', type: 'output' }
    ]
  },
  {
    id: '7408',
    name: '7408',
    description: 'Quad 2-Input AND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: {
      logicSymbol: 'Quad 2-Input AND',
      functionTable: [
        { inputs: { A: 'L', B: 'L' }, output: { Y: 'L' } },
        { inputs: { A: 'L', B: 'H' }, output: { Y: 'L' } },
        { inputs: { A: 'H', B: 'L' }, output: { Y: 'L' } },
        { inputs: { A: 'H', B: 'H' }, output: { Y: 'H' } }
      ]
    },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '4B', type: 'input' },
      { pin: 3, label: '1Y', type: 'output' },  { pin: 12, label: '4A', type: 'input' },
      { pin: 4, label: '2A', type: 'input' },   { pin: 11, label: '4Y', type: 'output' },
      { pin: 5, label: '2B', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },
  {
    id: '7410',
    name: '7410',
    description: 'Triple 3-Input NAND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: { logicSymbol: 'Triple 3-Input NAND' },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '1C', type: 'input' },
      { pin: 3, label: '2A', type: 'input' },   { pin: 12, label: '1Y', type: 'output' },
      { pin: 4, label: '2B', type: 'input' },   { pin: 11, label: '3C', type: 'input' },
      { pin: 5, label: '2C', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },
  {
    id: '7411',
    name: '7411',
    description: 'Triple 3-Input AND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: { logicSymbol: 'Triple 3-Input AND' },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '1C', type: 'input' },
      { pin: 3, label: '2A', type: 'input' },   { pin: 12, label: '1Y', type: 'output' },
      { pin: 4, label: '2B', type: 'input' },   { pin: 11, label: '3C', type: 'input' },
      { pin: 5, label: '2C', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },
  {
    id: '7420',
    name: '7420',
    description: 'Dual 4-Input NAND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: { logicSymbol: 'Dual 4-Input NAND' },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '1D', type: 'input' },
      { pin: 3, label: 'NC', type: 'nc' },      { pin: 12, label: '1C', type: 'input' },
      { pin: 4, label: '1C', type: 'input' },   { pin: 11, label: 'NC', type: 'nc' },
      { pin: 5, label: '1D', type: 'input' },   { pin: 10, label: '2D', type: 'input' },
      { pin: 6, label: '1Y', type: 'output' },  { pin: 9, label: '2C', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '2Y', type: 'output' }
    ]
  },
  {
    id: '7421',
    name: '7421',
    description: 'Dual 4-Input AND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: { logicSymbol: 'Dual 4-Input AND' },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '1D', type: 'input' },
      { pin: 3, label: 'NC', type: 'nc' },      { pin: 12, label: '1C', type: 'input' },
      { pin: 4, label: '1C', type: 'input' },   { pin: 11, label: 'NC', type: 'nc' },
      { pin: 5, label: '1D', type: 'input' },   { pin: 10, label: '2D', type: 'input' },
      { pin: 6, label: '1Y', type: 'output' },  { pin: 9, label: '2C', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '2Y', type: 'output' }
    ]
  },
  {
    id: '7427',
    name: '7427',
    description: 'Triple 3-Input NOR Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: { logicSymbol: 'Triple 3-Input NOR' },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '1C', type: 'input' },
      { pin: 3, label: '2A', type: 'input' },   { pin: 12, label: '1Y', type: 'output' },
      { pin: 4, label: '2B', type: 'input' },   { pin: 11, label: '3C', type: 'input' },
      { pin: 5, label: '2C', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },
  {
    id: '7430',
    name: '7430',
    description: '8-Input NAND Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: { logicSymbol: 'Single 8-Input NAND' },
    pinout: [
      { pin: 1, label: 'A', type: 'input' },    { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: 'B', type: 'input' },    { pin: 13, label: 'NC', type: 'nc' },
      { pin: 3, label: 'C', type: 'input' },    { pin: 12, label: 'H', type: 'input' },
      { pin: 4, label: 'D', type: 'input' },    { pin: 11, label: 'G', type: 'input' },
      { pin: 5, label: 'E', type: 'input' },    { pin: 10, label: 'NC', type: 'nc' },
      { pin: 6, label: 'F', type: 'input' },    { pin: 9, label: 'NC', type: 'nc' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: 'Y', type: 'output' }
    ]
  },
  {
    id: '7432',
    name: '7432',
    description: 'Quad 2-Input OR Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: {
      logicSymbol: 'Quad 2-Input OR',
      functionTable: [
        { inputs: { A: 'L', B: 'L' }, output: { Y: 'L' } },
        { inputs: { A: 'L', B: 'H' }, output: { Y: 'H' } },
        { inputs: { A: 'H', B: 'L' }, output: { Y: 'H' } },
        { inputs: { A: 'H', B: 'H' }, output: { Y: 'H' } }
      ]
    },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '4B', type: 'input' },
      { pin: 3, label: '1Y', type: 'output' },  { pin: 12, label: '4A', type: 'input' },
      { pin: 4, label: '2A', type: 'input' },   { pin: 11, label: '4Y', type: 'output' },
      { pin: 5, label: '2B', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },
  {
    id: '7486',
    name: '7486',
    description: 'Quad 2-Input XOR Gate',
    pins: 14,
    category: 'Gates',
    type: 'combinational',
    disabled: false,
    vccPin: 14,
    gndPin: 7,
    manual: {
      logicSymbol: 'Quad 2-Input XOR',
      functionTable: [
        { inputs: { A: 'L', B: 'L' }, output: { Y: 'L' } },
        { inputs: { A: 'L', B: 'H' }, output: { Y: 'H' } },
        { inputs: { A: 'H', B: 'L' }, output: { Y: 'H' } },
        { inputs: { A: 'H', B: 'H' }, output: { Y: 'L' } }
      ]
    },
    pinout: [
      { pin: 1, label: '1A', type: 'input' },   { pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1B', type: 'input' },   { pin: 13, label: '4B', type: 'input' },
      { pin: 3, label: '1Y', type: 'output' },  { pin: 12, label: '4A', type: 'input' },
      { pin: 4, label: '2A', type: 'input' },   { pin: 11, label: '4Y', type: 'output' },
      { pin: 5, label: '2B', type: 'input' },   { pin: 10, label: '3B', type: 'input' },
      { pin: 6, label: '2Y', type: 'output' },  { pin: 9, label: '3A', type: 'input' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '3Y', type: 'output' }
    ]
  },

  // --- ARITHMETIC CIRCUITS ---
  {
    id: '7483',
    name: '7483',
    description: '4-Bit Binary Full Adder',
    pins: 16,
    category: 'Arithmetic',
    type: 'combinational',
    disabled: false,
    vccPin: 5,
    gndPin: 12,
    manual: {
      logicSymbol: '4-Bit Adder (A + B + Cin)',
      functionTable: [
        { inputs: { A: '4-bit', B: '4-bit', CIN: '0/1' }, output: { SUM: 'S1-S4', COUT: '0/1' } }
      ]
    },
    pinout: [
      { pin: 1, label: 'A4', type: 'input' },   { pin: 16, label: 'B4', type: 'input' },
      { pin: 2, label: 'S3', type: 'output' },  { pin: 15, label: 'S4', type: 'output' },
      { pin: 3, label: 'A3', type: 'input' },   { pin: 14, label: 'COUT', type: 'output' },
      { pin: 4, label: 'B3', type: 'input' },   { pin: 13, label: 'CIN', type: 'input' },
      { pin: 5, label: 'VCC', type: 'power' },  { pin: 12, label: 'GND', type: 'ground' },
      { pin: 6, label: 'S2', type: 'output' },  { pin: 11, label: 'B1', type: 'input' },
      { pin: 7, label: 'B2', type: 'input' },   { pin: 10, label: 'A1', type: 'input' },
      { pin: 8, label: 'A2', type: 'input' },   { pin: 9, label: 'S1', type: 'output' }
    ]
  },

  // --- DECODERS, ENCODERS & MULTIPLEXERS ---
  {
    id: '74138',
    name: '74138',
    description: '3-to-8 Line Decoder / Demux',
    pins: 16,
    category: 'Decoders',
    type: 'combinational',
    disabled: false,
    vccPin: 16,
    gndPin: 8,
    manual: { logicSymbol: '3-to-8 Active-LOW Decoder' },
    pinout: [
      { pin: 1, label: 'A0', type: 'input' },   { pin: 16, label: 'VCC', type: 'power' },
      { pin: 2, label: 'A1', type: 'input' },   { pin: 15, label: 'Y0\'', type: 'output' },
      { pin: 3, label: 'A2', type: 'input' },   { pin: 14, label: 'Y1\'', type: 'output' },
      { pin: 4, label: 'E1\'', type: 'input' }, { pin: 13, label: 'Y2\'', type: 'output' },
      { pin: 5, label: 'E2\'', type: 'input' }, { pin: 12, label: 'Y3\'', type: 'output' },
      { pin: 6, label: 'E3', type: 'input' },   { pin: 11, label: 'Y4\'', type: 'output' },
      { pin: 7, label: 'Y7\'', type: 'output' },{ pin: 10, label: 'Y5\'', type: 'output' },
      { pin: 8, label: 'GND', type: 'ground' }, { pin: 9, label: 'Y6\'', type: 'output' }
    ]
  },
  {
    id: '74145',
    name: '74145',
    description: 'BCD-to-Decimal Decoder',
    pins: 16,
    category: 'Decoders',
    type: 'combinational',
    disabled: false,
    vccPin: 16,
    gndPin: 8,
    manual: { logicSymbol: 'BCD to 1-of-10 Decoder' },
    pinout: [
      { pin: 1, label: 'Y0\'', type: 'output' }, { pin: 16, label: 'VCC', type: 'power' },
      { pin: 2, label: 'Y1\'', type: 'output' }, { pin: 15, label: 'A0', type: 'input' },
      { pin: 3, label: 'Y2\'', type: 'output' }, { pin: 14, label: 'A1', type: 'input' },
      { pin: 4, label: 'Y3\'', type: 'output' }, { pin: 13, label: 'A2', type: 'input' },
      { pin: 5, label: 'Y4\'', type: 'output' }, { pin: 12, label: 'A3', type: 'input' },
      { pin: 6, label: 'Y5\'', type: 'output' }, { pin: 11, label: 'Y9\'', type: 'output' },
      { pin: 7, label: 'Y6\'', type: 'output' }, { pin: 10, label: 'Y8\'', type: 'output' },
      { pin: 8, label: 'GND', type: 'ground' }, { pin: 9, label: 'Y7\'', type: 'output' }
    ]
  },
  {
    id: '74148',
    name: '74148',
    description: '8-Line to 3-Line Priority Encoder',
    pins: 16,
    category: 'Encoders',
    type: 'combinational',
    disabled: false,
    vccPin: 16,
    gndPin: 8,
    manual: { logicSymbol: '8-Input Priority Encoder' },
    pinout: [
      { pin: 1, label: 'I4\'', type: 'input' }, { pin: 16, label: 'VCC', type: 'power' },
      { pin: 2, label: 'I5\'', type: 'input' }, { pin: 15, label: 'EO\'', type: 'output' },
      { pin: 3, label: 'I6\'', type: 'input' }, { pin: 14, label: 'GS\'', type: 'output' },
      { pin: 4, label: 'I7\'', type: 'input' }, { pin: 13, label: 'I3\'', type: 'input' },
      { pin: 5, label: 'EI\'', type: 'input' }, { pin: 12, label: 'I2\'', type: 'input' },
      { pin: 6, label: 'A2\'', type: 'output' },{ pin: 11, label: 'I1\'', type: 'input' },
      { pin: 7, label: 'A1\'', type: 'output' },{ pin: 10, label: 'I0\'', type: 'input' },
      { pin: 8, label: 'GND', type: 'ground' }, { pin: 9, label: 'A0\'', type: 'output' }
    ]
  },
  {
    id: '74151',
    name: '74151',
    description: '8-Input Multiplexer',
    pins: 16,
    category: 'Multiplexers',
    type: 'combinational',
    disabled: false,
    vccPin: 16,
    gndPin: 8,
    manual: { logicSymbol: '8-to-1 Data Selector / MUX' },
    pinout: [
      { pin: 1, label: 'I3', type: 'input' },   { pin: 16, label: 'VCC', type: 'power' },
      { pin: 2, label: 'I2', type: 'input' },   { pin: 15, label: 'I4', type: 'input' },
      { pin: 3, label: 'I1', type: 'input' },   { pin: 14, label: 'I5', type: 'input' },
      { pin: 4, label: 'I0', type: 'input' },   { pin: 13, label: 'I6', type: 'input' },
      { pin: 5, label: 'Y', type: 'output' },   { pin: 12, label: 'I7', type: 'input' },
      { pin: 6, label: 'Y\'', type: 'output' },  { pin: 11, label: 'S0', type: 'input' },
      { pin: 7, label: 'E\'', type: 'input' },  { pin: 10, label: 'S1', type: 'input' },
      { pin: 8, label: 'GND', type: 'ground' }, { pin: 9, label: 'S2', type: 'input' }
    ]
  },
  {
    id: '74153',
    name: '74153',
    description: 'Dual 4-Input Multiplexer',
    pins: 16,
    category: 'Multiplexers',
    type: 'combinational',
    disabled: false,
    vccPin: 16,
    gndPin: 8,
    manual: { logicSymbol: 'Dual 4-to-1 MUX' },
    pinout: [
      { pin: 1, label: '1E\'', type: 'input' }, { pin: 16, label: 'VCC', type: 'power' },
      { pin: 2, label: 'S1', type: 'input' },   { pin: 15, label: '2E\'', type: 'input' },
      { pin: 3, label: '1I3', type: 'input' },  { pin: 14, label: 'S0', type: 'input' },
      { pin: 4, label: '1I2', type: 'input' },  { pin: 13, label: '2I3', type: 'input' },
      { pin: 5, label: '1I1', type: 'input' },  { pin: 12, label: '2I2', type: 'input' },
      { pin: 6, label: '1I0', type: 'input' },  { pin: 11, label: '2I1', type: 'input' },
      { pin: 7, label: '1Y', type: 'output' },  { pin: 10, label: '2I0', type: 'input' },
      { pin: 8, label: 'GND', type: 'ground' }, { pin: 9, label: '2Y', type: 'output' }
    ]
  },
  {
    id: '74154',
    name: '74154',
    description: '4-to-16 Line Decoder / Demux',
    pins: 24,
    category: 'Decoders',
    type: 'combinational',
    disabled: false,
    vccPin: 24,
    gndPin: 12,
    manual: { logicSymbol: '4-to-16 Active-LOW Decoder' },
    pinout: [
      { pin: 1, label: 'Y0\'', type: 'output' }, { pin: 24, label: 'VCC', type: 'power' },
      { pin: 2, label: 'Y1\'', type: 'output' }, { pin: 23, label: 'A0', type: 'input' },
      { pin: 3, label: 'Y2\'', type: 'output' }, { pin: 22, label: 'A1', type: 'input' },
      { pin: 4, label: 'Y3\'', type: 'output' }, { pin: 21, label: 'A2', type: 'input' },
      { pin: 5, label: 'Y4\'', type: 'output' }, { pin: 20, label: 'A3', type: 'input' },
      { pin: 6, label: 'Y5\'', type: 'output' }, { pin: 19, label: 'E1\'', type: 'input' },
      { pin: 7, label: 'Y6\'', type: 'output' }, { pin: 18, label: 'E0\'', type: 'input' },
      { pin: 8, label: 'Y7\'', type: 'output' }, { pin: 17, label: 'Y15\'', type: 'output' },
      { pin: 9, label: 'Y8\'', type: 'output' }, { pin: 16, label: 'Y14\'', type: 'output' },
      { pin: 10, label: 'Y9\'', type: 'output' },{ pin: 15, label: 'Y13\'', type: 'output' },
      { pin: 11, label: 'Y10\'', type: 'output' },{ pin: 14, label: 'Y12\'', type: 'output' },
      { pin: 12, label: 'GND', type: 'ground' }, { pin: 13, label: 'Y11\'', type: 'output' }
    ]
  },
  {
    id: '74157',
    name: '74157',
    description: 'Quad 2-Input Multiplexer (Non-Inverted)',
    pins: 16,
    category: 'Multiplexers',
    type: 'combinational',
    disabled: false,
    vccPin: 16,
    gndPin: 8,
    manual: { logicSymbol: 'Quad 2-to-1 MUX' },
    pinout: [
      { pin: 1, label: 'S', type: 'input' },    { pin: 16, label: 'VCC', type: 'power' },
      { pin: 2, label: '1I0', type: 'input' },  { pin: 15, label: 'E\'', type: 'input' },
      { pin: 3, label: '1I1', type: 'input' },  { pin: 14, label: '4I0', type: 'input' },
      { pin: 4, label: '1Y', type: 'output' },  { pin: 13, label: '4I1', type: 'input' },
      { pin: 5, label: '2I0', type: 'input' },  { pin: 12, label: '4Y', type: 'output' },
      { pin: 6, label: '2I1', type: 'input' },  { pin: 11, label: '3I0', type: 'input' },
      { pin: 7, label: '2Y', type: 'output' },  { pin: 10, label: '3I1', type: 'input' },
      { pin: 8, label: 'GND', type: 'ground' }, { pin: 9, label: '3Y', type: 'output' }
    ]
  },

  // --- SEQUENTIAL ELEMENTS (LOCKED / DISABLED) ---
  {
    id: '7473',
    name: '7473',
    description: 'Dual J-K Flip-Flop with Clear',
    pins: 14,
    category: 'Sequential',
    type: 'sequential',
    disabled: true,
    vccPin: 4,
    gndPin: 11,
    pinout: [
      { pin: 1, label: '1CLK', type: 'input' }, { pin: 14, label: '1J', type: 'input' },
      { pin: 2, label: '1CLR\'', type: 'input' },{ pin: 13, label: '1Q', type: 'output' },
      { pin: 3, label: '1K', type: 'input' },   { pin: 12, label: '1Q\'', type: 'output' },
      { pin: 4, label: 'VCC', type: 'power' },  { pin: 11, label: 'GND', type: 'ground' },
      { pin: 5, label: '2CLK', type: 'input' }, { pin: 10, label: '2K', type: 'input' },
      { pin: 6, label: '2CLR\'', type: 'input' },{ pin: 9, label: '2Q', type: 'output' },
      { pin: 7, label: '2J', type: 'input' },   { pin: 8, label: '2Q\'', type: 'output' }
    ]
  },
  {
    id: '7474',
    name: '7474',
    description: 'Dual D-Type Flip-Flop',
    pins: 14,
    category: 'Sequential',
    type: 'sequential',
    disabled: true,
    vccPin: 14,
    gndPin: 7,
    pinout: [
      { pin: 1, label: '1CLR\'', type: 'input' },{ pin: 14, label: 'VCC', type: 'power' },
      { pin: 2, label: '1D', type: 'input' },   { pin: 13, label: '2CLR\'', type: 'input' },
      { pin: 3, label: '1CLK', type: 'input' }, { pin: 12, label: '2D', type: 'input' },
      { pin: 4, label: '1PRE\'', type: 'input' },{ pin: 11, label: '2CLK', type: 'input' },
      { pin: 5, label: '1Q', type: 'output' },  { pin: 10, label: '2PRE\'', type: 'input' },
      { pin: 6, label: '1Q\'', type: 'output' }, { pin: 9, label: '2Q', type: 'output' },
      { pin: 7, label: 'GND', type: 'ground' }, { pin: 8, label: '2Q\'', type: 'output' }
    ]
  },
  {
    id: '7490',
    name: '7490',
    description: 'Decade Counter (Ripple Type)',
    pins: 14,
    category: 'Sequential',
    type: 'sequential',
    disabled: true,
    vccPin: 5,
    gndPin: 10,
    pinout: [
      { pin: 1, label: 'CP1\'', type: 'input' },{ pin: 14, label: 'CP0\'', type: 'input' },
      { pin: 2, label: 'MR1', type: 'input' },  { pin: 13, label: 'NC', type: 'nc' },
      { pin: 3, label: 'MR2', type: 'input' },  { pin: 12, label: 'Q0', type: 'output' },
      { pin: 4, label: 'NC', type: 'nc' },       { pin: 11, label: 'Q3', type: 'output' },
      { pin: 5, label: 'VCC', type: 'power' },  { pin: 10, label: 'GND', type: 'ground' },
      { pin: 6, label: 'MS1', type: 'input' },  { pin: 9, label: 'Q1', type: 'output' },
      { pin: 7, label: 'MS2', type: 'input' },  { pin: 8, label: 'Q2', type: 'output' }
    ]
  }
];