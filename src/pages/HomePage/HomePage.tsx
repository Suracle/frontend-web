import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu, Search, Bell, Send, Paperclip, FileText, Gavel, BookOpen,
  History, Star, Settings, Filter, Bookmark, ChevronRight, ChevronDown, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";


// --- Minimal mock types ---
type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  text: string;
  sources?: Source[];
  time?: string;
}
interface Source {
  id: string;
  type: "법령" | "판례" | "행정해석" | "기사";
  title: string;
  ref: string;
  snippet: string;
  score?: number; // relevance
}

// --- Color tokens (Tailwind classes) ---
// Primary: indigo-600, Surface: slate-50, Text: slate-800, Keylines: slate-200
// Accent for legal items: emerald-600 (ok), warning: amber-500

const mockSources: Source[] = [
  { id: "s1", type: "법령", title: "근로기준법 제60조(연차유급휴가)", ref: "법제처",
    snippet: "사용자는 1년간 80% 이상 출근한 근로자에게 15일의 유급휴가를 주어야 한다...", score: 0.93 },
  { id: "s2", type: "판례", title: "대법원 2012다00000 (연차수당)", ref: "대법원 종합법률정보",
    snippet: "연차휴가 미사용수당은 임금에 해당하며, 단체협약으로 포기하게 할 수 없다...", score: 0.87 },
  { id: "s3", type: "행정해석", title: "고용노동부 임금체불 질의회시(2019)", ref: "고용노동부",
    snippet: "연차휴가의 발생 시점은 근로계약 체결 후 1년 경과 시로 보아야 하며...", score: 0.78 },
];

export default function HomePage() {
  // ✅ 홈: 초기 메시지 비움
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  const [tab, setTab] = useState<"요약" | "쟁점" | "근거">("요약");
  const [resultFilter, setResultFilter] = useState<"전체" | "법령" | "판례" | "행정해석">("전체");

  // 🔎 상단 전역 검색 → /search 이동
  const [globalQuery, setGlobalQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const filteredSources = useMemo(() => {
    if (resultFilter === "전체") return mockSources;
    return mockSources.filter((s) => s.type === resultFilter);
  }, [resultFilter]);

  // 전송
  const send = () => {
    if (!input.trim()) return;
    const q: Message = { id: crypto.randomUUID(), role: "user", text: input, time: now() };
    setMessages((m) => [...m, q]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const a: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        time: now(),
        text: "질문 맥락 기준으로 관련 법령과 판례를 찾았어요. 회사의 사용촉진 여부와 재직기간, 취업규칙을 입력하면 더 정확해집니다.",
        sources: mockSources,
      };
      setMessages((m) => [...m, a]);
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }));
    }, 700);
  };

  // 단축키: Ctrl/⌘+Enter 전송, Ctrl/⌘+K 검색 포커스
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        send();
      }
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [input]);

  // 샘플 프롬프트
  const samples = ["연차수당 지급 기준", "경업금지 위약벌", "포괄임금 야근수당", "징계해고 절차"];

  return (
    <div className="h-full w-full text-slate-900 dark:text-slate-100">
      {/* Content area */}
      <div className="flex-1 flex min-h-0">
        {/* Chat */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="px-4 md:px-8 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3">
            <Tabs value={tab} onChange={setTab} items={["요약", "쟁점", "근거"]} />
            <div className="ml-auto hidden md:flex items-center gap-2 text-xs">
              <Badge icon={<Gavel size={14} />} label="법률 자문 모드" color="indigo" />
              <Badge icon={<Bookmark size={14} />} label="익명화 활성" color="emerald" />
            </div>
          </div>

          {/* Empty hero when no messages */}
          {messages.length === 0 && !loading ? (
            <div className="flex-1 grid place-content-center text-center p-6">
              <div className="mx-auto h-12 w-12 rounded-2xl grid place-content-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">⚖️</div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">무엇이 궁금하신가요?</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">예: "연차휴가 미사용수당 지급 의무와 시효"</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {samples.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 h-9 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-800 dark:text-slate-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">단축키: <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">Ctrl/⌘+K</kbd> 검색 · <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">Ctrl/⌘+Enter</kbd> 전송</div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div ref={listRef} className="flex-1 overflow-auto p-4 md:p-8 space-y-4">
                {messages.map((m) => (
                  <Bubble key={m.id} role={m.role} time={m.time}>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    {m.role === "assistant" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Chip icon={<FileText size={14} />} label="요약" />
                        <Chip icon={<Gavel size={14} />} label="관련 법령" />
                        <Chip icon={<BookOpen size={14} />} label="판례" />
                      </div>
                    )}
                  </Bubble>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <Loader2 className="animate-spin" size={16} /> 작성 중…
                  </div>
                )}
              </div>
            </>
          )}

          {/* Composer */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 md:p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2">
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600" aria-label="파일 첨부"><Paperclip size={18} /></button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  placeholder="질문을 구체적으로 입력하세요. (사안, 시점, 당사자, 근로형태 등)"
                                     className="flex-1 resize-none rounded-2xl border border-slate-200 dark:border-slate-600 focus:border-slate-700 dark:focus:border-slate-600 focus:ring-slate-700/30 dark:focus:ring-slate-600/30 p-3 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") send();
                  }}
                />
                                 <button
                   onClick={send}
                   className="rounded-2xl px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition flex items-center gap-2"
                 >
                  <Send size={16} /> 전송
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <span className="hidden sm:inline">예시: "연차휴가 미사용수당 지급 의무와 시효"</span>
                <span className="ml-auto">출처 표시 · 참고용 답변 · 법률자문 아님</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right panel: Filters & Sources */}
                 <aside className="hidden lg:flex w-[360px] border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-col min-h-0">
          <button
            onClick={() => setOpenFilters((v) => !v)}
            className="h-12 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700"
          >
                         <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100"><Filter size={16} /> 결과 필터</div>
            {openFilters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="overflow-hidden transition-all duration-300 ease-in-out">
            {openFilters && (
              <div className="p-3 space-y-3">
                <SelectRow label="문서 유형">
                  <Pill active={resultFilter === "전체"} onClick={() => setResultFilter("전체")}>전체</Pill>
                  <Pill active={resultFilter === "법령"} onClick={() => setResultFilter("법령")}>법령</Pill>
                  <Pill active={resultFilter === "판례"} onClick={() => setResultFilter("판례")}>판례</Pill>
                  <Pill active={resultFilter === "행정해석"} onClick={() => setResultFilter("행정해석")}>행정해석</Pill>
                </SelectRow>
                                 <SelectRow label="관할·기간">
                   <input className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-600 px-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400" placeholder="대한민국 · 최근 10년" />
                 </SelectRow>
                 <SelectRow label="키워드">
                   <input className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-600 px-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400" placeholder="연차, 수당, 사용촉진" />
                </SelectRow>
              </div>
            )}
          </div>

          <div className="px-4 py-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">근거 자료</div>
          <div className="flex-1 overflow-auto p-3 space-y-3">
            {filteredSources.map((s) => (
              <SourceCard key={s.id} source={s} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------- UI atoms ------- */
function Tabs({ value, onChange, items }: { value: string; onChange: (v: any) => void; items: string[] }) {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      {items.map((it) => (
        <button
          key={it}
          onClick={() => onChange(it as any)}
          className={
            "px-3 h-8 rounded-lg text-sm transition " +
            (value === it ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100")
          }
        >
          {it}
        </button>
      ))}
    </div>
  );
}

function Badge({ icon, label, color = "indigo" }: { icon?: React.ReactNode; label: string; color?: "indigo" | "emerald" | "amber" }) {
  const cls = { 
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400", 
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400", 
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" 
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 h-7 rounded-full text-xs ${cls}`}>
      {icon}
      {label}
    </span>
  );
}

function Bubble({ role, children, time }: { role: Role; children: React.ReactNode; time?: string }) {
  const me = role === "user";
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      {!me && <div className="mr-2 mt-1 h-8 w-8 rounded-full bg-[#1E3A8A] text-white text-xs flex items-center justify-center">AI</div>}
      <div className={`max-w-[85%] sm:max-w-[720px] rounded-2xl px-4 py-3 shadow-sm border text-sm ${me ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"}`}>
        {children}
        {time && <div className={`mt-1 text-[11px] ${me ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>{time}</div>}
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 h-7 text-xs text-slate-600 dark:text-slate-400">
      {icon}
      {label}
    </span>
  );
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-full text-sm border transition ${
                 active ? "bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function SelectRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SourceCard({ source }: { source: Source }) {
  const color = source.type === "법령" ? "indigo" : source.type === "판례" ? "emerald" : "amber";
  const chipCls = { 
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400", 
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400", 
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" 
  }[
    color as "indigo" | "emerald" | "amber"
  ];

  return (
         <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-3 hover:shadow-sm transition bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <div className={`text-[11px] px-2 py-1 rounded-full ${chipCls}`}>{source.type}</div>
        {source.score && <div className="text-[11px] text-slate-500 dark:text-slate-400">관련도 {(source.score * 100).toFixed(0)}%</div>}
      </div>
             <div className="mt-2 font-medium text-sm leading-5 line-clamp-2 text-slate-900 dark:text-slate-100">{source.title}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{source.ref}</div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{source.snippet}</div>
             <button className="mt-2 text-xs text-slate-700 dark:text-slate-400 hover:underline">원문 열기</button>
    </div>
  );
}

function now() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
