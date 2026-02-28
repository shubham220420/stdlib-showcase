import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import cosh from "../utils/cosh/wrapper.js";
import coshf from "../utils/coshf/wrapper.js";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0d1117] border border-[#1f2d45] rounded-lg px-4 py-3 shadow-2xl text-xs font-mono">
      <p className="text-slate-400 mb-2">x = <span className="text-white font-semibold">{Number(label).toFixed(3)}</span></p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {typeof entry.value === "number" ? entry.value.toFixed(6) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CoshPlot = ({ yMin, yMax, xRange, step = 0.1, showCosh = true, showCoshf = true }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = [];
    for (let x = xRange[0]; x <= xRange[1]; x = parseFloat((x + step).toFixed(10))) {
      let yCosh = null, yCoshf = null;
      try { yCosh = cosh(x); } catch { yCosh = null; }
      try { yCoshf = coshf(x); } catch { yCoshf = null; }
      if (yCosh !== null && (yCosh > yMax || !isFinite(yCosh))) yCosh = null;
      if (yCoshf !== null && (yCoshf > yMax || !isFinite(yCoshf))) yCoshf = null;
      data.push({ x: parseFloat(x.toFixed(2)), cosh: yCosh, coshf: yCoshf });
    }
    setChartData(data);
  }, [xRange, step, yMax]);

  const gridColor = "#1a2640";
  const axisColor = "#334155";
  const tickStyle = { fontSize: 11, fill: "#475569", fontFamily: "ui-monospace, monospace" };

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 16, right: 24, left: 10, bottom: 24 }}>
          <defs>
            <linearGradient id="coshFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="coshfFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={true} />

          <XAxis
            dataKey="x"
            type="number"
            domain={[xRange[0], xRange[1]]}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
            tick={tickStyle}
            label={{ value: "x", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            domain={[yMin, yMax]}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
            tick={tickStyle}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v.toFixed(0)}
            label={{ value: "y", angle: -90, position: "insideLeft", offset: 12, fill: "#64748b", fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }} />

          <ReferenceLine x={0} stroke={axisColor} strokeWidth={1} />
          <ReferenceLine y={1} stroke={axisColor} strokeWidth={1} strokeDasharray="4 4" />

          {showCosh && (
            <Area
              type="monotone"
              dataKey="cosh"
              name="cosh (float64)"
              stroke="#2dd4bf"
              strokeWidth={2.5}
              fill="url(#coshFill)"
              dot={false}
              activeDot={{ r: 5, fill: "#2dd4bf", stroke: "#0a0e1a", strokeWidth: 2 }}
              connectNulls={false}
              filter="url(#glowTeal)"
            />
          )}
          {showCoshf && (
            <Line
              type="monotone"
              dataKey="coshf"
              name="coshf (float32)"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 5, fill: "#f97316", stroke: "#0a0e1a", strokeWidth: 2 }}
              connectNulls={false}
              filter="url(#glowOrange)"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoshPlot;
