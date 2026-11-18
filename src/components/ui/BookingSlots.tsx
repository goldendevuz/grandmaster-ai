import { useEffect, useState } from "react";

/**
 * BookingSlots — picking the time in a booking form. Once a date is picked,
 * the taken times come from `GET <endpoint>/slots?date=YYYY-MM-DD` and those
 * buttons are disabled. Only bookings that came through the site count as
 * taken. On a network error every time stays open — the booking still
 * reaches the owner.
 *
 *   <BookingSlots endpoint={ENDPOINT} date={form.values.date}
 *     value={form.values.time} onChange={(t) => form.setField("time", t)} />
 */
export interface BookingSlotsProps {
  /** The form endpoint: {PUBLIC_API_URL}/public/forms/{PROJECT_ID}. */
  endpoint: string;
  /** The picked date, YYYY-MM-DD ("" — none yet). */
  date: string;
  /** The picked time, HH:MM. */
  value: string;
  onChange: (time: string) => void;
  /** The working day: "09:00" … "18:00", step (minutes). */
  from?: string;
  to?: string;
  step?: number;
  /** The length of one booking (minutes) — to check whether it overlaps a taken range. */
  duration?: number;
  label?: string;
  required?: boolean;
  error?: string;
  /** The text shown while no date is picked. */
  emptyText?: string;
  name?: string;
  className?: string;
}

type Busy = { start: string; end: string };

/** "Pick a date first" per <html lang>; English otherwise. */
const EMPTY_TEXTS: Record<string, string> = {
  en: "Pick a date first", ru: "Сначала выберите дату", uz: "Avval sanani tanlang",
  es: "Primero elige una fecha", tr: "Önce bir tarih seçin",
};

function defaultEmptyText(): string {
  const lang = (typeof document !== "undefined" ? document.documentElement.lang : "").slice(0, 2);
  return EMPTY_TEXTS[lang] ?? EMPTY_TEXTS.en;
}

const toMin = (t: string): number => {
  const m = /^(\d{1,2}):(\d{2})/.exec(t ?? "");
  return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
};
const toTime = (n: number): string => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

export function BookingSlots({
  endpoint,
  date,
  value,
  onChange,
  from = "09:00",
  to = "18:00",
  step = 60,
  duration,
  label,
  required,
  error,
  emptyText,
  name = "time",
  className = "",
}: BookingSlotsProps) {
  const [busy, setBusy] = useState<Busy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!endpoint || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
      setBusy([]);
      return;
    }
    let alive = true;
    setLoading(true);
    fetch(`${endpoint.replace(/\/$/, "")}/slots?date=${encodeURIComponent(date)}`)
      .then((r) => (r.ok ? r.json() : { slots: [] }))
      .then((data) => {
        if (alive) setBusy(Array.isArray(data?.slots) ? data.slots : []);
      })
      .catch(() => {
        if (alive) setBusy([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [endpoint, date]);

  const len = duration && duration > 0 ? duration : step;
  const start = toMin(from);
  const end = toMin(to);
  const times: string[] = [];
  for (let t = start; t >= 0 && t + len <= end && times.length < 96; t += Math.max(step, 5)) times.push(toTime(t));
  const taken = (t: string) => {
    const a = toMin(t);
    return busy.some((b) => a < (b.end === "24:00" ? 1440 : toMin(b.end)) && toMin(b.start) < a + len);
  };

  useEffect(() => {
    if (value && taken(value)) onChange("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <input type="hidden" name={name} value={value ?? ""} aria-label={label ?? name} />
      {!date ? (
        <p className="text-sm opacity-70">{emptyText ?? defaultEmptyText()}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" aria-busy={loading}>
          {times.map((t) => {
            const off = taken(t);
            const on = value === t;
            return (
              <button
                key={t}
                type="button"
                disabled={off}
                aria-pressed={on}
                onClick={() => onChange(t)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  on ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-current/20"
                } ${off ? "cursor-not-allowed line-through opacity-40" : "hover:border-[var(--accent)]"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
