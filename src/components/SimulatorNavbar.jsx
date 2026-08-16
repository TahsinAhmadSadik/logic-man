import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { getSolutionById } from '../data/solutions';
import { DebugEditorialModal } from './DebugEditorialModal';
import { UserGuideModal } from './UserGuideModal';
import logo from '../assets/favicon2.png'
import {
  ArrowLeft,
  Award,
  Cpu,
  Timer,
  FileText,
  Terminal,
  Download,
  Upload,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const SimulatorNavbar = () => {
  const fileInputRef = useRef(null);

  const {
    currentProblem,
    completedProblemIds,
    activePanel,
    togglePanel,
    isShortCircuit,
    exportCircuit,
    importCircuit,
    wires,
    placedIcs,
    setPendingConfirmAction
  } = useSimulatorStore();

  const [activeDebugEditorial, setActiveDebugEditorial] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importCircuit(content);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const isCircuitMatchingSolution = (solution) => {
    if (!solution) return false;
    if (wires.length !== solution.wires?.length) return false;
    if (placedIcs.length !== solution.placedIcs?.length) return false;

    const currentWireIds = new Set(wires.map((w) => `${w.startHole}_${w.endHole}`));
    const solutionWireIds = new Set((solution.wires || []).map((w) => `${w.startHole}_${w.endHole}`));
    for (let id of solutionWireIds) {
      if (!currentWireIds.has(id)) return false;
    }
    return true;
  };

  const handleEditorialClick = () => {
    if (!currentProblem || currentProblem.id === 'free' || currentProblem.numId === 0) return;

    const solution = getSolutionById(currentProblem.id) || getSolutionById(String(currentProblem.numId));
    if (!solution) return;

    const isDebugProblem =
      currentProblem.category?.toLowerCase().includes('debug') ||
      !!solution.debugChanges;

    if (isCircuitMatchingSolution(solution) && isDebugProblem) {
      setActiveDebugEditorial(solution);
      return;
    }

    setPendingConfirmAction({
      type: 'loadEditorial',
      title: 'View Editorial Solution?',
      message:
        'Warning: Viewing the editorial will overwrite your current breadboard circuit with the complete reference solution. Are you sure you want to proceed?',
      onConfirm: () => {
        useSimulatorStore.setState({
          placedIcs: solution.placedIcs || [],
          wires: solution.wires || []
        });
        useSimulatorStore.getState().reevaluate();

        if (isDebugProblem && solution.debugChanges) {
          setActiveDebugEditorial(solution);
        }
      }
    });
  };

  const hasEditorialSolution =
    currentProblem &&
    currentProblem.id !== 'free' &&
    currentProblem.numId !== 0 &&
    !!(getSolutionById(currentProblem.id) || getSolutionById(String(currentProblem.numId)));

  return (
    <>
      <header className="fixed top-4 left-6 right-6 z-40 flex items-center justify-between gap-3 px-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md text-zinc-100 overflow-x-auto">
        {/* Hidden File Input for Import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />

        {/* Left Section: Brand Logo & Problem Metadata */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-amber-500/10 hover:border-amber-500/30 border border-zinc-700/60 transition-all duration-150"
            title="Back to Homepage"
          >
            <ArrowLeft size={15} className="text-zinc-400 group-hover:-translate-x-0.5 group-hover:text-amber-400 transition-all" />
            {/* <div className="w-5 h-5 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold font-mono text-[11px]">
              LM
            </div> */}
            <img src={logo} alt="" />
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

        {/* Center Section: Panel Toggles */}
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

                {p.alert && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Section: Guide + Editorial + Export/Import */}
        <div className="flex items-center gap-2 text-xs font-medium shrink-0">
          {/* Guide Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-700/50 transition-colors"
            title="Open Platform Guide"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Editorial / Solution Button */}
          {hasEditorialSolution && (
            <button
              onClick={handleEditorialClick}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-colors shadow-sm"
              title="View Problem Editorial & Solution"
            >
              <BookOpen size={14} className="text-amber-400" />
              <span>Editorial</span>
            </button>
          )}

          {/* Export Circuit JSON */}
          <button
            onClick={exportCircuit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
            title="Export Circuit JSON"
          >
            <Download size={14} className="text-amber-400" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Import Circuit JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
            title="Import Circuit JSON"
          >
            <Upload size={14} className="text-amber-400" />
            <span className="hidden lg:inline">Import</span>
          </button>
        </div>
      </header>

      {/* Debug Fixes Breakdown Modal */}
      {activeDebugEditorial && (
        <DebugEditorialModal
          solution={activeDebugEditorial}
          onClose={() => setActiveDebugEditorial(null)}
        />
      )}

      {/* Platform User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};