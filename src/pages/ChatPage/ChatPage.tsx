import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Input,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Separator,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Switch,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Label
} from "@/components/ui"; // adjust to your shadcn barrel setup
import { cn } from "@/lib/utils";
import { Gavel, Paperclip, Send, Filter, Search, Loader2, Link as LinkIcon } from "lucide-react";

/**
 * Q&A Chatbot Page — Responsive / Tailwind + shadcn/ui
 * Palette
 *  - Primary: #1E3A8A (indigo-900)
 *  - Secondary: #3B82F6 (blue-500)
 *  - Accent: #F59E0B (amber-500)
 */

type Role = "user" | "assistant";
type SourceType = "법령" | "판례" | "행정해석";

interface Sentence {
  id: string;
  text: string;
  sourceIds: string[]; // sentence-level grounding
}
interface Source {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  snippet: string;
  score?: number; // relevance 0..1
}
interface ChatTurn {
  id: string;
  role: Role;
  time: string;
  content?: string; // for user or simple assistant
  sentences?: Sentence[]; // assistant structured
}

// --- Mock data ---
const MOCK_SOURCES: Source[] = [
  { id: "s1", type: "법령", title: "근로기준법 제60조(연차유급휴가)", url: "#", snippet: "1년간 80% 이상 출근한 근로자에게 15일의 유급휴가...", score: 0.93 },
  { id: "s2", type: "판례", title: "대법원 2012다00000 — 연차수당", url: "#", snippet: "연차휴가 미사용수당은 임금에 해당하며...", score: 0.86 },
  { id: "s3", type: "행정해석", title: "고용노동부 질의회시(2019)", url: "#", snippet: "연차휴가 발생 시점은 근로계약 체결 후 1년 경과...", score: 0.78 },
];

const INITIAL_TURNS: ChatTurn[] = [
  { id: "u1", role: "user", time: now(), content: "연차휴가를 다 못 쓰면 수당으로 받을 수 있나요? 스타트업 근무 중입니다." },
  {
    id: "a1",
    role: "assistant",
    time: now(),
    sentences: [
      { id: "a1s1", text: "원칙적으로 미사용 연차는 수당으로 보상됩니다.", sourceIds: ["s1", "s2"] },
      { id: "a1s2", text: "다만 사용촉진 절차를 회사가 적법하게 이행했다면 예외가 생길 수 있어요.", sourceIds: ["s2"] },
      { id: "a1s3", text: "재직기간, 취업규칙, 발생시점에 따라 계산 방식이 달라지므로 구체 정보가 필요합니다.", sourceIds: ["s3"] },
    ],
  },
];

export default function ChatPageResponsive() {
  // chat state
  const [turns, setTurns] = useState<ChatTurn[]>(INITIAL_TURNS);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState("요약"); // "요약" | "쟁점" | "근거"
  const [anonymize, setAnonymize] = useState(true);

  // right panel filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [resultType, setResultType] = useState<"전체" | SourceType>("전체");
  const [keyword, setKeyword] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // auto scroll to bottom
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns, streaming]);



  const [highlightSources, setHighlightSources] = useState<Set<string>>(new Set());

  function send() {
    if (!input.trim()) return;
    const userTurn: ChatTurn = { id: uid(), role: "user", time: now(), content: input };
    setTurns((t) => [...t, userTurn]);
    setInput("");
    // fake stream
    simulateStream();
  }

  function simulateStream() {
    setStreaming(true);
    const sents: Sentence[] = [
      { id: uid(), text: "질문을 확인했고 관련 법령과 판례를 찾았습니다.", sourceIds: ["s1", "s2"] },
      { id: uid(), text: "회사의 사용촉진 절차 이행 여부가 핵심 쟁점이에요.", sourceIds: ["s2"] },
      { id: uid(), text: "연차 발생 시점과 취업규칙 조항도 함께 확인해 주세요.", sourceIds: ["s1", "s3"] },
    ];
    const newTurn: ChatTurn = { id: uid(), role: "assistant", time: now(), sentences: [] };
    setTurns((t) => [...t, newTurn]);

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTurns((t) => {
        const clone = [...t];
        const last = clone[clone.length - 1];
        if (last && last.role === "assistant") {
          last.sentences = [...(last.sentences ?? []), sents[i - 1]];
        }
        return clone;
      });
      if (i === sents.length) {
        clearInterval(timer);
        setStreaming(false);
      }
    }, 500);
  }

  return (
    <div className="h-full w-full bg-white dark:bg-slate-800">
      {/* Topbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-800/60">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 h-16 flex items-center gap-2">
          <div className="relative flex-1 max-w-3xl">
            <Input
              placeholder="대화 내 검색 (예: 사용촉진 절차, 연차수당)"
              className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus-visible:ring-[#3B82F6]/30"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
            <TabsList className="h-9">
              <TabsTrigger value="요약">요약</TabsTrigger>
              <TabsTrigger value="쟁점">쟁점</TabsTrigger>
              <TabsTrigger value="근거">근거</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="hidden sm:flex items-center gap-3">
            <Badge className="bg-[#1E3A8A]/10 text-[#1E3A8A]">법률 자문 모드</Badge>
            <div className="flex items-center gap-2 text-sm">
              <Switch checked={anonymize} onCheckedChange={setAnonymize} id="anon" />
              <Label htmlFor="anon">익명화</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 py-4">
        {/* Chat area */}
        <section className="min-w-0">
          {/* Tab bar (mobile) */}
          <div className="md:hidden mb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-9 w-full">
                <TabsTrigger value="요약" className="flex-1">요약</TabsTrigger>
                <TabsTrigger value="쟁점" className="flex-1">쟁점</TabsTrigger>
                <TabsTrigger value="근거" className="flex-1">근거</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Messages */}
          <Card className="overflow-hidden bg-white dark:bg-slate-800">
            <div ref={listRef} className="h-[55vh] md:h-[60vh] overflow-auto bg-slate-50/60 p-3 sm:p-4">
                        <div className="mx-auto max-w-3xl space-y-3">
            {turns.map((t) => (
              <ChatBubble key={t.id} turn={t} highlightSources={highlightSources} setHighlightSources={setHighlightSources} />
            ))}
            {streaming && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> 답변 생성 중…
              </div>
            )}
          </div>
            </div>

            {/* Composer */}
            <CardFooter className="border-t border-slate-200 p-3 sm:p-4">
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10"><Paperclip className="h-4 w-4" /></Button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={2}
                    placeholder="질문을 구체적으로 입력하세요. (사안/시점/당사자/근로형태 등)"
                    className="flex-1 resize-none rounded-2xl border border-slate-200 focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 p-3 outline-none"
                  />
                  <Button onClick={send} className="bg-[#1E3A8A] hover:brightness-95 gap-2">
                    <Send className="h-4 w-4" /> 전송
                  </Button>
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
                  <span className="hidden sm:inline">예: "연차휴가 미사용수당 지급 의무와 시효"</span>
                  <span className="ml-auto">출처 표시 · 참고용 · 법률자문 아님</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </section>

        {/* Evidence / Filters panel */}
        <aside className="min-w-0">
          {/* Mobile: filter sheet trigger */}
          <div className="lg:hidden">
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 w-full mb-2"><Filter className="h-4 w-4" /> 결과 필터</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[92vw] sm:w-[420px] p-0">
                <SheetHeader className="p-4"><SheetTitle>결과 필터</SheetTitle></SheetHeader>
                <Separator />
                <RightFilterBody resultType={resultType} setResultType={setResultType} keyword={keyword} setKeyword={setKeyword} />
                <Separator />
                <SheetFooter className="p-4">
                  <Button className="bg-[#1E3A8A] hover:brightness-95" onClick={() => setFilterOpen(false)}>닫기</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

                     {/* Desktop: sticky panel */}
           <div className="hidden lg:block">
             <Card className="sticky top-20 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-base">결과 필터</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RightFilterBody resultType={resultType} setResultType={setResultType} keyword={keyword} setKeyword={setKeyword} />
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RightFilterBody({ resultType, setResultType, keyword, setKeyword }: any) {
  const [tab, setTab] = useState("sources");
  const sources = useMemo(() => MOCK_SOURCES, []);
  const filtered = useMemo(() => {
    let arr = sources;
    if (resultType !== "전체") arr = arr.filter((s) => s.type === resultType);
    if (keyword.trim()) {
      const k = keyword.toLowerCase();
      arr = arr.filter((s) => `${s.title} ${s.snippet}`.toLowerCase().includes(k));
    }
    return arr;
  }, [resultType, keyword, sources]);

  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Select value={resultType} onValueChange={setResultType}>
          <SelectTrigger>
            <SelectValue placeholder="문서 유형" />
          </SelectTrigger>
          <SelectContent>
            {(["전체", "법령", "판례", "행정해석"] as const).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="키워드" className="pl-9" />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-9 w-full">
          <TabsTrigger value="sources" className="flex-1">근거 자료</TabsTrigger>
          <TabsTrigger value="notes" className="flex-1">노트</TabsTrigger>
        </TabsList>
        <TabsContent value="sources" className="space-y-3 mt-3">
          {filtered.map((s: Source) => (
            <Card key={s.id} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className={cn("px-2 py-1", s.type === "법령" ? "bg-indigo-50 text-indigo-700" : s.type === "판례" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{s.type}</Badge>
                {s.score != null && (
                  <span className="text-xs text-slate-500">관련도 {(s.score * 100).toFixed(0)}%</span>
                )}
              </div>
              <div className="mt-2 font-medium text-sm leading-5 line-clamp-2">{s.title}</div>
              <div className="text-xs text-slate-500 mt-1">{s.url ? new URL("https://example.com").host : "국내 법령/판례 DB"}</div>
              <div className="mt-2 text-sm text-slate-700 line-clamp-3">{s.snippet}</div>
              <Button variant="link" className="px-0 h-7 text-[#3B82F6]" asChild>
                <a href={s.url || "#"}><LinkIcon className="h-3.5 w-3.5 mr-1" /> 원문 열기</a>
              </Button>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="notes" className="mt-3">
          <div className="text-sm text-slate-600">문장에 메모를 남기면 여기에 모아 보여줄 수 있어요. (TODO)</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChatBubble({ turn, highlightSources, setHighlightSources }: { turn: ChatTurn; highlightSources: Set<string>; setHighlightSources: React.Dispatch<React.SetStateAction<Set<string>>>; }) {
  const isUser = turn.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start") }>
      {!isUser && (
        <div className="mr-2 mt-1 h-8 w-8 rounded-full bg-[#1E3A8A] text-white text-xs grid place-content-center">AI</div>
      )}
      <div className={cn("max-w-[720px] rounded-2xl px-4 py-3 shadow-sm border text-sm", isUser ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600")}>
        {turn.content && <p className="leading-relaxed whitespace-pre-wrap">{turn.content}</p>}
        {turn.sentences && (
          <div className="space-y-2">
            {turn.sentences.map((s) => (
              <div key={s.id} className="leading-relaxed">
                {s.text}
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {s.sourceIds.map((sid) => (
                    <button
                      key={sid}
                      onMouseEnter={() => setHighlightSources(new Set([sid]))}
                      onMouseLeave={() => setHighlightSources(new Set())}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border text-[11px] h-6 px-2",
                        highlightSources.has(sid) ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#1E3A8A]" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      <Gavel className="h-3.5 w-3.5" /> {sid}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={cn("mt-1 text-[11px]", isUser ? "text-indigo-100" : "text-slate-500 dark:text-slate-400")}>{turn.time}</div>
      </div>
    </div>
  );
}

function uid() { return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }
function now() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
