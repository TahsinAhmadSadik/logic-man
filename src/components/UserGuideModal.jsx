import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  GitPullRequest,
  AlertTriangle,
  Play,
  Wrench,
  BookOpen,
  Terminal,
  Timer,
  FileCode,
  Download,
  Share2,
  ExternalLink,
  Eraser,
  MousePointer
} from 'lucide-react';

export const UserGuideModal = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    // --- Slide 1 ---
    {
      title: 'Welcome to LogicMan',
      subtitle: 'Digital Logic Lab Practice & Problem-Solving Platform',
      icon: Sparkles,
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl">
            <strong>Why LogicMan?</strong> While standard circuit simulators exist, LogicMan is specialized for university DLD laboratory courses. It pairs real-world trainer board mechanics with graded problem sets so you can practice wiring, troubleshoot faults, and ace your lab exams.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <Cpu size={14} className="text-amber-400" /> Design Challenges
              </div>
              <p className="text-zinc-400 text-[11px]">
                Build combinational logic from scratch to satisfy a specified Boolean expression or truth table.
              </p>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <Wrench size={14} className="text-rose-400" /> Debugging Labs
              </div>
              <p className="text-zinc-400 text-[11px]">
                Inspect pre-wired breadboards with signal clashes, missing power rails, or wrong pinouts, and fix them with minimal rewiring.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // --- Slide 2 ---
    {
      title: 'Breadboard Controls & Shortcuts',
      subtitle: 'Master navigation, wiring, deletion, and assembly',
      icon: Layers,
      content: (
        <div className="space-y-3 text-xs text-zinc-300">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-zinc-400 block font-semibold mb-0.5">Navigation:</span>
              <p className="text-zinc-300">Scroll wheel to <strong className="text-white">Zoom</strong>. Drag canvas to <strong className="text-white">Pan</strong>.</p>
            </div>
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-zinc-400 block font-semibold mb-0.5">Wire Colors:</span>
              <p className="text-zinc-300">Pick colors to organize <strong className="text-rose-400">VCC</strong>, <strong className="text-zinc-400">GND</strong>, and data paths.</p>
            </div>
          </div>

          {/* Wire & IC Deletion Guide */}
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1.5">
            <h4 className="font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Eraser size={13} /> How to Delete Wires & ICs (Power Must Be OFF)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-zinc-950/80 p-2 rounded border border-zinc-800 flex items-start gap-1.5">
                <MousePointer size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Desktop:</strong> Right-click on any wire/IC, or select it and press the <strong className="text-white">Delete</strong> key.</span>
              </div>
              <div className="bg-zinc-950/80 p-2 rounded border border-zinc-800 flex items-start gap-1.5">
                <Eraser size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Tablet/Touch:</strong> Click the <strong className="text-rose-400">Eraser icon</strong> in the bottom toolbar to tap-to-delete.</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Essential Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10.5px]">
              <div className="flex items-center justify-between bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                <span>Undo / Redo</span>
                <span className="text-amber-400 font-bold">Ctrl+Z / Ctrl+Y</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                <span>Clear All Wires</span>
                <span className="text-amber-400 font-bold">Ctrl+W</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                <span>Reset Circuit</span>
                <span className="text-amber-400 font-bold">Ctrl+R</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                <span>Power Toggle</span>
                <span className="text-amber-400 font-bold">Power Switch</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // --- Slide 3 ---
    {
      title: 'Tools & Diagnostic Panels',
      subtitle: 'Your laboratory workbench toolkit',
      icon: Terminal,
      content: (
        <div className="space-y-2.5 text-xs text-zinc-300">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-start gap-2.5">
            <Cpu size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">IC Library & Pinout Manuals:</strong>
              <p className="text-zinc-400 text-[11px]">Browse allowed chips for the problem. Click the <BookOpen size={11} className="inline text-amber-400 mx-0.5" /> book icon to view standard DIP pin numbers, notch orientation, and gate function tables.</p>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-start gap-2.5">
            <Timer size={18} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Stopwatch:</strong>
              <p className="text-zinc-400 text-[11px]">Time your practice sessions to build speed and confidence for real timed laboratory exams.</p>
            </div>
          </div>

          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-start gap-2.5">
            <Terminal size={18} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Real-Time Diagnostics Console:</strong>
              <p className="text-zinc-400 text-[11px]">Automatically flags short-circuits (VCC-to-GND), logic clashes (two gates driving the same node), unconnected IC power pins, and floating TTL inputs.</p>
            </div>
          </div>
        </div>
      )
    },

    // --- Slide 4 ---
    {
      title: 'Auto-Tester, Editorial & Sharing',
      subtitle: 'Validate solutions, learn fixes, and share circuits',
      icon: CheckCircle2,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white text-xs">
              <Play size={14} className="text-emerald-400 fill-emerald-400" /> Automated Truth Table Grader
            </div>
            <p className="text-zinc-400 text-[11px]">
              Open the <strong>Lab Spec</strong> panel and click <strong>Run Tester</strong>. The engine automatically cycles switches through all input combinations with live breadboard animations and evaluates correctness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
              <strong className="text-amber-400 flex items-center gap-1">
                <BookOpen size={13} /> Editorial Solutions
              </strong>
              <p className="text-zinc-400 text-[11px]">
                Stuck? Open the Editorial to load the verified solution. For debug labs, a changelog modal shows every wire moved or added.
              </p>
            </div>

            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
              <strong className="text-sky-400 flex items-center gap-1">
                <Share2 size={13} /> Import & Export
              </strong>
              <p className="text-zinc-400 text-[11px]">
                Export any circuit as a lightweight <code className="text-zinc-200">.json</code> file to backup your work or share solutions with classmates.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // --- Slide 5 ---
    {
      title: 'Free Simulation Sandbox',
      subtitle: 'Build whatever you want & Auto-Generate Truth Tables',
      icon: Play,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Want to test an assignment problem not listed in the catalog? Enter <strong>Free Simulation Mode</strong> from the homepage navbar to get unlimited access to all basic logic gates, 4-bit adders, decoders, multiplexers, and encoders.
          </p>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-xl space-y-1.5">
            <strong className="text-amber-400 flex items-center gap-1.5 text-xs">
              <Sparkles size={14} /> Instant Truth Table Generator
            </strong>
            <p className="text-[11px] text-zinc-300">
              When working in Free Mode, open the <strong>Circuit Analyzer</strong> panel and click <strong>Generate Truth Table</strong>. The simulator scans all connected switches and LEDs, simulates every state, and produces the complete truth table of your custom circuit in milliseconds!
            </p>
          </div>
        </div>
      )
    },

    // --- Slide 6 ---
    {
      title: 'Contributing & Reporting Issues',
      subtitle: 'Help expand LogicMan for your department',
      icon: GitPullRequest,
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5">
            <strong className="text-white flex items-center gap-1.5">
              <FileCode size={14} className="text-amber-400" /> Authoring Problems via Problem Studio
            </strong>
            <p className="text-zinc-400 text-[11px]">
              Use our built-in <strong>Problem Studio</strong> to define inputs, expected truth tables, IC limits, and export validated problem JSONs without writing raw code.
            </p>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5">
            <strong className="text-white flex items-center gap-1.5">
              <GitPullRequest size={14} className="text-sky-400" /> How to Submit a Pull Request
            </strong>
            <p className="text-zinc-400 text-[11px]">
              To add your problem to LogicMan: add your problem JSON to <code className="text-zinc-300">src/data/problems/</code>, its solved circuit to <code className="text-zinc-300">src/data/solutions/</code>, and register both in their respective <code className="text-zinc-300">index.js</code> files.
            </p>
          </div>

          {/* GitHub Issue Reporting Link */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div>
              <strong className="text-white block text-xs">Found a bug or incorrect problem?</strong>
              <span className="text-zinc-400 text-[11px]">Report issues directly on our GitHub repository.</span>
            </div>
            <a
              href="https://github.com/TahsinAhmadSadik/logic-man/issues/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors border border-zinc-700"
            >
              Report Issue <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <HelpCircle size={18} />
            <span>LogicMan Platform Guide</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Slide Title Bar */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{current.title}</h3>
              <p className="text-zinc-400 text-xs">{current.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Slide Body */}
        <div className="px-5 py-3 flex-1 overflow-y-auto">{current.content}</div>

        {/* Footer with Step Dots and Prev/Next Controls */}
        <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-between">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx
                    ? 'w-6 bg-amber-400'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Prev Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Back
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-md shadow-emerald-500/20"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};