import React from 'react';
import { Link } from 'react-router-dom';
import { useSimulatorStore } from '../store/useSimulatorStore';
import {
  ArrowLeft,
  Award,
  Code2,
  Users,
  Cpu,
  Timer,
  FileText,
  Terminal
} from 'lucide-react';

export const SimulatorNavbar = () => {
  const {
    currentProblem,
    completedProblemIds,
    activePanel,
    togglePanel,
    isShortCircuit
  } = useSimulatorStore();

  const isCompleted =
    currentProblem &&
    (completedProblemIds.includes(currentProblem.id) ||
      completedProblemIds.includes(String(currentProblem.numId)));

  const panels = [
    { id: 'library', label: 'IC Library', icon: Cpu },
    { id: 'timer', label: 'Stopwatch', icon: Timer },
    { id: 'spec', label: 'Lab Spec', icon: FileText },
    { id: 'console', label: 'Diagnostics', icon: Terminal, alert: isShortCircuit }
  ];

  return (
    <header className="fixed top-4 left-6 right-6 z-40 flex items-center justify-between gap-3 px-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md text-zinc-100 overflow-x-auto">
      {/* Left Section: Brand Logo & Problem Metadata */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/"
          className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-amber-500/10 hover:border-amber-500/30 border border-zinc-700/60 transition-all duration-150"
          title="Back to Homepage"
        >
          <ArrowLeft size={15} className="text-zinc-400 group-hover:-translate-x-0.5 group-hover:text-amber-400 transition-all" />
          <div className="w-5 h-5 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold font-mono text-[11px]">
            LM
          </div>
          <span className="font-bold text-xs tracking-wider text-white group-hover:text-amber-400 transition-colors hidden sm:inline">
            LogicMan
          </span>
        </Link>

        {currentProblem && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-xs">
            <span className="font-mono text-amber-400 font-bold">
              #{currentProblem.numId}
            </span>
            <span className="font-semibold text-zinc-200 truncate max-w-[150px]">
              {currentProblem.title}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                <Award size={12} /> Solved
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center Section: Panel Toggles (Merged from Bottom Floating Bar) */}
      <div className="flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800/80 p-1 rounded-xl">
        {panels.map((p) => {
          const Icon = p.icon;
          const isActive = activePanel === p.id;

          return (
            <button
              key={p.id}
              onClick={() => togglePanel(p.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
              }`}
            >
              <Icon size={15} />
              <span className="hidden md:inline">{p.label}</span>

              {/* Alert indicator for Diagnostics */}
              {p.alert && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Section: Quick Links */}
      <div className="flex items-center gap-3 text-xs font-medium shrink-0">
        <Link
          to="/author"
          className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors"
          title="Problem Studio"
        >
          <Code2 size={15} />
          <span className="hidden xl:inline">Studio</span>
        </Link>
        <Link
          to="/contributors"
          className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors"
          title="Contributors"
        >
          <Users size={15} />
          <span className="hidden xl:inline">Contributors</span>
        </Link>
      </div>
    </header>
  );
};