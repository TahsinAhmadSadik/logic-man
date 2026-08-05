export const BOARD_WIDTH = 2423;
export const BOARD_HEIGHT = 2160;

export const generateBoardCoordinates = () => {
  const coords = {};

  // --- BREADBOARD TERMINAL STRIP MATRIX (60 Columns x 10 Rows) ---
  const bbStartX = 720;
  const colSpacing = 16.6; // Gap between columns 1..60
  
  // Rows A-E (Top half) and Rows F-J (Bottom half)
  const topRows = ['A', 'B', 'C', 'D', 'E'];
  const botRows = ['F', 'G', 'H', 'I', 'J'];
  const rowSpacing = 22;

  const topYStart = 780;  // Row A Y-level
  const botYStart = 1010; // Row F Y-level (gives space for IC center channel!)

  for (let col = 1; col <= 60; col++) {
    const x = bbStartX + (col - 1) * colSpacing;

    // Top block (A to E)
    topRows.forEach((row, idx) => {
      coords[`BB_${row}${col}`] = {
        x,
        y: topYStart + idx * rowSpacing,
        type: 'breadboard',
        nodeGroup: `COL_${col}_TOP`
      };
    });

    // Bottom block (F to J)
    botRows.forEach((row, idx) => {
      coords[`BB_${row}${col}`] = {
        x,
        y: botYStart + idx * rowSpacing,
        type: 'breadboard',
        nodeGroup: `COL_${col}_BOT`
      };
    });

    // Power Bus Rails (Top & Bottom pairs)
    // Top Rail VCC (+5V) and GND
    coords[`RAIL_TOP_VCC_${col}`] = { x, y: 700, type: 'rail', nodeGroup: 'BUS_TOP_VCC' };
    coords[`RAIL_TOP_GND_${col}`] = { x, y: 725, type: 'rail', nodeGroup: 'BUS_TOP_GND' };

    // Bottom Rail VCC (+5V) and GND
    coords[`RAIL_BOT_VCC_${col}`] = { x, y: 1140, type: 'rail', nodeGroup: 'BUS_BOT_VCC' };
    coords[`RAIL_BOT_GND_${col}`] = { x, y: 1165, type: 'rail', nodeGroup: 'BUS_BOT_GND' };
  }

  // --- POWER SUPPLY TERMINALS (Top Left Panel) ---
  coords['PWR_VCC_1'] = { x: 530, y: 360, type: 'power', nodeGroup: 'FIXED_VCC' };
  coords['PWR_VCC_2'] = { x: 530, y: 395, type: 'power', nodeGroup: 'FIXED_VCC' };
  coords['PWR_GND_1'] = { x: 530, y: 465, type: 'power', nodeGroup: 'FIXED_GND' };
  coords['PWR_GND_2'] = { x: 530, y: 500, type: 'power', nodeGroup: 'FIXED_GND' };

  // --- 8-BIT LED DISPLAY INPUT HOLES (Top Right Panel) ---
  const ledStartX = 1860;
  const ledSpacing = 58;
  const ledY = 380;

  for (let i = 0; i < 8; i++) {
    coords[`LED_IN_${i}`] = {
      x: ledStartX + i * ledSpacing,
      y: ledY,
      type: 'led',
      ledIndex: i,
      nodeGroup: `LED_NODE_${i}`
    };
  }

  // --- DATA SWITCHES OUTPUT HOLES (Bottom Panel) ---
  const swStartX = 820;
  const swSpacing = 112;
  const swY = 1830;

  for (let i = 0; i < 8; i++) {
    coords[`SWITCH_OUT_${i}`] = {
      x: swStartX + i * swSpacing,
      y: swY,
      type: 'switch',
      switchIndex: i,
      nodeGroup: `SWITCH_NODE_${i}`
    };
  }

  return coords;
};