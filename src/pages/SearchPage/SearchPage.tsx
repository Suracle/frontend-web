import { useState } from "react";
import {
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Search, Filter, BookOpen, Gavel, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 검색 페이지 — Tailwind + shadcn/ui (Enhanced)
 * Palette
 *  - Primary: #0F172A (딥 네이비)
 *  - Secondary: #1E293B (어두운 네이비)
 *  - Accent: #F59E0B (기존 액센트)
 */

interface SearchResult {
  id: string;
  type: "판례" | "법령" | "행정해석";
  title: string;
  snippet: string;
  date?: string;
  relevance: number; // 0-100
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    type: "판례",
    title: "경업금지약정의 유효 범위와 기간의 합리성 판단 기준",
    snippet: "경업금지약정은 기간·지역·직무 범위를 고려하여 합리적 범위에서만 유효합니다...",
    date: "2021-12-16",
    relevance: 95,
  },
  {
    id: "2",
    type: "법령",
    title: "근로기준법 제60조(연차유급휴가)",
    snippet: "1년간 80% 이상 출근한 근로자에게 15일의 유급휴가를 주어야 합니다...",
    date: "2020-01-01",
    relevance: 87,
  },
  {
    id: "3",
    type: "행정해석",
    title: "고용노동부 질의회시 - 연차 발생 시점",
    snippet: "연차 발생 시점은 근로계약 체결 후 1년 경과한 날부터 발생합니다...",
    date: "2019-10-15",
    relevance: 82,
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [results] = useState<SearchResult[]>(MOCK_RESULTS);

  const filteredResults = results.filter((result) => {
    if (selectedType !== "all" && result.type !== selectedType) return false;
    if (query && !(`${result.title} ${result.snippet}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "판례":
        return <Gavel className="h-4 w-4" />;
      case "법령":
        return <BookOpen className="h-4 w-4" />;
      case "행정해석":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">법률 검색</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">판례, 법령, 행정해석을 검색하세요</p>
      </div>

      {/* Search Section */}
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative max-w-3xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="검색어를 입력하세요 (예: 경업금지, 연차수당, 해고예고)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
                         className="pl-10 h-12 text-[15px] rounded-xl bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm focus:border-slate-700 dark:focus:border-slate-600 focus:ring-slate-700/30 dark:focus:ring-slate-600/30 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
                      <Button className="absolute right-1.5 top-1.5 h-9 px-3 bg-slate-700 dark:bg-slate-700 hover:brightness-95">
            검색
          </Button>
        </div>

        {/* Type segmented control */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "판례", "법령", "행정해석"].map((t) => (
            <Button
              key={t}
              variant={selectedType === t ? "default" : "outline"}
              onClick={() => setSelectedType(t)}
              className={cn(
                "h-8 px-3 rounded-full transition-colors",
                selectedType === t 
                                ? "bg-slate-900 dark:bg-slate-700 text-white"
                             : "border-slate-300 dark:border-slate-600 hover:bg-slate-700/10 dark:hover:bg-slate-700/20"
              )}
            >
              {t === "all" ? "전체" : t}
            </Button>
          ))}
        </div>

        {/* Meta line */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {filteredResults.length}개의 결과 · <span className="text-slate-500 dark:text-slate-400">정렬: 관련도</span>
          </span>
          <div className="flex items-center gap-2">
                         <Button variant="outline" className="gap-1 h-8 text-sm border-slate-300 dark:border-slate-600 hover:bg-slate-700/10 dark:hover:bg-slate-700/20">
              <Filter className="h-4 w-4" /> 필터
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Card
              key={result.id}
              className={cn(
                "transition shadow-sm hover:shadow-md hover:-translate-y-[1px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
                result.type === "판례" && "border-l-4 border-emerald-500",
                                  result.type === "법령" && "border-l-4 border-slate-900 dark:border-slate-600",
                                 result.type === "행정해석" && "border-l-4 border-amber-500"
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={cn(
                        "px-2 py-1",
                        result.type === "판례" && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                        result.type === "법령" && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400",
                        result.type === "행정해석" && "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                      )}
                    >
                      <span className="inline-flex items-center gap-1">
                        {getTypeIcon(result.type)} <span>{result.type}</span>
                      </span>
                    </Badge>
                    {result.date && <span className="text-xs text-slate-500 dark:text-slate-400">{result.date}</span>}
                  </div>
                                     <CardTitle className="text-lg text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">
                    {result.title}
                  </CardTitle>
                </div>
                                 <Badge className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-600">
                  관련도 {result.relevance}%
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.snippet}</p>
                <div className="mt-4 flex gap-2">
                                     <Button variant="outline" size="sm" className="hover:border-slate-700 dark:hover:border-slate-600 border-slate-300 dark:border-slate-600">
                    상세보기
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
                    관련 문서
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">검색 결과가 없습니다</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">다른 검색어를 시도해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
