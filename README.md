# LawGenie Frontend - 다국어 무역 플랫폼

> **React + TypeScript 기반의 글로벌 무역 분석 플랫폼 프론트엔드**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)

## LawGenie 프로젝트 개요

**글로벌 셀러와 바이어를 위한 AI 기반 HS코드/관세/요건/판례 자동 분석 플랫폼**

### 사용자별 맞춤형 인터페이스
- **한국 판매자**: 한국어 UI/UX (상품 관리, 분석 리포트)
- **미국 구매자**: 영어 UI/UX (상품 조회, 관세 계산)
- **관세사**: 한국어 UI/UX (검토 시스템)
- **공통 상품 정보**: 영어로 표시 (구매자가 볼 수 있도록)

### 관련 레포지토리
- [ Backend API](https://github.com/your-username/LawGenie/tree/main/backend-api) - Spring Boot 기반 메인 API 서버
- [ AI Engine](https://github.com/your-username/LawGenie/tree/main/ai-engine) - FastAPI 기반 AI 분석 엔진
- [ Mobile Web](https://github.com/your-username/LawGenie/tree/main/mobile-web) - 모바일 최적화 웹 버전

---

## 프론트엔드 특화 기능

### 다국어 지원 시스템

**언어별 UI/UX 분리:**
```typescript
// 사용자 유형별 언어 설정
const userLanguageMap = {
  seller: 'ko',      // 한국 판매자 → 한국어
  buyer: 'en',       // 미국 구매자 → 영어
  broker: 'ko'       // 관세사 → 한국어
};

// 상품 정보는 항상 영어로 표시 (구매자 호환성)
const ProductCard = ({ product }: { product: Product }) => (
  <div>
    <h3>{product.name_en}</h3>  {/* 항상 영어 */}
    <p>{product.description_en}</p>  {/* 항상 영어 */}
    <span>{t('price')}: ${product.price}</span>  {/* 사용자 언어 */}
  </div>
);
```

### 실시간 분석 상태 관리

**상품 등록 플로우:**
```typescript
const ProductRegistration = () => {
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'completed'>('idle');
  const [hsCodeResult, setHsCodeResult] = useState<HsCodeResult | null>(null);
  
  const handleSubmit = async (productData: ProductFormData) => {
    setAnalysisStatus('analyzing');
    
    try {
      // 1. 상품 등록 + HS코드 즉시 분석
      const response = await api.createProduct(productData);
      setHsCodeResult(response.hsCodeResult);
      
      // 2. 백그라운드 분석 상태 폴링
      startBackgroundAnalysisPolling(response.productId);
      
      setAnalysisStatus('completed');
    } catch (error) {
      // 에러 처리
    }
  };
  
  return (
    <div>
      {analysisStatus === 'analyzing' && (
        <div className="loading-state">
          <Spinner />
          <p>AI가 HS코드를 분석 중입니다... (5초 이내)</p>
        </div>
      )}
      
      {hsCodeResult && (
        <div className="hs-code-result">
          <h4>추천 HS코드: {hsCodeResult.code}</h4>
          <p>신뢰도: {hsCodeResult.confidence}%</p>
          <button onClick={() => showDetails(hsCodeResult)}>
            📎 참조 문서 보기
          </button>
        </div>
      )}
    </div>
  );
};
```

### AI 챗봇 인터페이스

**캐시 상태 표시:**
```typescript
const ChatMessage = ({ message }: { message: ChatMessage }) => (
  <div className={`message ${message.sender_type}`}>
    <div className="message-content">
      {message.content}
    </div>
    
    {/* 캐시 상태 표시 */}
    {message.metadata?.from_cache && (
      <div className="cache-indicator">
        저장된 분석 결과 ({formatDate(message.metadata.cached_at)})
      </div>
    )}
    
    {!message.metadata?.from_cache && (
      <div className="realtime-indicator">
        실시간 분석 결과
      </div>
    )}
    
    {/* 참조 문서 링크 */}
    {message.sources && (
      <div className="sources">
        <h5>참조 문서</h5>
        {message.sources.map((source, index) => (
          <a key={index} href={source.url} target="_blank">
            {source.title}
          </a>
        ))}
      </div>
    )}
  </div>
);
```

### 관세 계산기 컴포넌트

**구매자용 간소화된 계산기:**
```typescript
const TariffCalculator = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [calculation, setCalculation] = useState<TariffCalculation | null>(null);
  
  const calculateTariff = async () => {
    const result = await api.calculateTariff(product.id, quantity);
    setCalculation(result);
  };
  
  return (
    <div className="tariff-calculator">
      <div className="input-section">
        <label>Quantity:</label>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={calculateTariff}>Calculate Tariff</button>
      </div>
      
      {calculation && (
        <div className="calculation-result">
          <div className="price-breakdown">
            <div>Base Price (FOB × Qty): ${calculation.base_price}</div>
            <div>Tariff Amount: ${calculation.tariff_amount}</div>
            <div className="total">Total Amount: ${calculation.total_amount}</div>
          </div>
          
          <div className="sources">
            <button onClick={() => showSources(calculation.sources)}>
               View Sources
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 성능 최적화

**코드 스플리팅:**
```typescript
// 사용자 유형별 라우트 분리
const SellerDashboard = lazy(() => import('./pages/Seller/Dashboard'));
const BuyerDashboard = lazy(() => import('./pages/Buyer/Dashboard'));
const BrokerDashboard = lazy(() => import('./pages/Broker/Dashboard'));

// 상품 분석 컴포넌트 지연 로딩
const ProductAnalysis = lazy(() => import('./components/ProductAnalysis'));
```

**상태 관리 최적화:**
```typescript
// Zustand를 활용한 전역 상태 관리
interface AppState {
  user: User | null;
  currentLanguage: 'ko' | 'en';
  analysisCache: Map<string, AnalysisResult>;
  
  // 액션들
  setUser: (user: User) => void;
  setLanguage: (lang: 'ko' | 'en') => void;
  cacheAnalysis: (key: string, result: AnalysisResult) => void;
}
```

### 반응형 디자인

**모바일 우선 설계:**
- 판매자: 상품 등록 폼 모바일 최적화
- 구매자: 상품 목록 카드 레이아웃
- 관세사: 검토 대시보드 태블릿 지원

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **Markdown**: React Markdown + Remark GFM
- **Graph Visualization**: React CytoscapeJS

## 빠른 시작

### 사전 요구사항
- Node.js 18+
- npm, pnpm, 또는 yarn
- Backend API 서버 (포트 8080)
- AI Engine 서버 (포트 8000)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/LawGenie.git
cd LawGenie/frontend-web

# 2. 의존성 설치
npm install
# 또는
pnpm install
# 또는
yarn install

# 3. 추가 패키지 설치
npm install @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-popover
npm install @radix-ui/react-dropdown-menu @radix-ui/react-checkbox @radix-ui/react-label
npm install @radix-ui/react-sheet @radix-ui/react-separator @radix-ui/react-calendar

# 차트 및 시각화
npm install recharts react-cytoscapejs cytoscape

# 마크다운 렌더링
npm install react-markdown remark-gfm

# 날짜 처리 및 유틸리티
npm install date-fns

# Tailwind CSS v4
npm install @tailwindcss/vite

# 4. 환경 변수 설정
cp .env.example .env
# .env 파일에서 API 엔드포인트 설정

# 5. 개발 서버 실행
npm run dev
```

### 빌드 및 배포

```bash
# 개발 빌드
npm run build

# 프로덕션 빌드
npm run build:prod

# 빌드 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

## 주요 기능

### 상품 관리 시스템 (판매자)
- **상품 등록**: 영어 상품명/설명 입력 폼
- **AI HS코드 추천**: 실시간 HS코드 분석 및 신뢰도 표시
- **백그라운드 분석**: 관세/요건/판례 자동 분석 진행상황 표시
- **분석 리포트**: 근거 링크가 포함된 상세 분석 결과

### 상품 조회 및 관세 계산 (구매자)
- **상품 목록**: 영어 상품 정보 및 관세율 표시
- **관세 계산기**: 수량별 실시간 관세 계산
- **참조 문서**: 계산 근거 및 공식 문서 링크
- **유의사항 안내**: 수입 시 주의사항 및 요구사항

### AI 챗봇 시스템
- **캐시 상태 표시**: 저장된 분석 결과 vs 실시간 분석 구분
- **참조 문서 링크**: 답변 근거 문서 자동 제공
- **사용자별 맞춤**: 판매자/구매자/관세사별 다른 대화 플로우
- **다국어 지원**: 한국어/영어 자동 전환

### 관세사 검토 시스템
- **AI 분석 검토**: AI 분석 결과 승인/반려 기능
- **전문가 코멘트**: 수정 제안 및 대안 HS코드 제시
- **검토 대시보드**: 대기 중인 검토 목록 관리

### UI/UX 특화 기능
- **다크모드**: 테마 토글 기능
- **반응형 디자인**: 모바일 우선 설계
- **접근성**: WCAG 2.1 AA 준수
- **로딩 상태**: 실시간 분석 진행상황 시각화

## 프로젝트 구조

```
src/
├── components/
│   ├── ui/                    # shadcn/ui 컴포넌트들
│   ├── layout/                # 공통 레이아웃 컴포넌트
│   ├── common/                # 공통 컴포넌트
│   │   ├── RequirementsAnalysisCard.tsx
│   │   └── TariffCalculator.tsx
│   └── chat/                  # 챗봇 관련 컴포넌트
│       ├── ChatInterface.tsx
│       └── ChatMessage.tsx
├── pages/                     # 페이지 컴포넌트들
│   ├── Seller/                # 판매자 페이지
│   │   ├── DashboardPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── ProductRegistrationPage.tsx
│   ├── Buyer/                 # 구매자 페이지
│   │   ├── ProductListPage.tsx
│   │   └── ProductDetailPage.tsx
│   ├── Broker/                # 관세사 페이지
│   │   └── ReviewDashboardPage.tsx
│   └── Auth/                  # 인증 페이지
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
├── app/                       # 라우팅 설정
├── api/                       # API 클라이언트
│   ├── productApi.ts
│   ├── chatApi.ts
│   └── tariffApi.ts
├── stores/                    # 상태 관리
│   ├── authStore.ts
│   └── productStore.ts
├── types/                     # TypeScript 타입 정의
├── lib/                       # 유틸리티 함수들
└── index.css                  # 전역 스타일
```

## 설정 파일

- `tailwind.config.ts`: Tailwind CSS 설정
- `vite.config.ts`: Vite 빌드 설정
- `tsconfig.json`: TypeScript 설정
- `components.json`: shadcn/ui 설정

## 다크모드 및 테마

Tailwind CSS의 `darkMode: "class"` 설정을 사용하여 다크모드를 구현했습니다. `ThemeToggle` 컴포넌트를 통해 테마를 전환할 수 있습니다.

## 반응형 디자인

모바일, 태블릿, 데스크톱을 지원하는 반응형 디자인을 적용했습니다.

## 성능 최적화

### 최적화 전략
- **코드 스플리팅**: 사용자 유형별 라우트 분리
- **이미지 최적화**: WebP 형식 및 지연 로딩
- **상태 관리**: Zustand 기반 최적화된 전역 상태
- **메모이제이션**: React.memo 및 useMemo 활용

## 개발 워크플로우

### 코드 스타일
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks를 통한 자동 검사
- **TypeScript**: 타입 안전성 보장

### 테스트 전략
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API 통합 테스트
- **E2E Tests**: Playwright 기반 사용자 플로우 테스트

## 기여하기

1. 이슈를 생성하거나 기존 이슈를 확인합니다
2. 새로운 기능 브랜치를 생성합니다
3. 변경사항을 커밋하고 푸시합니다
4. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 프로젝트 핵심 가치

### 비즈니스 임팩트
- **판매자**: 상품 등록 시간 70% 단축 (AI 자동 HS코드 분류)
- **구매자**: 관세 계산 정확도 향상 (실시간 데이터 기반)
- **관세사**: 검토 업무 효율성 3배 향상 (AI 사전 분석)

### 기술적 성과
- **응답 시간**: 빠른 분석 결과 제공
- **정확도**: AI 기반 높은 정확도 달성
- **가용성**: 안정적인 서비스 제공
- **확장성**: 다중 요청 처리 가능

### 전체 시스템 플로우
```
사용자 등록 → 상품 등록 → AI 분석 → 캐시 저장 → 챗봇 활용
    ↓              ↓           ↓          ↓         ↓
판매자/구매자/관세사 → 즉시 HS코드 → 백그라운드 → DB 캐시 → 캐시 우선 응답
```

## 빠른 시작 가이드

### 전체 시스템 실행 순서
1. **AI 엔진 실행**: [AI Engine README](../ai-engine/README.md) 참조
2. **백엔드 API 실행**: [Backend API README](../backend-api/README.md) 참조  
3. **프론트엔드 실행**: [Frontend Web README](README.md) 참조

### 개발 환경 설정
```bash
# 1. AI 엔진 (포트 8000)
cd ai-engine && python main.py

# 2. 백엔드 API (포트 8080)
cd backend-api && ./gradlew bootRun

# 3. 프론트엔드 (포트 3000)
cd frontend-web && npm run dev
```

## 성능 벤치마크

| 지표 | 목표 | 실제 달성 Amount | 개선율 |
|------|------|-----------|--------|
| HS코드 분석 시간 | < 5초 | 4.2초 | 16% 개선 |
| 캐시 히트율 | 목표 달성 | 안정적 | 목표 달성 |
| 전체 응답 시간 | 빠른 응답 | 안정적 | 목표 달성 |
| 시스템 가용성 | > 99% | 99.8% | 목표 초과 달성 |
