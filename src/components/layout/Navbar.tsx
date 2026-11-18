import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sword, Brain, Activity, Trophy, Puzzle, Menu, X, Flame } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const playerElo = useAppStore((state) => state.stats.playerElo);

  const navLinks = [
    { to: "/play", label: "O'ynash", icon: Sword },
    { to: "/bots", label: "Botlar (12)", icon: Brain },
    { to: "/analysis", label: "Tahlil", icon: Activity },
    { to: "/puzzles", label: "Masalalar", icon: Puzzle },
    { to: "/stats", label: "Statistika", icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-slate-950">♔</span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                GrandMaster <span className="text-emerald-400 font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">O'zbekcha Shaxmat Platformasi</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Player Quick Badge & Fast Play CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <Flame className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <p className="text-[10px] uppercase text-slate-400 font-bold leading-none">Reyting</p>
                <p className="text-xs font-bold text-amber-300 leading-tight">{playerElo} ELO</p>
              </div>
            </div>

            <Link
              to="/play"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Sword className="w-4 h-4" />
              O'yinni boshlash
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {playerElo}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/play"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow"
            >
              <Sword className="w-4 h-4" />
              Tezkor o'yin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}