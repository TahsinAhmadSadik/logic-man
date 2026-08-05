export const BOARD_WIDTH = 2423;
export const BOARD_HEIGHT = 2160;

// Export calculated Y levels for background accent lines
export const LAYOUT_CONSTANTS = {
  powerRails: [],   // Array of { vccY, gndY }
  dipChannels: [],  // Array of Y values for grey DIP channels
  slabHeight: 0,
  trayStartY: 680   // Updated tray position
};

export const generateBoardCoordinates = () => {
  const coords = {};

  const bbStartX = 680;
  const colSpacing = 16.8;
  const rowSpacing = 20;
  const channelGap = 20;

  // Reset exported constants
  LAYOUT_CONSTANTS.powerRails = [];
  LAYOUT_CONSTANTS.dipChannels = [];

  // Top Power Rail Pair Y position
  const topBusVCC = 770;
  const topBusGND = 792;
  LAYOUT_CONSTANTS.powerRails.push({ vccY: topBusVCC, gndY: topBusGND });

  let currentY = 830;

  const blocks = [
    { id: 'M1', top: ['A','B','C','D','E'], bot: ['F','G','H','I','J'] },
    { id: 'M2', top: ['K','L','M','N','O'], bot: ['P','Q','R','S','T'] },
    { id: 'M3', top: ['U','V','W','X','Y'], bot: ['Z','AA','AB','AC','AD'] }
  ];

  blocks.forEach((block, bIdx) => {
    const topGroupY = currentY;
    
    // DIP Center Channel
    const dipY = topGroupY + 4 * rowSpacing + 10;
    LAYOUT_CONSTANTS.dipChannels.push(dipY);

    const botGroupY = topGroupY + 4 * rowSpacing + channelGap;

    for (let col = 1; col <= 64; col++) {
      const x = bbStartX + (col - 1) * colSpacing;

      // Top 5 Terminal Rows
      block.top.forEach((row, rIdx) => {
        coords[`BB_${row}${col}`] = {
          x,
          y: topGroupY + rIdx * rowSpacing,
          type: 'breadboard',
          nodeGroup: `NODE_${block.id}_TOP_COL_${col}`
        };
      });

      // Bottom 5 Terminal Rows
      block.bot.forEach((row, rIdx) => {
        coords[`BB_${row}${col}`] = {
          x,
          y: botGroupY + rIdx * rowSpacing,
          type: 'breadboard',
          nodeGroup: `NODE_${block.id}_BOT_COL_${col}`
        };
      });
    }

    const groupEndY = botGroupY + 4 * rowSpacing;

    if (bIdx < blocks.length - 1) {
      // Intermediate Power Rail Pair
      const busVCC = groupEndY + 25;
      const busGND = busVCC + 22;

      LAYOUT_CONSTANTS.powerRails.push({ vccY: busVCC, gndY: busGND });

      for (let col = 1; col <= 64; col++) {
        const x = bbStartX + (col - 1) * colSpacing;
        coords[`BUS_MID_${bIdx}_VCC_${col}`] = { x, y: busVCC, type: 'rail', nodeGroup: `BUS_MID_${bIdx}_VCC` };
        coords[`BUS_MID_${bIdx}_GND_${col}`] = { x, y: busGND, type: 'rail', nodeGroup: `BUS_MID_${bIdx}_GND` };
      }

      currentY = busGND + 35;
    } else {
      // Bottom Power Rail Pair
      const busVCC = groupEndY + 25;
      const busGND = busVCC + 22;

      LAYOUT_CONSTANTS.powerRails.push({ vccY: busVCC, gndY: busGND });

      for (let col = 1; col <= 64; col++) {
        const x = bbStartX + (col - 1) * colSpacing;
        coords[`BUS_TOP_VCC_${col}`] = { x, y: topBusVCC, type: 'rail', nodeGroup: 'BUS_TOP_VCC' };
        coords[`BUS_TOP_GND_${col}`] = { x, y: topBusGND, type: 'rail', nodeGroup: 'BUS_TOP_GND' };
        coords[`BUS_BOT_VCC_${col}`] = { x, y: busVCC, type: 'rail', nodeGroup: 'BUS_BOT_VCC' };
        coords[`BUS_BOT_GND_${col}`] = { x, y: busGND, type: 'rail', nodeGroup: 'BUS_BOT_GND' };
      }

      // Calculate exact white slab height
      LAYOUT_CONSTANTS.slabHeight = busGND - 740 + 35;
    }
  });

  // --- HARDWARE POWER SUPPLY TERMINALS ---
  coords['PWR_VCC_1'] = { x: 530, y: 360, type: 'power', nodeGroup: 'FIXED_VCC' };
  coords['PWR_VCC_2'] = { x: 530, y: 395, type: 'power', nodeGroup: 'FIXED_VCC' };
  coords['PWR_GND_1'] = { x: 530, y: 465, type: 'power', nodeGroup: 'FIXED_GND' };
  coords['PWR_GND_2'] = { x: 530, y: 500, type: 'power', nodeGroup: 'FIXED_GND' };

  // --- 8-BIT LED DISPLAY INPUT HOLES ---
  const ledStartX = 1860;
  const ledSpacing = 58;
  for (let i = 0; i < 8; i++) {
    coords[`LED_IN_${i}`] = { x: ledStartX + i * ledSpacing, y: 380, type: 'led', ledIndex: i, nodeGroup: `LED_NODE_${i}` };
  }

  // --- DATA SWITCHES OUTPUT HOLES ---
  const swStartX = 820;
  const swSpacing = 112;
  for (let i = 0; i < 8; i++) {
    coords[`SWITCH_OUT_${i}`] = { x: swStartX + i * swSpacing, y: 1830, type: 'switch', switchIndex: i, nodeGroup: `SWITCH_NODE_${i}` };
  }

  return coords;
};