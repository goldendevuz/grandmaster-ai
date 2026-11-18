import { Zap } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface EvalBarProps {
  scoreOverride?: number;
  showRecommendation?: boolean;
}

export default function EvalBar({ scoreOverride, showRecommendation = true }: EvalBarProps) {
  const storeScore = useAppStore((state) => state.evaluationScore);
  const analysis = useAppStore((state) => state.analysis);
  const score = scoreOverride !== undefined ? scoreOverride : storeScore;

  // Convert score (-10 to +10 range) to percentage for white advantage (0% to 100%)
  const clampedScore = Math.max(-8, Math.min(8, score));
  const whitePercent = Math.round(50 + (clampedScore / 8) * 45);

  const formatScoreText = (val: number) => {
    if (val === 0) return "0.0";
    return val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-white">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Pozitsiya bahosi (Engine Eval)
        </span>
        <span
          className={`font-mono px-2 py-0.5 rounded text-xs font-bold ${
            score >= 0
              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-950 text-rose-400 border border-rose-500/30"
          }`}
        >
          {formatScoreText(score)}
        </span>
      </div>

      {/* Visual Evaluation Bar */}
      <div className="relative w-full h-5 rounded-full overflow-hidden bg-slate-800 flex border border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out flex items-center justify-start pl-2"
          style={{ width: `${whitePercent}%` }}
        >
          {whitePercent > 20 && (
            <span className="text-[10px] font-bold text-slate-950 select-none">
              Oqlar {whitePercent}%
            </span>
          )}
        </div>
        <div className="flex-1 bg-slate-950 flex items-center justify-end pr-2">
          {whitePercent < 80 && (
            <span className="text-[10px] font-bold text-slate-300 select-none">
              Qoralar {100 - whitePercent}%
            </span>
          )}
        </div>
      </div>

      {/* AI Recommendation line */}
      {showRecommendation && (
        <div className="text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <p className="text-slate-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">
            AI maslahati (Eng yaxshi yurish: <span className="text-emerald-400">{analysis.bestMove}</span>)
          </p>
          <p className="text-slate-300 text-xs leading-relaxed">{analysis.engineRecommendation}</p>
        </div>
      )}
    </div>
  );
}