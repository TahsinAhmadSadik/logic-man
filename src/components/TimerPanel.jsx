import React, { useState } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { Timer, Play, Pause, RotateCcw, BellOff, X, Clock } from 'lucide-react';

export const TimerPanel = () => {
  const {
    activePanel,
    togglePanel,
    // Stopwatch
    stopwatchTime,
    isStopwatchRunning,
    setIsStopwatchRunning,
    resetStopwatch,
    // Timer
    timerRemainingTime,
    timerInitialTime,
    isTimerRunning,
    setIsTimerRunning,
    resetTimer,
    setTimerInitialTime,
    isTimerAlarmActive,
    dismissTimerAlarm
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState('timer'); // 'timer' | 'stopwatch'
  const [customMinutes, setCustomMinutes] = useState('5');

  if (activePanel !== 'timer') return null;

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetTimer = (e) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimerInitialTime(mins * 60);
    }
  };

  return (
    <div
      className="fixed top-20 left-6 z-50 w-80 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Panel Top Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Clock & Timer</h2>
        </div>
        <button onClick={() => togglePanel('timer')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/30">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'timer'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Timer size={14} /> Countdown Timer
        </button>
        <button
          onClick={() => setActiveTab('stopwatch')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'stopwatch'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock size={14} /> Stopwatch
        </button>
      </div>

      {/* TAB 1: COUNTDOWN TIMER */}
      {activeTab === 'timer' && (
        <div className="p-5 flex flex-col items-center">
          {/* Active Alarm Alert */}
          {isTimerAlarmActive && (
            <div className="w-full mb-4 p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center justify-between animate-pulse">
              <span className="text-xs font-bold text-rose-300">⏰ Time's Up!</span>
              <button
                onClick={dismissTimerAlarm}
                className="flex items-center gap-1 text-[11px] bg-rose-500 text-white font-bold py-1 px-2.5 rounded-lg hover:bg-rose-600 transition-colors"
              >
                <BellOff size={12} /> Stop Sound
              </button>
            </div>
          )}

          {/* Digital LED Display */}
          <div className="bg-zinc-950 border-2 border-zinc-800 px-8 py-4 rounded-2xl shadow-inner mb-5">
            <span className="font-mono text-4xl font-extrabold tracking-widest text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              {formatTime(timerRemainingTime)}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3 mb-5">
            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                disabled={timerRemainingTime === 0}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-colors disabled:opacity-50"
              >
                <Play size={14} fill="currentColor" /> Start
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-colors"
              >
                <Pause size={14} fill="currentColor" /> Pause
              </button>
            )}

            <button
              onClick={resetTimer}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-3 py-2 rounded-xl text-xs transition-colors border border-zinc-700"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Preset Custom Time Input */}
          <form onSubmit={handleSetTimer} className="w-full flex items-center gap-2 pt-3 border-t border-zinc-800">
            <span className="text-xs text-zinc-400">Set (Mins):</span>
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-center text-zinc-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg transition-colors"
            >
              Set
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: STOPWATCH */}
      {activeTab === 'stopwatch' && (
        <div className="p-5 flex flex-col items-center">
          {/* Digital LED Display */}
          <div className="bg-zinc-950 border-2 border-zinc-800 px-8 py-4 rounded-2xl shadow-inner mb-5">
            <span className="font-mono text-4xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {formatTime(stopwatchTime)}
            </span>
          </div>

          {/* Stopwatch Controls */}
          <div className="flex items-center gap-3">
            {!isStopwatchRunning ? (
              <button
                onClick={() => setIsStopwatchRunning(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-colors"
              >
                <Play size={14} fill="currentColor" /> Start
              </button>
            ) : (
              <button
                onClick={() => setIsStopwatchRunning(false)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-colors"
              >
                <Pause size={14} fill="currentColor" /> Pause
              </button>
            )}

            <button
              onClick={resetStopwatch}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-3 py-2 rounded-xl text-xs transition-colors border border-zinc-700"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};