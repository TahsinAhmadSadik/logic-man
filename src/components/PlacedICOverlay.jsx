import React, { useState } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { IC_CATALOG } from '../data/icCatalog';
import { LAYOUT_CONSTANTS } from '../utils/boardCoordinates';

// Helper to find DIP channel Y coordinate
const getDipChannelY = (blockId) => {
  const idx = blockId === 'M1' ? 0 : blockId === 'M2' ? 1 : 2;
  return LAYOUT_CONSTANTS.dipChannels[idx] || 0;
};

// ==========================================
// 1. BASE IC LAYER (Placed below Wires)
// ==========================================
export const PlacedICOverlay = ({ holeCoords, onHoverPin, onHoverIc, hoveredIcId }) => {
  const {
    placedIcs,
    selectedIcId,
    setSelectedIcId,
    deleteIc,
    spawningIcTypeId,
    hoveredHole,
    isDeleteMode,
    powerOn
  } = useSimulatorStore();

  const spawningIc = IC_CATALOG.find((cat) => cat.id === spawningIcTypeId);
  const hoveredCoord = hoveredHole ? holeCoords[hoveredHole] : null;

  return (
    <g id="pure-svg-ic-layer">
      {/* Installed IC Chips */}
      {placedIcs.map((ic) => {
        const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
        if (!icType) return null;

        const pinCount = icType.pins || 14;
        const pinsPerSide = pinCount / 2;

        const bbStartX = 680;
        const colSpacing = 16.8;

        const pinStartX = bbStartX + (ic.startCol - 1) * colSpacing;
        const width = (pinsPerSide - 1) * colSpacing + 20;
        const x = pinStartX - 10;

        const dipY = getDipChannelY(ic.blockId);
        const height = 46;
        const y = dipY - height / 2;

        const isSelected = selectedIcId === ic.id;
        const isHovered = hoveredIcId === ic.id;

        return (
          <g
            key={ic.id}
            className="cursor-pointer group"
            onMouseEnter={() => onHoverIc?.(ic.id)}
            onMouseLeave={() => onHoverIc?.(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (isDeleteMode && !powerOn) {
                deleteIc(ic.id);
              } else {
                setSelectedIcId(ic.id);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteIc(ic.id);
            }}
          >
            {/* Selection Glow */}
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

            {/* DIP Plastic Body */}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx="4"
              fill={isDeleteMode && isHovered ? '#4c0519' : '#18181b'}
              stroke={isDeleteMode && isHovered ? '#f43f5e' : '#3f3f46'}
              strokeWidth="2"
            />

            {/* DIP Center Notch at Pin 1 side (Left) */}
            <path
              d={`M ${x} ${y + height / 2 - 6} A 6 6 0 0 1 ${x} ${y + height / 2 + 6}`}
              fill="#09090b"
              stroke="#3f3f46"
            />

            {/* Pin 1 Dot Marker */}
            <circle cx={x + 10} cy={y + height / 2 + 12} r="2.5" fill="#a1a1aa" />

            {/* Base IC Model Label (Realistic substrate text) */}
            <text
              x={x + width / 2}
              y={y + height / 2 + 4}
              fill="#fbbf24"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
              className="select-none pointer-events-none opacity-80"
            >
              {icType.name}
            </text>

            {/* Silver Pins */}
            {Array.from({ length: pinsPerSide }).map((_, i) => {
              const px = pinStartX + i * colSpacing;
              const botPinNum = i + 1;
              const topPinNum = pinCount - i;

              const topPinDef = icType.pinout.find((p) => p.pin === topPinNum);
              const botPinDef = icType.pinout.find((p) => p.pin === botPinNum);

              return (
                <g key={`pins-${i}`}>
                  {/* Top Pin (14..8) */}
                  <g
                    onMouseEnter={() =>
                      onHoverPin?.({
                        x: px,
                        y: y - 10,
                        text: `Pin ${topPinNum}: ${topPinDef?.label || ''} (${topPinDef?.type || ''})`
                      })
                    }
                    onMouseLeave={() => onHoverPin?.(null)}
                  >
                    <rect x={px - 2.5} y={y - 4} width="5" height="5" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                  </g>

                  {/* Bottom Pin (1..7) */}
                  <g
                    onMouseEnter={() =>
                      onHoverPin?.({
                        x: px,
                        y: y + height + 15,
                        text: `Pin ${botPinNum}: ${botPinDef?.label || ''} (${botPinDef?.type || ''})`
                      })
                    }
                    onMouseLeave={() => onHoverPin?.(null)}
                  >
                    <rect x={px - 2.5} y={y + height - 1} width="5" height="5" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Ghost Preview IC */}
      {spawningIc && hoveredCoord && (
        <g className="pointer-events-none opacity-70">
          {(() => {
            const pinCount = spawningIc.pins || 14;
            const pinsPerSide = pinCount / 2;
            const colSpacing = 16.8;
            const width = (pinsPerSide - 1) * colSpacing + 20;
            const height = 46;

            const match = hoveredHole ? hoveredHole.match(/^BB_([A-Z]+)(\d+)$/) : null;
            let blockId = 'M1';
            if (match) {
              const row = match[1];
              if (['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'].includes(row)) blockId = 'M2';
              else if (['U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD'].includes(row)) blockId = 'M3';
            }

            const dipY = getDipChannelY(blockId);
            const gx = hoveredCoord.x - 10;
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

// ==========================================
// 2. TOP TOOLTIP & BADGE LAYER (Placed ABOVE Wires)
// ==========================================
export const ICTooltipOverlay = ({ hoveredPinInfo, hoveredIcId }) => {
  const { placedIcs, selectedIcId } = useSimulatorStore();

  return (
    <g id="pure-svg-ic-top-overlay" className="pointer-events-none">
      {/* Floating High-Contrast Chip ID Badges on Hover/Selection */}
      {placedIcs.map((ic) => {
        const isHovered = hoveredIcId === ic.id;
        const isSelected = selectedIcId === ic.id;
        if (!isHovered && !isSelected) return null;

        const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
        if (!icType) return null;

        const pinCount = icType.pins || 14;
        const pinsPerSide = pinCount / 2;
        const colSpacing = 16.8;
        const pinStartX = 680 + (ic.startCol - 1) * colSpacing;
        const width = (pinsPerSide - 1) * colSpacing + 20;
        const x = pinStartX - 10;

        const dipY = getDipChannelY(ic.blockId);
        const height = 46;
        const y = dipY - height / 2;

        return (
          <g key={`badge-${ic.id}`} className="transition-all duration-150">
            <rect
              x={x + width / 2 - 34}
              y={y + height / 2 - 10}
              width="68"
              height="20"
              rx="5"
              fill="#09090b"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <text
              x={x + width / 2}
              y={y + height / 2 + 4}
              fill="#fbbf24"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {icType.name}
            </text>
          </g>
        );
      })}

      {/* Floating Pin Info Tooltip */}
      {hoveredPinInfo && (
        <g>
          <rect
            x={hoveredPinInfo.x - 70}
            y={hoveredPinInfo.y - 12}
            width="140"
            height="22"
            rx="5"
            fill="#09090b"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <text
            x={hoveredPinInfo.x}
            y={hoveredPinInfo.y + 3}
            fill="#fbbf24"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {hoveredPinInfo.text}
          </text>
        </g>
      )}
    </g>
  );
};