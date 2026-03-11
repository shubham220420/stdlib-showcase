import React from "react";
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

const COSH_COLOR = "#1D4ED8";
const COSHF_COLOR = "#D97706";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-[10px] border border-[#E0E0E0] bg-white px-4 py-3 text-xs font-mono shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <p className="mb-2 text-[#6C7378]">x = <span className="font-semibold text-[#2C2E2F]">{Number(label).toFixed(3)}</span></p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[#6C7378]">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {typeof entry.value === "number" ? entry.value.toFixed(6) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const Plot = ({ yMin, yMax, xRange, step = 0.1, showCosh = true, showCoshf = true }) => {
  const chartData = [];
  for (let x = xRange[0]; x <= xRange[1]; x = parseFloat((x + step).toFixed(10))) {
    let yCosh = null;
    let yCoshf = null;

    try {
      yCosh = cosh(x);
    } catch {
      yCosh = null;
    }

    try {
      yCoshf = coshf(x);
    } catch {
      yCoshf = null;
    }

    if (yCosh !== null && (yCosh > yMax || !isFinite(yCosh))) yCosh = null;
    if (yCoshf !== null && (yCoshf > yMax || !isFinite(yCoshf))) yCoshf = null;

    chartData.push({ x: parseFloat(x.toFixed(2)), cosh: yCosh, coshf: yCoshf });
  }

  const gridColor = "#E7ECF2";
  const axisColor = "#B8C2CC";
  const tickStyle = { fontSize: 11, fill: "#6C7378", fontFamily: "ui-monospace, monospace" };

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 16, right: 24, left: 10, bottom: 24 }}>
          <defs>
            <linearGradient id="coshFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COSH_COLOR} stopOpacity={0.18} />
              <stop offset="95%" stopColor={COSH_COLOR} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="coshfFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COSHF_COLOR} stopOpacity={0.16} />
              <stop offset="95%" stopColor={COSHF_COLOR} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={true} />

          <XAxis
            dataKey="x"
            type="number"
            domain={[xRange[0], xRange[1]]}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
            tick={tickStyle}
            label={{ value: "x", position: "insideBottom", offset: -10, fill: "#6C7378", fontSize: 12 }}
          />
          <YAxis
            domain={[yMin, yMax]}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
            tick={tickStyle}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v.toFixed(0)}
            label={{ value: "y", angle: -90, position: "insideLeft", offset: 12, fill: "#6C7378", fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#D5DEE8", strokeWidth: 1, strokeDasharray: "4 4" }} />

          <ReferenceLine x={0} stroke={axisColor} strokeWidth={1} />
          <ReferenceLine y={1} stroke={axisColor} strokeWidth={1} strokeDasharray="4 4" />

          {showCosh && (
            <Area
              type="monotone"
              dataKey="cosh"
              name="cosh (float64)"
              stroke={COSH_COLOR}
              strokeWidth={2.25}
              fill="url(#coshFill)"
              dot={false}
              activeDot={{ r: 5, fill: COSH_COLOR, stroke: "#ffffff", strokeWidth: 2 }}
              connectNulls={false}
            />
          )}
          {showCoshf && (
            <Line
              type="monotone"
              dataKey="coshf"
              name="coshf (float32)"
              stroke={COSHF_COLOR}
              strokeWidth={2.25}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 5, fill: COSHF_COLOR, stroke: "#ffffff", strokeWidth: 2 }}
              connectNulls={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Plot;
