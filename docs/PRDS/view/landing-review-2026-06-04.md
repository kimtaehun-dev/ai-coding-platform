# Landing 페이지 구현 — Codex 리뷰 결과

- 일시: 2026-06-04
- 대상 PRD: [/docs/PRDS/view/landing.md](./landing.md)
- 산출물: `src/shared/ui/{Hero,FeatureSection}.tsx`, `src/widgets/landing/`, `src/views/landing/`, `src/app/{layout,page}.tsx`
- 리뷰 주체: Codex (codex:rescue subagent)
- 응답·결정: Claude Code

---

## TL;DR

- **CRITICAL 0건**
- **즉시 적용한 수정 1건**: 이미지 공간 예약 (MAJOR — Codex 의견 채택)
- **대립 후 Claude 입장 유지 4건**: Fade 손대지 않음, CTA 정적 버튼 유지 등 (PRD/사용자 결정 보존)
- **사용자 결정 보류 4건**: Hero SSR invisibility, Hero 네이밍, Storybook 추가 케이스, reduced-motion 수동 검증
- 빌드 통과, lint 통과 (src/ 깨끗), fsd:lint exit 0

---

## 1. 즉시 수정 적용 (CRITICAL/MAJOR)

### M1. 이미지 공간 예약 — `aspect-video` + `width/height` attrs

**Codex 지적 (MAJOR)**

- `Fade`는 `show=false`일 때 children unmount → `min-h-105/120`만으로는 brittle.
- 이미지 width/height 속성 없음 → 슬로우 네트워크/오프라인 시 이미지 영역 collapse.

**Claude 입장**

- `min-h`는 vertical span 보장 목적이었음. 이미지 cell 자체 collapse는 별개 우려라는 지적 동의.
- Fade `keepMounted` 추가 vs 외부 wrapper 예약 — 후자가 Fade primitive 사양 불변 유지하면서 동일 효과.

**최종 결정 (Codex 의견 채택, 구현 방식만 분기)**

- `FeatureSection`: 이미지 cell을 `<div className="aspect-video w-full overflow-hidden rounded-lg bg-surface">` 로 감싸서 16:9 공간 항상 예약. `Fade` 시그니처는 손대지 않음.
- `Hero`: `<img>`에 `width={640} height={400}` 속성 추가 (intrinsic aspect ratio로 브라우저가 공간 예약). Hero는 Fade가 항상 show=true라 외부 wrapper 불필요.
- 두 컴포넌트 모두 `min-h-*`는 fallback으로 유지.

**관련 파일**

- [src/shared/ui/FeatureSection.tsx](../../../src/shared/ui/FeatureSection.tsx)
- [src/shared/ui/Hero.tsx](../../../src/shared/ui/Hero.tsx)

---

## 2. 대립 → Claude 입장 유지 (PRD/사용자 결정 보존)

### D1. `Fade` 수정 여부 (MAJOR)

| 입장     | 주장                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex    | `Fade`에 `keepMounted` 옵션 추가, 또는 scroll reveal 전용 wrapper 신설. unmount 자체가 brittle 원인이라 근본 해결 필요.                               |
| Claude   | PRD §FSD §Pre-decided 1에 "Fade는 손 안 댐, 시그니처 불변" 명시. 사용자가 브레인스토밍 단계에서 옵션 A를 명시적으로 선택. Fade 확장은 별도 의뢰 사항. |
| **채택** | **Claude (PRD/사용자 결정 우선)**                                                                                                                     |
| 후속     | 이번 문제는 §M1의 외부 wrapper로 우회. Fade 확장이 필요해지면 별도 의뢰서로.                                                                          |

### D2. CTA 버튼 접근성

| 입장     | 주장                                                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Codex    | `type="button"` + onClick 없음 = 스크린리더가 활성화 가능한 버튼으로 인식하지만 동작 없음. `disabled` 처리 또는 `<a>` placeholder 권장. |
| Claude   | 사용자가 브레인스토밍에서 "onClick 동작은 없이 그냥 버튼만 랜더링" 명시. Auth 흐름 추가 시 핸들러 주입 예정. PR 범위 외 변경 금지.      |
| **채택** | **Claude (사용자 결정 우선)**                                                                                                           |
| 후속     | Auth 후속 작업에서 `onClick` 또는 `<Link>`로 교체.                                                                                      |

### D3. Hero 네이밍 일반성 (MINOR)

| 입장     | 주장                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------- |
| Codex    | `Hero` 이름 + 고정 대형 타이포가 마케팅 랜딩에 고착. 다른 페이지에서 재사용 시 어색할 수 있음. 향후 `widgets`로 이동 고려.  |
| Claude   | 사용자가 "shared/ui에 Hero+Section 둘 다" 명시. props 기반 도메인-무관 구조라 일반성 확보됨. 현 시점 재사용처 없음 (YAGNI). |
| **채택** | **Claude (사용자 결정 + YAGNI)**                                                                                            |
| 후속     | 두 번째 사용처가 생기면 그때 일반화 vs widget 이동 판단.                                                                    |

### D4. Storybook 추가 케이스 (MINOR)

| 입장     | 주장                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| Codex    | 누락 케이스: (1) 긴 제목/CTA 라벨 오버플로, (2) 의미 있는 `imageAlt`, (3) 이미지 로드 실패, (4) reduced-motion 시연 |
| Claude   | PRD §Deliverables 스토리 의무는 충족. 추가 케이스는 scope creep.                                                    |
| **채택** | **Claude (스코프 유지)**                                                                                            |
| 후속     | 사용자가 필요하다 판단하면 후속 작업으로.                                                                           |

---

## 3. 사용자 결정 필요 (보류)

### Q1. Hero SSR Invisibility — Progressive Enhancement (MINOR)

**상황**

- Hero의 `Fade`가 `initial="hidden"` 상태로 SSR HTML 전송 → JS hydration 전까지 Hero 콘텐츠 invisible.
- 토큰 duration 0.2s라 정상 환경에선 거의 체감 안 됨.
- JS 비활성화 사용자 / 매우 느린 네트워크에선 Hero 영구 invisible 가능.

**옵션**
| 옵션 | 내용 | 트레이드오프 |
|------|------|------|
| A. 현 상태 유지 | Hero도 fadeIn 모션 그대로 | UX 일관성 유지, edge case 사용자 불이익 |
| B. Hero에서 Fade 제거 | Hero는 즉시 표시 | PE 안전, fadeIn 일관성 깨짐 |
| C. CSS-only fadeIn | `@keyframes` + animation으로 motion 우회 | PE 안전 + 모션 유지, 구현 추가 |

**Claude 추천**: A 유지. 0.2s + 정상 환경 가정. PE 우려가 실제 발생 시 C로 전환.

### Q2. Hero 위치 — `shared/ui` vs `widgets/landing-hero`

**상황** (D3 후속)

- 다른 페이지에서 Hero 재사용 의사가 있는가? 아니면 이 랜딩 전용인가?
- 향후 인사이트: 재사용 의사 없으면 `widgets/landing-hero`로 이동하는 게 더 깔끔.

**Claude 추천**: 현 상태 유지. 재사용처가 생기는 시점에 판단.

### Q3. picsum.photos 대체 시점

**상황**

- 현재 `<img src="https://picsum.photos/...">`. 외부 의존, Next Image 미사용.
- 빌드는 통과. 오프라인 개발 시 placeholder 깨질 수 있음.

**옵션**
| 옵션 | 내용 |
|------|------|
| A. 현 상태 유지 | 후속에 실제 썸네일 확보 후 Next Image + 도메인 화이트리스트 일괄 교체 |
| B. 로컬 placeholder | `public/images/landing-*.png` 정적 파일로 교체 (오프라인 안전) |

**Claude 추천**: A. 사용자가 "임시 사진" 명시했고 후속에 실제 자산 들어올 예정.

### Q4. Reduced-Motion 환경 + 느린 JS 조합 수동 검증

**상황**

- `Fade`가 `useReducedMotion`으로 duration 0 강제 처리.
- 다만 reduced-motion + hydration 지연 + in-view 평가 시점이 겹치면 일시 invisible 가능성.
- 자동 테스트 없음. 사용자 수동 확인 필요.

**검증 절차** (수동)

1. macOS 시스템 설정 → 손쉬운 사용 → 디스플레이 → "동작 줄이기" ON
2. `pnpm dev` → `/` 접속
3. Hero 즉시 표시 확인 (애니메이션 없이)
4. 스크롤하며 각 섹션 즉시 표시 확인 (fade 없이)
5. 결과 확인 후 설정 OFF

---

## 4. 합의 (Codex와 Claude 모두 OK 판정)

- **FSD 레이어링**: `app → views → widgets → shared` import 방향 준수. 도메인 카피는 `widgets/landing/model/`에 격리.
- **'use client' 경계**: `Hero`, `FeatureSection` client / `Landing`, `LandingView` server. RSC 흐름 정상. `actions` slot 직렬화 가능.
- **반응형 비대칭**: Hero(텍스트 위 / 이미지 아래) vs FeatureSection(이미지 위 / 텍스트 아래) 의도 명확, 구현 일치.
- **prefers-reduced-motion**: `Fade` 내부 `useReducedMotion` 처리 적절.

---

## 5. 검증 결과 (최종)

| 명령               | 결과                                                                          |
| ------------------ | ----------------------------------------------------------------------------- |
| `pnpm fsd:lint`    | exit 0, 4 warnings (`insignificant-slice` — config가 warn 처리)               |
| `pnpm lint` (src/) | 0 errors                                                                      |
| `pnpm lint` (전체) | 343 errors _but_ 전부 `.claude/skills/**/*.cjs` (git untracked, pre-existing) |
| `pnpm build`       | 성공, `/` 라우트 52.4 kB static prerender                                     |

**pre-existing 별건**: `pnpm lint`가 `.claude/`의 superpowers 스킬 스크립트까지 lint 함. eslint config의 `ignores`에 `.claude/**` 추가 필요. 이번 PR 범위 외라 미터치.

---

## 6. 내일 액션 (사용자용)

1. ☐ `/docs/PRDS/view/landing.md` 스펙 검토 (Hero 풀스크린/stagger 반영됨)
2. ☐ §3 Q1~Q4 결정 (특히 Q1 PE, Q4 수동 검증)
3. ☐ §7 추가 결정 (Toss 스타일 추가 적용 여부)
4. ☐ `pnpm dev` 실행 후 `/` 시각 확인 (모바일/데스크탑/스크롤/reduce-motion)
5. ☐ `.claude/`를 ESLint ignore에 추가할지 결정 (pre-existing 별건)
6. ☐ 머지 여부 결정

---

## 7. 사용자 피드백 반영 (2026-06-04 추가)

### F1. Hero 풀스크린 — 적용

**사용자 요청**: "Hero 페이지는 풀스크린이였으면 좋겠어" (참고: 토스 랜딩)

**적용**:
- `<section className="min-h-screen flex items-center px-6 py-20 md:py-28">` — viewport 100% 점유 + 콘텐츠 수직 중앙
- 컨테이너에 `w-full` 추가하여 grid가 전체 너비 사용
- PRD §Pre-decided 6 갱신

### F2. Hero 진입 delay (stagger) — 적용

**사용자 요청**: "조금의 딜레이가 있었으면 좋겠어. 지금은 거의 미리나와있거든"

**원인 분석**: Fade duration이 0.2s + delay 0이라 사용자가 인지하기 전에 끝남.

**적용**:
- 텍스트 Fade: `delay={0.3}` → 0.3s ~ 0.5s 사이에 진입
- 썸네일 Fade: `delay={0.5}` → 0.5s ~ 0.7s 사이에 진입 (stagger)
- 총 entry sequence: 약 0.7s, 시각적으로 인지 가능
- PRD §Pre-decided 3 갱신

### F3. Q5 — FeaturePage(페어/솔로 풀스크린) 적용

**사용자 결정**: "2개씩 묶어서 하나의 페이지처럼. 솔로는 가운데 정렬 풀스크린. 섹션 추가 고려해 renderer에 solo 정의 포함. 필요하면 묶음 컴포넌트 신설."

**구현**:
- 신규: [src/widgets/landing/ui/FeaturePage.tsx](../../../src/widgets/landing/ui/FeaturePage.tsx) — features 1~N 입력받아 pair/solo 분기 풀스크린 렌더
- `Landing.tsx`의 `chunkPairs(features)` — 2씩 묶고 홀수면 마지막 solo. 섹션 추가 시 자동 분할.
- 페어: `min-h-screen flex flex-col justify-center snap-start` — 상단부터 `PAIR_STAGGER_DELAY=0.3s` 간격 stagger
- 솔로: `min-h-screen flex items-center snap-start` — 중앙 정렬
- `FeatureSection`에 `delay?: number` prop 추가 (Fade로 전달)

**현재 페이지 구조** (5 features):

| 페이지 | 구성 | 동작 |
|--------|------|------|
| 1 | Hero | 마운트 stagger (텍스트 0.3s, 이미지 0.5s) |
| 2 | 페어: daily-limit + ai-generate | inView 시 상단 delay 0 / 하단 delay 0.3 |
| 3 | 페어: ai-hint + review | 동일 |
| 4 | 솔로: heatmap | inView 시 delay 0 |

### F4. Q6 — Scroll Snap 적용

**사용자 결정**: "Q5의 묶인 페이지를 스크롤할 때마다 하나씩 이동. 지금은 구분없이 자유 스크롤."

**구현**:
- `LandingView`의 `<main>`을 `h-dvh overflow-y-auto snap-y snap-mandatory`로 변경 — 컨테이너 내부 스크롤로 전환
- 모든 페이지(Hero / FeaturePage)에 `snap-start` 부여
- 휠/스와이프/PageDown 1회당 한 페이지 이동

**알려진 트레이드오프**:
- 컨테이너 스크롤로 전환 → 모바일 URL 바 자동 숨김 동작 변경. 일반 페이지보다 더 "앱처럼" 느껴짐 (Toss 의도).
- 매우 작은 viewport(< ~700px)에서 페어가 viewport보다 커지면 페어 내부에서 자유 스크롤 후 다음 스냅으로 진입. 페어가 클립되지 않게 의도.

### 추가 결정 필요 (Toss 스타일 후속)

| Q | 항목 | 현 상태 | 결정 필요 |
|---|------|--------|----------|
| ~~Q5~~ | ~~FeatureSection 풀스크린~~ | **F3 적용 완료** | — |
| ~~Q6~~ | ~~Scroll snap~~ | **F4 적용 완료** | — |
| Q7 | Hero 타이포 | `text-display-md` (2.75rem) | 더 키울지. `display-lg`(3.5rem)? |
| Q8 | 배경 그라데이션/장식 | 없음 | 추가 여부. |
| Q9 | 페이지 진입 delay | `PAGE_ENTRY_DELAY = 0.3s` + `PAIR_STAGGER_DELAY = 0.3s` (top 0.3 / bottom 0.6 / solo 0.3) | 짧/길면 조정 |
| Q10 | 페어/솔로 시각 비율 | 솔로 시 콘텐츠 동일 크기, 주변 여백만 큼 | 솔로일 때 텍스트·이미지 키울지 |

### F9. Q2 — Hero를 widgets/landing-hero로 이동 + Q3/D2/D4 후속

**사용자 결정**:
- Q2: Hero는 재사용 안할 거라 widgets로 이동
- Q3: picsum 교체는 TODO 주석으로
- D2: CTA 버튼에 TODO 주석
- D4: Codex 제안 스토리 케이스 추가

**구조 변경**:
- 신규 `widgets/landing-hero/`:
  - `model/hero-content.ts` — heroContent (title/subtitle/imageUrl) + Q3 TODO
  - `ui/LandingHero.tsx` — props 모두 optional, 기본값으로 heroContent + 기본 버튼(로그인/홈으로) 렌더 + D2 TODO
  - `ui/LandingHero.stories.tsx` — 9개 스토리 (Default · ImageLeft · NoSubtitle · NoActions · CustomActions · LongContent · MeaningfulImageAlt · BrokenImage · ReducedMotion)
  - `index.ts`
- 삭제: `src/shared/ui/Hero.tsx`, `src/shared/ui/Hero.stories.tsx`
- 수정 `widgets/landing/`:
  - `model/landing-content.ts` — heroContent 제거, features만 + Q3 TODO
  - `ui/Landing.tsx` — Hero import/렌더 제거, FeaturePage 조립만
  - `ui/Landing.stories.tsx` — 설명 갱신
- 수정 `views/landing/ui/LandingView.tsx` — `<LandingHero/>` + `<Landing/>` 조립
- 신규 `src/shared/lib/motion/index.ts` — public API (FSD `no-public-api-sidestep` 룰 충족)
- 수정 `src/shared/ui/FeatureSection.tsx`, `widgets/landing-hero/ui/LandingHero.tsx` — `@/shared/lib/motion`으로 import 경로 정리

**FSD 슬라이스 격리 반영**: widget이 widget을 import 못 함 → LandingHero + Landing 조립은 view 레이어로 이동.

**D4 스토리 추가** (Hero 9개 + FeatureSection +3개):
- LandingHero: LongContent, MeaningfulImageAlt, BrokenImage, ReducedMotion
- FeatureSection: MeaningfulImageAlt, BrokenImage, ReducedMotion

**검증**:
- `pnpm build` 성공 (`/` 54.9 kB static)
- `pnpm fsd:lint` exit 0, 5 warnings (insignificant-slice)

---

### F7. Q8 배경 — Vertical Gradient + Dot Grid (약)

**사용자 결정**: A(gradient) + C(dot grid) 조합. 점 세기 "약" (1.5px / 22px / 0.45).

**적용**:
- [src/views/landing/ui/LandingView.tsx](../../../src/views/landing/ui/LandingView.tsx) — `<main>` 배경에 두 레이어:
  1. 점 패턴: `radial-gradient(circle, color-mix(in oklch, var(--color-foreground-subtle) 45%, transparent) 1.5px, transparent 1.5px) 0 0 / 22px 22px`
  2. 그라데이션: `linear-gradient(180deg, --color-background 0%, --color-surface-elevated 50%, --color-background 100%)`
- 컨테이너 스크롤 → 배경 자리 유지 (parallax)
- semantic token 기반 → 다크모드 자동

### F8. FeatureSection 내부 stagger — 텍스트 먼저 / 이미지 0.2s 뒤 (Q9)

**사용자 결정**: "텍스트가 먼저 나오고 이미지가 뒤에 나오면 좋겠어 조금 딜레이를 둬서"

**적용**:
- [src/shared/ui/FeatureSection.tsx](../../../src/shared/ui/FeatureSection.tsx) — `INTERNAL_IMAGE_OFFSET = 0.2` 상수
- 텍스트 Fade: `delay = props.delay`
- 이미지 Fade: `delay = props.delay + INTERNAL_IMAGE_OFFSET`
- Hero의 stagger 패턴(text 0.3 / image 0.5)과 일관
- 페어 bottom: text 0.6 / image 0.8 (전체 1초)

### F6. FeatureSection 높이 viewport-relative로 변경 (3회차 피드백)

**사용자 피드백**: "썸네일 크기가 고정으로 되어있나? 작은 디바이스에서 페이지처럼 넘어간 다음에 한번 스크롤하게 되어있네."

**원인 분석**:
- 썸네일 자체는 고정 아님 (`aspect-video w-full`로 컬럼 폭 추종). `width=640 height=360`은 intrinsic ratio 힌트.
- 진짜 문제: `FeatureSection`의 `min-h-105/120` + `py-16/24` 합산 → 작은 viewport(< ~900px)에서 페어(2섹션)가 viewport 초과 → snap 후 한 번 더 스크롤 필요.

**적용**:
- [src/shared/ui/FeatureSection.tsx](../../../src/shared/ui/FeatureSection.tsx) 수정:
  - `min-h-105 md:min-h-120` 제거 (콘텐츠 + 패딩이 높이 결정)
  - `py-16 md:py-24` → `py-6 md:py-10`
  - `gap-10 md:gap-16` → `gap-6 md:gap-10`
  - 이미지 셀에 `max-h-[28dvh] mx-auto` 추가 → aspect-video 유지하되 28dvh로 캡, 좁고 키 큰 viewport에선 너비 축소·가운데 정렬
- 결과: 페어가 700~1440px viewport 전 범위에서 한 화면 안에 맞음. snap 1회 = 콘텐츠 1페이지 완전 노출.

**계산 검증**:
| Viewport | image h | section h | pair h | 결과 |
|---------|---------|----------|--------|------|
| 700 (mobile) | 196 | ~324 | 648 | < 700 ✓ |
| 900 (small desktop) | 252 | ~412 | 824 | < 900 ✓ |
| 1080 | 302 | ~462 | 924 | < 1080 ✓ |
| 1440 | 403 | ~563 | 1126 | < 1440 ✓ |

---

### F5. 페이지 진입 base delay 추가 (2회차 피드백)

**사용자 피드백**: "각 섹션의 첫번째로 나오는 요소가 너무 빨리 나와서 애니메이션이 없는 것처럼 느껴져"

**원인 분석**: `useInView`가 스크롤 중에 발화 → snap 완료 전에 fade 끝남 → "이미 있던 것"처럼 보임. top section의 `delay=0`이 핵심 원인.

**적용**:
- `FeaturePage`에 `PAGE_ENTRY_DELAY = 0.3s` 신설
- 페어 top: `delay = 0.3s` (was 0)
- 페어 bottom: `delay = 0.6s` (was 0.3)
- 솔로: `delay = 0.3s` (was 0)
- Hero는 이전부터 stagger(0.3/0.5) 적용돼 있어 영향 없음

시각 확인 후 결정.
