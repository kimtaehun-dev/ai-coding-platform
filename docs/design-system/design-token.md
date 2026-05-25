# Design Token System — 사용 가이드

> 이 문서는 **앞으로 컴포넌트를 만들거나 수정할 때마다 참조**하는 시스템 정의다.
> 토큰의 구조, 위치, 사용법, 다크 모드 동작을 모두 다룬다.
> 토큰 값 자체의 **생성 절차**는 `/docs/PRDS/design-system/design-token.md`를 참조.

---

## 1. Purpose

이 시스템은 모든 UI 컴포넌트가 따르는 **단일 시각 진실 소스(single source of visual truth)**다.

목적:

- shadcn 컴포넌트와 자체 컴포넌트가 같은 토큰 사용
- light / dark 모드 자동 전환
- WCAG 접근성 보장
- 디자인 변경 시 토큰 한 곳만 수정하면 전체 반영

---

## 2. Architecture

```
Primitive Palette
      ↓
Semantic Tokens
      ↓
Component Tokens (필요 시)
```

| Layer         | 사용 가능 위치                        | 예시                    |
| ------------- | ------------------------------------- | ----------------------- |
| **Primitive** | 토큰 정의 내부에서만                  | `primary-40`            |
| **Semantic**  | 컴포넌트가 사용하는 **유일한** 레이어 | `primary`, `background` |
| **Component** | 컴포넌트 전용 변형 필요 시만          | `button-primary-bg`     |

**규칙: 컴포넌트는 semantic 이름만 사용한다.** primitive를 직접 호출하면 PR에서 거부된다.

---

## 3. 색공간

모든 색은 **OKLCH**로 표기한다.

```css
/* ✅ */
--color-primary: oklch(0.58 0.2 260);

/* ❌ 금지 */
--color-primary: #2e5bff;
--color-primary: rgb(46 91 255);
```

이유:

- Tailwind v4 표준
- 광색역(P3) 호환
- lightness 축이 시각적 균일성에 가까움 → tonal scale 자연스러움

---

## 4. File Layout

```
src/app/globals.css                       # Next/Tailwind 진입점. 모든 토큰 파일 @import
src/app-init/styles/tokens/
├── palette.css                           # @theme — primitive palette 5종 × 13단계
├── semantic.css                          # @theme — light mode semantic 토큰
├── dark.css                              # @layer base { .dark { ... } } — dark 오버라이드
├── typography.css                        # @theme — 18개 typography 스케일
├── spacing.css                           # @theme — spacing + radius
└── elevation.css                         # @theme — shadow + z-index
```

### `globals.css` 상단에 manifest 코멘트 (에이전트 진입점)

```css
/* ───────────────────────────────────────────
 * Design Token Manifest
 * 토큰 추가 시 카테고리에 맞는 파일에 작성.
 * - palette.css     : primitive color palette
 * - semantic.css    : semantic tokens (light defaults)
 * - dark.css        : dark mode overrides
 * - typography.css  : type scale
 * - spacing.css     : spacing + radius
 * - elevation.css   : shadow + z-index
 * ─────────────────────────────────────────── */
@import 'tailwindcss';
@import '../app-init/styles/tokens/palette.css';
@import '../app-init/styles/tokens/semantic.css';
@import '../app-init/styles/tokens/typography.css';
@import '../app-init/styles/tokens/spacing.css';
@import '../app-init/styles/tokens/elevation.css';
@import '../app-init/styles/tokens/dark.css';
```

---

## 5. Dark Mode 메커니즘

### 전략: class-based (`<html class="dark">`)

- 라이브러리: **`next-themes`** 권장 (시스템 prefers + 수동 토글 모두 지원)
- Tailwind v4의 `@custom-variant`로 `dark:` 유틸리티 활성화

### `semantic.css` 형태

```css
/* light mode가 기본값 */
@theme {
  --color-background: oklch(0.99 0.005 260);
  --color-foreground: oklch(0.12 0.01 260);
  --color-primary: oklch(0.45 0.18 260);
  /* ... */
}
```

### `dark.css` 형태

```css
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  .dark {
    --color-background: oklch(0.12 0.01 260);
    --color-foreground: oklch(0.95 0.005 260);
    --color-primary: oklch(0.75 0.14 260);
    /* ... */
  }
}
```

→ `@theme`은 변수 정의 + Tailwind 유틸리티 자동 생성, `.dark`는 변수 값만 덮어씀.
→ 결과: `bg-primary` 한 클래스가 라이트/다크에서 자동으로 다른 색 사용.

---

## 6. Token Categories (전체 목록)

### Primitive Palette (65개)

- `primary-{0..100}` × 13단계
- `secondary-{0..100}` × 13단계
- `neutral-{0..100}` × 13단계
- `neutral-variant-{0..100}` × 13단계
- `error-{0..100}` × 13단계

### Semantic — Surface

`background` · `surface` · `surface-muted` · `surface-elevated` · `surface-overlay`

### Semantic — Text (Foreground)

`foreground` · `foreground-muted` · `foreground-subtle` · `foreground-inverse`

### Semantic — Border

`border` · `border-muted` · `border-strong` · `outline` · `outline-variant`

### Semantic — Interactive

`primary` · `on-primary` · `secondary` · `on-secondary`

### Semantic — Feedback

`error` · `on-error` · `success` · `on-success` · `warning` · `on-warning` · `info` · `on-info`

### Semantic — Interaction States

클릭 가능한 요소가 사용자 입력에 반응할 때 사용. `:hover`, `:active`(눌림) 의사 클래스에 1:1 매핑한다.

| 카테고리       | 토큰                                                      | 비고                                       |
| -------------- | --------------------------------------------------------- | ------------------------------------------ |
| primary 상태   | `primary-hover` · `primary-active`                        | base = `primary`                           |
| secondary 상태 | `secondary-hover` · `secondary-active`                    | base = `secondary`                         |
| error 상태     | `error-hover` · `error-active`                            | shadcn `destructive`와도 호환              |
| surface 상태   | `surface-hover` · `surface-active`                        | 클릭 가능한 카드 / 리스트 행 / 메뉴 아이템 |
| focus          | `focus-ring`                                              | 반투명(alpha 0.4). box-shadow ring으로 적용 |
| disabled       | `--state-disabled` (= 0.38)                               | 색상 대신 opacity로 처리                    |

**모드별 변화 방향**

- light → 더 어둡게 (L 감소): 눌리는 느낌
- dark → 더 밝게 (L 증가): 올라오는 느낌

두 모드 모두 "더 강해진" 인지 효과로 통일된다.

### State Layer Opacity (Material 스타일 오버레이)

위의 명시적 토큰으로 커버되지 않는 케이스(예: ghost 버튼)에서 같은 hue를 옅게 덮어쓰기 위한 alpha 값.

`--state-hover (0.08)` · `--state-pressed (0.12)` · `--state-focus (0.12)` · `--state-selected (0.16)` · `--state-disabled (0.38)`

> ⚠️ 신규 버튼/링크 컴포넌트는 위의 명시 토큰(`primary-hover` 등)을 우선 사용한다. State layer는 보조용.

### Typography (18개)

- Display: `display-lg/md/sm`
- Headline: `headline-lg/md/sm`
- Title: `title-lg/md/sm`
- Body: `body-lg/md/sm`
- Label: `label-lg/md/sm`
- Utility: `caption` · `code` · `code-sm`

### Shape

`radius-xs/sm/md/lg/xl/full`

### Spacing

`space-1/2/4/6/8/10/12/16/20`

### Elevation

`level-0/1/2/3/4/5`

### Z-index

`z-base/sticky/dropdown/popover/modal/toast/tooltip`

---

## 7. 컴포넌트에서 사용하기

### Tailwind 유틸리티 (자동 생성)

`@theme`에 정의된 `--color-*`, `--text-*`, `--spacing-*` 등은 Tailwind가 유틸리티 클래스로 자동 변환한다.

| CSS 변수             | 생성되는 유틸리티                                              |
| -------------------- | -------------------------------------------------------------- |
| `--color-primary`    | `bg-primary`, `text-primary`, `border-primary`, `ring-primary` |
| `--color-foreground` | `text-foreground`, `bg-foreground`                             |
| `--text-headline-lg` | `text-headline-lg`                                             |
| `--spacing-4`        | `p-4`, `m-4`, `gap-4`, `space-x-4`                             |
| `--radius-md`        | `rounded-md`                                                   |
| `--shadow-level-2`   | `shadow-level-2`                                               |

### shadcn 호환

shadcn 컴포넌트는 이미 `bg-primary`, `text-primary-foreground`, `border-border` 등을 사용한다.
이 시스템은 **동일한 변수명**으로 정의하므로 별도 변환 없이 자동 호환된다.

> 예외: shadcn은 `text-primary-foreground`라는 이름을 쓰지만 이 시스템은 `on-primary`다.
> `semantic.css`에서 `--color-primary-foreground: var(--color-on-primary);` 같은 alias로 양쪽 모두 지원.

### 인터랙션 상태 적용 (표준 패턴)

기본 인터랙티브 컬러는 **명시적 상태 토큰**(`-hover`, `-active`)으로 처리한다. `color-mix`나 opacity modifier(`/80`)는 사용하지 않는다.

```tsx
// 권장: 명시적 상태 토큰
<button
  className="
    bg-primary           text-on-primary
    hover:bg-primary-hover
    active:bg-primary-active
    focus-visible:outline-none
    focus-visible:ring-3 focus-visible:ring-focus-ring
    disabled:opacity-[var(--state-disabled)]
    rounded-md px-4 py-2
  "
>
  Submit
</button>
```

**클릭 가능한 카드**:

```tsx
<div className="bg-surface hover:bg-surface-hover active:bg-surface-active rounded-lg p-4 cursor-pointer">
  ...
</div>
```

**Focus Ring**: `--color-focus-ring`은 alpha 0.4의 반투명 색이라 box-shadow ring으로 그릴 때 가장 잘 보인다.

```css
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
```

**State Layer (보조 패턴)**: ghost / outlined 버튼처럼 base 컬러가 transparent인 경우, 명시 토큰 대신 `--state-*` opacity를 사용한 오버레이로 처리한다.

```tsx
// ghost 버튼 — base가 transparent라 명시 토큰이 없음
<button className="hover:bg-[color-mix(in_oklch,currentColor_8%,transparent)]">
  Ghost
</button>
```

---

## 8. 사용 예시

### ✅ 올바름

```tsx
// 인터랙티브 버튼 — 명시적 상태 토큰 사용
<button className="
  bg-primary text-on-primary
  hover:bg-primary-hover active:bg-primary-active
  focus-visible:ring-3 focus-visible:ring-focus-ring
  disabled:opacity-[var(--state-disabled)]
  px-4 py-2 rounded-md shadow-level-1
">
  Submit
</button>

// 정적 카드
<div className="bg-surface border border-border rounded-lg p-6">
  <h3 className="text-headline-md text-foreground">Card title</h3>
  <p className="text-body-md text-foreground-muted">Description</p>
</div>

// 클릭 가능한 카드 — surface 상태 토큰 사용
<div className="
  bg-surface hover:bg-surface-hover active:bg-surface-active
  border border-border rounded-lg p-6 cursor-pointer
">
  ...
</div>
```

### ❌ 금지

```tsx
{
  /* primitive 직접 사용 */
}
;<button className="bg-primary-40 text-primary-100">…</button>

{
  /* hex/rgb 인라인 */
}
;<div style={{ background: '#2E5BFF' }}>…</div>

{
  /* 시멘틱 이름에 숫자 */
}
;<div className="text-foreground-2">…</div>

{
  /* opacity modifier로 hover 표현 — 명시적 상태 토큰 사용할 것 */
}
;<button className="bg-primary hover:bg-primary/80">…</button>

{
  /* 임의의 hex로 focus ring 색상 지정 */
}
;<button className="focus-visible:ring-[#3b82f6]">…</button>
```

---

## 9. 시스템 불변 제약

- **OKLCH only** — 모든 색 표기
- **WCAG AA 이상** — 모든 (foreground, background) 페어
  - 본문 ≥ 4.5:1
  - 큰 글자 / UI 요소 ≥ 3:1
  - 본문 강조 ≥ 7:1 (권장)
- **light/dark pair** — 모든 semantic 토큰 (자동: `@theme` 기본 + `.dark` 오버라이드)
- **No primitive in components** — `primary-40`을 컴포넌트가 직접 참조 금지
- **No numbers in semantic names** — semantic 이름에 숫자 금지
- **reduced-motion** — `prefers-reduced-motion: reduce` 사용자에게는 모션 토큰 적용 안 함

---

## 10. 검증

### 시각 검증

- Storybook **Foundations** 그룹에 모든 카테고리가 시각화되어 있다 (`src/app-init/styles/tokens/*.mdx`)
  - `개요 (Overview)` — 시스템 전체 구조
  - `색상 (Colors)` — 의미 토큰 light/dark + 프리미티브 팔레트 + shadcn alias
  - `타이포그래피 (Typography)` — 18 스케일 + 폰트 패밀리 + Weight
  - `스페이싱 & 반경 (Spacing & Radius)` — spacing + radius + 8px 그리드 예시
  - `Elevation & Z-index` — shadow level light/dark + z-index 계층
  - `인터랙션 (Interactions)` — 상태 컬러(base/hover/active) + focus ring + disabled + state layer
- 모든 스와치는 런타임에 CSS 변수를 읽어 렌더 → 토큰 값 변경 시 자동 동기화

### 코드 검증

- `pnpm lint` — ESLint 규칙
- `pnpm fsd:lint` — Steiger 아키텍처 검증
- 새 토큰 추가 시 manifest 코멘트 갱신

### 대비 검증

- 토큰 생성 시 `/docs/PRDS/design-system/design-token.md`의 self-verification checklist를 통과해야 함
- 결과는 `semantic.css` 또는 `dark.css` 상단 코멘트에 표기

---

## Version

v1.0
