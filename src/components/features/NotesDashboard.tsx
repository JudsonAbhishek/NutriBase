"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckSquare,
  Clock3,
  FileText,
  ListFilter,
  Plus,
  Search,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";

type NoteItem = { id: string; text: string; done: boolean };
type Note = {
  id: string;
  title: string;
  text: string;
  kind: "text" | "checklist";
  items: NoteItem[];
  createdAt: string;
  updatedAt: string;
  reminderAt: string;
  reminderDone: boolean;
};
type Filter = "all" | "notes" | "pending" | "completed";

const STORAGE_KEY = "nutribase_notes_v1";
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function isNoteList(value: unknown): value is Note[] {
  return Array.isArray(value) && value.every((note) =>
    typeof note.id === "string" &&
    typeof note.title === "string" &&
    (note.kind === "text" || note.kind === "checklist") &&
    Array.isArray(note.items)
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function isComplete(note: Note) {
  return note.kind === "checklist" && note.items.length > 0 && note.items.every((item) => item.done);
}

export function NotesDashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Note | null>(null);
  const [newItem, setNewItem] = useState("");
  const [remindersPaused, setRemindersPaused] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isNoteList(parsed)) setNotes(parsed);
      }
      setRemindersPaused(localStorage.getItem("nutribase_notes_reminders_paused") === "true");
    } catch (error) {
      console.warn("Unable to restore NutriBase notes:", error);
      setStorageError("Saved notes could not be read from this browser.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("nutribase_notes_reminders_paused", String(remindersPaused));
    } catch (error) {
      console.warn("Unable to save NutriBase reminder preference:", error);
      setStorageError("Reminder preference could not be saved in this browser.");
    }
  }, [loaded, remindersPaused]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setStorageError("");
    } catch (error) {
      console.warn("Unable to save NutriBase notes:", error);
      setStorageError("Notes could not be saved. Check available browser storage.");
    }
  }, [loaded, notes]);

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return notes.filter((note) => {
      const searchable = `${note.title} ${note.text} ${note.items.map((item) => item.text).join(" ")}`.toLocaleLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (filter === "notes") return note.kind === "text";
      if (filter === "pending") return note.kind === "checklist" && !isComplete(note);
      if (filter === "completed") return note.kind === "checklist" && isComplete(note);
      return true;
    }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filter, notes, search]);

  const saveNote = () => {
    if (!editing) return;
    const title = editing.title.trim();
    const text = editing.text.trim();
    const items = editing.items.filter((item) => item.text.trim());
    if (!title && !text && items.length === 0 && !editing.reminderAt) {
      setEditing(null);
      return;
    }
    const saved: Note = { ...editing, title, text, items, updatedAt: new Date().toISOString() };
    setNotes((current) => {
      const exists = current.some((note) => note.id === saved.id);
      return exists ? current.map((note) => note.id === saved.id ? saved : note) : [saved, ...current];
    });
    setEditing(null);
    setNewItem("");
  };

  const startNote = (kind: Note["kind"]) => {
    const now = new Date().toISOString();
    setNewItem("");
    setEditing({ id: createId(), title: "", text: "", kind, items: [], createdAt: now, updatedAt: now, reminderAt: "", reminderDone: false });
  };

  const patchEditing = (update: Partial<Note>) => setEditing((current) => current ? { ...current, ...update } : current);
  const addItem = () => {
    const text = newItem.trim();
    if (!text || !editing) return;
    patchEditing({ items: [...editing.items, { id: createId(), text, done: false }] });
    setNewItem("");
  };
  const updateItem = (id: string, update: Partial<NoteItem>) => {
    if (!editing) return;
    patchEditing({ items: editing.items.map((item) => item.id === id ? { ...item, ...update } : item) });
  };
  const moveItem = (index: number, offset: number) => {
    if (!editing) return;
    const target = index + offset;
    if (target < 0 || target >= editing.items.length) return;
    const items = [...editing.items];
    [items[index], items[target]] = [items[target], items[index]];
    patchEditing({ items });
  };

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "notes", label: "Notes" },
    { value: "pending", label: "To-do" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl space-y-7 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
              <StickyNote className="h-3.5 w-3.5" /> Your personal workspace
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Notes &amp; to-do lists</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Keep quick notes, organize checklists, and attach reminders in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => startNote("text")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700">
              <Plus className="h-4 w-4" /> Add note
            </button>
            <button type="button" onClick={() => startNote("checklist")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <CheckSquare className="h-4 w-4 text-brand-600" /> Checklist
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input aria-label="Search notes and tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes and tasks..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <div role="group" aria-label="Filter notes" className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            {filters.map((option) => <button key={option.value} type="button" aria-pressed={filter === option.value} onClick={() => setFilter(option.value)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold ${filter === option.value ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{option.label}</button>)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ListFilter className="h-3.5 w-3.5" /> Saved in this browser · {notes.length} {notes.length === 1 ? "item" : "items"}
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 sm:flex-row sm:items-center dark:border-amber-900/60 dark:bg-amber-950/30">
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            <strong>{remindersPaused ? "Reminders paused." : "Reminders active."}</strong> Reminder dates stay saved; browser notifications are not enabled.
          </p>
          <button type="button" onClick={() => setRemindersPaused((paused) => !paused)} className="shrink-0 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800">
            {remindersPaused ? "Resume reminders" : "Pause reminders"}
          </button>
        </div>
        {storageError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{storageError}</p>}

        {visibleNotes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <FileText className="mx-auto h-9 w-9 text-slate-300" />
            <h2 className="mt-4 font-bold text-slate-800 dark:text-white">{search || filter !== "all" ? "No matching notes" : "Your workspace is ready"}</h2>
            <p className="mt-1 text-sm text-slate-500">Create a note or checklist to get started.</p>
          </div>
        ) : (
          <section aria-label="Your notes" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleNotes.map((note) => {
              const complete = isComplete(note);
              return (
                <article key={note.id} className={`group rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-900 ${complete ? "border-emerald-200 dark:border-emerald-900" : "border-slate-200 dark:border-slate-700"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {note.kind === "checklist" ? <CheckSquare className="h-4 w-4 shrink-0 text-brand-600" /> : <FileText className="h-4 w-4 shrink-0 text-amber-500" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{note.kind === "checklist" ? "Checklist" : "Note"}</span>
                        {complete && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Done</span>}
                      </div>
                      <h2 className="break-words text-base font-bold text-slate-900 dark:text-white">{note.title || "Untitled"}</h2>
                    </div>
                    <details className="relative shrink-0">
                      <summary aria-label={`Options for ${note.title || "untitled note"}`} className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-full text-xl leading-none text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">⋯</summary>
                      <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <button type="button" onClick={() => { setNewItem(""); setEditing(note); }} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700">Edit note</button>
                        <button type="button" onClick={() => { setNewItem(""); setEditing(note); }} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700">Reminder settings</button>
                        <button type="button" onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">Delete</button>
                      </div>
                    </details>
                  </div>

                  {note.text && <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{note.text}</p>}
                  {note.kind === "checklist" && <ul className="mt-3 space-y-2">
                    {note.items.map((item) => <li key={item.id} className="flex items-start gap-2.5">
                      <input type="checkbox" aria-label={`Mark ${item.text} ${item.done ? "pending" : "complete"}`} checked={item.done} onChange={() => setNotes((current) => current.map((entry) => entry.id === note.id ? { ...entry, updatedAt: new Date().toISOString(), items: entry.items.map((row) => row.id === item.id ? { ...row, done: !row.done } : row) } : entry))} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600" />
                      <span className={`min-w-0 flex-1 break-words text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"}`}>{item.text}</span>
                    </li>)}
                  </ul>}
                  {note.reminderAt && <div className={`mt-4 flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold ${note.reminderDone ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"}`}>
                    <Bell className="h-3.5 w-3.5" /><span className="flex-1">{formatDate(note.reminderAt)}</span>
                    <button type="button" onClick={() => setNotes((current) => current.map((entry) => entry.id === note.id ? { ...entry, reminderDone: !entry.reminderDone } : entry))} className="rounded-md px-1.5 py-1 hover:bg-white/70 dark:hover:bg-slate-800">{note.reminderDone ? "Undo" : "Complete"}</button>
                  </div>}
                  <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400 dark:border-slate-800">
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> Updated {formatDate(note.updatedAt)}</span>
                    {note.kind === "checklist" && <span>{note.items.filter((item) => item.done).length}/{note.items.length} done</span>}
                  </footer>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {editing && <div role="presentation" className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="note-editor-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:rounded-3xl sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">{editing.kind === "checklist" ? "Checklist" : "Note"}</p>
              <h2 id="note-editor-title" className="text-xl font-black text-slate-900 dark:text-white">{notes.some((note) => note.id === editing.id) ? "Edit your note" : "Create a note"}</h2>
            </div>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close editor" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">Title
              <input autoFocus value={editing.title} onChange={(event) => patchEditing({ title: event.target.value })} placeholder="Title" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800" />
            </label>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">{editing.kind === "checklist" ? "Description (optional)" : "Note"}
              <textarea rows={editing.kind === "checklist" ? 2 : 5} value={editing.text} onChange={(event) => patchEditing({ text: event.target.value })} placeholder={editing.kind === "checklist" ? "Add a little context..." : "Write your note..."} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800" />
            </label>
            {editing.kind === "checklist" && <div>
              <p className="mb-2 text-xs font-bold text-slate-600 dark:text-slate-300">List items</p>
              <ul className="space-y-2">{editing.items.map((item, index) => <li key={item.id} className="flex items-center gap-2">
                <input type="checkbox" aria-label={`Mark ${item.text} complete`} checked={item.done} onChange={() => updateItem(item.id, { done: !item.done })} className="h-4 w-4 accent-emerald-600" />
                <input aria-label="Checklist item text" value={item.text} onChange={(event) => updateItem(item.id, { text: event.target.value })} className={`min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 ${item.done ? "text-slate-400 line-through" : ""}`} />
                <button type="button" aria-label="Move item up" disabled={index === 0} onClick={() => moveItem(index, -1)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">↑</button>
                <button type="button" aria-label="Move item down" disabled={index === editing.items.length - 1} onClick={() => moveItem(index, 1)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">↓</button>
                <button type="button" aria-label={`Delete ${item.text}`} onClick={() => patchEditing({ items: editing.items.filter((entry) => entry.id !== item.id) })} className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"><Trash2 className="h-4 w-4" /></button>
              </li>)}</ul>
              <div className="mt-2 flex gap-2">
                <input aria-label="New checklist item" value={newItem} onChange={(event) => setNewItem(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addItem(); } }} placeholder="Add an item and press Enter" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
                <button type="button" onClick={addItem} className="rounded-xl border border-slate-200 px-3 text-sm font-bold text-brand-700 hover:bg-brand-50 dark:border-slate-700 dark:text-brand-300">Add</button>
              </div>
            </div>}
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200"><span className="mb-1.5 flex items-center gap-2"><Bell className="h-4 w-4 text-amber-500" /> Reminder date and time</span>
                <input type="datetime-local" value={editing.reminderAt} onChange={(event) => patchEditing({ reminderAt: event.target.value, reminderDone: false })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </label>
              {editing.reminderAt && <button type="button" onClick={() => patchEditing({ reminderAt: "", reminderDone: false })} className="mt-2 text-xs font-semibold text-rose-600 hover:underline">Remove reminder</button>}
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Reminder times are saved here for you to manage. Browser notifications and background alarms are not enabled.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
            <button type="button" onClick={saveNote} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"><Check className="h-4 w-4" /> Save</button>
          </div>
        </section>
      </div>}
    </div>
  );
}
