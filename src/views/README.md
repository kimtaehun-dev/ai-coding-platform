# Layer: `views`

페이지 단위 조합. **FSD의 `pages/`를 Next.js 라우팅 컨벤션과의 충돌을 피하기 위해 rename함.** 각 슬라이스는 사용자가 보는 페이지 한 화면에 대응한다.

## 규칙
- **Import 가능 대상:** `shared/*`, `entities/*`, `features/*`, `widgets/*`
- **Import 가능한 상위 레이어:** `app-init`, 그리고 `src/app/**` (Next 라우트)
- **슬라이스 격리:** view는 다른 view를 import할 수 **없다**.

## Slice 템플릿
```
views/<page-name>/
├── ui/
│   ├── home-view.tsx
│   └── home-view.stories.tsx
├── model/                    # 페이지 전용 상태/로더 (옵션)
└── index.ts                  # PUBLIC API
```

## Next.js `src/app/`과의 관계
`src/app/page.tsx`와 라우트 핸들러는 **얇은 wrapper**여야 한다.
1. Next 전용 관심사(metadata, 서버 데이터 페칭)만 처리
2. 이 레이어의 view를 렌더

```tsx
// src/app/page.tsx
import { HomeView } from "@/views/home";
export default function Page() {
  return <HomeView />;
}
```

이렇게 두면 view 컴포넌트가 Next 라우트 컨텍스트 없이도 Storybook에서 검증 가능하다.
