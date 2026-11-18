import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  Flag,
  Lightbulb,
  Handshake,
  Bot as BotIcon,
  Palette,
  ChevronDown,
  Sparkles,
  Trophy,
  Activity,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChessBoardView from "../components/chess/ChessBoardView";
import MoveHistory from "../components/chess/MoveHistory";
import EvalBar from "../components/chess/EvalBar";
import { useAppStore } from "../store/useAppStore";
import { bots, formatTime, formatElo } from "../lib/mockData";

export default function PlayPage() {
  const {
    currentTurn,
    whiteTime,
    blackTime,
    isThinking,
    isGameOver,
    gameResult,
    botDifficulty,
    botElo,
    stats,
    analysis,
    tickTimer,
    makeMove,
    resetGame,
    setThinking,
    updateEvaluation,
    recordGameResult,
    setBotDifficulty,
  } = useAppStore();

  const [boardTheme, setBoardTheme] = useState<"emerald" | "wood" | "slate">("emerald");
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [showBotSelector, setShowBotSelector] = useState(false);
  const [capturedPieces] = useState({
    white: ["♟", "♟", "♘"],
    black: ["♙", "♙", "♗"],
  });

  // Current active bot info
  const activeBot = bots.find((b) => b.elo === botElo) || bots[0];

  // Active game timer countdown
  useEffect(() => {
    const timer = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(timer);
  }, [tickTimer]);

  // Simulated AI response move
  useEffect(() => {
    if (currentTurn === "b" && !isGameOver && !isThinking) {
      setThinking(true);
      const timer = setTimeout(() => {
        const standardReplies = ["e7e5", "c7c5", "g8f6", "d7d5", "b8c6", "e7e6"];
        const moveChoice = standardReplies[Math.floor(Math.random() * standardReplies.length)];
        const fromSq = moveChoice.slice(0, 2);
        const toSq = moveChoice.slice(2, 4);
        makeMove(fromSq, toSq, `${fromSq.toUpperCase()}→${toSq.toUpperCase()}`);
        setThinking(false);
        updateEvaluation(Number((Math.random() * 1.6 - 0.7).toFixed(1)));
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, isGameOver, isThinking, makeMove, setThinking, updateEvaluation]);

  const handleShowHint = () => {
    setHintMessage(`Tavsiya etilgan yurish: ${analysis.bestMove}. ${analysis.engineRecommendation}`);
    setTimeout(() => setHintMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {/* Top Control Bar: Bot selector & Board Theme */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowBotSelector(!showBotSelector)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs sm:text-sm font-semibold transition"
              >
                <BotIcon className="w-4 h-4 text-emerald-400" />
                <span>Raqib: <strong className="text-white">{activeBot.name} ({formatElo(activeBot.elo)})</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showBotSelector && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase">Botni tanlang</div>
                  {bots.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setBotDifficulty(`${b.title} (${b.name})`, b.elo);
                        setShowBotSelector(false);
                        resetGame();
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                        b.elo === botElo ? "bg-emerald-500/20 text-emerald-300 font-bold" : "hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={b.avatar} alt={b.name} className="w-6 h-6 rounded-full object-cover" />
                        <span>{b.name} <span className="text-[10px] text-slate-400">({b.title})</span></span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">{b.elo}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="hidden md:inline-block text-xs text-slate-400">
              Uslubi: <span className="text-slate-300 font-medium">{activeBot.playstyle}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-emerald-400" /> Taxta:
            </span>
            {(["emerald", "wood", "slate"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setBoardTheme(t)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize font-medium transition ${
                  boardTheme === t
                    ? "bg-emerald-500 text-slate-950 font-bold shadow"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {t === "emerald" ? "Zumrad" : t === "wood" ? "Yog'och" : "Klassik"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Board & Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Board Area & Action Buttons */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
            {/* Opponent Profile Bar */}
            <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
              currentTurn === "b" && !isGameOver ? "bg-slate-900 border-emerald-500/60 shadow-lg" : "bg-slate-900/70 border-slate-800"
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={activeBot.avatar}
                  alt={activeBot.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{activeBot.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                      {formatElo(activeBot.elo)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Yutilganlar: {capturedPieces.black.join(" ")}</span>
                    {isThinking && <span className="text-emerald-400 text-[11px] animate-pulse">O'ylamoqda...</span>}
                  </div>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-lg font-mono text-base font-black border ${
                currentTurn === "b" && !isGameOver
                  ? "bg-emerald-950 text-emerald-400 border-emerald-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}>
                {formatTime(blackTime)}
              </div>
            </div>

            {/* Chess Board */}
            <div className="relative">
              <ChessBoardView theme={boardTheme} interactive={!isGameOver} />

              {/* Game Over Modal / Overlay */}
              {isGameOver && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 rounded-2xl z-20">
                  <div className="bg-slate-900 border border-slate-700 max-w-sm w-full p-6 rounded-2xl text-center shadow-2xl space-y-4">
                    <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-black text-white">Partiya yakunlandi</h3>
                      <p className="text-sm text-slate-300 mt-1">{gameResult}</p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={resetGame}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow"
                      >
                        Qayta o'ynash
                      </button>
                      <Link
                        to="/analysis"
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Activity className="w-3.5 h-3.5 text-emerald-400" /> Partiyani tahlil qilish
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Player Profile Bar */}
            <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
              currentTurn === "w" && !isGameOver ? "bg-slate-900 border-emerald-500/60 shadow-lg" : "bg-slate-900/70 border-slate-800"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-slate-950 text-xl border border-emerald-400/40">
                  ♔
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">Siz (Oqlar)</h3>
                    <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                      {formatElo(stats.playerElo)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Yutilganlar: {capturedPieces.white.join(" ")}</span>
                    {currentTurn === "w" && !isGameOver && (
                      <span className="text-emerald-400 text-[11px] font-semibold">Sizning navbatingiz</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-lg font-mono text-base font-black border ${
                currentTurn === "w" && !isGameOver
                  ? "bg-emerald-950 text-emerald-400 border-emerald-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}>
                {formatTime(whiteTime)}
              </div>
            </div>

            {/* Game Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={handleShowHint}
                disabled={isGameOver}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-300 disabled:opacity-40 transition"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" /> Maslahat
              </button>

              <button
                onClick={() => recordGameResult("draw")}
                disabled={isGameOver}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40 transition"
              >
                <Handshake className="w-4 h-4 text-sky-400" /> Durang taklifi
              </button>

              <button
                onClick={() => recordGameResult("loss")}
                disabled={isGameOver}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-rose-300 disabled:opacity-40 transition"
              >
                <Flag className="w-4 h-4 text-rose-400" /> Taslim bo'lish
              </button>

              <button
                onClick={resetGame}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" /> Yangi partiya
              </button>
            </div>

            {/* Hint Notice if requested */}
            {hintMessage && (
              <div className="bg-amber-950/60 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{hintMessage}</span>
              </div>
            )}
          </div>

          {/* Right Column: Eval bar, Bot Personality & Move History */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            <EvalBar />

            {/* Bot Personality Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <BotIcon className="w-3.5 h-3.5 text-emerald-400" />
                Raqib xarakteri
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                "{activeBot.personality}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Hisoblash chuqurligi: <strong className="text-white">{activeBot.depth} qadam</strong></span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> FIDE qoidalari
                </span>
              </div>
            </div>

            {/* Move History Component */}
            <div className="min-h-[280px]">
              <MoveHistory />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}