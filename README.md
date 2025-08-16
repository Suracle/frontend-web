# LawGenie - 법률 Q&A 플랫폼

React + TypeScript + Vite 기반의 법률 질의응답 플랫폼입니다.

## 🚀 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **Markdown**: React Markdown + Remark GFM
- **Graph Visualization**: React CytoscapeJS

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
# 기본 의존성 설치
npm install

# 또는 pnpm 사용
pnpm install

# 또는 yarn 사용
yarn install
```

### 2. 추가 패키지 설치

프로젝트에 필요한 추가 패키지들을 설치합니다:

```bash
# UI 컴포넌트 라이브러리
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install @radix-ui/react-switch
npm install @radix-ui/react-slider
npm install @radix-ui/react-popover
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-label
npm install @radix-ui/react-sheet
npm install @radix-ui/react-separator
npm install @radix-ui/react-calendar

# 차트 및 시각화
npm install recharts
npm install react-cytoscapejs cytoscape

# 마크다운 렌더링
npm install react-markdown remark-gfm

# 날짜 처리
npm install date-fns

# Tailwind CSS v4
npm install @tailwindcss/vite
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

### 5. 빌드 미리보기

```bash
npm run preview
```

## 🎨 주요 기능

- **다크모드**: 테마 토글 기능
- **공통 레이아웃**: 헤더와 사이드바를 통한 일관된 네비게이션
- **법률 검색**: 판례, 법령, 행정해석 검색
- **챗봇 인터페이스**: AI 기반 법률 질의응답
- **대시보드**: 통계 및 분석 차트
- **지식베이스**: 법률 문서 관리

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/           # shadcn/ui 컴포넌트들
│   └── layout/       # 공통 레이아웃 컴포넌트
├── pages/            # 페이지 컴포넌트들
│   ├── HomePage/     # 메인 홈페이지
│   ├── SearchPage/   # 검색 페이지
│   ├── ChatPage/     # 챗봇 페이지
│   ├── DashboardPage/ # 대시보드
│   └── DocumentPage/ # 문서 상세 페이지
├── app/              # 라우팅 설정
├── lib/              # 유틸리티 함수들
└── index.css         # 전역 스타일
```

## 🔧 설정 파일

- `tailwind.config.ts`: Tailwind CSS 설정
- `vite.config.ts`: Vite 빌드 설정
- `tsconfig.json`: TypeScript 설정
- `components.json`: shadcn/ui 설정

## 🌙 다크모드

Tailwind CSS의 `darkMode: "class"` 설정을 사용하여 다크모드를 구현했습니다. `ThemeToggle` 컴포넌트를 통해 테마를 전환할 수 있습니다.

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱을 지원하는 반응형 디자인을 적용했습니다.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 🤝 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인합니다
2. 새로운 기능 브랜치를 생성합니다
3. 변경사항을 커밋하고 푸시합니다
4. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
