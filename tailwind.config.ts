import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F172A",
          secondary: "#1E293B",
          accent: "#F59E0B",
          surface: "#F8FAFC",
          text: "#0F172A",
        },
        // HTML 파일에서 사용된 커스텀 색상들
        primary: "#D94F4F",
        secondary: "#E99BAE",
        "accent-cream": "#F3E6D8",
        "text-primary": "#2c2c2c",
        "text-secondary": "#666666",
        "light-gray": "#f8f9fa",
        border: "#e0e0e0",
        success: "#4CAF50",
        warning: "#ff9800",
        info: "#2196f3",
        error: "#f44336",
        shadow: "rgba(217, 79, 79, 0.15)",
      },
      spacing: {
        '15': '3.75rem',
      },
      zIndex: {
        '100': '100',
      },
    },
  },
  plugins: [],
} satisfies Config;