import React from "react";

function stripLicense(raw) {
  const idx = raw.indexOf("*/");
  if (idx === -1) return raw.trim();
  return raw.slice(idx + 2).replace(/^\n/, "").trim();
}

const CodeBlock = ({ raw, accentColor, label }) => {
  const code = stripLicense(raw);
  const dot = accentColor === "orange" ? "bg-[#F59E0B]" : "bg-[#60A5FA]";
  const name = accentColor === "orange" ? "text-[#FCD34D]" : "text-[#BFDBFE]";

  return (
    <div className="overflow-hidden rounded-xl border border-[#0F172A] bg-[#0F172A] shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#111827] px-5 py-3">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className={`${name} text-xs font-mono font-semibold`}>{label}</span>
        <span className="ml-auto text-xs font-mono text-[#94A3B8]">examples/index.cjs</span>
      </div>
      <pre className="m-0 whitespace-pre overflow-x-auto bg-[#0B1120] px-5 py-4 text-xs font-mono leading-[1.9] text-[#E2E8F0]">
        {code}
      </pre>
    </div>
  );
};

export default CodeBlock;
