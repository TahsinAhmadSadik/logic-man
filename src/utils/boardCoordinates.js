/**
 * Precise SB-700 Coordinate Map
 * Image Dimensions: 2423px (Width) x 2160px (Height)
 */

export const BOARD_WIDTH = 2423;
export const BOARD_HEIGHT = 2160;

export const generateBoardCoordinates = () => {
  const coords = {};

  // --- 1. BREADBOARD GRID (4 VERTICAL SECTIONS) ---
  const bbStartX = 652;       // Column 1 X center
  const colSpacing = 17.8;    // Horizontal gap per column (1 to 64)
  
  // Vertical positions for the 4 breadboard blocks
  const blockConfigs = [
    { startY: 672, rows: ['A', 'B', 'C', 'D', 'E'], topRailY: 622, botRailY: 642 },
    { startY: 885, rows: ['F', 'G', 'H', 'I', 'J'], topRailY: 835, botRailY: 855 },
    { startY: 1098, rows: ['K', 'L', 'M', 'N', 'O'], topRailY: 1048, botRailY: 1068 },
    { startY: 1311, rows: ['P', 'Q', 'R', 'S', 'T'], topRailY: 1261, botRailY: 1281 }
  ];

  const rowSpacing = 22.5;

  blockConfigs.forEach((block, blockIdx) => {
    // A) Terminal Strip Holes (Columns 1-64)
    for (let col = 1; col <= 64; col++) {
      const x = bbStartX + (col - 1) * colSpacing;

      block.rows.forEach((rowLetter, rIdx) => {
        const y = block.startY + rIdx * rowSpacing;
        const holeId = `BB_${rowLetter}${col}`;
        const nodeGroup = `NODE_BLOCK${blockIdx}_COL${col}`;

        coords[holeId] = { x, y, type: 'breadboard', nodeGroup };
      });

      // B) Power Rail Holes for each block (GND / VCC)
      // Standard breadboards break power rails into 5-pin groups, but electrically connected
      coords[`RAIL_B${blockIdx}_TOP_${col}`] = {
        x,
        y: block.topRailY,
        type: 'rail',
        nodeGroup: `BUS_BLOCK${blockIdx}_VCC`
      };
      coords[`RAIL_B${blockIdx}_BOT_${col}`] = {
        x,
        y: block.botRailY,
        type: 'rail',
        nodeGroup: `BUS_BLOCK${blockIdx}_GND`
      };
    }
  });

  // --- 2. DC POWER SUPPLY TAPS (Top-Left Panel) ---
  // +5V Taps (Red)
  coords['PWR_VCC_1'] = { x: 552, y: 368, type: 'power', nodeGroup: 'POWER_VCC' };
  coords['PWR_VCC_2'] = { x: 552, y: 406, type: 'power', nodeGroup: 'POWER_VCC' };
  
  // GND Taps (Black)
  coords['PWR_GND_1'] = { x: 552, y: 480, type: 'power', nodeGroup: 'POWER_GND' };
  coords['PWR_GND_2'] = { x: 552, y: 518, type: 'power', nodeGroup: 'POWER_GND' };

  // --- 3. 8-BIT LED DISPLAY INPUT HOLES (Top-Right Panel) ---
  // LEDs 0 through 7 (Each has 2 vertically stacked pin holes)
  const ledStartX = 1445;
  const ledSpacing = 77.5;
  const ledY1 = 356;
  const ledY2 = 485;

  for (let i = 0; i < 8; i++) {
    const x = ledStartX + i * ledSpacing;
    coords[`LED_IN_TOP_${i}`] = { x, y: ledY1, type: 'led', ledIndex: i, nodeGroup: `LED_NODE_${i}` };
    coords[`LED_IN_BOT_${i}`] = { x, y: ledY2, type: 'led', ledIndex: i, nodeGroup: `LED_NODE_${i}` };
  }

  // --- 4. DATA SWITCHES OUTPUT HOLES (Bottom Panel) ---
  // Switches 0 through 7 output terminals
  const switchStartX = 824;
  const switchSpacing = 101.5;
  const switchY = 1842;

  for (let i = 0; i < 8; i++) {
    const x = switchStartX + i * switchSpacing;
    coords[`SWITCH_OUT_${i}`] = {
      x,
      y: switchY,
      type: 'switch',
      switchIndex: i,
      nodeGroup: `SWITCH_NODE_${i}`
    };
  }

  return coords;
};