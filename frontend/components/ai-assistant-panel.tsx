"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, Loader2, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── PROMPT CHIPS ────────────────────────────────────────── */
const prompts = [
  "Summarize revenue for June",
  "Forecast inventory for Q3",
  "List overdue invoices",
  "Detect anomalies in sales",
  "Top 5 customers by spend",
];

/* ── MOCK RESPONSES ──────────────────────────────────────── */
const mockResponses: Record<string, string> = {
  "Summarize revenue for June":
    "📊 **June Revenue Summary**\n\nTotal Revenue: **$124,650** (+12.5% MoM)\nGross Profit: **$48,230** (38.7% margin)\nTop Category: Electronics ($42,000)\n\nRevenue is tracking 8% above monthly target. Strong performance from Laptops and Monitors categories.",
  "Forecast inventory for Q3":
    "📦 **Q3 Inventory Forecast**\n\nBased on current trends:\n• Laptops: Reorder 80 units by Jul 15\n• Office Chairs: Stock sufficient through Aug\n• Monitors: High demand expected (+34%)\n\nRecommended reorder budget: **$68,000**",
  "List overdue invoices":
    "📋 **Overdue Invoices (5 total)**\n\n• #INV-198 — Globex Industries — $3,200 (15 days)\n• #INV-201 — Wayne Corp — $1,800 (9 days)\n• #INV-195 — Umbrella Ltd — $4,500 (22 days)\n• #INV-189 — Stark Inc — $2,100 (31 days)\n• #INV-183 — Acme Corp — $890 (45 days)\n\nTotal Outstanding: **$12,490**",
  "Detect anomalies in sales":
    "🔍 **Anomaly Detection Report**\n\n⚠️ **2 anomalies detected:**\n\n1. Unusual spike in cancellations (+340%) on Jun 18 — possible checkout issue\n2. Product 'Office Chair Pro' showing 0 sales for 12 days — verify listing\n\nAll other metrics are within normal ranges.",
  "Top 5 customers by spend":
    "👥 **Top 5 Customers — June**\n\n1. Acme Corporation — **$18,450**\n2. Stark Enterprises — **$14,200**\n3. Wayne Industries — **$11,800**\n4. Globex Corp — **$9,350**\n5. Umbrella Ltd — **$7,640**\n\nCombined: **$61,440** (49.3% of total revenue)",
};

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  ts: string;
};

/* ── AI ASSISTANT PANEL ──────────────────────────────────── */
export default function AiAssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "👋 Hi! I'm your ERP AI Assistant. Ask me anything about your business data — revenue, inventory, customers, forecasts, or anomalies.",
      ts: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1400));

    const response =
      mockResponses[text.trim()] ??
      `I found relevant data for "${text.trim()}". Based on current business metrics, I can see positive trends. Would you like me to generate a detailed report or export this data?`;

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: response,
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] overflow-hidden"
      style={{ boxShadow: "var(--erp-shadow)", height: "420px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[--erp-border] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">AI Assistant</p>
            <p className="text-[10px] text-emerald-400">Online · Ready</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
            GPT-4o
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "")}
            >
              {/* Avatar */}
              <div className={cn(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                msg.role === "ai"
                  ? "bg-gradient-to-br from-cyan-500 to-indigo-600"
                  : "bg-gradient-to-br from-slate-600 to-slate-700"
              )}>
                {msg.role === "ai" ? <Sparkles className="h-3 w-3 text-white" /> : "DA"}
              </div>

              {/* Bubble */}
              <div className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                msg.role === "ai"
                  ? "bg-white/[0.05] border border-[--erp-border] text-white/80"
                  : "bg-gradient-to-br from-cyan-500 to-indigo-600 text-white"
              )}>
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line.startsWith("**") && line.endsWith("**")
                      ? <strong>{line.slice(2, -2)}</strong>
                      : line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
                <div className={cn(
                  "mt-1 text-[9px]",
                  msg.role === "ai" ? "text-white/25" : "text-white/50"
                )}>
                  {msg.ts}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/[0.05] border border-[--erp-border] px-3.5 py-2.5">
                <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                <span className="text-xs text-white/50">Analyzing data...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Prompt chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            className="flex-shrink-0 rounded-full border border-[--erp-border] bg-white/[0.03] px-3 py-1 text-[11px] text-white/50 hover:border-cyan-400/30 hover:text-cyan-300 transition-all whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-[--erp-border] px-4 py-3 flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask anything about your business..."
          className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white disabled:opacity-30 hover:opacity-90 transition-opacity shadow-lg"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
