import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Flame,
  TrendingUp,
  Award,
  Swords,
  Target,
  CheckCircle2,
  Lock,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StatCard from "../components/sections/StatCard";
import { useAppStore } from "../store/useAppStore";
import { openings, bots } from "../lib/mockData";
import achievementsData from "../data/achievements.json";

interface RawAchievement {
  id: string;
  title: string;
  desc: string;
  tier: string;
  targetType: string;
  targetValue: number;
}

const rawAchievements = achievementsData.items as RawAchievement[];

export default function StatsPage() {
  const { stats } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const winRate = useMemo(() => {
    if (!stats.gamesPlayed) return 0;
    return Math.round((stats.wins / stats.gamesPlayed) * 100);
  }, [stats.gamesPlayed, stats.wins]);

  const openingStats = useMemo(() => {
    return openings.slice(0, 6).map((op, idx) => {
      const played = 14 - idx * 2;
      const won = Math.max(1, Math.round(played * (0.8 - idx * 0.08)));
      const rate = Math.round((won / played) * 100);
      return { ...op, played, won, rate };
    });
  }, []);

  const achievements = useMemo(() => {
    return rawAchievements.map((ach) => {
      let unlocked = false;
      let progress = "";

      if (ach.targetType === "wins") {
        unlocked = stats.wins >= ach.targetValue;
        progress = `${Math.min(stats.wins, ach.targetValue)}/${ach.targetValue}`;
      } else if (ach.targetType === "elo") {
        unlocked = stats.playerElo >= ach.targetValue;
        progress = `${stats.playerElo}/${ach.targetValue}`;
      } else if (ach.targetType === "accuracy") {
        unlocked = stats.accuracyAvg >= ach.targetValue;
        progress = `${stats.accuracyAvg}%/${ach.targetValue}%`;
      } else if (ach.targetType === "games") {
        unlocked = stats.gamesPlayed >= ach.targetValue;
        progress = `${stats.gamesPlayed}/${ach.targetValue}`;
      } else if (ach.targetType === "gm_win") {
        unlocked = (stats.winRateByDifficulty["Grossmeyster (2400+)"] || 0) > 0;
        progress = unlocked ? "1/1" : "0/1";
      }

      return {
        ...ach,
        unlocked,
        progress,
      };
    });
  }, [stats]);

  const ratingHistory = [
    { month: "Yanvar", elo: 1200 },
    { month: "Fevral", elo: 1260 },
    { month: "Mart", elo: 1315 },
    { month: "Aprel", elo: 1350 },
    { month: "May", elo: 1390 },
    { month: "Hozir", elo: stats.playerElo },
  ];

  const filteredOpenings =
    selectedCategory === "all"
      ? openingStats
      : openingStats.filter((item) => (selectedCategory === "high" ? item.rate >= 60 : item.rate < 60));

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Shaxsiy o'yin hisoboti va taraqqiyot
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Statistika va Natijalar
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              AI bilan o'tkazilgan barcha partiyalar tahlili, g'alabalar nisbati va reyting o'sish dinamikasi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/play"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
            >
              <Swords className="w-4 h-4" />
              Yangi partiya boshlash
            </Link>
          </div>
        </div>

        <section aria-labelledby="general-stats-title">
          <h2 id="general-stats-title" className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Umumiy partiyalar ko'rsatkichlari
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Jami partiyalar"
              value={stats.gamesPlayed}
              subtitle={`${stats.wins} g'alaba, ${stats.draws} durang`}
              icon={Swords}
              badge={`${stats.wins}W / ${stats.losses}L`}
              badgeColor="emerald"
            />
            <StatCard
              title="G'alaba foizi"
              value={`${winRate}%`}
              subtitle="Jami o'yinlardagi zafar ulushi"
              icon={Trophy}
              badge="Yuqori sur'at"
              badgeColor="amber"
            />
            <StatCard
              title="Joriy ELO reyting"
              value={`${stats.playerElo}`}
              subtitle="So'nggi o'yinlar hisobi"
              icon={Flame}
              badge="+220 o'sish"
              badgeColor="blue"
            />
            <StatCard
              title="O'rtacha aniqlik"
              value={`${stats.accuracyAvg}%`}
              subtitle="Stockfish neyrotarmog'i bahosi"
              icon={TrendingUp}
              badge="Barqaror"
              badgeColor="emerald"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="text-emerald-400">G'alabalar: {stats.wins} ({winRate}%)</span>
              <span className="text-amber-400">
                Duranglar: {stats.draws} ({Math.round((stats.draws / (stats.gamesPlayed || 1)) * 100)}%)
              </span>
              <span className="text-rose-400">
                Mag'lubiyatlar: {stats.losses} ({Math.round((stats.losses / (stats.gamesPlayed || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${(stats.wins / (stats.gamesPlayed || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
              />
              <div
                style={{ width: `${(stats.draws / (stats.gamesPlayed || 1)) * 100}%` }}
                className="bg-amber-400 h-full transition-all duration-500"
              />
              <div
                style={{ width: `${(stats.losses / (stats.gamesPlayed || 1)) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  Bot darajalariga qarshi g'alaba ko'rsatkichlari
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Har xil sun'iy intellekt darajalariga qarshi samaradorlik
                </p>
              </div>
              <Link
                to="/bots"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                Botlarni tanlash <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-5">
              {Object.entries(stats.winRateByDifficulty).map(([tier, rate]) => (
                <div key={tier} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{tier}</span>
                    <span
                      className={`font-mono ${
                        rate >= 70
                          ? "text-emerald-400"
                          : rate >= 40
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {rate}% g'alaba
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rate >= 70
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : rate >= 40
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-rose-500 to-red-400"
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Reyting dinamikasi (O'sish)
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                So'nggi 6 oylik mashg'ulotlar natijasida ELO o'zgarishi
              </p>

              <div className="space-y-3">
                {ratingHistory.map((item, idx) => {
                  const maxElo = 1500;
                  const percent = Math.min(100, Math.round((item.elo / maxElo) * 100));
                  const isCurrent = idx === ratingHistory.length - 1;

                  return (
                    <div key={item.month} className="flex items-center gap-3 text-xs">
                      <span className="w-14 text-slate-400 font-medium">{item.month}</span>
                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCurrent ? "bg-emerald-400" : "bg-slate-600"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span
                        className={`w-16 text-right font-mono font-bold ${
                          isCurrent ? "text-emerald-400" : "text-slate-300"
                        }`}
                      >
                        {item.elo}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Eng kuchli raqib: <span className="text-slate-200 font-semibold">{bots[8]?.name} (2600 ELO)</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="openings-stats-title" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="openings-stats-title" className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Sevimli debyutlar va ulardagi samaradorlik
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Dastlabki yurishlar va pozitsion o'yinlardagi shaxsiy statistika
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Barchasi
              </button>
              <button
                onClick={() => setSelectedCategory("high")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === "high"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yuqori (&ge;60%)
              </button>
              <button
                onClick={() => setSelectedCategory("low")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === "low"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Qiyin (&lt;60%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpenings.map((op) => (
              <div
                key={op.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 font-mono border border-slate-700">
                      {op.eco}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        op.rate >= 60
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-950 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {op.rate}% g'alaba
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{op.name}</h3>
                  <p className="font-mono text-xs text-amber-300/90 mb-2">{op.moves}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{op.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Partiyalar: {op.played} ta</span>
                  <span className="text-emerald-400 font-medium">G'alaba: {op.won} ta</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="achievements-title">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="achievements-title" className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Yutuqlar va shaxmat unvonlari
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Mashqlar va o'yinlardagi faolligingiz orqali ochiladigan nishonlar
              </p>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
              Ochilgan: {achievements.filter((a) => a.unlocked).length} / {achievements.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? "bg-slate-900/90 border-emerald-500/30 shadow-sm"
                    : "bg-slate-900/40 border-slate-800/60 opacity-70"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}
                >
                  {ach.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-white truncate">{ach.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {ach.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ach.desc}</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Holat:</span>
                    <span
                      className={`font-mono font-bold ${
                        ach.unlocked ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {ach.unlocked ? "Erishildi" : ach.progress}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}