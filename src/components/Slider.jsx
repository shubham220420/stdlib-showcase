import React from "react";

const Slider = ({ label, value, setValue, min, max, step, accentColor = "teal" }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = accentColor === "orange" ? "#f97316" : "#2dd4bf";
  const thumbBorder = accentColor === "orange" ? "border-orange-400" : "border-teal-400";
  const labelColor = accentColor === "orange" ? "text-orange-400" : "text-teal-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">{label}</span>
        <span className={`${labelColor} font-mono font-semibold text-sm tabular-nums`}>
          {Number.isInteger(step) ? value.toFixed(0) : value.toFixed(1)}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-[#1f2d45]" />
        {/* Filled portion */}
        <div
          className="absolute left-0 h-[3px] rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: trackColor, boxShadow: `0 0 6px ${trackColor}88` }}
        />
        {/* Thumb dot at position */}
        <div
          className={`absolute w-3.5 h-3.5 rounded-full bg-[#0a0e1a] border-2 ${thumbBorder} shadow-md pointer-events-none transition-all`}
          style={{ left: `calc(${pct}% - 7px)`, boxShadow: `0 0 8px ${trackColor}99` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-slate-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
