import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // 다크모드 클래스 기반
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F172A",      // slate-900 (매우 어두운 네이비)
          secondary: "#1E293B",    // slate-800 (어두운 네이비)
          accent: "#F59E0B",       // amber-500 (기존 액센트)
          surface: "#F8FAFC",      // slate-50 (밝은 배경)
          text: "#0F172A",         // slate-900 (어두운 텍스트)
        },
      },
    },
  },
} satisfies Config;