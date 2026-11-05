import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export default function InnovationMeter({ score = 92.5, tier = 'High', publicationPotential = 'IEEE / ACM Conference' }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const numScore = Number(score) || 92.5;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;

  // Refined matte colors (no neon/radium)
  const getStrokeColor = (s) => {
    if (s >= 88) return '#10b981'; // muted emerald
    if (s >= 75) return '#6366f1'; // refined indigo
    if (s >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // subdued red
  };

  const strokeColor = getStrokeColor(numScore);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-zinc-800 flex flex-col items-center text-center relative">
      
      <div className="w-full flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Innovation Index</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
          {tier} Novelty
        </span>
      </div>

      {/* Circular Precision Gauge */}
      <div className="relative w-32 h-32 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#1c1c24"
            strokeWidth="7"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-white">
            {numScore.toFixed(1)}%
          </span>
          <span className="text-[10px] font-medium text-zinc-400 mt-0.5">
            Peer Score
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-300 font-medium">
        Publication Track: <span className="text-white font-semibold">{publicationPotential}</span>
      </div>

      <div className="w-full mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-left text-[11px]">
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Prior Art Diff</span>
          <span className="text-zinc-200 font-medium">+18.4% above avg</span>
        </div>
        <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Defense Read.</span>
          <span className="text-emerald-400 font-medium">Tier-1 Cleared</span>
        </div>
      </div>

    </div>
  );
}
