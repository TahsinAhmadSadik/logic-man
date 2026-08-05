import React, { useMemo, useState, useRef } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { generateBoardCoordinates, BOARD_WIDTH, BOARD_HEIGHT } from '../utils/boardCoordinates';
import { BoardVector } from './BoardVector';
import { WireOverlay } from './WireOverlay';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const HoleCanvas = () => {
  const holeCoords = useMemo(() => generateBoardCoordinates(), []);
  const containerRef = useRef(null);
  const boardRef = useRef(null);

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
    toggleSwitch,
    powerOn,
    togglePower,
    leds
  } = useSimulatorStore();

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
    const newScale = Math.min(Math.max(scale * zoomFactor, 1), 8.0);

    if (newScale === scale) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = (mouseX - position.x) * (1 - zoomFactor);
    const dy = (mouseY - position.y) * (1 - zoomFactor);

    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }

    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    // Enable panning on Left-Click (button 0), Middle-Click (button 1), Right-Click (button 2), or Alt-Key
    if (e.button === 0 || e.button === 1 || e.button === 2 || e.altKey) {
      // Don't interrupt if clicking direct UI controls or interactive holes
      if (e.target.closest('.cursor-pointer')) return;

      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - startPan.x;
    const dy = e.clientY - startPan.y;

    // Direct DOM manipulation for butter-smooth panning
    if (boardRef.current) {
      boardRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    }
  };

  const handleMouseUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
      setPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-zinc-950 p-2 ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-lg shadow-xl text-zinc-300 backdrop-blur">
        <button onClick={() => setScale((s) => Math.min(s * 1.25, 8.0))} className="p-2 hover:bg-zinc-800 rounded-md">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => setScale((s) => Math.max(s / 1.25, 1))} className="p-2 hover:bg-zinc-800 rounded-md">
          <ZoomOut size={18} />
        </button>
        <button onClick={resetZoom} className="p-2 hover:bg-zinc-800 rounded-md">
          <RotateCcw size={18} />
        </button>
        <span className="text-xs px-2 text-zinc-400 font-mono border-l border-zinc-800">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Transform Board Container */}
      <div
        ref={boardRef}
        className="relative transition-transform duration-75 ease-out shadow-2xl rounded-lg overflow-hidden border border-zinc-800 h-[92vh]"
        style={{
          aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
      >
        <svg viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} className="w-full h-full">
          {/* A) Static & Memoized Vector Faceplate */}
          <BoardVector
            holeCoords={holeCoords}
            switches={switches}
            toggleSwitch={toggleSwitch}
            powerOn={powerOn}
            togglePower={togglePower}
            leds={leds}
          />

          {/* B) Wires Layer */}
          <WireOverlay holeCoords={holeCoords} />

          {/* C) Interactive Sockets Overlays */}
          {Object.entries(holeCoords).map(([holeId, coord]) => {
            const isSelectedStart = wireStartHole === holeId;
            const isHovered = hoveredHole === holeId;

            return (
              <circle
                key={holeId}
                cx={coord.x}
                cy={coord.y}
                r={isHovered || isSelectedStart ? "14" : "8"}
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
        </svg>
      </div>
    </div>
  );
};