import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "emerald" | "amber" | "rose" | "blue";
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "emerald",
  children,
}: StatCardProps) {
  const badgeClasses = {
    emerald: "bg-emerald-950/80 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-950/80 text-amber-400 border-amber-500/30",
    rose: "bg-rose-950/80 text-rose-400 border-rose-500/30",
    blue: "bg-sky-950/80 text-sky-400 border-sky-500/30",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h4>
            <div className="text-2xl font-black text-white tracking-tight">{value}</div>
          </div>
        </div>

        {badge && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeClasses[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}