import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

export const WireOverlay = ({ holeCoords }) => {
  const {
    wires,
    wireStartHole,
    hoveredHole,
    selectedColor,
    selectedWireId,
    setSelectedWireId,
    deleteWire,
    isDeleteMode,
    powerOn
  } = useSimulatorStore();

  const startCoord = wireStartHole ? holeCoords[wireStartHole] : null;
  const hoverCoord = hoveredHole ? holeCoords[hoveredHole] : null;

  return (
    <g id="pure-svg-wire-layer">
      {wires.map((wire) => {
        const p1 = holeCoords[wire.startHole];
        const p2 = holeCoords[wire.endHole];

        if (!p1 || !p2) return null;

        const isSelected = selectedWireId === wire.id;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curveOffset = Math.min(dist * 0.15, 60);

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - curveOffset;

        const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

        return (
          <g
            key={wire.id}
            className={`group cursor-pointer ${isDeleteMode ? 'hover:opacity-60' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isDeleteMode && !powerOn) {
                deleteWire(wire.id);
              } else {
                setSelectedWireId(wire.id);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteWire(wire.id);
            }}
          >
            {/* Invisible wide stroke for easy clicking & touch taps */}
            <path d={pathData} fill="none" stroke="transparent" strokeWidth="28" />

            {/* Selection Outline Glow */}
            {isSelected && (
              <path
                d={pathData}
                fill="none"
                stroke="#facc15"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.8"
                className="animate-pulse"
              />
            )}

            {/* Main Visual Wire Path */}
            <path
              d={pathData}
              fill="none"
              stroke={isDeleteMode ? '#f43f5e' : wire.color}
              strokeWidth="8"
              strokeLinecap="round"
              className="transition-all duration-150 group-hover:stroke-width-[10]"
            />

            {/* Endpoint caps */}
            <circle cx={p1.x} cy={p1.y} r={isSelected ? '10' : '6'} fill={wire.color} stroke="#ffffff" strokeWidth="2" />
            <circle cx={p2.x} cy={p2.y} r={isSelected ? '10' : '6'} fill={wire.color} stroke="#ffffff" strokeWidth="2" />
          </g>
        );
      })}

      {/* Live Preview Wire while drawing */}
      {startCoord && hoverCoord && (
        <line
          x1={startCoord.x}
          y1={startCoord.y}
          x2={hoverCoord.x}
          y2={hoverCoord.y}
          stroke={selectedColor}
          strokeWidth="6"
          strokeDasharray="8 6"
          opacity="0.8"
          className="pointer-events-none"
        />
      )}
    </g>
  );
};