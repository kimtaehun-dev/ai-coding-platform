# Layer: `widgets`

여러 feature/entity를 조합해 의미 있는 한 블록을 이루는 자립형 UI (`header`, `sidebar`, `main-layout`, `problem-board`).

## 규칙
- **Import 가능 대상:** `shared/*`, `entities/*`, `features/*`
- **Import 가능한 상위 레이어:** `views`, `app-init`
- **슬라이스 격리:** widget은 다른 widget을 import할 수 **없다**.

## Slice 템플릿
```
widgets/<widget-name>/
├── ui/
│   ├── header.tsx
│   └── header.stories.tsx
├── model/                    # widget 내부 상태 (옵션)
├── lib/                      # widget 전용 헬퍼 (옵션)
└── index.ts                  # PUBLIC API
```

## 레이아웃 widget
페이지 상단 chrome (Header, Sidebar, MainLayout)은 여기에 둔다. Next.js 루트 레이아웃 `src/app/layout.tsx`는 widget을 import하는 얇은 wrapper다.

## Public API 규칙
```ts
// ✅ OK
import { MainLayout } from "@/widgets/main-layout";

// ❌ 금지
import { MainLayout } from "@/widgets/main-layout/ui/main-layout";
```
