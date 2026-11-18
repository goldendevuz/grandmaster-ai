import { useState } from "react";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Upload,
  Flame,
  Award,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChessBoardView from "../components/chess/ChessBoardView";
import EvalBar from "../components/chess/EvalBar";
import MoveHistory from "../components/chess/MoveHistory";
import { useAppStore } from "../store/useAppStore";
import pastGamesData from "../data/past-games.json";

interface PastGame {
  id: string;
  opponent: string;
  opponentElo: number;
  result: "G'alaba" | "Mag'lubiyat" | "Durang";
  date: string;
  movesCount: number;
  accuracyWhite: number;
  accuracyBlack: number;
  fen: string;
  blunders: number;
  mistakes: number;
  bestMoves: number;
  alternativeSuggestion: {
    movePlayed: string;
    engineMove: string;
    diff: string;
    explanation: string;
  };
}

const pastGames = pastGamesData.items as PastGame[];

export default function AnalysisPage() {
  const { setFen, updateEvaluation } = useAppStore();
  const [selectedGame, setSelectedGame] = useState<PastGame>(pastGames[0]);
  const [activeTab, setActiveTab] = useState<"summary" | "alternatives">("summary");
  const [boardTheme, setBoardTheme] = useState<"emerald" | "wood" | "slate">("emerald");

  const handleSelectGame = (game: PastGame) => {
    setSelectedGame(game);
    setFen(game.fen);
    updateEvaluation(game.result === "G'alaba" ? 2.4 : game.result === "Mag'lubiyat" ? -1.8 : 0.0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4" />
              Sun'iy Intellekt Tahlil Markazi
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              O'yin Tahlili & Xatolar Ko'rigi
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Stockfish dvigateli yordamida partiyalar aniqligini tekshiring va grossmeysterlik muqobillarini o'rganing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Taxta rangi:</span>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
              {(["emerald", "wood", "slate"] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setBoardTheme(thm)}
                  className={`px-2.5 py-1 text-xs rounded font-medium capitalize transition-all ${
                    boardTheme === thm ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <ChessBoardView theme={boardTheme} interactive={false} />
            <EvalBar
              scoreOverride={selectedGame.result === "G'alaba" ? 2.6 : selectedGame.result === "Mag'lubiyat" ? -1.8 : 0.1}
            />

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2 text-white font-medium">
                <Flame className="w-4 h-4 text-amber-400" />
                Pozitsiya FEN: <code className="text-emerald-400 font-mono text-[11px] truncate max-w-[200px] sm:max-w-xs">{selectedGame.fen}</code>
              </span>
              <button
                onClick={() => setFen(selectedGame.fen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Tiklash
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Partiya aniqlik ko'rsatkichi
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Raqib: {selectedGame.opponent} ({selectedGame.opponentElo})</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                    selectedGame.result === "G'alaba"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                      : selectedGame.result === "Mag'lubiyat"
                      ? "bg-rose-950 text-rose-400 border-rose-500/30"
                      : "bg-amber-950 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {selectedGame.result}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Sizning aniqligingiz</span>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">{selectedGame.accuracyWhite}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedGame.accuracyWhite}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Bot aniqligi</span>
                  <div className="text-2xl font-black text-slate-200 mt-0.5">{selectedGame.accuracyBlack}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: `${selectedGame.accuracyBlack}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedGame.bestMoves}
                  </div>
                  <span className="text-[10px] text-slate-400">Eng yaxshi</span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {selectedGame.mistakes}
                  </div>
                  <span className="text-[10px] text-slate-400">Noaniqlik</span>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/20">
                  <div className="flex items-center justify-center gap-1 text-rose-400 font-bold mb-1">
                    <XCircle className="w-3.5 h-3.5" />
                    {selectedGame.blunders}
                  </div>
                  <span className="text-[10px] text-slate-400">Qo'pol xato</span>
                </div>
              </div>

              <div className="flex border-b border-slate-800 pt-2">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "summary"
                      ? "border-emerald-400 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Yurishlar tarixi
                </button>
                <button
                  onClick={() => setActiveTab("alternatives")}
                  className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "alternatives"
                      ? "border-emerald-400 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Muqobil eng yaxshi yurish
                </button>
              </div>

              {activeTab === "summary" ? (
                <div className="h-64 overflow-hidden">
                  <MoveHistory />
                </div>
              ) : (
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Qilingan yurish:</span>
                    <span className="font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30">
                      {selectedGame.alternativeSuggestion.movePlayed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Stockfish tavsiyasi:</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      {selectedGame.alternativeSuggestion.engineMove} ({selectedGame.alternativeSuggestion.diff})
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    <p className="font-semibold text-emerald-400 text-[11px] mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Nega bu yurish yaxshiroq?
                    </p>
                    {selectedGame.alternativeSuggestion.explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                O'tgan partiyalarni yuklash va tahlil qilish
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quyidagi o'yinlardan birini tanlang va uning har bir pozitsiyasini ko'rib chiqing.
              </p>
            </div>
            <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-medium">
              Jami saqlangan o'yinlar: {pastGames.length} ta
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastGames.map((game) => {
              const isCurrent = selectedGame.id === game.id;
              return (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  className={`cursor-pointer rounded-xl p-4 transition-all border text-left ${
                    isCurrent
                      ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white truncate">{game.opponent}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        game.result === "G'alaba"
                          ? "bg-emerald-950 text-emerald-400"
                          : game.result === "Mag'lubiyat"
                          ? "bg-rose-950 text-rose-400"
                          : "bg-amber-950 text-amber-400"
                      }`}
                    >
                      {game.result}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3">
                    <span>{game.date}</span>
                    <span>{game.movesCount} ta yurish</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Aniqlik: <strong className="text-emerald-400">{game.accuracyWhite}%</strong></span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isCurrent ? "text-emerald-400" : "text-slate-400"}`}>
                      {isCurrent ? "Tanlangan" : "Yuklash"} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}