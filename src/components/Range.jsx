import React from "react";

const TrackSlider = ({ label, value, onChange, min, max, step, color }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = color === "orange" ? "#009CDE" : "#003087";
  const borderClass = color === "orange" ? "border-[#009CDE]" : "border-[#003087]";
  const textClass = color === "orange" ? "text-[#009CDE]" : "text-[#003087]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6C7378]">{label}</span>
        <span className={`${textClass} font-mono font-semibold text-xs tabular-nums`}>
          {value.toFixed(1)}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-[4px] rounded-full bg-[#DCE3EB]" />
        <div
          className="absolute left-0 h-[4px] rounded-full"
          style={{ width: `${pct}%`, backgroundColor: trackColor }}
        />
        <div
          className={`absolute h-4 w-4 rounded-full bg-white border ${borderClass} pointer-events-none shadow-sm`}
          style={{ left: `calc(${pct}% - 8px)` }}
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

const Range = ({ xRange, setXRange, min, max, step }) => {
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
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6C7378]">x-axis range</span>
        <span className="font-mono text-xs text-[#2C2E2F]">
          <span className="text-[#003087]">{localMin.toFixed(1)}</span>
          <span className="mx-1 text-[#6C7378]">to</span>
          <span className="text-[#009CDE]">{localMax.toFixed(1)}</span>
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

      <div className="flex justify-between pt-1 text-[10px] font-mono text-[#6C7378]">
        <span>{min}</span>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Range;
