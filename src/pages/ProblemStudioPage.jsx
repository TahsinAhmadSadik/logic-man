import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Cpu,
  Upload,
  FileCode,
  Wrench,
  Download,
  AlertCircle
} from 'lucide-react';

export const ProblemStudioPage = () => {
  const [copied, setCopied] = useState(false);
  const initialFileInputRef = useRef(null);

  // --- FORM STATE ---
  const [id, setId] = useState('prob_4');
  const [numId, setNumId] = useState(4);
  const [title, setTitle] = useState('Debug Faulty Inverter Connection');
  const [description, setDescription] = useState(
    'The pre-wired circuit below has a missing ground rail and improper inverter output wiring. Inspect the circuit and fix it so SW0 complements to LED0.'
  );
  const [difficulty, setDifficulty] = useState('Medium');
  const [category, setCategory] = useState('debug'); // 'design' | 'debug'
  const [tags, setTags] = useState('Debugging, 7404, Basic Gates');
  const [author, setAuthor] = useState('LogicMan Team');

  // Initial Pre-wired Circuit State (for Debug Mode)
  const [initialCircuit, setInitialCircuit] = useState({
    placedIcs: [],
    wires: []
  });
  const [importedFileName, setImportedFileName] = useState('');

  // I/O Mapping State
  const [inputs, setInputs] = useState([{ name: 'A', switchIndex: 0 }]);
  const [outputs, setOutputs] = useState([{ name: 'Y', ledIndex: 0 }]);

  // Truth Table State
  const [truthTable, setTruthTable] = useState([
    { inputs: { A: 0 }, outputs: { Y: 1 } },
    { inputs: { A: 1 }, outputs: { Y: 0 } }
  ]);

  // Allowed IC Limits State
  const [icLimits, setIcLimits] = useState([{ icTypeId: '7404', limit: 1 }]);

  // Hints State (Optional)
  const [hints, setHints] = useState([
    'Check if Pin 7 of the 7404 is connected to GND.',
    'Ensure Pin 2 is wired directly to LED 0.'
  ]);

  // --- RAW JSON EDITING & VALIDATION STATE ---
  const [rawJsonText, setRawJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const [isEditingJsonDirectly, setIsEditingJsonDirectly] = useState(false);

  // Sync Form State -> JSON Text
  useEffect(() => {
    if (!isEditingJsonDirectly) {
      const generated = {
        id,
        numId: Number(numId),
        title,
        description,
        difficulty,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        author,
        ioMapping: { inputs, outputs },
        truthTable,
        allowedICLimits: icLimits.reduce((acc, curr) => {
          if (curr.icTypeId.trim()) {
            acc[curr.icTypeId.trim()] = Number(curr.limit);
          }
          return acc;
        }, {}),
        initialCircuit,
        hints: hints.filter((h) => h.trim() !== '')
      };

      setRawJsonText(JSON.stringify(generated, null, 2));
      setJsonError(null);
    }
  }, [
    id,
    numId,
    title,
    description,
    difficulty,
    category,
    tags,
    author,
    inputs,
    outputs,
    truthTable,
    icLimits,
    initialCircuit,
    hints,
    isEditingJsonDirectly
  ]);

  // --- STRICT SCHEMA & EXTRA KEYS VALIDATOR ---
  const validateSchema = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return 'JSON must be a valid object.';
    }

    // 1. Strict Key Constraint: Reject extra unknown top-level keys
    const ALLOWED_KEYS = new Set([
      'id',
      'numId',
      'title',
      'description',
      'difficulty',
      'category',
      'tags',
      'author',
      'ioMapping',
      'truthTable',
      'allowedICLimits',
      'initialCircuit',
      'hints' // optional
    ]);

    const actualKeys = Object.keys(obj);
    for (const key of actualKeys) {
      if (!ALLOWED_KEYS.has(key)) {
        return `Constraint Violation: Extra key "${key}" is not allowed in schema.`;
      }
    }

    // 2. Required Fields & Type Checks
    if (!obj.id || typeof obj.id !== 'string' || !obj.id.trim()) {
      return 'Missing or invalid required field "id" (non-empty string).';
    }
    if (obj.numId === undefined || typeof obj.numId !== 'number' || isNaN(obj.numId)) {
      return 'Missing or invalid required field "numId" (number).';
    }
    if (!obj.title || typeof obj.title !== 'string' || !obj.title.trim()) {
      return 'Missing or invalid required field "title" (non-empty string).';
    }
    if (!obj.description || typeof obj.description !== 'string' || !obj.description.trim()) {
      return 'Missing or invalid required field "description" (non-empty string).';
    }
    if (!obj.difficulty || typeof obj.difficulty !== 'string' || !obj.difficulty.trim()) {
      return 'Missing or invalid required field "difficulty" (string).';
    }
    if (!obj.category || typeof obj.category !== 'string' || !obj.category.trim()) {
      return 'Missing or invalid required field "category" (string).';
    }
    if (!Array.isArray(obj.tags) || obj.tags.length === 0) {
      return 'Missing or invalid required field "tags" (must be a non-empty array of strings).';
    }
    if (!obj.author || typeof obj.author !== 'string' || !obj.author.trim()) {
      return 'Missing or invalid required field "author" (non-empty string).';
    }

    // 3. I/O Mapping Checks
    if (!obj.ioMapping || typeof obj.ioMapping !== 'object' || Array.isArray(obj.ioMapping)) {
      return 'Missing or invalid required field "ioMapping" (object).';
    }
    if (!Array.isArray(obj.ioMapping.inputs) || !Array.isArray(obj.ioMapping.outputs)) {
      return '"ioMapping" must contain "inputs" and "outputs" arrays.';
    }

    // 4. Truth Table Checks
    if (!Array.isArray(obj.truthTable) || obj.truthTable.length === 0) {
      return 'Missing or invalid required field "truthTable" (non-empty array).';
    }

    // 5. Allowed IC Limits Checks
    if (!obj.allowedICLimits || typeof obj.allowedICLimits !== 'object' || Array.isArray(obj.allowedICLimits)) {
      return 'Missing or invalid required field "allowedICLimits" (object).';
    }

    // 6. Initial Circuit Checks
    if (!obj.initialCircuit || typeof obj.initialCircuit !== 'object' || Array.isArray(obj.initialCircuit)) {
      return 'Missing or invalid required field "initialCircuit" (object).';
    }
    if (!Array.isArray(obj.initialCircuit.placedIcs) || !Array.isArray(obj.initialCircuit.wires)) {
      return '"initialCircuit" must contain "placedIcs" and "wires" arrays.';
    }

    // 7. Optional Hints Check
    if (obj.hints !== undefined && !Array.isArray(obj.hints)) {
      return 'Optional field "hints" must be an array of strings.';
    }

    return null; // All constraints passed
  };

  // --- HANDLER: RAW JSON INPUT CHANGE ---
  const handleRawJsonChange = (e) => {
    const text = e.target.value;
    setRawJsonText(text);

    try {
      const parsed = JSON.parse(text);
      const err = validateSchema(parsed);

      if (err) {
        setJsonError(err);
        // Keep direct edit active while there is a validation error
        setIsEditingJsonDirectly(true);
      } else {
        setJsonError(null);

        // 1. Immediately sync direct JSON changes into individual UI state fields
        if (parsed.id !== undefined) setId(parsed.id);
        if (parsed.numId !== undefined) setNumId(parsed.numId);
        if (parsed.title !== undefined) setTitle(parsed.title);
        if (parsed.description !== undefined) setDescription(parsed.description);
        if (parsed.difficulty !== undefined) setDifficulty(parsed.difficulty);
        if (parsed.category !== undefined) setCategory(parsed.category);
        if (Array.isArray(parsed.tags)) setTags(parsed.tags.join(', '));
        if (parsed.author !== undefined) setAuthor(parsed.author);
        if (parsed.ioMapping?.inputs) setInputs(parsed.ioMapping.inputs);
        if (parsed.ioMapping?.outputs) setOutputs(parsed.ioMapping.outputs);
        if (Array.isArray(parsed.truthTable)) setTruthTable(parsed.truthTable);
        if (parsed.initialCircuit) setInitialCircuit(parsed.initialCircuit);
        if (Array.isArray(parsed.hints)) setHints(parsed.hints);

        if (parsed.allowedICLimits && typeof parsed.allowedICLimits === 'object') {
          const formatted = Object.entries(parsed.allowedICLimits).map(([icTypeId, limit]) => ({
            icTypeId,
            limit
          }));
          setIcLimits(formatted);
        }

        // 2. Clear direct edit mode so subsequent UI edits don't overwrite JSON edits
        setIsEditingJsonDirectly(false);
      }
    } catch (syntaxErr) {
      setIsEditingJsonDirectly(true);
      setJsonError(`Syntax Error: ${syntaxErr.message}`);
    }
  };

  // --- HANDLER: UPLOAD EXPORTED CIRCUIT JSON ---
  const handleInitialCircuitUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const parsed = JSON.parse(content);
          if (!Array.isArray(parsed.wires) || !Array.isArray(parsed.placedIcs)) {
            alert('Invalid circuit file! File must contain "wires" and "placedIcs" arrays.');
            return;
          }

          setInitialCircuit({
            placedIcs: parsed.placedIcs,
            wires: parsed.wires
          });
          setImportedFileName(file.name);
          setIsEditingJsonDirectly(false);

          const icCounts = {};
          parsed.placedIcs.forEach((ic) => {
            icCounts[ic.icTypeId] = (icCounts[ic.icTypeId] || 0) + 1;
          });

          const autoLimits = Object.entries(icCounts).map(([icTypeId, limit]) => ({
            icTypeId,
            limit
          }));

          if (autoLimits.length > 0) {
            setIcLimits(autoLimits);
          }
        }
      } catch (err) {
        alert('Failed to parse circuit file: ' + err.message);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleClearInitialCircuit = () => {
    setInitialCircuit({ placedIcs: [], wires: [] });
    setImportedFileName('');
    setIsEditingJsonDirectly(false);
  };

  const handleCopy = () => {
    if (jsonError) {
      alert('Cannot copy! Please resolve JSON structure errors first.');
      return;
    }
    navigator.clipboard.writeText(rawJsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (jsonError) {
      alert('Cannot download! Please resolve JSON structure errors first.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(rawJsonText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${id || 'problem'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const addInputPin = () => {
    setIsEditingJsonDirectly(false);
    const nextChar = String.fromCharCode(65 + inputs.length);
    setInputs([...inputs, { name: nextChar, switchIndex: inputs.length }]);
  };

  const removeInputPin = (idx) => {
    setIsEditingJsonDirectly(false);
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const addOutputPin = () => {
    setIsEditingJsonDirectly(false);
    const name = outputs.length === 0 ? 'Y' : `Y${outputs.length}`;
    setOutputs([...outputs, { name, ledIndex: outputs.length }]);
  };

  const removeOutputPin = (idx) => {
    setIsEditingJsonDirectly(false);
    setOutputs(outputs.filter((_, i) => i !== idx));
  };

  const addTruthTableRow = () => {
    setIsEditingJsonDirectly(false);
    const defaultInputs = {};
    inputs.forEach((inp) => (defaultInputs[inp.name] = 0));

    const defaultOutputs = {};
    outputs.forEach((out) => (defaultOutputs[out.name] = 0));

    setTruthTable([...truthTable, { inputs: defaultInputs, outputs: defaultOutputs }]);
  };

  const removeTruthTableRow = (idx) => {
    setIsEditingJsonDirectly(false);
    setTruthTable(truthTable.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Hidden File Input for Circuit Upload */}
      <input
        type="file"
        ref={initialFileInputRef}
        onChange={handleInitialCircuitUpload}
        accept=".json"
        className="hidden"
      />

      {/* Navbar */}
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
            <Code2 size={18} />
            <span>LogicMan Problem Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all border border-zinc-700"
          >
            <Download size={15} />
            <span>Download .json</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
      </nav>

      {/* Main Studio Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Authoring Inputs */}
        <div className="space-y-6 overflow-y-auto pr-2 max-h-[85vh]">
          {/* Section 1: Basic Information */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} /> General Metadata
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Problem ID *
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    setId(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Numeric ID *
                </label>
                <input
                  type="number"
                  value={numId}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    setNumId(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setIsEditingJsonDirectly(false);
                  setTitle(e.target.value);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  setIsEditingJsonDirectly(false);
                  setDescription(e.target.value);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Difficulty *
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    setDifficulty(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    setCategory(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                >
                  <option value="design">Design</option>
                  <option value="debug">Debug</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Author *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    setAuthor(e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Tags (Comma Separated) *
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => {
                  setIsEditingJsonDirectly(false);
                  setTags(e.target.value);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
              />
            </div>
          </div>

          {/* Section 2: Debug Mode Initial Circuit Uploader */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Wrench size={16} /> Initial Pre-wired Circuit (For Debugging)
              </h3>
              {initialCircuit.placedIcs.length > 0 && (
                <button
                  onClick={handleClearInitialCircuit}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear Circuit
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Export a faulty or partially wired circuit from the simulator as a <code className="text-amber-300">.json</code> file and upload it here to serve as the starting state for this problem.
            </p>

            <button
              onClick={() => initialFileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500/50 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-all"
            >
              <Upload size={16} className="text-amber-400" />
              <span>
                {importedFileName
                  ? `Uploaded: ${importedFileName}`
                  : 'Upload Exported Circuit (.json)'}
              </span>
            </button>

            {(initialCircuit.placedIcs.length > 0 || initialCircuit.wires.length > 0) && (
              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-emerald-400" />
                  <span>
                    Initial State Loaded: <strong className="text-amber-400">{initialCircuit.placedIcs.length} ICs</strong>, <strong className="text-sky-400">{initialCircuit.wires.length} Wires</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: I/O Pin Assignments */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              I/O Pin Assignments *
            </h3>

            {/* Inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                <span>INPUT PINS</span>
                <button
                  onClick={addInputPin}
                  className="text-amber-400 flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add Input
                </button>
              </div>

              {inputs.map((inp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inp.name}
                    placeholder="Signal Name"
                    onChange={(e) => {
                      setIsEditingJsonDirectly(false);
                      const copy = [...inputs];
                      copy[idx].name = e.target.value;
                      setInputs(copy);
                    }}
                    className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                  />
                  <select
                    value={inp.switchIndex}
                    onChange={(e) => {
                      setIsEditingJsonDirectly(false);
                      const copy = [...inputs];
                      copy[idx].switchIndex = Number(e.target.value);
                      setInputs(copy);
                    }}
                    className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
                      <option key={s} value={s}>
                        Switch {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeInputPin(idx)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Outputs */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                <span>OUTPUT PINS</span>
                <button
                  onClick={addOutputPin}
                  className="text-amber-400 flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add Output
                </button>
              </div>

              {outputs.map((out, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={out.name}
                    placeholder="Signal Name"
                    onChange={(e) => {
                      setIsEditingJsonDirectly(false);
                      const copy = [...outputs];
                      copy[idx].name = e.target.value;
                      setOutputs(copy);
                    }}
                    className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                  />
                  <select
                    value={out.ledIndex}
                    onChange={(e) => {
                      setIsEditingJsonDirectly(false);
                      const copy = [...outputs];
                      copy[idx].ledIndex = Number(e.target.value);
                      setOutputs(copy);
                    }}
                    className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((l) => (
                      <option key={l} value={l}>
                        LED {l}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeOutputPin(idx)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Allowed IC Limits */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu size={16} /> Allowed IC Limits *
              </h3>
              <button
                onClick={() => {
                  setIsEditingJsonDirectly(false);
                  setIcLimits([...icLimits, { icTypeId: '7408', limit: 1 }]);
                }}
                className="text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Add IC Rule
              </button>
            </div>

            {icLimits.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="IC ID (e.g. 7404)"
                  value={rule.icTypeId}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    const copy = [...icLimits];
                    copy[idx].icTypeId = e.target.value;
                    setIcLimits(copy);
                  }}
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-mono"
                />
                <input
                  type="number"
                  placeholder="Max Allowed"
                  value={rule.limit}
                  onChange={(e) => {
                    setIsEditingJsonDirectly(false);
                    const copy = [...icLimits];
                    copy[idx].limit = Number(e.target.value);
                    setIcLimits(copy);
                  }}
                  className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                />
                <button
                  onClick={() => {
                    setIsEditingJsonDirectly(false);
                    setIcLimits(icLimits.filter((_, i) => i !== idx));
                  }}
                  className="p-1.5 text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Editable JSON Preview & Truth Table */}
        <div className="space-y-6 flex flex-col h-[85vh]">
          {/* Truth Table Builder */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Truth Table Rows *
              </h3>
              <button
                onClick={addTruthTableRow}
                className="text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Add Row
              </button>
            </div>

            <div className="overflow-x-auto max-h-48 overflow-y-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-center text-xs font-mono">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    {inputs.map((i) => (
                      <th key={i.name} className="p-2 border-r border-zinc-800">
                        {i.name}
                      </th>
                    ))}
                    {outputs.map((o) => (
                      <th key={o.name} className="p-2 border-r border-zinc-800 text-amber-400">
                        {o.name}
                      </th>
                    ))}
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {truthTable.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {inputs.map((inp) => (
                        <td key={inp.name} className="p-1 border-r border-zinc-800">
                          <input
                            type="text"
                            value={row.inputs[inp.name] ?? 0}
                            onChange={(e) => {
                              setIsEditingJsonDirectly(false);
                              const copy = [...truthTable];
                              copy[rIdx].inputs[inp.name] = e.target.value;
                              setTruthTable(copy);
                            }}
                            className="w-10 text-center bg-zinc-950 border border-zinc-800 rounded py-0.5 text-zinc-200"
                          />
                        </td>
                      ))}
                      {outputs.map((out) => (
                        <td key={out.name} className="p-1 border-r border-zinc-800">
                          <input
                            type="text"
                            value={row.outputs[out.name] ?? 0}
                            onChange={(e) => {
                              setIsEditingJsonDirectly(false);
                              const copy = [...truthTable];
                              copy[rIdx].outputs[out.name] = e.target.value;
                              setTruthTable(copy);
                            }}
                            className="w-10 text-center bg-zinc-950 border border-zinc-800 rounded py-0.5 text-amber-300 font-bold"
                          />
                        </td>
                      ))}
                      <td className="p-1">
                        <button
                          onClick={() => removeTruthTableRow(rIdx)}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Editable JSON View & Validator */}
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col overflow-hidden space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-2">
                <span>EDITABLE_SCHEMA.JSON</span>
                {isEditingJsonDirectly && (
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Direct Edit Active
                  </span>
                )}
              </span>

              <div className="flex items-center gap-3 font-sans font-bold">
                <button
                  onClick={handleDownload}
                  className="text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <Download size={13} /> Download
                </button>
                <button
                  onClick={handleCopy}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            </div>

            {/* Editable JSON Textarea */}
            <textarea
              value={rawJsonText}
              onChange={handleRawJsonChange}
              spellCheck={false}
              className={`flex-1 w-full bg-transparent font-mono text-[11px] text-amber-300/90 leading-relaxed focus:outline-none resize-none selection:bg-zinc-800 p-1 ${
                jsonError ? 'border-rose-500/50' : ''
              }`}
            />

            {/* Bottom Error / Success Validation Panel */}
            <div className="pt-2 border-t border-zinc-800">
              {jsonError ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  <span className="font-mono text-[11px]">{jsonError}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Valid Schema Structure (No Extra Keys)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};