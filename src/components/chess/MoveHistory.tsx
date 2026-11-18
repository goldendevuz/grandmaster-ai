import { ScrollText, ChevronRight, RotateCcw } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function MoveHistory() {
  const { moveHistory, resetGame } = useAppStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ScrollText className="w-4 h-4 text-emerald-400" />
          Yurishlar tarixi
        </div>
        <button
          onClick={resetGame}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
          title="O'yinni qayta boshlash"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Qayta boshlash
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-64 sm:max-h-80 space-y-1 pr-1 font-mono text-xs">
        {moveHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Hali hech qanday yurish amalga oshirilmadi.
            <br />
            Birinchi yurishni oqlar boshlaydi!
          </div>
        ) : (
          moveHistory.map((record) => (
            <div
              key={record.moveNumber}
              className="grid grid-cols-12 py-1.5 px-2 rounded hover:bg-slate-800/60 items-center transition-colors border-b border-slate-800/40"
            >
              <span className="col-span-2 text-slate-500 font-semibold">{record.moveNumber}.</span>
              <div className="col-span-5 flex items-center gap-1 font-bold text-emerald-300">
                <span>{record.white}</span>
                {record.whiteEval !== undefined && (
                  <span className="text-[10px] font-normal text-slate-400">
                    ({record.whiteEval > 0 ? `+${record.whiteEval}` : record.whiteEval})
                  </span>
                )}
              </div>
              <div className="col-span-5 flex items-center gap-1 text-slate-300">
                <span>{record.black || "..."}</span>
                {record.blackEval !== undefined && (
                  <span className="text-[10px] font-normal text-slate-400">
                    ({record.blackEval > 0 ? `+${record.blackEval}` : record.blackEval})
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Jami yurishlar: {moveHistory.length}</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          Standart PGN <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}