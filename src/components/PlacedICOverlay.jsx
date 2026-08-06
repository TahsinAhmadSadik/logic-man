import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { IC_CATALOG } from '../data/icCatalog';
import { LAYOUT_CONSTANTS } from '../utils/boardCoordinates';

export const PlacedICOverlay = ({ holeCoords }) => {
  const {
    placedIcs,
    selectedIcId,
    setSelectedIcId,
    deleteIc,
    spawningIcTypeId,
    hoveredHole
  } = useSimulatorStore();

  const spawningIc = IC_CATALOG.find((cat) => cat.id === spawningIcTypeId);
  const hoveredCoord = hoveredHole ? holeCoords[hoveredHole] : null;

  // Block index helper to get grey DIP channel Y position
  const getDipChannelY = (blockId) => {
    const idx = blockId === 'M1' ? 0 : blockId === 'M2' ? 1 : 2;
    return LAYOUT_CONSTANTS.dipChannels[idx] || 0;
  };

  return (
    <g id="pure-svg-ic-layer">
      {/* Installed IC Chips */}
      {placedIcs.map((ic) => {
        const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
        if (!icType) return null;

        const pinCount = icType.pins || 14;
        const pinsPerSide = pinCount / 2;

        // X position from column 1
        const bbStartX = 680;
        const colSpacing = 16.8;
        const x = bbStartX + (ic.startCol - 1) * colSpacing - 6;

        // Y position centered directly over the grey DIP channel
        const dipY = getDipChannelY(ic.blockId);
        const height = 48;
        const y = dipY - height / 2;

        const width = pinsPerSide * colSpacing + 12;
        const isSelected = selectedIcId === ic.id;

        return (
          <g
            key={ic.id}
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIcId(ic.id);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteIc(ic.id);
            }}
          >
            {/* Selection Outline */}
            {isSelected && (
              <rect
                x={x - 4}
                y={y - 4}
                width={width + 8}
                height={height + 8}
                rx="8"
                fill="none"
                stroke="#facc15"
                strokeWidth="3"
                className="animate-pulse"
              />
            )}

            {/* Black Plastic DIP Package */}
            <rect x={x} y={y} width={width} height={height} rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />

            {/* DIP Center Notch */}
            <path
              d={`M ${x} ${y + height / 2 - 6} A 6 6 0 0 1 ${x} ${y + height / 2 + 6}`}
              fill="#09090b"
              stroke="#3f3f46"
            />

            {/* IC Model Name */}
            <text
              x={x + width / 2}
              y={y + height / 2 + 4}
              fill="#fbbf24"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
              className="select-none"
            >
              {icType.name}
            </text>

            {/* Silver Pins */}
            {Array.from({ length: pinsPerSide }).map((_, i) => {
              const px = x + 10 + i * colSpacing;
              return (
                <g key={`pins-${i}`}>
                  <rect x={px - 2} y={y - 3} width="4" height="4" fill="#cbd5e1" />
                  <rect x={px - 2} y={y + height - 1} width="4" height="4" fill="#cbd5e1" />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Ghost Preview IC Shape following cursor */}
      {spawningIc && hoveredCoord && (
        <g className="pointer-events-none opacity-70">
          {(() => {
            const pinsPerSide = (spawningIc.pins || 14) / 2;
            const colSpacing = 16.8;
            const width = pinsPerSide * colSpacing + 12;
            const height = 48;

            // Align ghost preview directly to DIP channel
            const match = hoveredHole ? hoveredHole.match(/^BB_([A-Z]+)(\d+)$/) : null;
            let blockId = 'M1';
            if (match) {
              const row = match[1];
              if (['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'].includes(row)) blockId = 'M2';
              else if (['U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD'].includes(row)) blockId = 'M3';
            }

            const dipY = getDipChannelY(blockId);
            const gx = hoveredCoord.x - 6;
            const gy = dipY - height / 2;

            return (
              <>
                <rect
                  x={gx}
                  y={gy}
                  width={width}
                  height={height}
                  rx="4"
                  fill="#22c55e"
                  fillOpacity="0.3"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={gx + width / 2}
                  y={gy + height / 2 + 4}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {spawningIc.name}
                </text>
              </>
            );
          })()}
        </g>
      )}
    </g>
  );
};