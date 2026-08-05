import React from 'react';

export const BoardVector = ({ holeCoords, switches, toggleSwitch, powerOn, togglePower, leds }) => {
  return (
    <g id="pure-svg-board-layer">
      {/* SVG Defs: Diagonal Hatch Pattern for Inactive Sections */}
      <defs>
        <pattern id="diagonal-hatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#27272a" strokeWidth="4" />
        </pattern>
      </defs>

      {/* 1. Main Outer Box & Wooden Accents */}
      <rect x="0" y="0" width="2423" height="2160" rx="12" fill="#121214" stroke="#27272a" strokeWidth="8" />
      <rect x="0" y="0" width="50" height="2160" fill="#78350f" rx="4" />
      <rect x="2373" y="0" width="50" height="2160" fill="#78350f" rx="4" />

      {/* --- HEADER BAR --- */}
      <rect x="80" y="40" width="2263" height="170" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
      
      {/* Power Toggle Switch (Top-Left) */}
      <g className="cursor-pointer" onClick={togglePower}>
        <rect x="100" y="55" width="200" height="140" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        <text x="135" y="85" fill="#a1a1aa" fontSize="16" fontWeight="bold">POWER</text>
        <rect x="165" y="100" width="18" height="60" rx="4" fill="#3f3f46" />
        <circle cx="174" cy={powerOn ? "110" : "150"} r="15" fill={powerOn ? "#22c55e" : "#ef4444"} stroke="#ffffff" strokeWidth="2" />
        <circle cx="260" cy="130" r="10" fill={powerOn ? "#ef4444" : "#450a0a"} stroke="#991b1b" strokeWidth="2" />
        {powerOn && <circle cx="260" cy="130" r="18" fill="#ef4444" opacity="0.4" className="animate-pulse" />}
      </g>

      <text x="340" y="115" fill="#fbbf24" fontSize="52" fontWeight="bold">SB-700</text>
      <text x="340" y="160" fill="#e4e4e7" fontSize="26" letterSpacing="4">PORTABLE ANALOG/DIGITAL LABORATORY</text>

      {/* --- CENTRAL BREADBOARD CHASSIS --- */}
      <rect x="650" y="240" width="1120" height="1430" rx="10" fill="#1e1e22" stroke="#fbbf24" strokeWidth="2" />
      
      {/* White Plastic Breadboard Body */}
      <rect x="680" y="660" width="1060" height="560" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      
      {/* IC Center Division Channel */}
      <rect x="680" y="930" width="1060" height="20" fill="#cbd5e1" />

      {/* Rail Accent Lines */}
      <line x1="700" y1={700} x2="1720" y2={700} stroke="#ef4444" strokeWidth="3" />
      <line x1="700" y1={725} x2="1720" y2={725} stroke="#3b82f6" strokeWidth="3" />
      <line x1="700" y1={1140} x2="1720" y2={1140} stroke="#ef4444" strokeWidth="3" />
      <line x1="700" y1={1165} x2="1720" y2={1165} stroke="#3b82f6" strokeWidth="3" />

      {/* --- INACTIVE / DISABLED MODULES (YELLOW BORDER + GRAY HATCH) --- */}
      
      {/* 1. Logic Probe (Inactive) */}
      <g>
        <rect x="80" y="690" width="540" height="420" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
        <rect x="80" y="690" width="540" height="420" rx="8" fill="url(#diagonal-hatch)" opacity="0.6" />
        <rect x="100" y="705" width="240" height="32" rx="4" fill="#09090b" />
        <text x="110" y="727" fill="#fbbf24" fontSize="18" fontWeight="bold">3 STATE LOGIC PROBE</text>
      </g>

      {/* 2. Function Generator (Inactive) */}
      <g>
        <rect x="80" y="1130" width="540" height="540" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
        <rect x="80" y="1130" width="540" height="540" rx="8" fill="url(#diagonal-hatch)" opacity="0.6" />
        <rect x="100" y="1145" width="230" height="32" rx="4" fill="#09090b" />
        <text x="110" y="1167" fill="#fbbf24" fontSize="18" fontWeight="bold">FUNCTION GENERATOR</text>
      </g>

      {/* 3. Current Meter & DVM (Inactive) */}
      <g>
        <rect x="1790" y="690" width="550" height="980" rx="8" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
        <rect x="1790" y="690" width="550" height="980" rx="8" fill="url(#diagonal-hatch)" opacity="0.6" />
        <rect x="1810" y="705" width="280" height="32" rx="4" fill="#09090b" />
        <text x="1820" y="727" fill="#fbbf24" fontSize="18" fontWeight="bold">ANALOG / DVM METERS</text>
      </g>

      {/* --- ACTIVE MODULE 1: DC POWER SUPPLY --- */}
      <rect x="80" y="240" width="540" height="430" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
      <text x="230" y="275" fill="#fbbf24" fontSize="22" fontWeight="bold">DC POWER SUPPLY</text>
      <text x="440" y="366" fill="#ef4444" fontSize="18" fontWeight="bold">+5V</text>
      <text x="440" y="401" fill="#ef4444" fontSize="18" fontWeight="bold">+5V</text>
      <text x="440" y="471" fill="#38bdf8" fontSize="18" fontWeight="bold">GND</text>
      <text x="440" y="506" fill="#38bdf8" fontSize="18" fontWeight="bold">GND</text>

      {/* --- ACTIVE MODULE 2: 8-BIT LED DISPLAY --- */}
      <rect x="1790" y="240" width="550" height="430" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
      <text x="1950" y="275" fill="#fbbf24" fontSize="22" fontWeight="bold">8 BIT LED DISPLAY</text>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const ledX = 1860 + i * 58;
        const isLit = powerOn && leds && leds[i] === 1;

        return (
          <g key={`led-active-${i}`}>
            {/* LED Bulb */}
            <circle cx={ledX} cy="330" r="18" fill={isLit ? "#ef4444" : "#27272a"} stroke={isLit ? "#fca5a5" : "#52525b"} strokeWidth="3" />
            {isLit && <circle cx={ledX} cy="330" r="28" fill="#ef4444" opacity="0.4" className="animate-pulse" />}
            <text x={ledX - 6} y={300} fill="#a1a1aa" fontSize="16" fontWeight="bold">{i}</text>
          </g>
        );
      })}

      {/* --- ACTIVE MODULE 3: DATA SWITCHES --- */}
      <rect x="80" y="1690" width="2263" height="420" rx="8" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
      <text x="1110" y="1730" fill="#fbbf24" fontSize="26" fontWeight="bold">DATA SWITCHES</text>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const switchX = 820 + i * 112;
        const switchY = 1930;
        const isOn = switches[i] === 1;

        return (
          <g key={`sw-active-${i}`} className="cursor-pointer" onClick={() => toggleSwitch(i)}>
            {/* Switch Track Slot */}
            <rect x={switchX - 22} y={switchY - 50} width="44" height="100" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            
            {/* Switch Handle Lever */}
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
            <text x={switchX - 6} y={switchY + 80} fill="#fbbf24" fontSize="22" fontWeight="bold">{i}</text>
          </g>
        );
      })}

      {/* --- RENDER PERFECTLY ALIGNED PIN SOCKET HOLES --- */}
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
  );
};