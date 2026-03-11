import React from "react";

function ViewToggle({ activeView, onSelect, id, title, subtitle }) {
  const isActive = activeView === id;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`rounded-full border px-5 py-3 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] active:translate-y-px active:scale-[0.99] ${
        isActive
          ? "border-[#009CDE] bg-[#009CDE] text-white shadow-[0_14px_28px_rgba(0,156,222,0.28)]"
          : "border-[#E0E0E0] bg-white shadow-[0_6px_14px_rgba(15,23,42,0.14)] hover:-translate-y-0.5 hover:border-[#009CDE]/40 hover:shadow-[0_12px_22px_rgba(15,23,42,0.18)]"
      }`}
    >
      <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-[#2C2E2F]"}`}>{title}</p>
      <p className={`mt-1 text-xs leading-5 ${isActive ? "text-white/80" : "text-[#6C7378]"}`}>{subtitle}</p>
    </button>
  );
}

function Title({ activeView, setActiveView }) {
  const isTrafficView = activeView === "traffic";

  return (
    <header className="border-b border-[#111827] bg-[#0F172A] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#009CDE]" />
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#94A3B8]">
              {isTrafficView ? "github.com / stdlib-js / stdlib " : "@stdlib / math / base / special"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
            {isTrafficView ? "stdlib Repository" : "Hyperbolic Cosine"}
            <span className="mt-1 block text-[#C7D2FE]">{isTrafficView ? "Traffic Explorer" : "Precision Visualizer"}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#CBD5E1]">
            {isTrafficView ? (
              <>
                Inspect recent stdlib contributors, pull requests, and issues with rolling windows or your own
                custom date range.
              </>
            ) : (
              <>
                Compare double-precision <code className="font-mono text-[#7DD3FC]">cosh</code> vs
                single-precision <code className="font-mono text-white">coshf</code> floating-point arithmetic.
              </>
            )}
          </p>
        </div>

        <div className="w-full max-w-xl rounded-xl border border-white/10 bg-white/5 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.28)] backdrop-blur-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <ViewToggle
              activeView={activeView}
              onSelect={setActiveView}
              id="visualizer"
              title="Function Visualizer"
              subtitle="Plot cosh and coshf behavior interactively."
            />
            <ViewToggle
              activeView={activeView}
              onSelect={setActiveView}
              id="traffic"
              title="stdlib Traffic"
              subtitle="Open repository metrics, contributor details, and date filters."
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Title;
