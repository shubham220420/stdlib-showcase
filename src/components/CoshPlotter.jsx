import React, { useState } from "react";
import CoshPlot from "./CoshPlot";
import RangeSlider from "./RangeSlider";
import Slider from "./Slider";
import coshExampleRaw from "../examples/cosh.cjs?raw";
import coshfExampleRaw from "../examples/coshf.cjs?raw";

// Strips the license block (everything up to and including the blank line after '*/')
function stripLicense(raw) {
  const idx = raw.indexOf("*/");
  if (idx === -1) return raw.trim();
  return raw.slice(idx + 2).replace(/^\n/, "").trim();
}

// Minimal token-based syntax highlighter
function highlight(line) {
  // tokenise by splitting on boundaries but keeping delimiters
  const tokens = line.split(/('(?:[^'\\]|\\.)*'|\b(?:var|require|use strict)\b)/);
  return tokens.map((tok, i) => {
    if (/^'use strict'$/.test(tok)) return <span key={i} className="text-purple-400">{tok}</span>;
    if (/^'@stdlib\//.test(tok) || /^\.\.\/lib'$/.test(tok)) return <span key={i} className="text-teal-300">{tok}</span>;
    if (/^'.*'$/.test(tok)) return <span key={i} className="text-green-300">{tok}</span>;
    if (/^(var|require|use strict)$/.test(tok)) return <span key={i} className="text-slate-500">{tok}</span>;
    // colour identifiers before '='
    const withIdents = tok.replace(/(uniform|logEachMap|coshf|cosh|opts|x)(?=\s*[=(,;]|\()/g, (m) => `§WHITE§${m}§END§`);
    if (withIdents !== tok) {
      return withIdents.split(/(§WHITE§.*?§END§)/).map((part, j) => {
        const m = part.match(/^§WHITE§(.*)§END§$/);
        return m ? <span key={j} className="text-white">{m[1]}</span> : <span key={j} className="text-slate-300">{part}</span>;
      });
    }
    // numbers
    if (/^[\d.]+$/.test(tok.trim()) || /^-[\d.]+$/.test(tok.trim())) return <span key={i} className="text-orange-300">{tok}</span>;
    return <span key={i} className="text-slate-300">{tok}</span>;
  });
}

const CodeBlock = ({ raw, accentColor, label }) => {
  const code = stripLicense(raw);
  const lines = code.split("\n");
  const dot = accentColor === "orange" ? "bg-orange-400" : "bg-teal-400";
  const glow = accentColor === "orange" ? "0 0 6px #f97316" : "0 0 6px #2dd4bf";
  const name = accentColor === "orange" ? "text-orange-400" : "text-teal-400";
  return (
    <div className="bg-[#111827] border border-[#1f2d45] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1f2d45] bg-[#0d1117]">
        <span className={`w-2 h-2 rounded-full ${dot}`} style={{ boxShadow: glow }} />
        <span className={`${name} text-xs font-mono font-semibold`}>{label}</span>
        <span className="text-slate-600 text-xs font-mono ml-auto">examples/index.cjs</span>
      </div>
      <div className="px-5 py-4 text-xs font-mono leading-[1.9]">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">{line === "" ? <span>&#8203;</span> : highlight(line)}</div>
        ))}
      </div>
    </div>
  );
};

// Chip toggle
const FnToggle = ({ active, onToggle, label, color, precision }) => {
  const ring = color === "teal" ? "ring-teal-500/60 bg-teal-500/10 text-teal-300" : "ring-orange-500/60 bg-orange-500/10 text-orange-300";
  const off = "ring-[#1f2d45] bg-[#161d2e] text-slate-500";
  const hoverRing = color === "teal"
    ? "hover:ring-teal-400/80 hover:bg-teal-500/20 hover:text-teal-200"
    : "hover:ring-orange-400/80 hover:bg-orange-500/20 hover:text-orange-200";

  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border ring-1 transition-all duration-150 text-sm font-mono cursor-pointer ${
        active ? ring : off
      } ${hoverRing}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: active ? (color === "teal" ? "#2dd4bf" : "#f97316") : "#334155" }}
      />
      <span>{label}</span>
      <span className="text-[10px] text-slate-500">{precision}</span>
    </button>
  );
};

// Info row
const InfoRow = ({ dot, text }) => (
  <li className="flex items-start gap-3 py-2 border-b border-[#1a2436] last:border-0">
    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
    <span className="text-slate-400 text-sm leading-relaxed">{text}</span>
  </li>
);

function CoshPlotter() {
  const [xRange, setXRange] = useState([-5, 5]);
  const [yMax, setYMax] = useState(80);
  const [showCosh, setShowCosh] = useState(true);
  const [showCoshf, setShowCoshf] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200">
      <div className="max-w-screen-xl mx-auto p-6 space-y-6">

        {/* Top row: chart + right panel */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* Chart card */}
          <div className="bg-[#111827] border border-[#1f2d45] rounded-2xl overflow-hidden">
            {/* Chart toolbar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1f2d45]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Plot</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-sm text-slate-300">
                  x ∈ [{xRange[0].toFixed(1)}, {xRange[1].toFixed(1)}]
                </span>
              </div>
              <div className="flex items-center gap-3">
                {showCosh && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-teal-400">
                    <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#2dd4bf" strokeWidth="2" /></svg>
                    cosh
                  </span>
                )}
                {showCoshf && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-orange-400">
                    <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" /></svg>
                    coshf
                  </span>
                )}
              </div>
            </div>

            {/* Chart body */}
            <div className="h-[460px] px-2 py-4">
              <CoshPlot
                yMin={0}
                yMax={yMax}
                xRange={xRange}
                showCosh={showCosh}
                showCoshf={showCoshf}
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">

            {/* Controls card */}
            <div className="bg-[#111827] border border-[#1f2d45] rounded-2xl p-5 space-y-6">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Parameters</p>

              <RangeSlider
                xRange={xRange}
                setXRange={setXRange}
                min={-20}
                max={20}
                step={0.5}
              />

              <div className="border-t border-[#1a2436] pt-5">
                <Slider
                  label="y-axis ceiling"
                  value={yMax}
                  setValue={setYMax}
                  min={10}
                  max={500}
                  step={10}
                  accentColor="teal"
                />
              </div>
            </div>

            {/* Toggle card */}
            <div className="bg-[#111827] border border-[#1f2d45] rounded-2xl p-5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Visible Functions</p>
              <div className="flex flex-col gap-2">
                <FnToggle
                  active={showCosh}
                  onToggle={() => setShowCosh(!showCosh)}
                  label="cosh(x)"
                  color="teal"
                  precision="float64"
                />
                <FnToggle
                  active={showCoshf}
                  onToggle={() => setShowCoshf(!showCoshf)}
                  label="coshf(x)"
                  color="orange"
                  precision="float32"
                />
              </div>
            </div>

            {/* Formula card */}
            <div className="bg-[#111827] border border-[#1f2d45] rounded-2xl p-5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Definition</p>
              <div className="bg-[#0d1117] border border-[#1a2436] rounded-lg px-4 py-5 font-mono text-center">
                <div className="flex items-center justify-center gap-2 text-base">
                  <span className="text-teal-400 font-semibold">cosh</span>
                  <span className="text-slate-300">(x)</span>
                  <span className="text-slate-500 mx-1">=</span>
                  {/* Fraction */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-slate-200 text-sm">
                      e<sup className="text-xs text-teal-300">x</sup>
                      <span className="text-slate-500 mx-1.5">+</span>
                      e<sup className="text-xs text-orange-300">−x</sup>
                    </span>
                    <div className="w-full h-px bg-slate-500" />
                    <span className="text-orange-400 text-sm">2</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 font-mono mt-4">
                  cosh(x) ≥ 1 &nbsp;·&nbsp; cosh(0) = 1 &nbsp;·&nbsp; cosh(−x) = cosh(x)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock raw={coshExampleRaw} accentColor="teal" label="cosh" />
          <CodeBlock raw={coshfExampleRaw} accentColor="orange" label="coshf" />
        </div>

        {/* Bottom row: properties */}
        <div className="bg-[#111827] border border-[#1f2d45] rounded-2xl p-6">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Mathematical Properties</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            <InfoRow dot="#2dd4bf" text={<><code className="text-teal-300">cosh(0) = 1</code> — global minimum of the function</>} />
            <InfoRow dot="#f97316" text={<><code className="text-orange-300">cosh(-x) = cosh(x)</code> — even (symmetric about y-axis)</>} />
            <InfoRow dot="#2dd4bf" text={<><code className="text-teal-300">cosh(x) ≥ 1</code> for all real x</>} />
            <InfoRow dot="#f97316" text={"As |x| → ∞, cosh(x) grows exponentially"} />
          </ul>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] font-mono text-slate-700">
          stdlib · @stdlib/math/base/special/cosh &amp; coshf
        </p>

      </div>
    </div>
  );
}

export default CoshPlotter;
