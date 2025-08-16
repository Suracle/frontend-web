import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    // 로컬 스토리지에서 사용자의 이전 선택을 확인
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark" || savedTheme === "light") {
      // 사용자가 이전에 선택한 테마가 있으면 그것을 사용
      setTheme(savedTheme);
      applyTheme(savedTheme);
      console.log("📱 사용자 선택 테마 적용:", savedTheme);
    } else {
      // 사용자가 선택한 적이 없으면 시스템 테마를 확인
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
      applyTheme(systemTheme);
      localStorage.setItem("theme", systemTheme);
      console.log("🖥️ 시스템 테마 적용:", systemTheme);
    }
  }, []);

  // 시스템 테마 변경 감지
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 사용자가 명시적으로 테마를 선택하지 않은 경우에만 시스템 테마를 따름
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        console.log("🔄 시스템 테마 변경 감지:", newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    console.log("=== 테마 적용 시작 ===");
    console.log("적용할 테마:", newTheme);
    console.log("현재 HTML 클래스:", document.documentElement.className);
    
    if (newTheme === "dark") {
      // 다크모드 적용
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      console.log("✅ 다크모드 클래스 추가됨");
    } else {
      // 라이트모드 적용
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      console.log("✅ 라이트모드 클래스 추가됨");
    }
    
    console.log("최종 HTML 클래스:", document.documentElement.className);
  };

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("🔄 테마 토글:", { from: theme, to: newTheme });
    
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    console.log("✅ 테마 토글 완료:", newTheme);
  }, [theme]);

  // SSR을 위한 마운트 체크
  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "h-9 w-9 p-0 relative transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer z-10",
          className
        )}
      >
        <Sun className="h-4 w-4 text-slate-600" />
        <span className="sr-only">테마 토글</span>
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      {/* 테마 토글 버튼 */}
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "h-9 w-9 p-0 relative transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer z-10",
          className
        )}
        title={theme === "light" ? "다크모드로 변경" : "라이트모드로 변경"}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-slate-600" />
        ) : (
          <Sun className="h-4 w-4 text-slate-400" />
        )}
        <span className="sr-only">테마 토글</span>
      </button>
    </div>
  );
}
