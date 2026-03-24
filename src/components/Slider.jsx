import React from "react";
import isInteger from "@stdlib/math/base/assert/is-integer";

const Slider = ({ label, value, setValue, min, max, step, accentColor = "teal" }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = accentColor === "orange" ? "#009CDE" : "#003087";
  const thumbBorder = accentColor === "orange" ? "border-[#009CDE]" : "border-[#003087]";
  const labelColor = accentColor === "orange" ? "text-[#009CDE]" : "text-[#003087]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6C7378]">{label}</span>
        <span className={`${labelColor} font-mono font-semibold text-sm tabular-nums`}>
          {isInteger(step) ? value.toFixed(0) : value.toFixed(1)}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-[4px] rounded-full bg-[#DCE3EB]" />
        <div
          className="absolute left-0 h-[4px] rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: trackColor }}
        />
        <div
          className={`absolute h-4 w-4 rounded-full bg-white border ${thumbBorder} pointer-events-none transition-all`}
          style={{ left: `calc(${pct}% - 8px)` }}
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

      <div className="flex justify-between text-[10px] font-mono text-[#6C7378]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;
