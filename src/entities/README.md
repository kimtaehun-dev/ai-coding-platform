# Layer: `entities`

도메인 모델. 각 슬라이스는 하나의 비즈니스 엔티티(`user`, `post`, `problem`)에 대응한다.

## 규칙
- **Import 가능 대상:** `shared/*`
- **Import 가능한 상위 레이어:** `features`, `widgets`, `views`, `app-init`
- **슬라이스 격리:** `entities/user`는 `entities/post`를 import할 수 **없다**. 두 엔티티가 함께 필요하면 feature나 widget에서 조립한다.

## Slice 템플릿
```
entities/<entity-name>/
├── ui/                       # 표현용 컴포넌트 (card, badge, avatar)
│   ├── user-card.tsx
│   └── user-card.stories.tsx
├── model/                    # 타입, 스키마, selector, atom/store
│   └── types.ts
├── api/                      # endpoint, query key, fetcher
│   └── user-api.ts
├── lib/                      # 엔티티 전용 헬퍼 (옵션)
└── index.ts                  # PUBLIC API — 외부 노출 항목만
```

## Public API 규칙
외부 코드는 **슬라이스 루트**에서만 import한다.
```ts
// ✅ OK
import { UserCard, type User } from "@/entities/user";

// ❌ 금지 — 깊은 경로 import는 public 계약을 우회한다
import { UserCard } from "@/entities/user/ui/user-card";
```

## 여기 속하지 않는 것
- 사용자 **행위** ("login", "follow user") → `features/`
- 페이지 조합 → `widgets/` 또는 `views/`
