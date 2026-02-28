import React from "react";

const TrackSlider = ({ label, value, onChange, min, max, step, color }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = color === "orange" ? "#f97316" : "#2dd4bf";
  const borderClass = color === "orange" ? "border-orange-400" : "border-teal-400";
  const textClass = color === "orange" ? "text-orange-400" : "text-teal-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-[11px] font-mono">{label}</span>
        <span className={`${textClass} font-mono font-semibold text-xs tabular-nums`}>
          {value.toFixed(1)}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-[#1f2d45]" />
        <div
          className="absolute left-0 h-[3px] rounded-full"
          style={{ width: `${pct}%`, backgroundColor: trackColor, boxShadow: `0 0 6px ${trackColor}66` }}
        />
        <div
          className={`absolute w-3.5 h-3.5 rounded-full bg-[#0a0e1a] border-2 ${borderClass} pointer-events-none`}
          style={{ left: `calc(${pct}% - 7px)`, boxShadow: `0 0 8px ${trackColor}99` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
        />
      </div>
    </div>
  );
};

const RangeSlider = ({ xRange, setXRange, min, max, step }) => {
  const [localMin, localMax] = xRange;

  const handleMinChange = (v) => {
    if (v < localMax) setXRange([v, localMax]);
  };

  const handleMaxChange = (v) => {
    if (v > localMin) setXRange([localMin, v]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">x-axis range</span>
        <span className="font-mono text-xs">
          <span className="text-teal-400">{localMin.toFixed(1)}</span>
          <span className="text-slate-500 mx-1">to</span>
          <span className="text-orange-400">{localMax.toFixed(1)}</span>
        </span>
      </div>

      <TrackSlider
        label="x min"
        value={localMin}
        onChange={handleMinChange}
        min={min}
        max={max}
        step={step}
        color="teal"
      />

      <TrackSlider
        label="x max"
        value={localMax}
        onChange={handleMaxChange}
        min={min}
        max={max}
        step={step}
        color="orange"
      />

      <div className="flex justify-between text-[10px] font-mono text-slate-600 pt-1">
        <span>{min}</span>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
