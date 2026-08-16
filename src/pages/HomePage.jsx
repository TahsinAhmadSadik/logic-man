import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PROBLEMS_INDEX } from '../data/problems';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { UserGuideModal } from '../components/UserGuideModal';
import logo from '../assets/favicon.png';
import {
  Wrench,
  Cpu,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GitBranch,
  Users,
  Code2,
  Bug,
  Play,
  HelpCircle
} from 'lucide-react';

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('design');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedIcTag, setSelectedIcTag] = useState('All');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const { completedProblemIds } = useSimulatorStore();

  // Show guide automatically only on the first visit
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenLogicManGuide');
    if (!hasSeenGuide) {
      setIsGuideOpen(true);
    }
  }, []);

  const handleCloseGuide = () => {
    localStorage.setItem('hasSeenLogicManGuide', 'true');
    setIsGuideOpen(false);
  };

  const allIcTags = Array.from(
    new Set(PROBLEMS_INDEX.flatMap((p) => p.tags.filter((t) => t.startsWith('74'))))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const filteredProblems = PROBLEMS_INDEX.filter((prob) => {
    if (prob.category !== activeCategory) return false;

    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.numId.toString() === searchQuery;

    if (!matchesSearch) return false;

    if (selectedDifficulty !== 'All' && prob.difficulty !== selectedDifficulty) return false;

    if (selectedIcTag !== 'All' && !prob.tags.includes(selectedIcTag)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-bold font-mono">
            LM
          </div> */}
          <img src={logo} alt="" />
          <span className="font-bold text-lg tracking-wider text-white">LogicMan</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          {/* User Guide Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors border border-zinc-700/60"
            title="Open Platform Guide"
          >
            <HelpCircle size={15} />
            <span>Guide</span>
          </button>

          {/* Free Sandbox Quick Access */}
          <Link
            to="/problem/free"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            <Play size={14} className="fill-zinc-950" />
            <span>Free Simulation</span>
          </Link>

          <Link
            to="/author"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <Code2 size={15} />
            <span>Problem Studio</span>
          </Link>
          <Link
            to="/contributors"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <Users size={15} />
            <span>Contributors</span>
          </Link>
          <a
            href="https://github.com/TahsinAhmadSadik/logic-man"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
            title="GitHub Repository"
          >
            <GitBranch size={16} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-12 max-w-5xl mx-auto w-full text-center space-y-6">
        {activeCategory === 'design' ? (
          <div className="space-y-3 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Circuit Design Mode
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Build Combinational Logic From Scratch
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Wire switches, IC chips, and LEDs on a real-world virtual breadboard to solve boolean logic challenges.
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest">
              <Bug size={14} /> Circuit Debugging Mode
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Troubleshoot & Fix Faulty Breadboards
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Inspect pre-wired circuits with signal clashes, missing power rails, or floating pins and fix the logic!
            </p>
          </div>
        )}

        {/* Big Toggle Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
            <button
              onClick={() => setActiveCategory('design')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeCategory === 'design'
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu size={18} />
              <span>Design Challenges</span>
            </button>
            <button
              onClick={() => setActiveCategory('debug')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeCategory === 'debug'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Wrench size={18} />
              <span>Debugging Labs</span>
            </button>
          </div>

          <Link
            to="/problem/free"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-amber-500/50 transition-all shadow-xl"
          >
            <Play size={16} className="text-amber-400 fill-amber-400" />
            <span>Open Sandbox Canvas</span>
          </Link>
        </div>
      </header>

      {/* Main Problem Grid */}
      <main className="max-w-5xl mx-auto w-full px-6 pb-20 flex-1 space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl backdrop-blur">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search problem name or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={selectedIcTag}
              onChange={(e) => setSelectedIcTag(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="All">All IC Types</option>
              {allIcTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Cards */}
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl space-y-2">
            <p className="text-zinc-400 text-sm font-semibold">No problems found</p>
            <p className="text-zinc-600 text-xs">Try adjusting your search or filter tags.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProblems.map((prob) => {
              const isSolved =
                completedProblemIds.includes(prob.id) ||
                completedProblemIds.includes(String(prob.numId));

              const maxVisibleTags = 2;
              const visibleTags = prob.tags.slice(0, maxVisibleTags);
              const hiddenTagCount = prob.tags.length - maxVisibleTags;

              return (
                <Link
                  key={prob.id}
                  to={`/problem/${prob.id}`}
                  className="group relative p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-bold">
                          #{prob.numId}
                        </span>
                        <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                          {prob.title}
                        </h3>
                      </div>

                      {isSolved && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold shrink-0">
                          <CheckCircle2 size={13} /> Solved
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                      {prob.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-[11px] gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded shrink-0 ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {prob.difficulty}
                      </span>

                      {visibleTags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded shrink-0"
                        >
                          {tag}
                        </span>
                      ))}

                      {hiddenTagCount > 0 && (
                        <span
                          className="font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold shrink-0"
                          title={`Additional Tags: ${prob.tags.slice(maxVisibleTags).join(', ')}`}
                        >
                          +{hiddenTagCount}
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-1 transition-transform shrink-0">
                      Start <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Onboarding Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
      />
    </div>
  );
};