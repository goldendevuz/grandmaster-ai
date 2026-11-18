import { Link } from "react-router-dom";
import { Trophy, Shield, HelpCircle, Code, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950">
                ♔
              </div>
              <span className="text-base font-black text-white">GrandMaster AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Barcha darajadagi shaxmatchilar uchun sun'iy intellektga asoslangan tahlil, mashqlar va qiyin botlar bilan boyitilgan O'zbekistondagi zamonaviy platforma.
            </p>
            <div className="text-xs text-emerald-400/90 flex items-center gap-1.5 pt-1">
              <Shield className="w-3.5 h-3.5" /> 100% yolg'iz rejim (Botlarga qarshi)
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Bo'limlar</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/play" className="hover:text-emerald-400 transition-colors">
                  AI ga qarshi o'ynash
                </Link>
              </li>
              <li>
                <Link to="/bots" className="hover:text-emerald-400 transition-colors">
                  12 xil qiyinlikdagi botlar
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-emerald-400 transition-colors">
                  Pozitsiya va partiyalar tahlili
                </Link>
              </li>
              <li>
                <Link to="/puzzles" className="hover:text-emerald-400 transition-colors">
                  Taktik masalalar
                </Link>
              </li>
              <li>
                <Link to="/stats" className="hover:text-emerald-400 transition-colors">
                  Shaxsiy ko'rsatkichlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Chess rules & tips */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Shaxmat bo'yicha</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> FIDE rasmiy qoidalari
              </li>
              <li className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-slate-500" /> ELO reyting hisoblash tizimi
              </li>
              <li className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" /> Stockfish & Neyrotarmoq hisoblari
              </li>
              <li className="text-slate-400">Dimlangan mot va zamonaviy debyutlar</li>
            </ul>
          </div>

          {/* Unsplash Credits & About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Suratlar mualliflari</h4>
            <div className="text-[11px] text-slate-400 space-y-1 leading-normal">
              <p>
                Suratlar:{" "}
                <a
                  href="https://unsplash.com/@hpzworkz?utm_source=werto&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-400"
                >
                  Hassan Pasha
                </a>
                ,{" "}
                <a
                  href="https://unsplash.com/@felix_mittermeier?utm_source=werto&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-400"
                >
                  Felix Mittermeier
                </a>
                ,{" "}
                <a
                  href="https://unsplash.com/@jeshoots?utm_source=werto&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-400"
                >
                  JESHOOTS.COM
                </a>{" "}
                (
                <a
                  href="https://unsplash.com/?utm_source=werto&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-emerald-400"
                >
                  Unsplash
                </a>
                )
              </p>
              <p className="pt-2 text-slate-400">
                GrandMaster AI — aqlingizni charxlang va mahoratingizni yangi bosqichga olib chiqing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GrandMaster AI. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-1">
            <span>O'zbekiston shaxmatchilari uchun tayyorlandi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}