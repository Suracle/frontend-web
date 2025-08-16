import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
} from "@/components/ui"; // shadcn barrel
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CalendarIcon, ArrowUpRight, ArrowDownRight, RefreshCw, Download } from "lucide-react";
import { addDays, format } from "date-fns";

/** Admin / Analytics Dashboard (Responsive)
 * Palette: Primary #1E3A8A, Secondary #3B82F6, Accent #F59E0B
 * Features:
 *  - KPI Cards (검색 수, 클릭률, Q&A 성공률, 활성 사용자)
 *  - 기간/집계 단위 필터 (주/월/분기)
 *  - 라인/막대/파이 차트
 *  - 인기 키워드 / 인기 판례 리스트
 *  - ✅ CSV 다운로드 (시계열/테이블)
 *  - ✅ 실패 쿼리 테이블 (검색 실패/제로결과)
 *  - ✅ 사용자 피드백 테이블 (처리 상태 토글)
 */

type Range = { from?: Date; to?: Date };

const COLORS = { primary: "#1E3A8A", secondary: "#3B82F6", accent: "#F59E0B" };

// ---- Mock dataset ----
const mockSeries = Array.from({ length: 12 }).map((_, i) => ({
  label: `2024-${String(i + 1).padStart(2, "0")}`,
  searches: Math.round(300 + Math.random() * 500),
  clicks: Math.round(200 + Math.random() * 400),
  qaSuccess: Math.round(60 + Math.random() * 30), // %
  users: Math.round(40 + Math.random() * 80),
}));

const keywordTop = [
  { kw: "경업금지", count: 412 },
  { kw: "연차수당", count: 338 },
  { kw: "해고 예고", count: 220 },
  { kw: "퇴직금", count: 210 },
  { kw: "감봉", count: 180 },
];

const popularCases = [
  { title: "경업금지약정의 합리성 기준", date: "2021-12-16", score: 92 },
  { title: "연차 미사용수당 임금성", date: "2019-10-10", score: 87 },
  { title: "징계 해고의 정당성 판단", date: "2020-06-30", score: 81 },
];

const failedQueries = [
  { q: "연차촉진 절차 기준?", count: 23, lastAt: "2024-11-12" },
  { q: "경업금지 위약벌 한도", count: 17, lastAt: "2024-11-10" },
  { q: "포괄임금 연장수당", count: 15, lastAt: "2024-11-09" },
];

const feedbacksInit = [
  { id: "f1", user: "익명A", message: "판례 원문 링크가 깨져요", rating: 3, createdAt: "2024-11-08", status: "open" as const },
  { id: "f2", user: "익명B", message: "요약 정확도가 높아요", rating: 5, createdAt: "2024-11-07", status: "closed" as const },
  { id: "f3", user: "익명C", message: "검색 결과가 너무 적어요", rating: 2, createdAt: "2024-11-06", status: "open" as const },
];

export default function DashboardPage() {
  const [range, setRange] = useState<Range>({ from: addDays(new Date(), -90), to: new Date() });
  const [granularity, setGranularity] = useState("month"); // month | week | quarter
  const [tab, setTab] = useState("overview");
  const [feedbacks, setFeedbacks] = useState(feedbacksInit);
  const [fqFilter, setFqFilter] = useState("");

  const data = useMemo(() => mockSeries, [range, granularity]);

  return (
            <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 space-y-4 bg-white dark:bg-slate-800">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2"><CalendarIcon className="h-4 w-4" />
              {range.from && range.to ? `${format(range.from, "yyyy.MM.dd")} ~ ${format(range.to, "yyyy.MM.dd")}` : "기간 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar mode="range" selected={range as any} onSelect={setRange as any} numberOfMonths={2} initialFocus />
          </PopoverContent>
        </Popover>

        <Select value={granularity} onValueChange={setGranularity}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="집계 단위" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="week">주간</SelectItem>
            <SelectItem value="month">월간</SelectItem>
            <SelectItem value="quarter">분기</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto gap-2"><RefreshCw className="h-4 w-4" /> 새로고침</Button>
        <Button onClick={() => exportCSV(data, "timeseries.csv")} className="gap-2 bg-[#1E3A8A] hover:brightness-95"><Download className="h-4 w-4" /> CSV (시계열)</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="총 검색 수" value={sum(data, "searches")} delta={+8} />
        <KpiCard title="평균 클릭률(%)" value={avg(data, "clicks", "searches")} delta={+2} />
        <KpiCard title="Q&A 성공률(%)" value={avgPct(data, "qaSuccess")} delta={-1} />
        <KpiCard title="활성 사용자" value={sum(data, "users")} delta={+5} />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-9"><TabsTrigger value="overview">개요</TabsTrigger><TabsTrigger value="details">세부</TabsTrigger></TabsList>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Overview: line + bar + pie */}
          <Card className="lg:col-span-2 bg-white dark:bg-slate-800">
            <CardHeader><CardTitle className="text-base">검색 & 클릭 추이</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v:any)=>Intl.NumberFormat().format(v as number)} />
                  <Line type="monotone" dataKey="searches" stroke={COLORS.primary} strokeWidth={2} dot={false} name="검색" />
                  <Line type="monotone" dataKey="clicks" stroke={COLORS.secondary} strokeWidth={2} dot={false} name="클릭" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardHeader><CardTitle className="text-base">Q&A 성공률 분포</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="qaSuccess" fill={COLORS.accent} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Details: keyword pie + popular table */}
          <Card className="lg:col-span-2 bg-white dark:bg-slate-800">
            <CardHeader><CardTitle className="text-base">인기 키워드</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie data={keywordTop} dataKey="count" nameKey="kw" innerRadius={60} outerRadius={90}>
                    {keywordTop.map((_, i) => (
                      <Cell key={i} fill={[COLORS.primary, COLORS.secondary, COLORS.accent, "#64748B", "#16A34A"][i % 5]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">인기 판례 Top</CardTitle>
              <Button variant="outline" size="sm" onClick={() => exportCSV(popularCases, "popular_cases.csv")}>CSV</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {popularCases.map((r) => (
                  <div key={r.title} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-600 p-2">
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{r.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{r.date}</div>
                    </div>
                    <Badge className="bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 text-[#1E3A8A] dark:text-[#60A5FA]">{r.score}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* 실패 쿼리 / 피드백 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">검색 실패/제로결과 쿼리</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="검색어 필터" value={fqFilter} onChange={(e) => setFqFilter(e.target.value)} className="h-8 w-[180px]" />
              <Button variant="outline" size="sm" onClick={() => exportCSV(filterFailed(failedQueries, fqFilter), "failed_queries.csv")}>CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                    <th className="py-2 pr-4">쿼리</th>
                    <th className="py-2 pr-4">횟수</th>
                    <th className="py-2 pr-4">최근</th>
                  </tr>
                </thead>
                <tbody>
                  {filterFailed(failedQueries, fqFilter).map((r) => (
                    <tr key={r.q} className="border-b last:border-0 border-slate-100 dark:border-slate-700">
                      <td className="py-2 pr-4 font-medium text-slate-900 dark:text-slate-100">{r.q}</td>
                      <td className="py-2 pr-4 text-slate-900 dark:text-slate-100">{r.count}</td>
                      <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{r.lastAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">사용자 피드백</CardTitle>
            <Button variant="outline" size="sm" onClick={() => exportCSV(feedbacks, "feedbacks.csv")}>CSV</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                    <th className="py-2 pr-4">사용자</th>
                    <th className="py-2 pr-4">내용</th>
                    <th className="py-2 pr-4">평가</th>
                    <th className="py-2 pr-4">생성일</th>
                    <th className="py-2 pr-4">상태</th>
                    <th className="py-2 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f.id} className="border-b last:border-0 border-slate-100 dark:border-slate-700 align-top">
                      <td className="py-2 pr-4 whitespace-nowrap text-slate-900 dark:text-slate-100">{f.user}</td>
                      <td className="py-2 pr-4 max-w-[340px] text-slate-900 dark:text-slate-100"><div className="line-clamp-2">{f.message}</div></td>
                      <td className="py-2 pr-4 text-slate-900 dark:text-slate-100">{"★".repeat(f.rating)}</td>
                      <td className="py-2 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{f.createdAt}</td>
                      <td className="py-2 pr-4">
                        <Badge className={cn("rounded px-2", f.status === "open" ? "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400" : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400")}>{f.status === "open" ? "미처리" : "처리됨"}</Badge>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        {f.status === "open" ? (
                          <Button size="sm" className="h-8 bg-[#1E3A8A]" onClick={() => setFeedbacks(prev => prev.map(x => x.id === f.id ? { ...x, status: "closed" } : x))}>처리</Button>
                        ) : (
                          <Button size="sm" variant="outline" className="h-8" onClick={() => setFeedbacks(prev => prev.map(x => x.id === f.id ? { ...x, status: "open" } : x))}>되돌리기</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, delta }: { title: string; value: number; delta: number }) {
  const up = delta >= 0;
  return (
    <Card className="bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-semibold text-slate-900">{Intl.NumberFormat().format(value)}</div>
          <div className={cn("text-sm flex items-center gap-1", up ? "text-emerald-600" : "text-rose-600") }>
            {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />} {Math.abs(delta)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function sum<T extends Record<string, any>>(data: T[], key: keyof T) {
  return data.reduce((acc, cur) => acc + (Number(cur[key]) || 0), 0);
}
function avg(data: any[], numKey: string, denKey: string) {
  const n = data.reduce((a, c) => a + (c[numKey] || 0), 0);
  const d = data.reduce((a, c) => a + (c[denKey] || 0), 0);
  return d ? Math.round((n / d) * 100) : 0;
}
function avgPct(data: any[], key: string) {
  return Math.round(data.reduce((a, c) => a + (c[key] || 0), 0) / (data.length || 1));
}

// --- CSV utils ---
function exportCSV(rows: any[], filename: string) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function toCSV(rows: any[]) {
  if (!rows?.length) return "";
  const keys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: any) => {
    const s = String(v ?? "").replaceAll('"', '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const header = keys.join(",");
  const lines = rows.map((r) => keys.map((k) => escape(r[k])).join(","));
  return [header, ...lines].join("\n");
}

function filterFailed(rows: any[], kw: string) {
  if (!kw.trim()) return rows;
  const k = kw.toLowerCase();
  return rows.filter((r) => r.q.toLowerCase().includes(k));
}
