import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { evaluateCircuit } from '../utils/circuitEngine';
import { generateBoardCoordinates } from '../utils/boardCoordinates';
import { FileText, Table, Play, CheckCircle2, XCircle, X, HelpCircle, Award, Loader2, User, Sparkles, RefreshCw, Cpu } from 'lucide-react';

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

  const isFreeMode = !currentProblem || currentProblem.id === 'free' || currentProblem.numId === 0;

  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'truthtable'
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(null);

  // Free Simulation Auto-Generated Table State
  const [freeModeTable, setFreeModeTable] = useState(null);
  const [isGeneratingFreeTable, setIsGeneratingFreeTable] = useState(false);

  // Default to truthtable tab in free mode
  useEffect(() => {
    if (isFreeMode) {
      setActiveTab('truthtable');
    } else {
      setActiveTab('problem');
    }
  }, [currentProblem, isFreeMode]);

  if (activePanel !== 'spec') return null;

  const isCompleted =
    !isFreeMode &&
    currentProblem &&
    (completedProblemIds.includes(currentProblem.id) ||
      completedProblemIds.includes(String(currentProblem.numId)));

  // Helper to check if a value represents a Don't Care condition
  const checkIsDontCare = (val) => {
    if (val === undefined || val === null) return true;
    const str = String(val).toLowerCase().trim();
    return str === 'x' || str === '-' || str === 'dontcare';
  };

  // --- FREE SIMULATION: GENERATE TRUTH TABLE ---
  const handleGenerateFreeTable = () => {
    setIsGeneratingFreeTable(true);

    // 1. Detect connected Switches (Inputs) and LEDs (Outputs)
    const connectedSwitchIndices = new Set();
    const connectedLedIndices = new Set();

    wires.forEach((w) => {
      [w.startHole, w.endHole].forEach((hole) => {
        if (hole && hole.startsWith('SWITCH_OUT_')) {
          connectedSwitchIndices.add(parseInt(hole.replace('SWITCH_OUT_', ''), 10));
        }
        if (hole && hole.startsWith('LED_IN_')) {
          connectedLedIndices.add(parseInt(hole.replace('LED_IN_', ''), 10));
        }
      });
    });

    const activeSwitches = Array.from(connectedSwitchIndices).sort((a, b) => a - b);
    const activeLeds = Array.from(connectedLedIndices).sort((a, b) => a - b);

    if (activeSwitches.length === 0 && activeLeds.length === 0) {
      setFreeModeTable({ error: 'No wires connected to Switch Outputs or LED Inputs.' });
      setIsGeneratingFreeTable(false);
      return;
    }

    // Limit to max 6 active switches (64 combinations) to prevent lag
    const numInputs = Math.min(activeSwitches.length, 6);
    const totalCombinations = Math.pow(2, numInputs);
    const tableRows = [];

    // 2. Evaluate all 2^N combinations
    for (let combo = 0; combo < totalCombinations; combo++) {
      const currentSwitches = [0, 0, 0, 0, 0, 0, 0, 0];
      const rowInputs = {};

      activeSwitches.slice(0, numInputs).forEach((swIdx, bitPos) => {
        const bitVal = (combo >> (numInputs - 1 - bitPos)) & 1;
        currentSwitches[swIdx] = bitVal;
        rowInputs[`SW${swIdx}`] = bitVal;
      });

      const evalResult = evaluateCircuit({
        powerOn: true,
        wires,
        placedIcs,
        switches: currentSwitches,
        holeCoords
      });

      const rowOutputs = {};
      activeLeds.forEach((ledIdx) => {
        rowOutputs[`LED${ledIdx}`] = evalResult.leds[ledIdx];
      });

      tableRows.push({
        inputs: rowInputs,
        outputs: rowOutputs,
        isShortCircuit: evalResult.isShortCircuit
      });
    }

    setFreeModeTable({
      inputHeaders: activeSwitches.slice(0, numInputs).map((s) => `SW${s}`),
      outputHeaders: activeLeds.map((l) => `LED${l}`),
      rows: tableRows
    });
    setIsGeneratingFreeTable(false);
  };

  // --- LAB PROBLEM: RUN ANIMATED AUTO-GRADER TESTER ---
  const handleRunTester = async () => {
    if (isFreeMode || !currentProblem) return;
    setIsRunningTests(true);
    setActiveTab('truthtable');
    setTestResults([]);
    let allPassed = true;
    const accumulatedResults = [];

    useSimulatorStore.setState({ powerOn: true });

    for (let rowIndex = 0; rowIndex < currentProblem.truthTable.length; rowIndex++) {
      const row = currentProblem.truthTable[rowIndex];
      setActiveRowIndex(rowIndex);

      const dontCareInputs = [];
      const baseSwitches = [0, 0, 0, 0, 0, 0, 0, 0];

      currentProblem.ioMapping.inputs.forEach((inputDef) => {
        const val = row.inputs[inputDef.name];
        if (checkIsDontCare(val)) {
          dontCareInputs.push(inputDef.switchIndex);
        } else {
          baseSwitches[inputDef.switchIndex] = Number(val);
        }
      });

      const combinationsCount = Math.pow(2, dontCareInputs.length);
      let rowPassed = true;
      let lastEvalResult = null;

      for (let combo = 0; combo < combinationsCount; combo++) {
        const currentSwitches = [...baseSwitches];
        dontCareInputs.forEach((switchIdx, bitIndex) => {
          currentSwitches[switchIdx] = (combo >> bitIndex) & 1;
        });

        useSimulatorStore.setState({ switches: currentSwitches });
        reevaluate();

        const evalResult = evaluateCircuit({
          powerOn: true,
          wires,
          placedIcs,
          switches: currentSwitches,
          holeCoords
        });

        lastEvalResult = evalResult;

        if (evalResult.isShortCircuit) {
          rowPassed = false;
          break;
        }

        currentProblem.ioMapping.outputs.forEach((outDef) => {
          const expectedRaw = row.outputs[outDef.name];
          const actual = evalResult.leds[outDef.ledIndex];

          let expectedVal = expectedRaw;
          if (typeof expectedRaw === 'string' && row.inputs[expectedRaw] !== undefined) {
            expectedVal = row.inputs[expectedRaw];
          }

          if (!checkIsDontCare(expectedVal)) {
            if (Number(expectedVal) !== actual) {
              rowPassed = false;
            }
          }
        });

        if (!rowPassed) break;
      }

      if (!rowPassed) allPassed = false;

      const actualOutputs = {};
      if (lastEvalResult) {
        currentProblem.ioMapping.outputs.forEach((outDef) => {
          actualOutputs[outDef.name] = lastEvalResult.leds[outDef.ledIndex];
        });
      }

      accumulatedResults.push({
        rowIndex,
        passed: rowPassed,
        expectedInputs: row.inputs,
        expectedOutputs: row.outputs,
        actualOutputs
      });

      setTestResults([...accumulatedResults]);
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
          {!isFreeMode && currentProblem ? (
            <>
              <FileText size={18} className="text-amber-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider truncate max-w-[200px]" title={currentProblem.title}>
                Problem #{currentProblem.numId}: {currentProblem.title}
              </h2>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                  <Award size={12} /> Solved
                </span>
              )}
            </>
          ) : (
            <>
              <Sparkles size={18} className="text-amber-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Free Circuit Analyzer
              </h2>
            </>
          )}
        </div>
        <button onClick={() => togglePanel('spec')} className="p-1 text-zinc-400 hover:text-white rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Tabs (Only visible if inside a Lab Problem) */}
      {!isFreeMode && currentProblem ? (
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
      ) : null}

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto text-xs space-y-4">
        {!isFreeMode && currentProblem ? (
          // ==================== LAB PROBLEM VIEW ====================
          activeTab === 'problem' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {currentProblem.difficulty}
                  </span>
                  {currentProblem.author && (
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium truncate max-w-[200px]" title={`Authored by ${currentProblem.author}`}>
                      <User size={12} className="text-amber-400 shrink-0" />
                      <span className="truncate">By <strong className="text-zinc-300">{currentProblem.author}</strong></span>
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs">{currentProblem.description}</p>
              </div>

              {/* IO Pin Mappings */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase">I/O Pin Assignments</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-zinc-500">INPUTS:</span>
                    {currentProblem.ioMapping.inputs.map((inp) => (
                      <div key={inp.name} className="text-zinc-300">
                        • {inp.name} → <strong className="text-sky-400">Switch {inp.switchIndex}</strong>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-zinc-500">OUTPUTS:</span>
                    {currentProblem.ioMapping.outputs.map((out) => (
                      <div key={out.name} className="text-zinc-300">
                        • {out.name} → <strong className="text-amber-400">LED {out.ledIndex}</strong>
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
              <div className="overflow-auto max-h-[calc(75vh-200px)] rounded-xl border border-zinc-800 bg-zinc-950">
                <table className="w-full min-w-max text-center font-mono text-[11px] border-collapse">
                  <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {currentProblem.ioMapping.inputs.map((inp) => (
                        <th key={inp.name} className="p-2 border-r border-zinc-800 bg-zinc-900">{inp.name}</th>
                      ))}
                      {currentProblem.ioMapping.outputs.map((out) => (
                        <th key={out.name} className="p-2 text-amber-400 bg-zinc-900">{out.name}</th>
                      ))}
                      <th className="p-2 text-zinc-400 bg-zinc-900">Status</th>
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
          )
        ) : (
          // ==================== FREE SIMULATION VIEW ====================
          <div className="space-y-4">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Cpu size={15} /> Custom Circuit Analyzer
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Connect switches (Inputs) and LEDs (Outputs) on the breadboard, then click <strong>"Generate Truth Table"</strong> below to simulate all input states.
              </p>
            </div>

            {!freeModeTable ? (
              <div className="text-center py-8 text-zinc-500 text-xs italic">
                Click below to analyze and generate your circuit's truth table.
              </div>
            ) : freeModeTable.error ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs">
                {freeModeTable.error}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                  <span>Combinations: <strong>{freeModeTable.rows.length}</strong></span>
                  <button onClick={handleGenerateFreeTable} className="text-amber-400 hover:underline flex items-center gap-1">
                    <RefreshCw size={11} /> Re-analyze
                  </button>
                </div>

                <div className="overflow-auto max-h-[calc(75vh-240px)] rounded-xl border border-zinc-800 bg-zinc-950">
                  <table className="w-full min-w-max text-center font-mono text-[11px] border-collapse">
                    <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 sticky top-0 z-10 shadow-sm">
                      <tr>
                        {freeModeTable.inputHeaders.map((inp) => (
                          <th key={inp} className="p-2 border-r border-zinc-800 bg-zinc-900 text-sky-400">{inp}</th>
                        ))}
                        {freeModeTable.outputHeaders.map((out) => (
                          <th key={out} className="p-2 border-r border-zinc-800 bg-zinc-900 text-amber-400">{out}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {freeModeTable.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/40">
                          {freeModeTable.inputHeaders.map((inp) => (
                            <td key={inp} className="p-2 border-r border-zinc-800/50 text-zinc-300">
                              {row.inputs[inp]}
                            </td>
                          ))}
                          {freeModeTable.outputHeaders.map((out) => (
                            <td key={out} className="p-2 border-r border-zinc-800/50 font-bold text-amber-400">
                              {row.outputs[out]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Fixed Action */}
      <div className="p-3.5 border-t border-zinc-800 bg-zinc-950/80">
        {!isFreeMode && currentProblem ? (
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
        ) : (
          <button
            onClick={handleGenerateFreeTable}
            disabled={isGeneratingFreeTable}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {isGeneratingFreeTable ? (
              <div className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin text-zinc-950" />
                <span>Analyzing Circuit...</span>
              </div>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Truth Table</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};