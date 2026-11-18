import { useState, useEffect, useMemo } from "react";
import { Lightbulb, CheckCircle2, RotateCcw, ChevronRight, Award, Flame, Zap, HelpCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChessBoardView from "../components/chess/ChessBoardView";
import { Input, Select, Button } from "../components/ui";
import { useAppStore } from "../store/useAppStore";
import { puzzles, Puzzle, formatElo } from "../lib/mockData";

export default function PuzzlesPage() {
  const { setFen, setSelectedSquare } = useAppStore();
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string>(puzzles[0].id);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [revealedSolution, setRevealedSolution] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "idle" | "success" | "hint" }>({
    text: "Oqlarning yurishi. Eng kuchli taktik harakatni toping!",
    type: "idle",
  });
  const [boardTheme, setBoardTheme] = useState<"emerald" | "wood" | "slate">("emerald");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("Barchasi");
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>(["puz-01"]);

  const currentPuzzle: Puzzle = useMemo(
    () => puzzles.find((p) => p.id === selectedPuzzleId) || puzzles[0],
    [selectedPuzzleId]
  );

  useEffect(() => {
    setFen(currentPuzzle.fen);
    setSelectedSquare(null);
    setShowHint(false);
    setRevealedSolution(false);
    setStatusMessage({
      text: "Oqlarning navbati. Taktik kombinatsiyani amalga oshiring!",
      type: "idle",
    });
  }, [currentPuzzle, setFen, setSelectedSquare]);

  const themes = useMemo(() => {
    const list = Array.from(new Set(puzzles.map((p) => p.theme)));
    return ["Barchasi", ...list];
  }, []);

  const filteredPuzzles = useMemo(() => {
    return puzzles.filter((p) => {
      const matchQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.solution.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTheme = selectedTheme === "Barchasi" || p.theme === selectedTheme;
      return matchQuery && matchTheme;
    });
  }, [searchQuery, selectedTheme]);

  const handleCheckSolution = () => {
    setRevealedSolution(true);
    if (!solvedPuzzles.includes(currentPuzzle.id)) {
      setSolvedPuzzles((prev) => [...prev, currentPuzzle.id]);
    }
    setStatusMessage({
      text: `To'g'ri yechim: ${currentPuzzle.solution}! Masala muvaffaqiyatli hal qilindi.`,
      type: "success",
    });
  };

  const handleHintClick = () => {
    setShowHint(true);
    setStatusMessage({
      text: `Maslahat: Asosiy e'tiborni '${currentPuzzle.theme}' mavzusiga qarating.`,
      type: "hint",
    });
  };

  const handleNextPuzzle = () => {
    const currentIndex = puzzles.findIndex((p) => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % puzzles.length;
    setSelectedPuzzleId(puzzles[nextIndex].id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5" /> Kunlik taktik shaxmat masalalari
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mashg'ulot va Masalalar
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Taktik ko'rish qobiliyatingizni o'stiring va grossmeysterlik hisobini mashq qiling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Hal qilingan</p>
                <p className="text-base font-black text-amber-300">{solvedPuzzles.length} / {puzzles.length}</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
              <Award className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">O'rtacha daraja</p>
                <p className="text-base font-black text-emerald-400">1450 ELO</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">
                Taxta uslubi:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(["emerald", "wood", "slate"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setBoardTheme(t)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize transition-all ${
                      boardTheme === t ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t === "emerald" ? "Zumrad" : t === "wood" ? "Yog'och" : "Klassik"}
                  </button>
                ))}
              </div>
            </div>

            <ChessBoardView theme={boardTheme} interactive={true} />

            <div className={`w-full max-w-xl mt-4 p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === "success"
                ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
                : statusMessage.type === "hint"
                ? "bg-amber-950/70 border-amber-500/50 text-amber-300"
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}>
              <div className="flex items-center gap-2">
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={handleNextPuzzle}
                className="shrink-0 font-bold hover:underline flex items-center gap-1 text-slate-200"
              >
                Keyingisi <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                    {currentPuzzle.theme}
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">{currentPuzzle.title}</h2>
                </div>
                <span className="px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-bold text-sm">
                  {formatElo(currentPuzzle.rating)}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Pozitsiyani sinchiklab baholang. Himoyasiz donalarni aniqlab, hal qiluvchi zarba bering.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={handleHintClick}
                  className="flex items-center justify-center gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Maslahat olish
                </Button>
                <Button
                  onClick={handleCheckSolution}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Yechimni ko'rish
                </Button>
              </div>

              {revealedSolution && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 mb-4 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>G'olib kombinatsiya:</span>
                    <span className="font-mono bg-emerald-950 px-2 py-0.5 rounded text-white text-sm">
                      {currentPuzzle.solution}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ushbu yurish raqib himoyasini keskin sindiradi va muqarrar matga olib keladi.
                  </p>
                </div>
              )}

              {showHint && !revealedSolution && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 mb-4">
                  💡 <span className="font-semibold">Mavzu:</span> {currentPuzzle.theme}. Markaziy kataklar va himoyasiz qolgan donalarga zarba bering!
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => {
                    setFen(currentPuzzle.fen);
                    setRevealedSolution(false);
                    setShowHint(false);
                  }}
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Dastlabki holat
                </button>
                <button
                  onClick={handleNextPuzzle}
                  className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1"
                >
                  Keyingi masala <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1528819622765-d6bcf132f793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDc1MDQ1fDB8MXxzZWFyY2h8MXx8Y2hlc3MlMjBncmFuZG1hc3RlciUyMHN0cmF0ZWd5JTIwdGhpbmtpbmd8ZW58MXwwfHx8MTc5NDk4NTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Shaxmat donalari taktikasi"
                className="w-full h-36 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4 flex flex-col justify-end">
                <p className="text-xs font-bold text-white">Kuniga 5 ta masala yechish</p>
                <p className="text-[11px] text-slate-300">Shaxmat reytingingizni oyiga o'rtacha +120 ELO ga oshiradi.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 border-t border-slate-800 pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Mat topish va kombinatsion mashqlar
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Turli taktik mavzular bo'yicha saralangan barcha masalalar bazasi
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="w-full sm:w-56">
                <Input
                  label="Izlash"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masala yoki yechim izlash..."
                />
              </div>

              <div className="w-full sm:w-48">
                <Select
                  label="Mavzu"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  options={themes.map((th) => ({ value: th, label: th }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPuzzles.map((puz) => {
              const isSelected = puz.id === currentPuzzle.id;
              const isSolved = solvedPuzzles.includes(puz.id);

              return (
                <div
                  key={puz.id}
                  onClick={() => setSelectedPuzzleId(puz.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                      {puz.theme}
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {formatElo(puz.rating)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{puz.title}</h3>
                  <p className="text-[11px] font-mono text-slate-500 truncate mb-3">FEN: {puz.fen}</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className={`inline-flex items-center gap-1 font-semibold ${isSolved ? "text-emerald-400" : "text-slate-500"}`}>
                      {isSolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bajarilgan
                        </>
                      ) : (
                        "Yechilmagan"
                      )}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPuzzleId(puz.id);
                      }}
                      className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {isSelected ? "Faol" : "Tanlash"}
                    </button>
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