# View Spec: Landing — 메인 랜딩 페이지 의뢰서

> 진입점. 한 줄로 의뢰: _"docs/PRDS/view/landing.md 따라 의뢰"_.
> 산출물: shared primitive 2 + widget 1 + view 1 + Next 라우트(layout+page) 복원.

---

## ⚑ Pre-read

- [/AGENTS.md](/AGENTS.md) — FSD 매핑·import 방향·결정 트리
- [/src/views/README.md](/src/views/README.md) — views 슬라이스 룰
- [/src/widgets/README.md](/src/widgets/README.md) — widgets 슬라이스 룰
- [/src/shared/lib/motion/Fade.tsx](/src/shared/lib/motion/Fade.tsx) — fadeIn primitive (그대로 사용, 시그니처 불변)
- [/docs/design-system/runtime-motion-system.md](/docs/design-system/runtime-motion-system.md) — motion 토큰 사양

---

## ⚑ Goal

`/` 라우트에 렌더되는 1-스크롤 랜딩 페이지. Hero 1개 + Feature 섹션 5개. 좌우 fadeIn motion으로 강조.

- Hero: 마운트 즉시 fadeIn
- Feature 5섹션: 스크롤 진입 시 fadeIn 1회 (replay 없음)
- 5섹션 지그재그 (홀수=썸네일 좌, 짝수=썸네일 우)
- 썸네일은 picsum.photos seed 고정 임시 이미지

---

## ⚑ FSD 위치

| 산출 | 위치 | 역할 |
|------|------|------|
| `LandingHero` widget | `src/widgets/landing-hero/` | 좌우 split + 마운트 fadeIn. 카피·CTA 기본값 내장 (props로 override 가능). Q2 결정으로 widgets로 이동 |
| `FeatureSection` | `src/shared/ui/FeatureSection.tsx` (+stories) | 도메인-무관 좌우 split + 스크롤 fadeIn primitive |
| `FeaturePage` (헬퍼) | `src/widgets/landing/ui/FeaturePage.tsx` | FeatureSection 1~2개를 풀스크린 페어/솔로 페이지로 묶음 |
| `Landing` widget | `src/widgets/landing/` | FeaturePage들 조립 (5섹션 → 2-2-1 페어/솔로) |
| `LandingView` | `src/views/landing/` | `<LandingHero/>` + `<Landing/>` + 배경/scroll-snap 컨테이너. 두 widget 조립은 view 레이어 책임 (FSD 슬라이스 격리). 나중: `<Header/><LandingHero/><Landing/><Footer/>` |
| Next 라우트 | `src/app/layout.tsx`, `src/app/page.tsx` | layout + page에서 `<LandingView/>` |

---

## ⚑ Pre-decided

### 1. Scroll trigger 구현 방식

`motion/react`의 `useInView`를 `FeatureSection` 내부에서 호출하고 `<Fade show={inView} direction=...>` 에 주입. `Fade` 시그니처 불변, 별도 wrapper 안 만듦.

```tsx
const ref = useRef<HTMLDivElement>(null)
const inView = useInView(ref, { once: true, amount: 0.3 })
```

- `once: true` — 1회만 재생
- `amount: 0.3` — 섹션의 30%가 뷰포트에 들어왔을 때 트리거

### 2. 지그재그 매핑

```ts
// widgets/landing/ui/Landing.tsx
sections.map((s, idx) => (
  <FeatureSection {...s} imageSide={idx % 2 === 0 ? 'left' : 'right'} />
))
```

- 0,2,4 → 썸네일 좌
- 1,3 → 썸네일 우

### 3. fadeIn 방향 규칙 + Hero stagger

- 썸네일 = 위치한 쪽 바깥에서 들어옴 (`imageSide='left'` → `direction='left'`, 즉 왼쪽에서 슬라이드 인)
- 텍스트 = 반대 방향 (`imageSide='left'` → 텍스트는 `direction='right'`, 오른쪽에서 슬라이드 인)
- Hero: 텍스트 `delay=0.3s`, 썸네일 `delay=0.5s` (stagger — 진입 후 인지 가능한 모션을 위해 토스 랜딩 패턴 참고)
- FeatureSection: delay 없음 (스크롤 트리거 자체가 사용자 명시적 액션)
- 토큰 값(`motionDistance.fade=8`, `motionDuration.fade=0.2`, `motionEasing.fade='easeOut'`)은 Fade가 내부에서 처리

### 4. 임시 썸네일

`https://picsum.photos/seed/{slug}/640/360` (seed 고정 → 안정).
Next Image 미사용 (외부 도메인 설정 우회). `<img>` 태그 사용. 후속에서 Next Image + 도메인 화이트리스트로 교체.

### 5. Hero 슬롯 — 도메인 무관 유지

`Hero` primitive는 카피·버튼을 모름. `actions?: ReactNode` 슬롯으로 widget에서 주입.

```tsx
<Hero
  title="..."
  subtitle="..."
  imageUrl="..."
  actions={<><Button>로그인</Button><Button variant="outline">홈으로</Button></>}
/>
```

버튼은 `onClick` 없이 정적 렌더. 추후 auth 연결 시 widget에서 핸들러 주입.

### 6. 반응형 + 풀스크린 페이지 + Scroll Snap (Q5/Q6)

- **Scroll snap 컨테이너**: `LandingView`의 `<main>`이 `h-dvh overflow-y-auto snap-y snap-mandatory`. 휠/스와이프 1회당 한 페이지 이동.
- **Hero**: `min-h-screen flex items-center` — viewport 100% 점유. Landing widget이 `snap-start`로 감싸 첫 스냅 타겟.
- **FeaturePage** (widget 헬퍼): FeatureSection 1~2개를 풀스크린 한 페이지로 묶음. `min-h-screen snap-start`. features는 `chunkPairs`로 2씩 분할, 홀수면 마지막은 solo.
  - **페어(2개)**: `flex flex-col justify-center`, 상단부터 stagger fadeIn (`PAIR_STAGGER_DELAY = 0.3s`)
  - **솔로(1개)**: `flex items-center` 중앙 정렬
- **FeatureSection**: viewport-relative sizing
  - 패딩: `py-6 md:py-10`
  - 이미지 셀: `aspect-video w-full max-h-[28dvh] mx-auto` — 16:9 유지하되 28dvh로 캡 → 페어가 700~1440px viewport 전 범위에서 한 화면 안에 맞음
  - `min-h` 없음 (콘텐츠 + 패딩이 height 결정)

### 8. 배경 — Vertical Gradient + Dot Grid (Q8 결정)

`LandingView`의 `<main>`에 두 레이어 동시 부착:
1. **점 패턴**: `radial-gradient(circle, color-mix(in oklch, var(--color-foreground-subtle) 45%, transparent) 1.5px, transparent 1.5px)` / size 22×22
2. **그라데이션**: `linear-gradient(180deg, --color-background 0%, --color-surface-elevated 50%, --color-background 100%)`

- 모든 page(Hero, FeaturePage)가 같은 배경 공유
- 컨테이너 스크롤 시 배경 자리 유지 → parallax 효과
- semantic token 사용으로 다크모드 자동 매핑
- 데스크탑(≥ md): `grid-cols-2` 좌우 split
- 모바일(< md): 1-column 스택
  - Hero: 텍스트 위 / 이미지 아래
  - FeatureSection: 이미지 위 / 텍스트 아래
- 모바일에서 `imageSide` prop은 시각 차이 없음. fadeIn 방향은 유지.

### 7. 'use client' 경계

- `Hero`, `FeatureSection` — `'use client'` (motion 사용)
- `Landing` widget — server component (조립만)
- `LandingView` — server component
- `src/app/page.tsx` — server component (default)

---

## ⚑ Deliverables

### 1. `src/shared/ui/Hero.tsx` (+`Hero.stories.tsx`)

#### 시그니처

```tsx
'use client'
import type { ReactNode } from 'react'

export interface HeroProps {
  title: string
  subtitle?: string
  imageUrl: string
  imageAlt?: string
  imageSide?: 'left' | 'right'   // default 'right'
  actions?: ReactNode
}

export function Hero(props: HeroProps): JSX.Element
```

#### 동작

- `min-h-screen flex items-center` 풀스크린, 콘텐츠 수직 중앙
- 마운트 후 stagger fadeIn: 텍스트 `delay=0.3s`, 썸네일 `delay=0.5s`
- 텍스트 쪽 direction = `imageSide`와 반대
- 썸네일 쪽 direction = `imageSide`
- 모바일에서는 텍스트 위, 이미지 아래로 stack

#### 스토리

| 스토리 | 시연 |
|--------|------|
| `Default` | imageSide='right' 기본 |
| `ImageLeft` | imageSide='left' |
| `WithActions` | actions 슬롯에 Button 2개 (로그인/홈으로) |
| `NoSubtitle` | subtitle 생략 |

### 2. `src/shared/ui/FeatureSection.tsx` (+`FeatureSection.stories.tsx`)

#### 시그니처

```tsx
'use client'

export interface FeatureSectionProps {
  title: string
  description: string
  imageUrl: string
  imageAlt?: string
  imageSide?: 'left' | 'right'   // default 'left'
  delay?: number                  // fadeIn delay (sec) — pair stagger 제어용
}

export function FeatureSection(props: FeatureSectionProps): JSX.Element
```

#### 동작

- 내부 `useRef` + `useInView(ref, { once: true, amount: 0.3 })`
- `<Fade show={inView}>` 으로 양쪽 fadeIn
- 텍스트 쪽 direction = `imageSide`와 반대
- 썸네일 쪽 direction = `imageSide`

#### 스토리

| 스토리 | 시연 |
|--------|------|
| `ImageLeft` | imageSide='left' (홀수 섹션 패턴) |
| `ImageRight` | imageSide='right' (짝수 섹션 패턴) |
| `LongDescription` | 디스크립션 3-4줄 |
| `Stack` | 5섹션 연속 배치 (지그재그 확인용) |

### 3. `src/widgets/landing/`

```
widgets/landing/
├── ui/
│   ├── Landing.tsx
│   ├── Landing.stories.tsx
│   └── FeaturePage.tsx        # ← Q5/Q6 후속: pair/solo 풀스크린 페이지 헬퍼
├── model/
│   └── landing-content.ts
└── index.ts
```

#### `model/landing-content.ts`

```ts
import type { ReactNode } from 'react'

export interface LandingHeroContent {
  title: string
  subtitle: string
  imageUrl: string
}

export interface LandingFeature {
  id: string
  title: string
  description: string
  imageUrl: string
}

export const heroContent: LandingHeroContent = {
  title: 'AI와 함께 매일 코딩테스트',
  subtitle: '하루 2문제, 꾸준한 습관과 AI 맞춤 학습으로 코딩테스트를 준비하세요.',
  imageUrl: 'https://picsum.photos/seed/landing-hero/640/400',
}

export const features: readonly LandingFeature[] = [
  {
    id: 'daily-limit',
    title: '하루 딱 2문제, 무리 없이 매일',
    description: '과부하 대신 꾸준함. 매일 정해진 분량으로 학습 습관을 만듭니다.',
    imageUrl: 'https://picsum.photos/seed/landing-daily-limit/640/360',
  },
  {
    id: 'ai-generate',
    title: '원하는 난이도·유형으로 즉시 생성',
    description: 'Level과 알고리즘 유형을 고르면 AI가 새 문제를 만들어줍니다. (예: Level 2 해시)',
    imageUrl: 'https://picsum.photos/seed/landing-ai-generate/640/360',
  },
  {
    id: 'ai-hint',
    title: '답이 아닌 방향을 알려주는 힌트',
    description: '"Map을 활용해보세요", "반례를 생각해보세요" — 사고를 막지 않는 단계별 안내.',
    imageUrl: 'https://picsum.photos/seed/landing-ai-hint/640/360',
  },
  {
    id: 'review',
    title: '틀린 문제는 자동으로 모입니다',
    description: '실패한 문제는 오답 노트로 저장되어 언제든 다시 풀 수 있습니다.',
    imageUrl: 'https://picsum.photos/seed/landing-review/640/360',
  },
  {
    id: 'heatmap',
    title: '잔디로 보는 나의 성장',
    description: 'GitHub 잔디 형태로 매일의 학습 기록을 시각화합니다.',
    imageUrl: 'https://picsum.photos/seed/landing-heatmap/640/360',
  },
] as const
```

#### `ui/FeaturePage.tsx`

```tsx
import { FeatureSection } from '@/shared/ui/FeatureSection'
import type { LandingFeature } from '../model/landing-content'

const PAIR_STAGGER_DELAY = 0.3  // 페어 내 상→하 stagger (초)

interface FeaturePageProps {
  features: readonly LandingFeature[]
  startIndex: number              // 전역 idx — 페이지 간 imageSide 지그재그 유지
}

export function FeaturePage({ features, startIndex }: FeaturePageProps) {
  if (features.length === 0) return null
  if (features.length === 1) {
    // solo: 풀스크린 중앙 정렬
    return (
      <div className="min-h-screen flex items-center snap-start">
        <FeatureSection {...features[0]} imageSide={startIndex % 2 === 0 ? 'left' : 'right'} />
      </div>
    )
  }
  // pair: 풀스크린 + 상단부터 stagger
  return (
    <div className="min-h-screen flex flex-col justify-center snap-start">
      {features.map((f, i) => (
        <FeatureSection
          key={f.id}
          {...f}
          imageSide={(startIndex + i) % 2 === 0 ? 'left' : 'right'}
          delay={i * PAIR_STAGGER_DELAY}
        />
      ))}
    </div>
  )
}
```

#### `ui/Landing.tsx`

```tsx
import { Button } from '@/shared/ui/Button'
import { Hero } from '@/shared/ui/Hero'
import { features, heroContent, type LandingFeature } from '../model/landing-content'
import { FeaturePage } from './FeaturePage'

function chunkPairs(arr: readonly LandingFeature[]): LandingFeature[][] {
  const result: LandingFeature[][] = []
  for (let i = 0; i < arr.length; i += 2) result.push(arr.slice(i, i + 2))
  return result
}

export function Landing() {
  const pages = chunkPairs(features)
  return (
    <>
      <div className="snap-start">
        <Hero
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          imageUrl={heroContent.imageUrl}
          actions={
            <>
              <Button type="button">로그인</Button>
              <Button type="button" variant="outline">홈으로</Button>
            </>
          }
        />
      </div>
      {pages.map((page, idx) => (
        <FeaturePage key={page[0].id} features={page} startIndex={idx * 2} />
      ))}
    </>
  )
}
```

#### `index.ts`

```ts
export { Landing } from './ui/Landing'
```

#### 스토리

| 스토리 | 시연 |
|--------|------|
| `Default` | 전체 렌더 (Storybook viewport 큰 사이즈 권장) |

### 4. `src/views/landing/`

```
views/landing/
├── ui/
│   └── LandingView.tsx
└── index.ts
```

#### `ui/LandingView.tsx`

```tsx
import { Landing } from '@/widgets/landing'

export function LandingView() {
  // h-dvh + overflow-y-auto + snap-y snap-mandatory:
  // 휠/스와이프 1회당 한 페이지(Hero or FeaturePage) 이동
  return (
    <main className="h-dvh overflow-y-auto snap-y snap-mandatory">
      <Landing />
    </main>
  )
}
```

#### `index.ts`

```ts
export { LandingView } from './ui/LandingView'
```

stories 없음 (페이지 조립 컴포넌트 — views/README 가이드 §Storybook 규칙 적용 대상 아님).

### 5. Next 라우트 복원

#### `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Coding Test Trainer',
  description: 'AI 기반 코딩테스트 학습 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
```

#### `src/app/page.tsx`

```tsx
import { LandingView } from '@/views/landing'

export default function Page() {
  return <LandingView />
}
```

---

## ⚑ Post-handoff Checklist

- [ ] `pnpm lint` 통과
- [ ] `pnpm fsd:lint` 통과 (steiger)
- [ ] `pnpm build` 통과
- [ ] Storybook에서 Hero / FeatureSection 4스토리 + Landing Default 렌더 확인
- [ ] `/` 진입 시 Hero 마운트 fadeIn, 스크롤 시 각 섹션 1회 fadeIn 동작 확인
- [ ] 모바일 뷰포트(< md)에서 1-column stack 확인
- [ ] `prefers-reduced-motion: reduce` 시 즉시 표시 확인 (Fade 내부에서 처리)
- [ ] Hero 버튼 onClick 없음 (정적 렌더 확인)

---

## Version

v1.0
