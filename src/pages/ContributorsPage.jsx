import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Code2,
  GitBranch,
  Heart,
  Crown,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ContributorsPage = () => {
  const GITHUB_REPO = 'https://github.com/TahsinAhmadSadik/logic-man';

  // Highlighted Lead
  const projectLead = {
    name: 'Tahsin Ahmad',
    role: 'Project Lead & Core Architect',
    github: 'https://github.com/TahsinAhmadSadik',
    bio: 'Architected the core breadboard engine, combinational logic evaluation runtime, auto-grader, and UI system.',
    tags: ['Lead', 'Engine Architecture', 'UI/UX']
  };

  // Official Contributors List
  const contributorNames = [
    'Abdur Rahman Rounak',
    'Ali Tahmid Chowdhury',
    'Al Nahian Alif',
    // 'Imran Bin Hafiz',
    'Jarin Subah',
    'Jeneya Islam',
    'Nazmul Hasan Rafi',
    'Rahat Mohashin Zarif',
    'Raiyan Kazi',
    'Sadia Jahan Ritaz',
    'Sifat Al Islam',
    'Siratul Mustakim Arman',
    'Tabassum Binte Kamal',
    // 'Tamim Chowdhury',
    'Tanzimul Hasan Tahsin',
    // 'Tarif Mahir',
    'Tasnia Mehzabin Mysha'
  ];

  const contributors = contributorNames.map((name) => ({
    name,
    role: 'Contributor',
    github: 'https://github.com',
    contribution: 'Contributed to problem set authoring, logic testing, and platform development.'
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Users size={18} />
            <span>LogicMan Team</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition-colors border border-zinc-700/50"
          >
            <GitBranch size={15} />
            <span>Contribute on GitHub</span>
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1 space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Heart size={14} className="fill-amber-400" /> Open Source Contributors
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            The Minds Behind LogicMan
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
            LogicMan is built for students, by students. Special thanks to everyone who helped shape the simulator, write problem sets, and test breadboard circuits!
          </p>
        </div>

        {/* Project Lead Showcase Card */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Crown size={15} className="text-amber-400" /> Project Lead
          </h2>

          <div className="relative p-6 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-500 p-1 shrink-0 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-xl bg-zinc-950 flex items-center justify-center font-black text-2xl text-amber-400 font-mono">
                TA
              </div>
            </div>

            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                    {projectLead.name}
                    <Sparkles size={16} className="text-amber-400" />
                  </h3>
                  <p className="text-xs font-semibold text-amber-400">{projectLead.role}</p>
                </div>

                <a
                  href={projectLead.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  <GitBranch size={14} /> Profile <ExternalLink size={12} />
                </a>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{projectLead.bio}</p>

              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start pt-1">
                {projectLead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contributors List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Users size={15} className="text-amber-400" /> Contributors ({contributors.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributors.map((contrib, idx) => (
              <div
                key={idx}
                className="p-4 bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl transition-all duration-150 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold font-mono text-zinc-200">
                      {contrib.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{contrib.name}</h4>
                      <span className="text-[10px] text-amber-400/90 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {contrib.role}
                      </span>
                    </div>
                  </div>

                  {/* <a
                    href={contrib.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                  >
                    <GitBranch size={15} />
                  </a> */}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{contrib.contribution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source Callout */}
        <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl text-center space-y-3">
          <h3 className="text-sm font-bold text-white">Want to contribute problem sets or features?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            LogicMan is open-source! Use our Problem Studio to author custom laboratory specs or submit PRs on GitHub.
          </p>
          <div className="pt-2">
            <Link
              to="/author"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Code2 size={15} /> Open Problem Studio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};