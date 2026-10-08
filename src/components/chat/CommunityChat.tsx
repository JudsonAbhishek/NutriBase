"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Reply, Send, Smile, Users, X } from "lucide-react";

type ChatMessage = {
  id: string;
  displayName: string;
  message: string;
  createdAt: string;
  replyToId: string | null;
  replyToName: string | null;
  replyToMessage: string | null;
};

const NAME_STORAGE_KEY = "nutribase_chat_name";
const MESSAGES_STORAGE_KEY = "nutribase_live_chat_messages";
const CHAT_CHANNEL_NAME = "nutribase_live_chat";
const EMOJIS = ["😀", "😂", "😍", "🙌", "💪", "🔥", "🥗", "🍎", "❤️", "👏", "😋", "💡"];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readMessages() {
  try {
    const stored = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ChatMessage[]).slice(-50) : [];
  } catch {
    return [];
  }
}

export function CommunityChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    setMessages(readMessages());
    setDisplayName(window.localStorage.getItem(NAME_STORAGE_KEY) || "");

    if (typeof window.BroadcastChannel === "function") {
      const channel = new BroadcastChannel(CHAT_CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<ChatMessage[]>) => setMessages(event.data.slice(-50));
      channelRef.current = channel;
      return () => channel.close();
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === MESSAGES_STORAGE_KEY) setMessages(readMessages());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const publishMessages = (nextMessages: ChatMessage[]) => {
    const trimmedMessages = nextMessages.slice(-50);
    setMessages(trimmedMessages);
    window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(trimmedMessages));
    channelRef.current?.postMessage(trimmedMessages);
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = displayName.trim();
    const cleanMessage = draft.trim();
    if (cleanName.length < 2 || !cleanMessage || loading) return;

    setLoading(true);
    const nextMessage: ChatMessage = {
      id: createMessageId(),
      displayName: cleanName,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      replyToId: replyingTo?.id || null,
      replyToName: replyingTo?.displayName || null,
      replyToMessage: replyingTo?.message || null,
    };

    publishMessages([...messages, nextMessage]);
    window.localStorage.setItem(NAME_STORAGE_KEY, cleanName);
    setDraft("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-3 z-[60] sm:bottom-20 sm:right-6 lg:bottom-6">
      {open && (
        <section
          className="mb-3 flex h-[min(540px,calc(100vh-9rem))] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/50 sm:h-[min(540px,calc(100vh-8rem))] sm:w-[min(380px,calc(100vw-2rem))]"
          aria-label="Community chat"
        >
          <header className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2"><Users className="h-5 w-5" /></div>
              <div>
                <h2 className="text-sm font-black">Live Community Chat</h2>
                <p className="text-[11px] text-emerald-100">Live in this browser</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                Start a general discussion about food, health, or NutriBase.
              </div>
            ) : (
              messages.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-xs font-black text-emerald-700 dark:text-emerald-300">{item.displayName}</strong>
                    <time className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                  </div>
                  {item.replyToName && item.replyToMessage && (
                    <div className="mt-2 rounded-lg border-l-2 border-emerald-400 bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">Replying to {item.replyToName}</span>
                      <p className="truncate">{item.replyToMessage}</p>
                    </div>
                  )}
                  <p className="mt-1.5 break-words text-xs leading-relaxed text-slate-700 dark:text-slate-200">{item.message}</p>
                  <button
                    type="button"
                    onClick={() => { setReplyingTo(item); setShowEmojiPicker(false); }}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 transition hover:text-emerald-600 dark:hover:text-emerald-300"
                    aria-label={`Reply to ${item.displayName}`}
                  >
                    <Reply className="h-3 w-3" /> Reply
                  </button>
                </article>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="space-y-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            {replyingTo && (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-[11px] dark:bg-emerald-950/40">
                <span className="truncate text-emerald-800 dark:text-emerald-200">Replying to <strong>{replyingTo.displayName}</strong>: {replyingTo.message}</span>
                <button type="button" onClick={() => setReplyingTo(null)} className="ml-2 shrink-0 text-emerald-700 hover:text-rose-600" aria-label="Cancel reply"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={40}
              placeholder="Your display name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="flex gap-2">
              <div className="relative">
                <button type="button" onClick={() => setShowEmojiPicker((current) => !current)} className="h-full rounded-xl border border-slate-200 px-2.5 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" aria-label="Add emoji">
                  <Smile className="h-4 w-4" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-10 grid w-48 grid-cols-6 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    {EMOJIS.map((emoji) => (
                      <button key={emoji} type="button" onClick={() => { setDraft((current) => `${current}${emoji}`); setShowEmojiPicker(false); }} className="rounded-lg p-1.5 text-lg hover:bg-emerald-50 dark:hover:bg-slate-700" aria-label={`Add ${emoji}`}>{emoji}</button>
                    ))}
                  </div>
                )}
              </div>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={500}
                placeholder="Join the discussion..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button type="submit" disabled={loading || displayName.trim().length < 2 || !draft.trim()} className="rounded-xl bg-emerald-600 px-3 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">Messages are saved locally and sync across your open NutriBase tabs.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-700"
        aria-label={open ? "Close community chat" : "Open community chat"}
      >
        <MessageCircle className="h-5 w-5 transition group-hover:rotate-12" />
        <span className="hidden sm:inline">Community chat</span>
      </button>
    </div>
  );
}
