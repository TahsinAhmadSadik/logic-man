import React, { useState } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { evaluateCircuit } from '../utils/circuitEngine';
import { generateBoardCoordinates } from '../utils/boardCoordinates';
import { FileText, Table, Play, CheckCircle2, XCircle, X, HelpCircle, Award, Loader2 } from 'lucide-react';

const holeCoords = generateBoardCoordinates();

export const LabSpecPanel = () => {
  const {
    activePanel,
    togglePanel,
    currentProblem,
    wires,
    placedIcs,
    completedProblemIds,
    markProblemCompleted,
    reevaluate
  } = useSimulatorStore();

  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'truthtable'
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(null);

  if (activePanel !== 'spec' || !currentProblem) return null;

  const isCompleted =
    completedProblemIds.includes(currentProblem.id) ||
    completedProblemIds.includes(String(currentProblem.numId));

  // --- RUN ANIMATED AUTO-GRADER TESTER ---
  const handleRunTester = async () => {
    setIsRunningTests(true);
    setActiveTab('truthtable'); // Automatically focus truth table tab during test
    setTestResults([]);
    let allPassed = true;
    const accumulatedResults = [];

    // Temporarily turn ON power for live evaluation feedback
    useSimulatorStore.setState({ powerOn: true });

    for (let rowIndex = 0; rowIndex < currentProblem.truthTable.length; rowIndex++) {
      const row = currentProblem.truthTable[rowIndex];
      setActiveRowIndex(rowIndex);

      // 1. Update switches in store live so switches & LEDs animate on breadboard
      const currentSwitches = [0, 0, 0, 0, 0, 0, 0, 0];
      currentProblem.ioMapping.inputs.forEach((inputDef) => {
        const val = row.inputs[inputDef.name];
        if (val !== undefined && val !== 'X') {
          currentSwitches[inputDef.switchIndex] = Number(val);
        }
      });

      // Synchronize live switches in Zustand store & reevaluate circuit outputs
      useSimulatorStore.setState({ switches: currentSwitches });
      reevaluate();

      // 2. Evaluate circuit state
      const evalResult = evaluateCircuit({
        powerOn: true,
        wires,
        placedIcs,
        switches: currentSwitches,
        holeCoords
      });

      // 3. Verify output signals
      const actualOutputs = {};
      let rowPassed = !evalResult.isShortCircuit;

      currentProblem.ioMapping.outputs.forEach((outDef) => {
        const expected = row.outputs[outDef.name];
        const actual = evalResult.leds[outDef.ledIndex];
        actualOutputs[outDef.name] = actual;

        if (expected !== '-' && expected !== 'X') {
          if (Number(expected) !== actual) {
            rowPassed = false;
          }
        }
      });

      if (!rowPassed) allPassed = false;

      accumulatedResults.push({
        rowIndex,
        passed: rowPassed,
        expectedInputs: row.inputs,
        expectedOutputs: row.outputs,
        actualOutputs
      });

      // Update test results incrementally for live table animation
      setTestResults([...accumulatedResults]);

      // Delay between test cases to animate switch flipping and LED toggling
      await new Promise((res) => setTimeout(res, 180));
    }

    setActiveRowIndex(null);
    setIsRunningTests(false);

    if (allPassed) {
      markProblemCompleted(currentProblem.id);
      markProblemCompleted(String(currentProblem.numId));
    }
  };

  return (
    <div
      className="fixed top-20 left-6 z-50 w-96 h-[75vh] bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-zinc-200"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-amber-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate max-w-[200px]">
            Problem #{currentProblem.numId}: {currentProblem.title}
          </h2>
          {isCompleted && (
            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
              <Award size={12} /> Solved
            </span>
          )}
        </div>
        <button onClick={() => togglePanel('spec')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/30">
        <button
          onClick={() => setActiveTab('problem')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'problem'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText size={14} /> Specification
        </button>
        <button
          onClick={() => setActiveTab('truthtable')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'truthtable'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Table size={14} /> Truth Table
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto text-xs space-y-4">
        {activeTab === 'problem' ? (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {currentProblem.difficulty}
              </span>
              <p className="text-zinc-300 leading-relaxed mt-2.5 text-xs">{currentProblem.description}</p>
            </div>

            {/* IO Pin Mappings */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase">I/O Pin Assignments</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-zinc-500">INPUTS:</span>
                  {currentProblem.ioMapping.inputs.map((inp) => (
                    <div key={inp.name} className="text-zinc-300">
                      • {inp.name} $\rightarrow$ <strong className="text-sky-400">Switch {inp.switchIndex}</strong>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-zinc-500">OUTPUTS:</span>
                  {currentProblem.ioMapping.outputs.map((out) => (
                    <div key={out.name} className="text-zinc-300">
                      • {out.name} $\rightarrow$ <strong className="text-amber-400">LED {out.ledIndex}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hints Section */}
            {currentProblem.hints && currentProblem.hints.length > 0 && (
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px]">
                  <HelpCircle size={14} /> Hints
                </div>
                {currentProblem.hints.map((hint, idx) => (
                  <p key={idx} className="text-sky-200 text-[11px] leading-relaxed">
                    • {hint}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
              <table className="w-full text-center font-mono text-[11px]">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    {currentProblem.ioMapping.inputs.map((inp) => (
                      <th key={inp.name} className="p-2 border-r border-zinc-800">{inp.name}</th>
                    ))}
                    {currentProblem.ioMapping.outputs.map((out) => (
                      <th key={out.name} className="p-2 text-amber-400">{out.name}</th>
                    ))}
                    <th className="p-2 text-zinc-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {currentProblem.truthTable.map((row, idx) => {
                    const result = testResults?.[idx];
                    const isPassed = result?.passed;
                    const isActive = activeRowIndex === idx;

                    return (
                      <tr
                        key={idx}
                        className={`transition-all duration-150 ${
                          isActive
                            ? 'bg-amber-500/20 text-white font-bold animate-pulse'
                            : result
                            ? isPassed
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-rose-500/10 text-rose-300'
                            : 'hover:bg-zinc-800/40'
                        }`}
                      >
                        {currentProblem.ioMapping.inputs.map((inp) => (
                          <td key={inp.name} className="p-2 border-r border-zinc-800/50">
                            {row.inputs[inp.name] ?? '-'}
                          </td>
                        ))}
                        {currentProblem.ioMapping.outputs.map((out) => (
                          <td key={out.name} className="p-2 font-bold">
                            {row.outputs[out.name]}
                            {result && result.actualOutputs[out.name] !== undefined && (
                              <span className="text-[10px] ml-1 opacity-70">
                                ({result.actualOutputs[out.name]})
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="p-2 flex items-center justify-center">
                          {isActive ? (
                            <Loader2 size={14} className="animate-spin text-amber-400" />
                          ) : result ? (
                            isPassed ? (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            ) : (
                              <XCircle size={16} className="text-rose-400" />
                            )
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer Fixed Action: RUN TESTER */}
      <div className="p-3.5 border-t border-zinc-800 bg-zinc-950/80">
        <button
          onClick={handleRunTester}
          disabled={isRunningTests}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {isRunningTests ? (
            <div className="flex items-center gap-2">
              <Loader2 size={15} className="animate-spin text-zinc-950" />
              <span>Testing Truth Table...</span>
            </div>
          ) : (
            <>
              <Play size={15} className="fill-zinc-950" />
              <span>Run Tester</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};