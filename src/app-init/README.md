# Layer: `app-init`

FSD의 "app" 레이어 — **앱 전역 초기화**. Next.js 라우팅 폴더(`app/`)와의 충돌을 피하기 위해 rename함.

provider, 전역 스타일, 모든 페이지를 감싸는 앱 수준 설정을 담는다.

## 규칙

- **Import 가능 대상:** 모든 하위 레이어
- **Import 가능한 상위:** `src/app/layout.tsx` (Next 루트 레이아웃)
- FSD 스택의 최상단 — `src/` 내부에서 Next 라우트 파일 외에는 이 레이어를 import하지 않는다.

## 하위 폴더

| Folder       | 용도                                              |
| ------------ | ------------------------------------------------- |
| `providers/` | React context provider (Query, Theme, Toaster, …) |
| `styles/`    | 전역 CSS import, 디자인 토큰 진입점 (옵션)        |

## 예시

```tsx
// src/app-init/providers/app-providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const client = new QueryClient()
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

```tsx
// src/app/layout.tsx
import { AppProviders } from '@/app-init/providers/app-providers'
import { MainLayout } from '@/widgets/main-layout'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          <MainLayout>{children}</MainLayout>
        </AppProviders>
      </body>
    </html>
  )
}
```
