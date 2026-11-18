import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sword,
  Brain,
  Activity,
  Trophy,
  Puzzle,
  ChevronRight,
  Flame,
  Sparkles,
  Bot as BotIcon,
  Crosshair,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChessBoardView from "../components/chess/ChessBoardView";
import EvalBar from "../components/chess/EvalBar";
import StatCard from "../components/sections/StatCard";
import { useAppStore } from "../store/useAppStore";
import { bots, Bot } from "../lib/mockData";

export default function HomePage() {
  const { stats, setBotDifficulty } = useAppStore();
  const [activeTab, setActiveTab] = useState<"all" | "easy" | "pro">("all");
  const [boardTheme, setBoardTheme] = useState<"emerald" | "wood" | "slate">("emerald");

  const filteredBots = bots.filter((b) => {
    if (activeTab === "easy") return b.elo <= 1300;
    if (activeTab === "pro") return b.elo > 1300;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden py-14 sm:py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                O'zbekistondagi 1-raqamli Shaxmat Sun'iy Intellekti
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                Aqlingizni <span className="text-emerald-400">GrandMaster</span> darajasiga ko'taring
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                12 xil noyob xarakterga ega sun'iy intellekt botlariga qarshi o'ynang, har bir yurishingizni
                neyrotarmoqlar yordamida chuqur tahlil qiling va shaxsiy reytingingizni oshiring.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/play"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <Sword className="w-4 h-4" />
                  Tezkor o'yinni boshlash
                </Link>
                <Link
                  to="/bots"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
                >
                  <Brain className="w-4 h-4 text-emerald-400" />
                  Raqib tanlash
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <Flame className="w-4 h-4 text-amber-400" /> ELO 400 dan 3500 gacha
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-4 h-4 text-emerald-400" /> Har bir yurish tahlili
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDc1MDQ1fDB8MXxzZWFyY2h8MXx8Y2hlc3MlMjBib2FyZCUyMHBpZWNlcyUyMGdhbWV8ZW58MXwwfHx8MTc5NDk4NTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="A black and a white chess knight facing each other on a board"
                  loading="eager"
                  className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
                  <p className="text-xs uppercase font-bold tracking-wider text-emerald-400">Jonli o'yin zali</p>
                  <h3 className="text-lg font-black text-white">Xatolarsiz strategiya va aniq hisob</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Boshlang'ich piyoda yurishidan to murakkab endshpilgacha AI hamrohingiz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. JONLI INTERAKTIV DOSKA NAMUNASI */}
        <section className="py-16 bg-slate-950 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Jonli interaktiv doska</h2>
              <p className="text-sm text-slate-400 mt-2">
                Hozirning o'zida donani siljitib ko'ring yoki taxta mavzusini moslashtiring.
              </p>
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setBoardTheme("emerald")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    boardTheme === "emerald" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  Zumrad
                </button>
                <button
                  onClick={() => setBoardTheme("wood")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    boardTheme === "wood" ? "bg-amber-600 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  Yog'och
                </button>
                <button
                  onClick={() => setBoardTheme("slate")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    boardTheme === "slate" ? "bg-slate-300 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  Klassik Slate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-md">
                  <ChessBoardView theme={boardTheme} />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <EvalBar />
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                    Bosh sahifadan to'g'ridan-to'g'ri o'yinga
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ushbu mini doskada o'z yurishingizni amalga oshirishingiz yoki to'liq qulaylik bilan o'yin
                    xonasiga o'tib, vaqt nazorati bilan bellashishingiz mumkin.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/play"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                    >
                      To'liq o'yin maydoniga o'tish <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BOTLAR VA DARAJALAR SLAYDERI */}
        <section className="py-16 bg-slate-900/60 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Har qanday daraja uchun
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Sun'iy intellekt botlari</h2>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "all" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Barchasi (12)
                </button>
                <button
                  onClick={() => setActiveTab("easy")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "easy" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Havaskorlar (400-1300)
                </button>
                <button
                  onClick={() => setActiveTab("pro")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "pro" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Ustalar (1500-3500)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBots.slice(0, 4).map((bot: Bot) => (
                <div
                  key={bot.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all group"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-800">
                      <img
                        src={bot.avatar}
                        alt={bot.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-xs text-amber-300 font-mono text-xs font-extrabold px-2 py-0.5 rounded-md border border-amber-400/30">
                        {bot.elo} ELO
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-white text-base">{bot.name}</h4>
                        <span className="text-[11px] font-semibold text-emerald-400">{bot.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{bot.personality}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 italic">{bot.playstyle}</span>
                    <Link
                      to="/play"
                      onClick={() => setBotDifficulty(`${bot.title} (${bot.name})`, bot.elo)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                    >
                      O'ynash <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/bots"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Barcha 12 xil bot va shaxsiyatlarni ko'rish <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. ASOSIY AFZALLIKLAR VA TAHLIL IMKONIYATLARI */}
        <section className="py-16 bg-slate-950 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Nega GrandMaster AI?</h2>
              <p className="text-sm text-slate-400 mt-2">
                O'zbek shaxmat maktabi talablariga moslashtirilgan zamonaviy o'rganish va tahlil vositalari.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Chuqur Pozitsion Tahlil</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Har bir partiyangizdagi qo'pol xatolar (blunders), noaniqliklar va eng yaxshi yurish variantlarini
                  soniyalar ichida hisoblab beradi.
                </p>
                <Link to="/analysis" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 pt-1">
                  Tahlil zaliga o'tish <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Puzzle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Taktik Masalalar</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Oxirgi qatordagi motdan tortib to murakkab vazir qurbonliklarigacha bo'lgan qiziqarli shaxmat
                  masalalari bilan kombinatsion ko'rish qobiliyatingizni o'stiring.
                </p>
                <Link to="/puzzles" className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 pt-1">
                  Masalalarni yechish <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <BotIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Jonli O'yin Uslublari</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Botlar quruq algoritm emas: ba'zilari agressiv hujum qiladi, ba'zilari esa qat'iy himoyaviy
                  pozitsiyalarni afzal biladi.
                </p>
                <Link to="/bots" className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 pt-1">
                  Uslublarni sinash <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TEZKOR STATISTIKA */}
        <section className="py-16 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Muvaffaqiyat ko'zgusi</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Sizning hozirgi ko'rsatkichlaringiz</h2>
              </div>
              <Link
                to="/stats"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                Batafsil hisobot <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Joriy ELO Reyting"
                value={`${stats.playerElo}`}
                subtitle="O'yinlardagi natijalarga asoslangan"
                icon={Trophy}
                badge="+15 so'nggi g'alaba"
                badgeColor="emerald"
              />
              <StatCard
                title="O'tkazilgan O'yinlar"
                value={stats.gamesPlayed}
                subtitle={`${stats.wins} g'alaba, ${stats.losses} mag'lubiyat, ${stats.draws} durang`}
                icon={Sword}
                badge={`${Math.round((stats.wins / (stats.gamesPlayed || 1)) * 100)}% g'alaba`}
                badgeColor="amber"
              />
              <StatCard
                title="O'rtacha Aniqlik"
                value={`${stats.accuracyAvg}%`}
                subtitle="Engine hisoblagan yurishlar sifati"
                icon={Crosshair}
                badge="Yuqori mahorat"
                badgeColor="emerald"
              />
              <StatCard
                title="Eng yaxshi yechimlar"
                value="94.2%"
                subtitle="Havaskor botlarga qarshi ko'rsatkich"
                icon={Brain}
                badge="A'lo natija"
                badgeColor="blue"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}