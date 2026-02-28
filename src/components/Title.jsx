import React from "react";

function Title() {
  return (
    <header className="relative border-b border-[#1f2d45] bg-[#0a0e1a] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#2dd4bf 1px, transparent 1px), linear-gradient(90deg, #2dd4bf 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[200px] bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: branding */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
            <span className="text-teal-400 text-xs font-mono uppercase tracking-widest">
              @stdlib / math / base / special
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Hyperbolic Cosine
            <span className="block text-teal-400">Precision Visualizer</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-md">
            Compare double-precision <code className="text-teal-300 font-mono">cosh</code> vs
            single-precision <code className="text-orange-300 font-mono">coshf</code> floating-point arithmetic.
          </p>
        </div>

        {/* Right: terminal block */}
        <div className="shrink-0 w-full md:w-auto">
          <div className="bg-[#0d1117] border border-[#1f2d45] rounded-lg overflow-hidden text-xs font-mono shadow-xl min-w-[320px]">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#1f2d45] bg-[#161d2e]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="text-slate-500 ml-2">math.js</span>
            </div>
            <div className="px-4 py-3 space-y-1 leading-relaxed">
              <p>
                <span className="text-pink-400">import</span>
                <span className="text-white"> cosh </span>
                <span className="text-pink-400">from</span>
                <span className="text-teal-300"> &quot;@stdlib/math/base/special/cosh&quot;</span>
                <span className="text-slate-500">;</span>
              </p>
              <p>
                <span className="text-pink-400">import</span>
                <span className="text-white"> coshf </span>
                <span className="text-pink-400">from</span>
                <span className="text-orange-300"> &quot;@stdlib/math/base/special/coshf&quot;</span>
                <span className="text-slate-500">;</span>
              </p>
              <p className="pt-1">
                <span className="text-slate-500">// cosh(x)  → float64 &nbsp;| &nbsp;coshf(x) → float32</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Title;
