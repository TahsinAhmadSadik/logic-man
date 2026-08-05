import React from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';

export const WireOverlay = ({ holeCoords }) => {
  const {
    wires,
    wireStartHole,
    hoveredHole,
    selectedWireId,
    selectWire,
    startDraggingEndpoint
  } = useSimulatorStore();

  const getIsHighlighted = (wire) => {
    if (!hoveredHole) return false;
    return wire.startHole === hoveredHole || wire.endHole === hoveredHole;
  };

  return (
    <g className="pointer-events-auto">
      {/* Existing Wires */}
      {wires.map((wire) => {
        const start = holeCoords[wire.startHole];
        const end = holeCoords[wire.endHole];

        if (!start || !end) return null;

        const isSelected = selectedWireId === wire.id;
        const isHighlighted = getIsHighlighted(wire);

        return (
          <g key={wire.id} className="cursor-pointer">
            {/* Wider invisible stroke for easy clicking */}
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="transparent"
              strokeWidth="24"
              onClick={(e) => {
                e.stopPropagation();
                selectWire(wire.id);
              }}
            />

            {/* Visual Wire */}
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isHighlighted ? '#facc15' : wire.color}
              strokeWidth={isSelected ? "10" : "7"}
              strokeDasharray={isSelected ? "12 6" : "none"}
              className="transition-all duration-75"
            />

            {/* Wire Endpoints */}
            <circle
              cx={start.x}
              cy={start.y}
              r={isSelected ? "12" : "8"}
              fill={wire.color}
              stroke="#ffffff"
              strokeWidth="3"
              onMouseDown={(e) => {
                e.stopPropagation();
                startDraggingEndpoint(wire.id, 'start');
              }}
            />
            <circle
              cx={end.x}
              cy={end.y}
              r={isSelected ? "12" : "8"}
              fill={wire.color}
              stroke="#ffffff"
              strokeWidth="3"
              onMouseDown={(e) => {
                e.stopPropagation();
                startDraggingEndpoint(wire.id, 'end');
              }}
            />
          </g>
        );
      })}

      {/* Wire creation line preview */}
      {wireStartHole && hoveredHole && holeCoords[wireStartHole] && holeCoords[hoveredHole] && (
        <line
          x1={holeCoords[wireStartHole].x}
          y1={holeCoords[wireStartHole].y}
          x2={holeCoords[hoveredHole].x}
          y2={holeCoords[hoveredHole].y}
          stroke="#94a3b8"
          strokeWidth="6"
          strokeDasharray="8 8"
        />
      )}
    </g>
  );
};