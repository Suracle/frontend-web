import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  BarChart3, 
  FileText, 
  History, 
  Star, 
  BookOpen
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", icon: <FileText className="h-4 w-4" />, description: "Home" },
  { path: "/chat", label: "챗봇", icon: <History className="h-4 w-4" />, description: "질의하기" },
  { path: "/search", label: "검색", icon: <Star className="h-4 w-4" />, description: "검색 결과" },
  { path: "/dashboard", label: "대시보드", icon: <Star className="h-4 w-4" />, description: "대시보드" },
  { path: "/document", label: "법률 상세", icon: <BookOpen className="h-4 w-4" />, description: "법률 자료" },
];

const CATEGORIES = [
  { name: "노무", count: 92, icon: <BookOpen className="h-3 w-3" /> },
  { name: "계약", count: 41, icon: <FileText className="h-3 w-3" /> },
  { name: "행정", count: 23, icon: <BarChart3 className="h-3 w-3" /> },
  { name: "분쟁/소송", count: 12, icon: <MessageSquare className="h-3 w-3" /> },
];

// 카테고리별 색상 반환 함수
function getCategoryColor(name: string): string {
  switch (name) {
    case "노무": return "bg-indigo-500";
    case "계약": return "bg-emerald-500";
    case "행정": return "bg-amber-500";
    case "분쟁/소송": return "bg-rose-500";
    default: return "bg-slate-500";
  }
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen] = React.useState(true);

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">


      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* <div className="px-4 h-16 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
            <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-semibold">L</div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Legal Q&A</span>
          </div> */}
          
          <nav className="p-3 space-y-1 overflow-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors font-medium",
                  currentPath === item.path
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                )}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
            
            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300 font-semibold">분류</div>
            
            {CATEGORIES.map((category) => (
              <div key={category.name} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${getCategoryColor(category.name)}`}></span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{category.name}</span>
                </div>
                <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{category.count}</span>
              </div>
            ))}
          </nav>
          
          <div className="mt-auto p-3">
            <button 
              className="w-full rounded-2xl bg-slate-900 dark:bg-slate-800 text-white py-2.5 text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition"
              onClick={() => navigate('/')}
            >
              새 질의 시작
            </button>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">v0.1 • TS + Vite</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
