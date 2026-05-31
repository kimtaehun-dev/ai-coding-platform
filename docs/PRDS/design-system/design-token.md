# Design Token Generation Brief

> 이 문서는 **시드 컬러로부터 전체 디자인 토큰 시스템을 1회 생성**하기 위한 작업 지시서다.
> 실행 주체: Claude Code 에이전트.
> 산출물: `src/app-init/styles/tokens/*.css` 6개 파일 + `src/app/globals.css` 갱신.

---

## ⚑ Goal

시드 컬러 한 개로부터 다음을 모두 도출한다.

1. 5개 primitive palette × 13단계 = **65개 OKLCH 색**
2. light + dark 두 벌의 semantic 토큰 전체
3. typography 18개 스케일 (각 5필드)
4. shape · spacing · elevation · z-index 토큰
5. 위를 담은 6개 CSS 파일 + `globals.css` `@import` 갱신

**light 모드와 dark 모드 둘 다 완전 지원**이 필수다.

---

## ⚑ Pre-read (필독)

작업 시작 전 다음 문서를 반드시 읽는다.

- [/docs/design-system/design-token.md](/docs/design-system/design-token.md) — **시스템 정의·파일 레이아웃·다크 모드 메커니즘**
- [/docs/PRDS/design-system/index.md](/docs/PRDS/design-system/index.md) — 디자인 철학
- [/AGENTS.md](/AGENTS.md) — FSD 구조 (app-init 위치 확인용)

위 문서의 규칙은 이 브리프에 다시 적지 않아도 그대로 적용된다. 이 브리프는 그 위에 **생성 절차·시드·검증**만 추가한다.

---

## ⚑ Seed (확정)

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| `seed.primary`     | **`oklch(0.58 0.20 260)`** (= `#2E5BFF`)                     |
| `seed.secondary`   | _파생_ (`primary.hue + 60 = 320`, 즉 `oklch(0.58 0.18 320)`) |
| `seed.neutral.hue` | `260` (primary.hue 유지 → 살짝 푸른 회색)                    |
| `mode`             | `both` (light + dark)                                        |

> 시드는 절대 변경하지 않는다. 다른 hue를 사용하려면 이 브리프를 갱신한 뒤 재실행한다.

---

## ⚑ Generation Rules

### 1. Primitive Palette

**모든 palette는 동일한 lightness 단계를 공유**한다.

| Step | L    | Step | L    |
| ---- | ---- | ---- | ---- |
| 0    | 0.00 | 60   | 0.65 |
| 10   | 0.12 | 70   | 0.75 |
| 20   | 0.22 | 80   | 0.82 |
| 30   | 0.32 | 90   | 0.90 |
| 40   | 0.45 | 95   | 0.95 |
| 50   | 0.55 | 99   | 0.99 |
|      |      | 100  | 1.00 |

**Palette별 chroma + hue:**

| Palette           | Hue | Chroma 곡선                                          |
| ----------------- | --- | ---------------------------------------------------- |
| `primary`         | 260 | step 0,100 = 0 / step 40 peak = 0.20 / 양쪽으로 점감 |
| `secondary`       | 320 | 동일 곡선, peak 0.18                                 |
| `neutral`         | 260 | step 0,100 = 0 / 중간 step = 0.005 ~ 0.015           |
| `neutral-variant` | 275 | step 0,100 = 0 / 중간 step = 0.015 ~ 0.030           |
| `error`           | 25  | step 0,100 = 0 / step 40 peak = 0.20 / 양쪽 점감     |

#### Chroma 계산 권장 패턴

step 40을 peak으로, 0과 100을 0으로 두고 부드러운 곡선으로 보간. 구체적으로:

- step 0 = 0
- step 10 = peak × 0.30
- step 20 = peak × 0.50
- step 30 = peak × 0.75
- step 40 = peak (100%)
- step 50 = peak × 1.00 (또는 0.95)
- step 60 = peak × 0.90
- step 70 = peak × 0.75
- step 80 = peak × 0.55
- step 90 = peak × 0.33
- step 95 = peak × 0.17
- step 99 = peak × 0.05
- step 100 = 0

이 곡선은 실제 OKLCH 색 영역(gamut)에서 자연스러운 톤 전이를 만들어 낸다. 디자이너가 시각 검토 후 ±0.01 미세 조정 가능.

### 2. Semantic Tokens — Light Mode 매핑

| Token                | Primitive              |
| -------------------- | ---------------------- |
| `background`         | `neutral-99`           |
| `surface`            | `neutral-95`           |
| `surface-muted`      | `neutral-90`           |
| `surface-elevated`   | `neutral-100`          |
| `surface-overlay`    | `neutral-99 / 0.85`    |
| `foreground`         | `neutral-10`           |
| `foreground-muted`   | `neutral-30`           |
| `foreground-subtle`  | `neutral-50`           |
| `foreground-inverse` | `neutral-99`           |
| `border`             | `neutral-variant-80`   |
| `border-muted`       | `neutral-variant-90`   |
| `border-strong`      | `neutral-variant-60`   |
| `outline`            | `neutral-variant-60`   |
| `outline-variant`    | `neutral-variant-80`   |
| `primary`            | `primary-40`           |
| `on-primary`         | `primary-100`          |
| `secondary`          | `secondary-40`         |
| `on-secondary`       | `secondary-100`        |
| `error`              | `error-40`             |
| `on-error`           | `error-100`            |
| `success`            | `oklch(0.55 0.15 145)` |
| `on-success`         | `oklch(1 0 0)`         |
| `warning`            | `oklch(0.70 0.16 75)`  |
| `on-warning`         | `oklch(0.15 0 0)`      |
| `info`               | `primary-50`           |
| `on-info`            | `primary-100`          |

### 3. Semantic Tokens — Dark Mode 매핑

| Token                | Primitive              |
| -------------------- | ---------------------- |
| `background`         | `neutral-10`           |
| `surface`            | `neutral-20`           |
| `surface-muted`      | `neutral-15`\*         |
| `surface-elevated`   | `neutral-25`\*         |
| `surface-overlay`    | `neutral-30 / 0.85`    |
| `foreground`         | `neutral-95`           |
| `foreground-muted`   | `neutral-80`           |
| `foreground-subtle`  | `neutral-70`           |
| `foreground-inverse` | `neutral-10`           |
| `border`             | `neutral-variant-30`   |
| `border-muted`       | `neutral-variant-20`   |
| `border-strong`      | `neutral-variant-50`   |
| `outline`            | `neutral-variant-60`   |
| `outline-variant`    | `neutral-variant-30`   |
| `primary`            | `primary-70`           |
| `on-primary`         | `primary-10`           |
| `secondary`          | `secondary-70`         |
| `on-secondary`       | `secondary-10`         |
| `error`              | `error-70`             |
| `on-error`           | `error-10`             |
| `success`            | `oklch(0.72 0.15 145)` |
| `on-success`         | `oklch(0.15 0 0)`      |
| `warning`            | `oklch(0.80 0.16 75)`  |
| `on-warning`         | `oklch(0.15 0 0)`      |
| `info`               | `primary-60`           |
| `on-info`            | `primary-10`           |

> \*`neutral-15`, `neutral-25`는 13단계 표에 없는 중간 톤. 다음 식으로 직접 계산: L = `(L_step10 + L_step20) / 2` 등. (각각 L=0.17, L=0.27)

### 4. State Layer (light/dark 공통)

색이 아닌 opacity. CSS 변수로 정의해 컴포넌트가 `bg-current/<value>` 또는 `::before` 오버레이로 사용.

| Token              | Opacity |
| ------------------ | ------- |
| `--state-hover`    | 0.08    |
| `--state-pressed`  | 0.12    |
| `--state-focus`    | 0.12    |
| `--state-selected` | 0.16    |
| `--state-disabled` | 0.38    |

### 5. Typography

| Token       | size      | line-height | weight | letter-spacing | family |
| ----------- | --------- | ----------- | ------ | -------------- | ------ |
| display-lg  | 3.5rem    | 1.15        | 700    | -0.02em        | sans   |
| display-md  | 2.75rem   | 1.2         | 700    | -0.015em       | sans   |
| display-sm  | 2.25rem   | 1.25        | 600    | -0.01em        | sans   |
| headline-lg | 1.875rem  | 1.3         | 600    | -0.005em       | sans   |
| headline-md | 1.5rem    | 1.35        | 600    | -0.005em       | sans   |
| headline-sm | 1.25rem   | 1.4         | 600    | 0              | sans   |
| title-lg    | 1.125rem  | 1.4         | 600    | 0              | sans   |
| title-md    | 1rem      | 1.45        | 500    | 0              | sans   |
| title-sm    | 0.875rem  | 1.45        | 500    | 0              | sans   |
| body-lg     | 1rem      | 1.6         | 400    | 0              | sans   |
| body-md     | 0.875rem  | 1.6         | 400    | 0              | sans   |
| body-sm     | 0.8125rem | 1.55        | 400    | 0              | sans   |
| label-lg    | 0.875rem  | 1.4         | 500    | 0.005em        | sans   |
| label-md    | 0.8125rem | 1.4         | 500    | 0.01em         | sans   |
| label-sm    | 0.75rem   | 1.35        | 500    | 0.015em        | sans   |
| caption     | 0.6875rem | 1.4         | 400    | 0.02em         | sans   |
| code        | 0.875rem  | 1.6         | 400    | 0              | mono   |
| code-sm     | 0.8125rem | 1.55        | 400    | 0              | mono   |

**Font families:**

- `sans` = `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", "Apple SD Gothic Neo", "Noto Sans KR", "Inter", sans-serif`
- `mono` = `"JetBrains Mono", "Fira Code", ui-monospace, monospace`

(한국어 UI 가독성 위해 Pretendard 우선)

### 6. Shape

| Token         | Value  |
| ------------- | ------ |
| `radius-xs`   | 4px    |
| `radius-sm`   | 6px    |
| `radius-md`   | 8px    |
| `radius-lg`   | 12px   |
| `radius-xl`   | 16px   |
| `radius-full` | 9999px |

### 7. Spacing

| Token      | Value |
| ---------- | ----- |
| `space-1`  | 4px   |
| `space-2`  | 8px   |
| `space-4`  | 16px  |
| `space-6`  | 24px  |
| `space-8`  | 32px  |
| `space-10` | 40px  |
| `space-12` | 48px  |
| `space-16` | 64px  |
| `space-20` | 80px  |

### 8. Elevation (2-layer shadow recipe)

각 레벨 = ambient(넓고 옅음) + key(좁고 진함). dark 모드는 light alpha × 4~5.

| Token     | Light Recipe                                                      | Dark Recipe                                                       |
| --------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `level-0` | `none`                                                            | `none`                                                            |
| `level-1` | `0 1px 2px oklch(0 0 0 / 0.08), 0 1px 1px oklch(0 0 0 / 0.04)`    | `0 1px 2px oklch(0 0 0 / 0.40), 0 1px 1px oklch(0 0 0 / 0.20)`    |
| `level-2` | `0 2px 4px oklch(0 0 0 / 0.10), 0 1px 2px oklch(0 0 0 / 0.06)`    | `0 2px 4px oklch(0 0 0 / 0.50), 0 1px 2px oklch(0 0 0 / 0.30)`    |
| `level-3` | `0 4px 8px oklch(0 0 0 / 0.12), 0 2px 4px oklch(0 0 0 / 0.08)`    | `0 4px 8px oklch(0 0 0 / 0.55), 0 2px 4px oklch(0 0 0 / 0.35)`    |
| `level-4` | `0 8px 16px oklch(0 0 0 / 0.14), 0 4px 8px oklch(0 0 0 / 0.10)`   | `0 8px 16px oklch(0 0 0 / 0.60), 0 4px 8px oklch(0 0 0 / 0.40)`   |
| `level-5` | `0 16px 32px oklch(0 0 0 / 0.16), 0 8px 16px oklch(0 0 0 / 0.12)` | `0 16px 32px oklch(0 0 0 / 0.65), 0 8px 16px oklch(0 0 0 / 0.45)` |

### 9. Z-index

| Token        | Value |
| ------------ | ----- |
| `z-base`     | 0     |
| `z-sticky`   | 100   |
| `z-dropdown` | 1000  |
| `z-popover`  | 1100  |
| `z-modal`    | 1200  |
| `z-toast`    | 1300  |
| `z-tooltip`  | 1400  |

---

## ⚑ Output Format

### 파일 1: `src/app-init/styles/tokens/palette.css`

```css
/* Primitive Palette — DO NOT use directly in components. Use semantic tokens. */
@theme {
  --color-primary-0: oklch(0 0 260);
  --color-primary-10: oklch(0.12 0.06 260);
  /* ... 13단계 × 5 palette = 65 entries ... */
}
```

### 파일 2: `src/app-init/styles/tokens/semantic.css`

```css
/* Semantic Tokens — Light mode defaults. Use these in components. */
@theme {
  /* Surface */
  --color-background: oklch(0.99 0.005 260); /* = neutral-99 */
  --color-surface: oklch(0.95 0.003 260);
  /* ... */

  /* Text */
  --color-foreground: oklch(0.12 0.005 260);
  /* ... */

  /* Interactive */
  --color-primary: oklch(0.45 0.2 260); /* = primary-40 */
  --color-on-primary: oklch(1 0 260);
  /* ... */

  /* shadcn 호환 alias */
  --color-primary-foreground: var(--color-on-primary);
  --color-secondary-foreground: var(--color-on-secondary);
  --color-destructive: var(--color-error);
  --color-destructive-foreground: var(--color-on-error);
  --color-muted: var(--color-surface-muted);
  --color-muted-foreground: var(--color-foreground-muted);
  --color-accent: var(--color-surface);
  --color-accent-foreground: var(--color-foreground);
  --color-popover: var(--color-surface-elevated);
  --color-popover-foreground: var(--color-foreground);
  --color-card: var(--color-surface);
  --color-card-foreground: var(--color-foreground);
  --color-input: var(--color-border);
  --color-ring: var(--color-primary);

  /* State Layer (opacity 전용, color 아님) */
  --state-hover: 0.08;
  --state-pressed: 0.12;
  --state-focus: 0.12;
  --state-selected: 0.16;
  --state-disabled: 0.38;
}
```

### 파일 3: `src/app-init/styles/tokens/dark.css`

```css
/* Dark mode overrides. Triggered by <html class="dark"> */
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  .dark {
    --color-background: oklch(0.12 0.005 260); /* = neutral-10 */
    --color-surface: oklch(0.22 0.003 260);
    --color-foreground: oklch(0.95 0.003 260);
    --color-primary: oklch(0.75 0.14 260); /* = primary-70 */
    --color-on-primary: oklch(0.12 0.06 260);
    /* ... 모든 semantic 토큰 다크 값으로 ... */
  }
}
```

### 파일 4: `src/app-init/styles/tokens/typography.css`

```css
@theme {
  --font-sans:
    'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
    system-ui, 'Helvetica Neue', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Inter',
    sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  --text-display-lg: 3.5rem;
  --text-display-lg--line-height: 1.15;
  --text-display-lg--font-weight: 700;
  --text-display-lg--letter-spacing: -0.02em;
  /* ... 18 scales × 5 fields ... */
}
```

### 파일 5: `src/app-init/styles/tokens/spacing.css`

```css
@theme {
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  /* ... */

  --radius-xs: 4px;
  --radius-sm: 6px;
  /* ... */
}
```

### 파일 6: `src/app-init/styles/tokens/elevation.css`

```css
@theme {
  --shadow-level-0: none;
  --shadow-level-1:
    0 1px 2px oklch(0 0 0 / 0.08), 0 1px 1px oklch(0 0 0 / 0.04);
  /* ... */

  --z-base: 0;
  --z-sticky: 100;
  /* ... */
}

@layer base {
  .dark {
    --shadow-level-1:
      0 1px 2px oklch(0 0 0 / 0.4), 0 1px 1px oklch(0 0 0 / 0.2);
    /* ... 모든 shadow dark 값 ... */
  }
}
```

### 파일 7: `src/app/globals.css` (갱신)

기존 shadcn 콘텐츠는 유지하되, 상단에 manifest + import를 추가한다.

```css
/* ───────────────────────────────────────────
 * Design Token Manifest
 * - palette.css     : primitive palette
 * - semantic.css    : semantic tokens (light)
 * - dark.css        : dark overrides
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

/* (기존 shadcn base styles 유지) */
```

---

## ⚑ Hard Constraints (위반 시 출력 거부)

- 모든 색은 `oklch(L C H)` 형식 (`hex`/`rgb`/`hsl` 금지)
- 모든 semantic 토큰은 light + dark 두 값
- 모든 (foreground, background) 페어 **WCAG AA 이상** 통과
  - 본문 ≥ 4.5:1, 큰 글자/UI ≥ 3:1, 본문 강조 ≥ 7:1
  - 통과 결과를 각 CSS 파일 상단 주석에 표 형태로 기록
- semantic 이름에 숫자 사용 금지
- shadcn alias(`--color-primary-foreground` 등) 누락 금지 → 기존 shadcn 컴포넌트 깨짐 방지

---

## ⚑ Self-Verification Checklist (제출 전)

- [ ] 5 palette × 13 step = **65개 primitive 토큰** 모두 채움
- [ ] 모든 OKLCH가 `L C H` 3필드 + (alpha 있을 때) `/ A` 형식
- [ ] 모든 semantic 토큰이 light + dark 페어 보유
- [ ] (foreground, background) 페어 대비 계산표 작성 + AA 통과 명시
- [ ] State layer는 opacity 숫자만 (color 없음)
- [ ] Typography 18 스케일 × 5 필드 (size, line-height, weight, letter-spacing, family) 완비
- [ ] Elevation 6 레벨 × light/dark recipe 완비
- [ ] Z-index 7개 값 정의
- [ ] shadcn 호환 alias 정의 (`primary-foreground`, `destructive`, `muted`, `accent`, `popover`, `card`, `input`, `ring`)
- [ ] `globals.css`에 `@import` 6개 모두 추가
- [ ] `@custom-variant dark` 선언으로 Tailwind `dark:` 유틸리티 활성화
- [ ] `pnpm lint` + `pnpm fsd:lint` 통과
- [ ] Storybook 빌드 성공 확인 (`pnpm build-storybook`)

미충족 항목이 있으면 출력하지 말고 어떤 항목이 누락됐는지 보고한다.

---

## ⚑ Deliverable

1. 신규 파일 6개
   - `src/app-init/styles/tokens/palette.css`
   - `src/app-init/styles/tokens/semantic.css`
   - `src/app-init/styles/tokens/dark.css`
   - `src/app-init/styles/tokens/typography.css`
   - `src/app-init/styles/tokens/spacing.css`
   - `src/app-init/styles/tokens/elevation.css`
2. 갱신 파일 1개
   - `src/app/globals.css`
3. PR 또는 응답 본문에 **(foreground, background) 페어 WCAG 대비표** 첨부
4. `pnpm lint && pnpm fsd:lint && pnpm build && pnpm build-storybook` 전부 통과 확인 보고
