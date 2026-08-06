import React, { useMemo, useState, useRef } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { generateBoardCoordinates, BOARD_WIDTH, BOARD_HEIGHT } from '../utils/boardCoordinates';
import { BoardVector } from './BoardVector';
import { WireOverlay } from './WireOverlay';
import { PlacedICOverlay } from './PlacedICOverlay';
import { ICLibraryPanel } from './ICLibraryPanel';
import { ColorPickerToolbar } from './ColorPickerToolbar';
import { BottomFloatingBar } from './BottomFloatingBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { IC_CATALOG } from '../data/icCatalog';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const HoleCanvas = () => {
  useKeyboardShortcuts();

  const holeCoords = useMemo(() => generateBoardCoordinates(), []);
  const containerRef = useRef(null);
  const boardRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const {
    wireStartHole,
    cancelWireCreation,
    hoveredHole,
    setHoveredHole,
    handleHoleClick,
    switches,
    toggleSwitch,
    powerOn,
    togglePower,
    leds,
    setSelectedWireId,
    placedIcs
  } = useSimulatorStore();

  // Disable socket holes used by IC body and its metal pin legs
  const hiddenHoles = useMemo(() => {
    const hidden = new Set();

    placedIcs.forEach((ic) => {
      const icType = IC_CATALOG.find((cat) => cat.id === ic.icTypeId);
      if (!icType) return;

      const pinsPerSide = (icType.pins || 14) / 2;

      // IC Pins plug directly into the bottom row of top group & top row of bottom group:
      // Block M1: Row E (top pins) & Row F (bottom pins)
      // Block M2: Row O (top pins) & Row P (bottom pins)
      // Block M3: Row Y (top pins) & Row Z (bottom pins)
      const topPinRow = ic.blockId === 'M1' ? 'E' : ic.blockId === 'M2' ? 'O' : 'Y';
      const botPinRow = ic.blockId === 'M1' ? 'F' : ic.blockId === 'M2' ? 'P' : 'Z';

      for (let i = 0; i < pinsPerSide; i++) {
        const col = ic.startCol + i;
        hidden.add(`BB_${topPinRow}${col}`);
        hidden.add(`BB_${botPinRow}${col}`);
      }
    });

    return hidden;
  }, [placedIcs]);

  const hoveredNodeGroup = hoveredHole ? holeCoords[hoveredHole]?.nodeGroup : null;

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
    if (e.button === 2 && wireStartHole) {
      e.preventDefault();
      cancelWireCreation();
      return;
    }

    if (e.button === 0 || e.button === 1 || e.button === 2 || e.altKey) {
      if (e.target.closest('.cursor-pointer')) return;

      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
      setSelectedWireId(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - startPan.x;
    const dy = e.clientY - startPan.y;

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
      onContextMenu={(e) => {
        e.preventDefault();
        if (wireStartHole) {
          cancelWireCreation();
        }
      }}
    >
      <ICLibraryPanel />
      <ColorPickerToolbar />
      <BottomFloatingBar />

      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-lg shadow-xl text-zinc-300 backdrop-blur">
        <button onClick={() => setScale((s) => Math.min(s * 1.25, 8.0))} className="p-2 hover:bg-zinc-800 rounded-md">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => setScale((s) => Math.max(s / 1.25, 1))} className="p-2 hover:bg-zinc-800 rounded-md">
          <ZoomOut size={18} />
        </button>
        <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="p-2 hover:bg-zinc-800 rounded-md">
          <RotateCcw size={18} />
        </button>
        <span className="text-xs px-2 text-zinc-400 font-mono border-l border-zinc-800">
          {Math.round(scale * 100)}%
        </span>
      </div>

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
          <BoardVector
            holeCoords={holeCoords}
            switches={switches}
            toggleSwitch={toggleSwitch}
            powerOn={powerOn}
            togglePower={togglePower}
            leds={leds}
          />

          <PlacedICOverlay holeCoords={holeCoords} />

          <WireOverlay holeCoords={holeCoords} />

          {/* Interactive Sockets (Hides sockets directly under IC body AND pin legs) */}
          {Object.entries(holeCoords).map(([holeId, coord]) => {
            if (hiddenHoles.has(holeId)) return null;

            const isSelectedStart = wireStartHole === holeId;
            const isHovered = hoveredHole === holeId;
            const isInSameNodeGroup = hoveredNodeGroup && coord.nodeGroup === hoveredNodeGroup;

            return (
              <circle
                key={holeId}
                cx={coord.x}
                cy={coord.y}
                r={isHovered || isSelectedStart ? '14' : isInSameNodeGroup ? '9' : '8'}
                fill={
                  isSelectedStart
                    ? '#22c55e'
                    : isHovered
                    ? '#facc15'
                    : isInSameNodeGroup
                    ? '#eab308'
                    : 'transparent'
                }
                fillOpacity={isInSameNodeGroup && !isHovered ? 0.45 : 1}
                stroke={isHovered ? '#ffffff' : isInSameNodeGroup ? '#fef08a' : 'transparent'}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-75"
                onMouseEnter={() => setHoveredHole(holeId)}
                onMouseLeave={() => setHoveredHole(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHoleClick(holeId);
                }}
              >
                <title>{`${holeId} (${coord.nodeGroup})`}</title>
              </circle>
            );
          })}
        </svg>
      </div>
    </div>
  );
};