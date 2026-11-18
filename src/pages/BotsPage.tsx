import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Sword,
  Zap,
  Award,
  Flame,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StatCard from "../components/sections/StatCard";
import { Input, Button } from "../components/ui";
import { useAppStore } from "../store/useAppStore";
import { bots, Bot } from "../lib/mockData";
import botTiersData from "../data/bot-tiers.json";

interface BotTier {
  id: string;
  label: string;
  min?: number;
  max?: number;
}

const tiers = botTiersData.items as BotTier[];

export default function BotsPage() {
  const navigate = useNavigate();
  const { stats, setBotDifficulty, resetGame } = useAppStore();

  const [activeTier, setActiveTier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBotPreview, setActiveBotPreview] = useState<Bot | null>(null);

  const filteredBots = useMemo(() => {
    return bots.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.playstyle.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (activeTier === "all") return true;

      const currentTier = tiers.find((t) => t.id === activeTier);
      if (!currentTier || currentTier.min === undefined) return true;
      return b.elo >= currentTier.min && b.elo <= (currentTier.max ?? 4000);
    });
  }, [searchQuery, activeTier]);

  const handleStartGame = (bot: Bot) => {
    setBotDifficulty(`${bot.name} (${bot.title})`, bot.elo);
    resetGame();
    navigate("/play");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Brain className="w-3.5 h-3.5" />
              Sun'iy intellekt raqiblari
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Botlar va Qiyinlik Darajalari
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
              Oddiy yangi boshlovchilardan tortib to jahon chempioni darajasidagi botlargacha kuchingizni sinab ko'ring.
            </p>
          </div>

          <Button
            onClick={() => handleStartGame(bots[0])}
            className="inline-flex items-center justify-center gap-2"
          >
            <Sword className="w-4 h-4" />
            Tavsiya etilgan bot bilan o'ynash
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Sizning ELO"
            value={`${stats.playerElo} ELO`}
            subtitle="Hozirgi shaxsiy darajangiz"
            icon={Flame}
            badge="Faol"
            badgeColor="amber"
          />
          <StatCard
            title="Mavjud Botlar"
            value={bots.length}
            subtitle="400 dan 3500 ELO gacha"
            icon={Brain}
            badge="100% Onlayn"
            badgeColor="emerald"
          />
          <StatCard
            title="O'yinlar Tahlili"
            value={`${stats.accuracyAvg}%`}
            subtitle="O'rtacha yurish aniqligi"
            icon={Zap}
            badge="A'lo"
            badgeColor="blue"
          />
          <StatCard
            title="G'alabalar"
            value={`${stats.wins} ta`}
            subtitle={`Jami ${stats.gamesPlayed} ta o'yindan`}
            icon={Award}
            badge="58% Yutuq"
            badgeColor="emerald"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <Input
                label="Botlarni qidirish"
                type="text"
                placeholder="Bot ismi, unvoni yoki uslubi bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold self-end sm:self-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              Topildi: {filteredBots.length} ta raqib
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTier === tier.id
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {filteredBots.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Brain className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">Mos bot topilmadi</p>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Qidiruv so'zini o'zgartiring yoki filtrlarni qayta sozlang.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveTier("all");
              }}
            >
              Barcha botlarni ko'rish
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBots.map((bot) => {
              const isGrandMaster = bot.elo >= 2400;
              const isIntermediate = bot.elo >= 1200 && bot.elo < 2400;

              return (
                <div
                  key={bot.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={bot.avatar}
                          alt={bot.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-emerald-500/50 transition-all"
                        />
                        <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-700 text-[10px]">
                          {isGrandMaster ? "👑" : isIntermediate ? "⚔️" : "🌱"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {bot.name}
                          </h3>
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                              isGrandMaster
                                ? "bg-amber-950/80 text-amber-400 border-amber-500/30"
                                : isIntermediate
                                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {bot.elo} ELO
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{bot.title}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                      "{bot.personality}"
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Uslub
                        </span>
                        <span className="text-slate-200 font-medium truncate block">
                          {bot.playstyle}
                        </span>
                      </div>

                      <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Hisoblash chuqurligi
                        </span>
                        <span className="text-emerald-400 font-bold block">
                          {bot.depth} qadam oldinga
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => setActiveBotPreview(bot)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                      title="Batafsil ma'lumot"
                    >
                      Taktika
                    </button>

                    <button
                      onClick={() => handleStartGame(bot)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-[1.02] shadow"
                    >
                      <Sword className="w-3.5 h-3.5" />
                      O'yinni boshlash
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeBotPreview && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeBotPreview.avatar}
                  alt={activeBotPreview.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{activeBotPreview.name}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">
                    {activeBotPreview.title} • {activeBotPreview.elo} ELO
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">
                    Xarakter va Taktik Yondashuv
                  </span>
                  <p>{activeBotPreview.personality}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">
                    Kengash & Tavsiya
                  </span>
                  <p>
                    Ushbu bot <span className="text-emerald-400">{activeBotPreview.playstyle}</span> uslubida harakat qiladi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setActiveBotPreview(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Yopish
                </button>
                <button
                  onClick={() => handleStartGame(activeBotPreview)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <Sword className="w-3.5 h-3.5" />
                  Jangga kirishish
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              G'alabalar orqali ELO reytingingizni oshiring
            </h3>
            <p className="text-xs text-slate-400">
              Har bir yutilgan partiya uchun +15 ELO ball beriladi.
            </p>
          </div>

          <button
            onClick={() => navigate("/puzzles")}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-slate-700 whitespace-nowrap"
          >
            Taktik masalalarni yechish
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}