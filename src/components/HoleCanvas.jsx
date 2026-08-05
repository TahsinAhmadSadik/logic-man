import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { generateBoardCoordinates, BOARD_WIDTH, BOARD_HEIGHT } from '../utils/boardCoordinates';
import { WireOverlay } from './WireOverlay';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const HoleCanvas = () => {
  const holeCoords = useMemo(() => generateBoardCoordinates(), []);
  const containerRef = useRef(null);

  // Pan and Zoom States
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const {
    wireStartHole,
    hoveredHole,
    setHoveredHole,
    handleHoleClick,
    switches,
    toggleSwitch
  } = useSimulatorStore();

  // --- MOUSE WHEEL ZOOM LOGIC ---
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newScale = Math.min(Math.max(scale * zoomFactor, 1), 4.5); // Clamp zoom 1x to 4.5x

    if (newScale === scale) return;

    // Zoom towards mouse position
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = (mouseX - position.x) * (1 - zoomFactor);
    const dy = (mouseY - position.y) * (1 - zoomFactor);

    // Reset translation if zooming back to 1x
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }

    setScale(newScale);
  };

  // --- PANNING LOGIC (Middle Click or Right-Click Drag) ---
  const handleMouseDown = (e) => {
    if (e.button === 1 || e.button === 2 || e.altKey) { // Middle click or Alt+Click
      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPosition({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click menu for panning
    >
      {/* Zoom Control Buttons */}
      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-lg shadow-xl text-zinc-300 backdrop-blur">
        <button
          onClick={() => setScale((s) => Math.min(s * 1.2, 4.5))}
          className="p-2 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s / 1.2, 1))}
          className="p-2 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={resetZoom}
          className="p-2 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw size={18} />
        </button>
        <span className="text-xs px-2 text-zinc-500 font-mono border-l border-zinc-800">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Transform Container */}
      <div
        className="relative transition-transform duration-75 ease-out shadow-2xl rounded-lg overflow-hidden border border-zinc-800"
        style={{
          aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
          maxHeight: scale === 1 ? '88vh' : 'none',
          maxWidth: scale === 1 ? '92vw' : 'none',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Background SB-700 High-Res Image */}
        <img
          src="/trainer_board.png"
          alt="SB-700 Digital Laboratory"
          className="w-full h-full object-contain pointer-events-none no-select"
        />

        {/* Interactive Responsive SVG Overlay */}
        <svg
          viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
          className="absolute inset-0 w-full h-full"
        >
          {/* Wire Layer */}
          <WireOverlay holeCoords={holeCoords} />

          {/* Clickable Pin Holes */}
          {Object.entries(holeCoords).map(([holeId, coord]) => {
            const isSelectedStart = wireStartHole === holeId;
            const isHovered = hoveredHole === holeId;

            return (
              <circle
                key={holeId}
                cx={coord.x}
                cy={coord.y}
                r={isHovered || isSelectedStart ? "10" : "6"}
                fill={
                  isSelectedStart
                    ? "#22c55e"
                    : isHovered
                    ? "#facc15"
                    : "transparent"
                }
                stroke={isHovered ? "#ffffff" : "transparent"}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-75"
                onMouseEnter={() => setHoveredHole(holeId)}
                onMouseLeave={() => setHoveredHole(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHoleClick(holeId);
                }}
              >
                <title>{holeId}</title>
              </circle>
            );
          })}

          {/* Interactive Toggle Switches (Data Switches 0-7) */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const switchX = 824 + i * 101.5;
            const switchY = 1910;
            const isOn = switches[i] === 1;

            return (
              <g
                key={`switch-toggle-${i}`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSwitch(i);
                }}
              >
                <rect
                  x={switchX - 12}
                  y={isOn ? switchY - 30 : switchY}
                  width="24"
                  height="30"
                  rx="4"
                  fill={isOn ? "#22c55e" : "#ef4444"}
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};