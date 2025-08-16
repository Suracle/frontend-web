import { useMemo, useRef, useState } from "react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Separator,
} from "@/components/ui/index"; // shadcn barrel (경로 조정)
import { Download, Share2, Network, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

/**
 * 문서 상세·연결 페이지 (Responsive, Tailwind + shadcn/ui)
 * Palette: Primary #1E3A8A · Secondary #3B82F6 · Accent #F59E0B
 * 기능: 메타헤더, 탭(판시사항/이유/원문), 참조 네트워크(react-cytoscapejs), 관련 문서, 공유/다운로드
 * + 좌측 본문 ↔ 우측 그래프/목록 하이라이트(간단 sync)
 *
 * 옵션 설치(추천):
 *  npm i react-cytoscapejs cytoscape
 */

// ---- Mock Types ----
interface DocMeta {
  id: string;
  type: "판례" | "법령" | "행정해석";
  title: string;
  court?: string;
  caseNo?: string;
  date?: string; // yyyy-mm-dd
  tags: string[];
}
interface RefNode { id: string; label: string; kind: "판례" | "조문" | "행정해석"; }
interface RefEdge { id: string; source: string; target: string; rel: "참조" | "인용" | "관련"; }

const META: DocMeta = {
  id: "D-2021-001",
  type: "판례",
  title: "경업금지약정의 유효 범위와 기간의 합리성 판단 기준",
  court: "대법원",
  caseNo: "2021다12345",
  date: "2021-12-16",
  tags: ["노무", "경업금지", "영업비밀"],
};

const SUMMARY = {
  issues: [
    "경업금지약정의 기간·지역·대상 직무 범위의 합리성",
    "근로자의 전직의 자유와 사용자의 이익보호 간 이익형량",
    "대체보상(대가) 제공 여부의 고려",
  ],
  holding: `**결론 요지**\n\n경업금지약정은 기간·지역·직무 범위를 고려하여 **합리적 범위에서만 유효**합니다. 대가 제공 여부, 근로자의 지위, 퇴직 경위 등도 함께 판단합니다.`,
};

const REASON_MD = `### 이유(요지)\n\n1. 경업금지약정은 근로자의 직업선택의 자유를 제한하므로 엄격히 해석합니다.\n2. 기간·지역·대상 업무의 범위가 과도하면 무효가 될 수 있습니다.\n3. 사용자가 대가를 제공했는지, 근로자가 고위직인지 등 사정을 종합합니다.\n\n> 판례: 대법원 2010다00000 …`; 

const FULLTEXT_MD = `원문 텍스트(발췌)… 긴 본문은 스크롤 접기/펴기로 처리하세요.`;

const NODES: RefNode[] = [
  { id: "self", label: META.title, kind: "판례" },
  { id: "p1", label: "대법원 2010다00000", kind: "판례" },
  { id: "c1", label: "근로기준법 제60조", kind: "조문" },
  { id: "c2", label: "부정경쟁방지법 제2조", kind: "조문" },
  { id: "a1", label: "고용노동부 질의회시(2019)", kind: "행정해석" },
];
const EDGES: RefEdge[] = [
  { id: "e1", source: "self", target: "p1", rel: "참조" },
  { id: "e2", source: "self", target: "c1", rel: "참조" },
  { id: "e3", source: "self", target: "c2", rel: "관련" },
  { id: "e4", source: "self", target: "a1", rel: "참조" },
];

const RELATED = [
  { id: "R1", title: "퇴직 후 경쟁업체 취업 제한의 유효성", kind: "판례", date: "2020-05-12" },
  { id: "R2", title: "영업비밀 침해와 전직금지 가처분 기준", kind: "판례", date: "2019-10-30" },
  { id: "R3", title: "근로기준법 제60조 해설", kind: "법령", date: "2020-01-01" },
];

export default function DocumentPage() {
  const [tab, setTab] = useState("판시사항");
  const reasonRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);

  // 오른쪽 그래프 패널 하이라이트용
  const [activeNode, setActiveNode] = useState<string | null>(null);

  function onClickAnchor(target: "reason" | "full") {
    const el = target === "reason" ? reasonRef.current : fullRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="h-full w-full bg-white dark:bg-slate-800">
      {/* Header */}
             <div className="border-b border-slate-200 dark:border-brand-primary/30">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <TypeChip kind={META.type} />
              {META.court && <span className="text-slate-500 dark:text-slate-400">{META.court}</span>}
              {META.caseNo && <span className="text-slate-400 dark:text-slate-500">· {META.caseNo}</span>}
              {META.date && <span className="text-slate-400 dark:text-slate-500">· {META.date}</span>}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">{META.title}</h1>
            <div className="flex flex-wrap gap-2">
                             {META.tags.map((t) => (
                 <Badge key={t} variant="outline" className="border-brand-primary/30 text-brand-primary dark:text-brand-secondary bg-brand-primary/5 dark:bg-brand-primary/10">{t}</Badge>
               ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> 공유</Button>
              <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> PDF</Button>
              <Button variant="outline" className="gap-2" onClick={() => onClickAnchor("reason")}>이유로 이동</Button>
              <Button variant="outline" className="gap-2" onClick={() => onClickAnchor("full")}>원문으로 이동</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
             <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-4">
        {/* Left: Content */}
        <section className="min-w-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-slate-900 dark:text-white">내용</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="h-9 w-full max-w-full overflow-x-auto">
                  <TabsTrigger value="판시사항">판시사항</TabsTrigger>
                  <TabsTrigger value="이유">이유</TabsTrigger>
                  <TabsTrigger value="원문">원문</TabsTrigger>
                </TabsList>
                <TabsContent value="판시사항" className="mt-4 space-y-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">핵심 쟁점</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-white">
              {SUMMARY.issues.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
                  <div className="mt-3">
                    <Markdown content={SUMMARY.holding} />
                  </div>
                </TabsContent>
                <TabsContent value="이유" className="mt-4">
                  <div ref={reasonRef}>
                    <Markdown content={REASON_MD} />
                  </div>
                </TabsContent>
                <TabsContent value="원문" className="mt-4">
                  <div ref={fullRef}>
                    <FoldableMarkdown content={FULLTEXT_MD} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Related docs */}
          <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">관련 문서</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {RELATED.map((r) => (
                <Card key={r.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                                         <Badge variant="secondary" className={cn("px-2 py-1", r.kind === "판례" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : r.kind === "법령" ? "bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary" : "bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent dark:text-brand-accent/80")}>{r.kind}</Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{r.date}</span>
                  </div>
                                     <a href={`/doc/${r.id}`} className="mt-2 block font-medium text-sm text-slate-900 dark:text-slate-100 hover:text-brand-secondary dark:hover:text-brand-secondary">{r.title}</a>
                   <Button variant="link" className="px-0 h-7 text-brand-secondary dark:text-brand-secondary" asChild>
                     <a href={`/doc/${r.id}`}><ArrowRight className="h-3.5 w-3.5 mr-1" /> 상세보기</a>
                   </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Reference Graph & List */}
        <aside className="min-w-0">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white"><Network className="h-4 w-4" /> 참조 네트워크</CardTitle>
            </CardHeader>
            <CardContent>
              <GraphOrFallback nodes={NODES} edges={EDGES} activeNode={activeNode} setActiveNode={setActiveNode} />
              <Separator className="my-3" />
              <div className="space-y-2">
                {NODES.filter(n => n.id !== "self").map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setActiveNode(n.id)}
                    className={cn(
                      "w-full text-left rounded-lg border px-3 py-2 text-sm",
                      activeNode === n.id ? "border-brand-accent bg-brand-accent/10" : "border-slate-200 dark:border-brand-primary/40 hover:bg-slate-50 dark:hover:bg-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{n.label}</span>
                      <Badge variant="secondary" className={cn("px-2 py-1", n.kind === "판례" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : n.kind === "조문" ? "bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary" : "bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent dark:text-brand-accent/80")}>{n.kind}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/** Type Chip */
function TypeChip({ kind }: { kind: DocMeta["type"] }) {
  const cls = kind === "판례" 
    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" 
    : kind === "법령" 
    ? "bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-secondary" 
    : "bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent dark:text-brand-accent/80";
  return <span className={cn("px-2 py-1 rounded-full text-xs", cls)}>{kind}</span>;
}

/** Simple Markdown renderer (temporary) */
function Markdown({ content }: { content: string }) {
  // Simple markdown-like rendering without external dependencies
  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code className="bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5 text-[0.85em] text-slate-900 dark:text-white">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div 
      className="prose prose-sm max-w-none text-slate-900 dark:text-white"
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
    />
  );
}

function FoldableMarkdown({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={cn(!open && "line-clamp-6")}> <Markdown content={content} /> </div>
             <Button variant="outline" size="sm" className="mt-2 text-slate-900 dark:text-white" onClick={() => setOpen(v => !v)}>
         {open ? "접기" : "더 보기"}
       </Button>
    </div>
  );
}



/** Graph (Cytoscape or Fallback) */
function GraphOrFallback({ nodes, edges, activeNode, setActiveNode }: { nodes: RefNode[]; edges: RefEdge[]; activeNode: string | null; setActiveNode: (id: string) => void; }) {
  const cytoAvailable = useMemo(() => {
    try {
      // @ts-ignore
      require.resolve?.("react-cytoscapejs");
      return true;
    } catch { return false; }
  }, []);

  if (!cytoAvailable) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-brand-primary/30 p-3 text-sm text-slate-600 dark:text-slate-400">
        react-cytoscapejs가 설치되어 있지 않아 기본 목록만 표시합니다.
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">설치: <code className="bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5 text-[0.85em] text-slate-900 dark:text-white">npm i react-cytoscapejs cytoscape</code></div>
      </div>
    );
  }

  const CytoscapeComponent = require("react-cytoscapejs").default as any;
  const elements = [
    ...nodes.map((n) => ({ data: { id: n.id, label: n.label, kind: n.kind } })),
    ...edges.map((e) => ({ data: { id: e.id, source: e.source, target: e.target, rel: e.rel } })),
  ];

  const style = [
    { selector: "node", style: { label: "data(label)", "font-size": 10, "text-valign": "center", "text-halign": "center", "background-color": (ele: any) => kindColor(ele.data("kind")) } },
    { selector: "edge", style: { width: 2, "line-color": "#CBD5E1", "target-arrow-color": "#CBD5E1", "target-arrow-shape": "triangle", "curve-style": "bezier" } },
         { selector: `node[id = "${activeNode}"]`, style: { "border-width": 3, "border-color": "#F59E0B" } }, // brand-accent
  ];

  return (
    <div className="h-[260px]">
      <CytoscapeComponent
        elements={elements}
        stylesheet={style}
        layout={{ name: "cose", animate: false }}
        style={{ width: "100%", height: "100%" }}
        cy={(cy: any) => {
          cy.on("tap", "node", (evt: any) => setActiveNode(evt.target.id()));
        }}
      />
    </div>
  );
}

function kindColor(kind: RefNode["kind"]) {
  if (kind === "판례") return "#10B981"; // emerald-500
  if (kind === "조문") return "#1E3A8A"; // brand-primary
  return "#F59E0B"; // brand-accent for 행정해석
}
