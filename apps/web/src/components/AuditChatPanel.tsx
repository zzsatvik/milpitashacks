import { useEffect, useRef, useState } from "react";
import type { AuditInsights, ChatMessage, LawnAnalysis } from "@terraview/shared";
import { sendChatMessage } from "../lib/auditFeatures";
import { useMockMode } from "../lib/env";
import { mockChatReply } from "../lib/mockFeatures";
import { Close, Idea } from "./Icons";

interface AuditChatPanelProps {
  analysis: LawnAnalysis;
  zipCode?: string;
  insights: AuditInsights | null;
  open: boolean;
  onClose: () => void;
}

const STARTERS = [
  "Which swap should I do first if I only have $500?",
  "What if I want to keep some grass for my dog?",
  "What's the best time of year to start in my ZIP?",
];

export function AuditChatPanel({
  analysis,
  zipCode,
  insights,
  open,
  onClose,
}: AuditChatPanelProps) {
  const USE_MOCK = useMockMode();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I've got your full audit loaded. Ask me about priorities, budget, pets, rebates, or anything about your yard plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      let reply: string;
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        reply = mockChatReply(trimmed);
      } else {
        reply = await sendChatMessage(
          analysis,
          nextMessages.slice(1),
          zipCode,
          insights,
        );
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't respond: ${err instanceof Error ? err.message : "unknown error"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed bottom-0 right-0 z-50 flex h-[min(640px,92vh)] w-full max-w-md flex-col border-l border-t border-white/10 bg-forest-950/95 shadow-2xl sm:bottom-6 sm:right-6 sm:h-[560px] sm:rounded-3xl sm:border">
        <header className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="flex items-center gap-2">
            <Idea size={18} className="text-glow-400" strokeWidth={1.6} />
            <div>
              <p className="font-display text-base text-forest-50">Terraview advisor</p>
              <p className="font-mono-data text-[9px] uppercase tracking-wider text-forest-100/40">
                Audit context loaded
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="glass-subtle inline-flex h-8 w-8 items-center justify-center rounded-full text-forest-100/60"
            aria-label="Close chat"
          >
            <Close size={14} />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-glow-400/15 text-forest-50 border border-glow-400/25"
                    : "bg-white/[0.04] text-forest-100/80 border border-white/6"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-forest-100/45 animate-pulse">Thinking…</div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-forest-100/65 transition hover:border-glow-400/25 hover:text-glow-300"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="border-t border-white/8 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about swaps, budget, plants…"
              className="glass-subtle flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-forest-50 outline-none focus:border-glow-400/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-glow-400 px-4 py-2.5 text-sm font-semibold text-forest-950 disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export function AuditChatFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-glow-400/30 bg-forest-950/90 px-4 py-3 text-sm font-medium text-glow-300 shadow-lg backdrop-blur-xl transition hover:border-glow-400/50 hover:bg-glow-400/10 sm:left-auto sm:right-6"
    >
      <Idea size={16} strokeWidth={1.8} />
      Ask Terraview
    </button>
  );
}
