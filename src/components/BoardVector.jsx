import React, { memo } from 'react';
import { LAYOUT_CONSTANTS } from '../utils/boardCoordinates';

export const BoardVector = memo(({ holeCoords = {}, switches = {}, toggleSwitch, powerOn, togglePower, leds = {} }) => {
  const slabHeight = LAYOUT_CONSTANTS.slabHeight || 980;
  const trayHeight = slabHeight + 110;
  const trayStartY = LAYOUT_CONSTANTS.trayStartY || 680;
  const slabStartY = trayStartY + 60;

  return (
    <g id="pure-svg-board-layer">
      {/* Hatch Pattern */}
      <defs>
        <pattern id="diagonal-hatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#3f3f46" strokeWidth="5" />
        </pattern>
      </defs>

      {/* Static Background Layer */}
      <g className="pointer-events-none select-none">
        {/* Main Outer Box & Wood Accents */}
        <rect x="0" y="0" width="2423" height="2160" rx="12" fill="#121214" stroke="#27272a" strokeWidth="8" />
        <rect x="0" y="0" width="50" height="2160" fill="#78350f" rx="4" />
        <rect x="2373" y="0" width="50" height="2160" fill="#78350f" rx="4" />

        {/* Header Bar */}
        <rect x="80" y="40" width="2263" height="170" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
        <text x="340" y="115" fill="#fbbf24" fontSize="52" fontWeight="bold">SB-700</text>
        <text x="340" y="160" fill="#e4e4e7" fontSize="26" letterSpacing="4">PORTABLE ANALOG/DIGITAL LABORATORY</text>

        {/* Central Breadboard Tray & White Slab */}
        <rect x="640" y={trayStartY} width="1140" height={trayHeight} rx="24" fill="#1e1e22" stroke="#64748b" strokeWidth="6" />

        {/* Tray Screws */}
        {[
          { x: 680, y: trayStartY + 30 },
          { x: 1740, y: trayStartY + 30 },
          { x: 680, y: trayStartY + trayHeight - 30 },
          { x: 1740, y: trayStartY + trayHeight - 30 }
        ].map((screw, i) => (
          <g key={`screw-${i}`}>
            <circle cx={screw.x} cy={screw.y} r="14" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <line x1={screw.x - 8} y1={screw.y - 8} x2={screw.x + 8} y2={screw.y + 8} stroke="#1e293b" strokeWidth="3" />
            <line x1={screw.x + 8} y1={screw.y - 8} x2={screw.x - 8} y2={screw.y + 8} stroke="#1e293b" strokeWidth="3" />
          </g>
        ))}

        <rect x="665" y={slabStartY} width="1090" height={slabHeight} rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />

        {/* DIP Channels */}
        {(LAYOUT_CONSTANTS.dipChannels || []).map((chanY, idx) => (
          <rect key={`dip-chan-${idx}`} x="665" y={chanY - 7} width="1090" height="14" fill="#cbd5e1" />
        ))}

        {/* Red & Blue Power Rail Lines */}
        {(LAYOUT_CONSTANTS.powerRails || []).map((rail, idx) => (
          <g key={`rail-pair-${idx}`}>
            <line x1="680" y1={rail.vccY} x2="1740" y2={rail.vccY} stroke="#ef4444" strokeWidth="3" />
            <line x1="680" y1={rail.gndY} x2="1740" y2={rail.gndY} stroke="#3b82f6" strokeWidth="3" />
          </g>
        ))}

        {/* Inactive Hatch Modules */}
        <g>
          <rect x="80" y="690" width="540" height="420" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
          <rect x="80" y="690" width="540" height="420" rx="8" fill="url(#diagonal-hatch)" opacity="0.6" />
          <rect x="100" y="705" width="240" height="32" rx="4" fill="#09090b" />
          <text x="110" y="727" fill="#fbbf24" fontSize="18" fontWeight="bold">3 STATE LOGIC PROBE</text>
        </g>

        <g>
          <rect x="80" y="1130" width="540" height="540" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
          <rect x="80" y="1130" width="540" height="540" rx="8" fill="url(#diagonal-hatch)" opacity="0.6" />
          <rect x="100" y="1145" width="230" height="32" rx="4" fill="#09090b" />
          <text x="110" y="1167" fill="#fbbf24" fontSize="18" fontWeight="bold">FUNCTION GENERATOR</text>
        </g>

        <g>
          <rect x="1790" y="690" width="550" height="980" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
          <rect x="1790" y="690" width="550" height="980" rx="8" fill="url(#diagonal-hatch)" opacity="0.6" />
          <rect x="1810" y="705" width="280" height="32" rx="4" fill="#09090b" />
          <text x="1820" y="727" fill="#fbbf24" fontSize="18" fontWeight="bold">ANALOG / DVM METERS</text>
        </g>

        {/* DC Power Supply Panel */}
        <rect x="80" y="240" width="540" height="430" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
        <text x="230" y="275" fill="#fbbf24" fontSize="22" fontWeight="bold">DC POWER SUPPLY</text>
        <text x="440" y="366" fill="#ef4444" fontSize="18" fontWeight="bold">+5V</text>
        <text x="440" y="401" fill="#ef4444" fontSize="18" fontWeight="bold">+5V</text>
        <text x="440" y="471" fill="#38bdf8" fontSize="18" fontWeight="bold">GND</text>
        <text x="440" y="506" fill="#38bdf8" fontSize="18" fontWeight="bold">GND</text>

        {/* LED Display Panel Header */}
        <rect x="1790" y="240" width="550" height="430" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
        <text x="1950" y="275" fill="#fbbf24" fontSize="22" fontWeight="bold">8 BIT LED DISPLAY</text>

        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const ledX = 1860 + i * 58;
          const isLit = powerOn && leds[i] === 1;

          return (
            <g key={`led-active-${i}`}>
              <circle cx={ledX} cy="330" r="18" fill={isLit ? "#ef4444" : "#27272a"} stroke={isLit ? "#fca5a5" : "#52525b"} strokeWidth="3" />
              {isLit && <circle cx={ledX} cy="330" r="28" fill="#ef4444" opacity="0.4" className="animate-pulse" />}
              <text x={ledX - 6} y={300} fill="#a1a1aa" fontSize="16" fontWeight="bold">{i}</text>
            </g>
          );
        })}

        {/* Data Switches Frame */}
        <rect x="80" y="1690" width="2263" height="420" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
        <text x="1110" y="1730" fill="#fbbf24" fontSize="26" fontWeight="bold">DATA SWITCHES</text>
      </g>

      {/* Main Power Switch */}
      <g className="cursor-pointer" onClick={togglePower}>
        <rect x="100" y="55" width="200" height="140" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        <text x="135" y="85" fill="#a1a1aa" fontSize="16" fontWeight="bold" className="select-none">POWER</text>
        <rect x="165" y="100" width="18" height="60" rx="4" fill="#3f3f46" />
        <circle cx="174" cy={powerOn ? "110" : "150"} r="15" fill={powerOn ? "#22c55e" : "#ef4444"} stroke="#ffffff" strokeWidth="2" />
        <circle cx="260" cy="130" r="10" fill={powerOn ? "#ef4444" : "#450a0a"} stroke="#991b1b" strokeWidth="2" />
        {powerOn && <circle cx="260" cy="130" r="18" fill="#ef4444" opacity="0.4" className="animate-pulse" />}
      </g>

      {/* Interactive Data Switches */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const switchX = 820 + i * 112;
        const switchY = 1930;
        const isOn = switches[i] === 1;

        return (
          <g key={`sw-active-${i}`} className="cursor-pointer" onClick={() => toggleSwitch && toggleSwitch(i)}>
            <rect x={switchX - 22} y={switchY - 50} width="44" height="100" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            <rect
              x={switchX - 18}
              y={isOn ? switchY - 42 : switchY + 2}
              width="36"
              height="40"
              rx="4"
              fill={isOn ? "#22c55e" : "#ef4444"}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x={switchX - 6} y={switchY + 80} fill="#fbbf24" fontSize="22" fontWeight="bold" className="select-none">{i}</text>
          </g>
        );
      })}

      {/* Static Visual Pin Holes */}
      <g className="pointer-events-none">
        {Object.entries(holeCoords).map(([holeId, coord]) => {
          const isRail = coord.type === 'rail';
          const isPower = coord.type === 'power';
          const isLed = coord.type === 'led';
          const isSwitch = coord.type === 'switch';

          return (
            <g key={`pin-socket-${holeId}`}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={isPower || isSwitch || isLed ? "11" : "5.5"}
                fill={
                  isPower
                    ? coord.nodeGroup === 'FIXED_VCC' ? '#ef4444' : '#0284c7'
                    : isSwitch
                    ? '#0284c7'
                    : isLed
                    ? '#ea580c'
                    : '#e2e8f0'
                }
                stroke={isRail ? (coord.nodeGroup.includes('VCC') ? '#fca5a5' : '#93c5fd') : '#64748b'}
                strokeWidth="1.5"
              />
              <circle cx={coord.x} cy={coord.y} r={isPower || isSwitch || isLed ? "5" : "2.5"} fill="#0f172a" />
            </g>
          );
        })}
      </g>
    </g>
  );
});

BoardVector.displayName = 'BoardVector';