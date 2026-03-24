import React, { useState } from "react";
import Plot from "./Plot";
import TrafficDashboard from "./TrafficDashboard";
import Slider from "./Slider";
import CodeBlock from "./CodeBlock";
import coshExampleRaw from "../examples/cosh.cjs?raw";
import coshfExampleRaw from "../examples/coshf.cjs?raw";
import cosh from "../utils/cosh/index.js";
import coshf from "../utils/coshf/index.js";
import isFiniteNumber from "@stdlib/math/base/assert/is-finite";
import abs from "@stdlib/math/base/special/abs";

const FnToggle = ({ active, onToggle, label, color, precision }) => {
  const activeClass = color === "teal"
    ? "border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-[0_10px_24px_rgba(29,78,216,0.18)]"
    : "border-[#D97706] bg-[#D97706] text-white shadow-[0_10px_24px_rgba(217,119,6,0.18)]";
  const inactiveClass = color === "teal"
    ? "border-[#BFDBFE] bg-white text-[#1E3A8A] hover:border-[#1D4ED8]/45"
    : "border-[#FCD34D] bg-white text-[#9A3412] hover:border-[#D97706]/45";
  const inactiveDot = color === "teal" ? "#1D4ED8" : "#D97706";

  return (
    <button
      onClick={onToggle}
      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BAE6FD] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px active:scale-[0.99] ${active ? activeClass : inactiveClass}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: active ? "#ffffff" : inactiveDot }}
      />
      <span>{label}</span>
      <span className={`text-[10px] uppercase tracking-[0.16em] ${active ? "text-white/80" : "text-[#6C7378]"}`}>{precision}</span>
    </button>
  );
};

const InfoRow = ({ dot, text }) => (
  <li className="flex items-start gap-3 border-b border-[#E0E0E0] py-3 last:border-0">
    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />
    <span className="text-[#6C7378] text-sm leading-relaxed">{text}</span>
  </li>
);

function Visualizer({ activeView = "visualizer" }) {
  const [xValue, setXValue] = useState(0);
  const [showCosh, setShowCosh] = useState(true);
  const [showCoshf, setShowCoshf] = useState(true);
  const yCosh = cosh(xValue);
  const yCoshf = coshf(xValue);
  const maxFiniteY = Math.max(
    isFiniteNumber(yCosh) ? yCosh : 1,
    isFiniteNumber(yCoshf) ? yCoshf : 1
  );
  const yMax = Math.max(10, maxFiniteY * 1.1);

  const clampX = (v) => {
    if (!isFiniteNumber(v)) return 0;
    return Math.min(100, Math.max(0, parseFloat(v.toFixed(1))));
  };

  const handleXInputChange = (e) => {
    const next = parseFloat(e.target.value);
    setXValue(clampX(next));
  };

  const formatOutputValue = (value) => {
    if (!isFiniteNumber(value)) return "NaN";
    const absValue = abs(value);
    if (absValue !== 0 && (absValue >= 1e6 || absValue < 1e-4)) {
      return value.toExponential(4);
    }
    return value.toFixed(6);
  };

  if (activeView === "traffic") {
    return (
      <div className="min-h-screen bg-[#F5F7FA] text-[#2C2E2F]">
        <div className="mx-auto max-w-screen-xl space-y-6 px-6 py-8">
          <TrafficDashboard />
          <footer className="rounded-xl border border-[#111827] bg-[#0F172A] px-6 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/stdlib-js/stdlib"
                  target="_blank"
                  rel="noreferrer"
                  title="View stdlib on GitHub"
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BAE6FD]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                    <img src="/logo.png" alt="stdlib logo" className="h-4 w-4 object-contain" />
                  </div>
                </a>
                <span className="text-[11px] font-mono text-[#94A3B8]">stdlib · repository traffic explorer</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/shubham220420"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#009CDE]/30 bg-[#009CDE]/10 px-3 py-1.5 text-[10px] font-mono text-[#009CDE] transition-all hover:border-[#009CDE]/50 hover:bg-[#009CDE]/15"
                  title="Visit creator's GitHub profile"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://github.com/shubham220420"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-[#94A3B8] transition-colors hover:text-[#009CDE]"
                  title="Visit creator's GitHub profile"
                >
                  Made by @shubham220420
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#2C2E2F]">
      <div className="mx-auto max-w-screen-xl space-y-6 px-6 py-8">

        
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          
          <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            
            <div className="flex items-center justify-between border-b border-[#E0E0E0] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C7378]">Plot</span>
                <span className="text-[#6C7378]">•</span>
                <span className="font-mono text-sm text-[#2C2E2F]">
                  x = {xValue.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {showCosh && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs font-mono text-[#1D4ED8]">
                    <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#1D4ED8" strokeWidth="2" /></svg>
                    cosh (float64)
                  </span>
                )}
                {showCoshf && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-mono text-[#D97706]">
                    <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#D97706" strokeWidth="2" strokeDasharray="4 2" /></svg>
                    coshf (float32)
                  </span>
                )}
              </div>
            </div>

            
            <div className="h-[460px] px-2 py-4">
              <Plot
                yMin={0}
                yMax={yMax}
                xValue={xValue}
                showCosh={showCosh}
                showCoshf={showCoshf}
              />
            </div>
          </div>

          
          <div className="flex flex-col gap-4">

            
            <div className="space-y-6 rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C7378]">Parameters</p>

              <Slider
                label="input x"
                value={xValue}
                setValue={setXValue}
                min={0}
                max={100}
                step={0.1}
                accentColor="orange"
              />

              <div className="space-y-2">
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#6C7378]" htmlFor="x-value-input">
                  x input box
                </label>
                <input
                  id="x-value-input"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={xValue}
                  onChange={handleXInputChange}
                  className="w-full rounded-[10px] border border-[#D5DEE8] bg-white px-3 py-2 font-mono text-sm text-[#2C2E2F] outline-none focus:border-[#009CDE] focus:ring-2 focus:ring-[#BAE6FD]"
                />
              </div>

              <div className="rounded-[10px] border border-[#E0E0E0] bg-[#F5F7FA] p-4">
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.16em] text-[#6C7378]">Function Output</p>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6C7378]">x</span>
                    <span className="max-w-[170px] break-all text-right text-[#2C2E2F]">{xValue.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1D4ED8]">cosh(x)</span>
                    <span className="max-w-[170px] break-all text-right text-[#1D4ED8]">{formatOutputValue(yCosh)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D97706]">coshf(x)</span>
                    <span className="max-w-[170px] break-all text-right text-[#D97706]">{formatOutputValue(yCoshf)}</span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C7378]">Visible Functions</p>
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

            
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C7378]">Definition</p>
              <div className="rounded-[10px] border border-[#E0E0E0] bg-[#F5F7FA] px-4 py-5 font-mono text-center">
                <div className="flex items-center justify-center gap-2 text-base">
                  <span className="font-semibold text-[#003087]">cosh</span>
                  <span className="text-[#2C2E2F]">(x)</span>
                  <span className="mx-1 text-[#6C7378]">=</span>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[#2C2E2F] text-sm">
                      e<sup className="text-xs text-[#003087]">x</sup>
                      <span className="mx-1.5 text-[#6C7378]">+</span>
                      e<sup className="text-xs text-[#009CDE]">−x</sup>
                    </span>
                    <div className="h-px w-full bg-[#BFC9D4]" />
                    <span className="text-[#2C2E2F] text-sm">2</span>
                  </div>
                </div>
                <p className="mt-4 text-[10px] font-mono text-[#6C7378]">
                  cosh(x) ≥ 1 &nbsp;·&nbsp; cosh(0) = 1 &nbsp;·&nbsp; cosh(−x) = cosh(x)
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock raw={coshExampleRaw} accentColor="teal" label="cosh" />
          <CodeBlock raw={coshfExampleRaw} accentColor="orange" label="coshf" />
        </div>

        
        <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C7378]">Mathematical Properties</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            <InfoRow dot="#003087" text={<><code className="text-[#003087]">cosh(0) = 1</code> — global minimum of the function</>} />
            <InfoRow dot="#009CDE" text={<><code className="text-[#2C2E2F]">cosh(-x) = cosh(x)</code> — even (symmetric about y-axis)</>} />
            <InfoRow dot="#003087" text={<><code className="text-[#003087]">cosh(x) ≥ 1</code> for all real x</>} />
            <InfoRow dot="#009CDE" text={"As |x| → ∞, cosh(x) grows exponentially"} />
          </ul>
        </div>

        
        <footer className="rounded-xl border border-[#111827] bg-[#0F172A] px-6 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/stdlib-js/stdlib"
                target="_blank"
                rel="noreferrer"
                title="View stdlib on GitHub"
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BAE6FD]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <img src="/logo.png" alt="stdlib logo" className="h-4 w-4 object-contain" />
                </div>
              </a>
              <span className="text-[11px] font-mono text-[#94A3B8]">stdlib · @stdlib/math/base/special/cosh &amp; coshf</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/shubham220420"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#009CDE]/30 bg-[#009CDE]/10 px-3 py-1.5 text-[10px] font-mono text-[#009CDE] transition-all hover:border-[#009CDE]/50 hover:bg-[#009CDE]/15"
                title="Visit creator's GitHub profile"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://github.com/shubham220420"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#94A3B8] transition-colors hover:text-[#009CDE]"
                title="Visit creator's GitHub profile"
              >
                Made by @shubham220420
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default Visualizer;
