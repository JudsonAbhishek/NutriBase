"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  ArrowDown,
  ArrowUp,
  Clock3,
  Droplets,
  GlassWater,
  Minus,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";

type Drink = { id: string; name: string; amount: number; time: string };
type DayLog = { date: string; drinks: Drink[] };
type Settings = {
  goal: number;
  wake: string;
  sleep: string;
  interval: number;
  remindersEnabled: boolean;
  remindersPaused: boolean;
  continueAfterGoal: boolean;
};

const STORAGE_KEY = "nutribase_hydration_v1";
const DEFAULT_SETTINGS: Settings = {
  goal: 2500,
  wake: "07:00",
  sleep: "23:00",
  interval: 1,
  remindersEnabled: true,
  remindersPaused: false,
  continueAfterGoal: false,
};
const QUICK_AMOUNTS = [150, 250, 350, 500];

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function validData(value: unknown): value is { settings: Settings; days: DayLog[] } {
  if (!value || typeof value !== "object") return false;
  const data = value as { settings?: Settings; days?: DayLog[] };
  return Boolean(data.settings && Number.isFinite(data.settings.goal) && Array.isArray(data.days));
}

function formatClock(value: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(value);
}

function scheduleTimes(date: string, wake: string, sleep: string, interval: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [wakeHour, wakeMinute] = wake.split(":").map(Number);
  const [sleepHour, sleepMinute] = sleep.split(":").map(Number);
  const start = new Date(year, month - 1, day, wakeHour, wakeMinute);
  let end = new Date(year, month - 1, day, sleepHour, sleepMinute);
  if (end <= start) end = new Date(year, month - 1, day + 1, sleepHour, sleepMinute);
  const result: Date[] = [];
  for (let time = start.getTime(); time < end.getTime(); time += interval * 60 * 60 * 1000) result.push(new Date(time));
  return result;
}

export function HydrationDashboard() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [days, setDays] = useState<DayLog[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [customAmount, setCustomAmount] = useState("250");
  const [customName, setCustomName] = useState("Water");
  const [editing, setEditing] = useState<Drink | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    setSelectedDate(localDateString());
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (validData(parsed)) {
          setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
          setDays(parsed.days);
        }
      }
    } catch (error) {
      console.warn("Unable to restore NutriBase hydration data:", error);
      setStorageError("Hydration history could not be read from this browser.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, days }));
      setStorageError("");
    } catch (error) {
      console.warn("Unable to save NutriBase hydration data:", error);
      setStorageError("Hydration data could not be saved. Check available browser storage.");
    }
  }, [days, loaded, settings]);

  const today = localDateString();
  const selectedLog = days.find((day) => day.date === selectedDate);
  const drinks = selectedLog?.drinks ?? [];
  const total = drinks.reduce((sum, drink) => sum + drink.amount, 0);
  const remaining = Math.max(0, settings.goal - total);
  const progress = settings.goal > 0 ? Math.min(100, Math.round(total / settings.goal * 100)) : 0;
  const nextReminder = useMemo(() => {
    if (!settings.remindersEnabled || settings.remindersPaused || (total >= settings.goal && !settings.continueAfterGoal)) return undefined;
    const now = new Date();
    const times = scheduleTimes(localDateString(), settings.wake, settings.sleep, settings.interval);
    return times.find((time) => time > now);
  }, [settings, total]);
  const history = [...days].filter((day) => day.date !== today).sort((a, b) => b.date.localeCompare(a.date));

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };
  const addDrink = (amount: number, name = "Water") => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    const date = selectedDate || today;
    setDays((current) => {
      const found = current.find((day) => day.date === date);
      const drink = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, amount: Math.round(amount), time: new Date().toISOString() };
      return found
        ? current.map((day) => day.date === date ? { ...day, drinks: [...day.drinks, drink] } : day)
        : [...current, { date, drinks: [drink] }];
    });
  };
  const updateDrink = (id: string, update: Partial<Drink>) => {
    setDays((current) => current.map((day) => day.date === selectedDate ? { ...day, drinks: day.drinks.map((drink) => drink.id === id ? { ...drink, ...update } : drink) } : day));
    setEditing(null);
  };
  const removeDrink = (id: string) => setDays((current) => current.map((day) => day.date === selectedDate ? { ...day, drinks: day.drinks.filter((drink) => drink.id !== id) } : day));
  const shiftDate = (offset: number) => {
    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() + offset);
    setSelectedDate(localDateString(date));
  };
  const shortDate = (date: string) => new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-7 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
              <Droplets className="h-3.5 w-3.5" /> Daily hydration
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Water &amp; fluid tracker</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Track water and other drinks toward your personal daily fluid goal.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => shiftDate(-1)} aria-label="Previous day" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><ArrowDown className="h-4 w-4" /></button>
            <span className="min-w-24 text-center text-sm font-bold text-slate-700 dark:text-slate-200">{(selectedDate || today) === today ? "Today" : shortDate(selectedDate || today)}</span>
            <button type="button" disabled={selectedDate >= today} onClick={() => shiftDate(1)} aria-label="Next day" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><ArrowUp className="h-4 w-4" /></button>
          </div>
        </header>

        {storageError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{storageError}</p>}

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-48 w-48 shrink-0" role="img" aria-label={`${progress}% of fluid goal completed`}>
                <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${progress * 4.27} 427`} className="text-sky-500 transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Droplets className="mb-1 h-5 w-5 text-sky-500" />
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{progress}%</span>
                  <span className="text-xs text-slate-500">of daily goal</span>
                </div>
              </div>
              <div className="w-full flex-1 space-y-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Total fluid consumed</p><p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{total.toLocaleString()} <span className="text-base font-semibold text-slate-400">ml</span></p></div>
                  <div className="text-right"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Daily goal</p><label className="mt-1 flex items-baseline justify-end gap-1"><input aria-label="Daily fluid goal in milliliters" type="number" min="1" step="50" value={settings.goal} onChange={(event) => updateSetting("goal", Math.max(1, Number(event.target.value) || 1))} className="w-24 border-0 bg-transparent p-0 text-right text-xl font-black text-slate-800 outline-none focus:ring-0 dark:text-white" /><span className="text-sm text-slate-400">ml</span></label></div>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-950/40">
                  <p className="text-xs font-bold text-sky-900 dark:text-sky-200">Fluid remaining</p>
                  <p className="mt-1 text-2xl font-black text-sky-700 dark:text-sky-300">{remaining.toLocaleString()} ml</p>
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Progress includes <strong>all logged beverages</strong>, not water alone. This general goal can be adjusted to your preference.</p>
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"><Clock3 className="h-4 w-4 text-sky-500" />{nextReminder ? `Next planned reminder: ${formatClock(nextReminder)}` : settings.remindersPaused ? "Reminders are paused" : total >= settings.goal && !settings.continueAfterGoal ? "Daily goal reached — reminders stopped" : "No more reminder times today"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
            <div className="flex items-center gap-2"><GlassWater className="h-5 w-5 text-sky-600" /><h2 className="text-lg font-black text-slate-900 dark:text-white">Quick add a drink</h2></div>
            <p className="mt-1 text-xs text-slate-500">Quick buttons log water. Use custom entry for other beverages.</p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {QUICK_AMOUNTS.map((amount) => <button key={amount} type="button" disabled={selectedDate !== today} onClick={() => addDrink(amount)} className="rounded-xl border border-sky-100 bg-sky-50 px-2 py-3 text-sm font-bold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100 disabled:opacity-50 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200 dark:hover:bg-sky-900/60"><Plus className="mr-1 inline h-3.5 w-3.5" />{amount} ml</button>)}
            </div>
            <form className="mt-4 grid grid-cols-[1fr_1fr_auto] gap-2" onSubmit={(event) => { event.preventDefault(); addDrink(Number(customAmount), customName); }}>
              <label className="sr-only" htmlFor="drink-name">Beverage name</label>
              <input id="drink-name" value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Drink" className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
              <label className="sr-only" htmlFor="drink-amount">Volume in milliliters</label>
              <input id="drink-amount" type="number" min="1" step="10" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder="ml" className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
              <button type="submit" disabled={selectedDate !== today} className="rounded-xl bg-brand-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50">Add</button>
            </form>
            {selectedDate !== today && <p className="mt-3 text-xs text-slate-500">Past days are read-only.</p>}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="text-lg font-black text-slate-900 dark:text-white">Beverage history</h2><p className="mt-1 text-xs text-slate-500">{shortDate(selectedDate || today)} · {drinks.length} {drinks.length === 1 ? "drink" : "drinks"}</p></div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{total.toLocaleString()} ml</span>
            </div>
            {drinks.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">No drinks logged for this day yet.</div> : <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {[...drinks].sort((a, b) => b.time.localeCompare(a.time)).map((drink) => <li key={drink.id} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300"><GlassWater className="h-4 w-4" /></span>
                {editing?.id === drink.id ? <div className="flex min-w-0 flex-1 gap-2">
                  <input aria-label="Edit beverage name" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800" />
                  <input aria-label="Edit beverage volume in milliliters" type="number" min="1" value={editing.amount} onChange={(event) => setEditing({ ...editing, amount: Number(event.target.value) })} className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800" />
                  <button type="button" onClick={() => updateDrink(drink.id, { name: editing.name.trim() || "Drink", amount: Math.max(1, Math.round(editing.amount)) })} className="text-xs font-bold text-brand-700">Save</button>
                </div> : <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{drink.name}</p><p className="text-[11px] text-slate-400">{formatClock(new Date(drink.time))}</p></div>}
                {editing?.id !== drink.id && <span className="text-sm font-black text-slate-700 dark:text-slate-200">{drink.amount} ml</span>}
                {selectedDate === today && editing?.id !== drink.id && <button type="button" onClick={() => setEditing(drink)} aria-label={`Edit ${drink.name}`} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Edit</button>}
                {selectedDate === today && editing?.id !== drink.id && <button type="button" onClick={() => removeDrink(drink.id)} aria-label={`Delete ${drink.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"><Trash2 className="h-4 w-4" /></button>}
              </li>)}
            </ul>}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-brand-600" /><h2 className="text-lg font-black text-slate-900 dark:text-white">Reminder schedule</h2></div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">Plan reminders around your own waking hours. Times are calculated locally and avoid your configured sleep hours.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Wake time<input type="time" value={settings.wake} onChange={(event) => updateSetting("wake", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800" /></label>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Sleep time<input type="time" value={settings.sleep} onChange={(event) => updateSetting("sleep", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800" /></label>
            </div>
            <label className="mt-3 block text-xs font-bold text-slate-600 dark:text-slate-300">Reminder interval
              <select value={settings.interval} onChange={(event) => updateSetting("interval", Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"><option value={1}>Every 1 hour</option><option value={2}>Every 2 hours</option><option value={3}>Every 3 hours</option></select>
            </label>
            <label className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span>Continue reminders after goal is reached</span><input type="checkbox" checked={settings.continueAfterGoal} onChange={(event) => updateSetting("continueAfterGoal", event.target.checked)} className="h-4 w-4 accent-brand-600" />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {!settings.remindersEnabled ? <button type="button" onClick={() => updateSetting("remindersEnabled", true)} className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white">Enable reminders</button> : <button type="button" onClick={() => updateSetting("remindersEnabled", false)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">Disable</button>}
              {settings.remindersEnabled && <button type="button" onClick={() => updateSetting("remindersPaused", !settings.remindersPaused)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:text-slate-300">{settings.remindersPaused ? "Resume schedule" : "Pause schedule"}</button>}
            </div>
            <p className="mt-3 inline-flex items-start gap-2 text-[11px] leading-relaxed text-slate-400"><AlarmClock className="mt-0.5 h-3.5 w-3.5 shrink-0" />Scheduled times are shown in the app. Notifications and background delivery are not enabled; no alarms run while the app is closed.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black text-slate-900 dark:text-white">Daily timeline</h2><p className="text-xs text-slate-500">Planned times based on your waking schedule and interval.</p></div><Minus className="h-4 w-4 text-slate-300" /></div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {scheduleTimes(selectedDate || today, settings.wake, settings.sleep, settings.interval).map((time) => <div key={time.toISOString()} className={`min-w-24 rounded-xl border px-3 py-2 text-center ${time <= new Date() && selectedDate === today ? "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-900 dark:bg-brand-950/40 dark:text-brand-200" : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800"}`}><p className="text-xs font-bold">{formatClock(time)}</p><p className="mt-1 text-[10px]">{settings.interval}h interval</p></div>)}
            {scheduleTimes(selectedDate || today, settings.wake, settings.sleep, settings.interval).length === 0 && <p className="text-xs text-slate-400">No planned time in this interval.</p>}
          </div>
        </section>

        {history.length > 0 && <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Previous days</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{history.map((day) => {
            const amount = day.drinks.reduce((sum, drink) => sum + drink.amount, 0);
            return <button key={day.date} type="button" onClick={() => setSelectedDate(day.date)} className={`rounded-2xl border bg-white p-4 text-left transition hover:border-sky-300 dark:bg-slate-900 ${selectedDate === day.date ? "border-sky-400 ring-2 ring-sky-100 dark:ring-sky-950" : "border-slate-200 dark:border-slate-700"}`}><div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-800 dark:text-slate-100">{shortDate(day.date)}</span><span className="text-xs font-bold text-sky-700 dark:text-sky-300">{amount.toLocaleString()} ml</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(100, amount / settings.goal * 100)}%` }} /></div><p className="mt-1.5 text-[10px] text-slate-400">{day.drinks.length} drinks · {Math.min(100, Math.round(amount / settings.goal * 100))}% of current goal</p></button>;
          })}</div>
        </section>}
      </div>
    </div>
  );
}
