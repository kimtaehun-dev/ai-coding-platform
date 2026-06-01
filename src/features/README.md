# Layer: `features`

사용자가 수행하는 **행위/동작**. 각 슬라이스는 "사용자가 무엇을 _할 수_ 있는가?"에 답한다 (`auth-login`, `post-create`, `cart-add-item`).

## 규칙

- **Import 가능 대상:** `shared/*`, `entities/*`
- **Import 가능한 상위 레이어:** `widgets`, `views`, `app-init`
- **슬라이스 격리:** `features/auth-login`은 `features/post-create`를 import할 수 **없다**. 두 feature가 함께 필요하면 widget이나 view에서 조립한다.

## Slice 템플릿

```
features/<verb-noun>/
├── ui/                       # 컴포넌트 — PascalCase
│   ├── LoginForm.tsx
│   └── LoginForm.stories.tsx
├── model/                    # 훅, 상태, 검증 스키마 — kebab-case
│   └── use-login.ts
├── api/                      # 이 행위에 해당하는 mutation/query — kebab-case
│   └── login.ts
├── lib/                      # feature 전용 헬퍼 (옵션)
└── index.ts                  # PUBLIC API
```

## 네이밍

슬라이스 이름은 `<verb>-<noun>` 또는 `<domain>-<verb>` 형식을 사용한다.

- ✅ `auth-login`, `post-create`, `cart-add-item`, `editor-save`
- ❌ `login` (너무 일반적), `LoginForm` (폴더에 Pascal 사용 금지)

## Public API 규칙

```ts
// ✅ OK
import { LoginForm, useLogin } from '@/features/auth-login'

// ❌ 금지
import { LoginForm } from '@/features/auth-login/ui/LoginForm'
```
