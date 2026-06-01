# Design Token Generation Brief

> 이 PRD는 디자인 토큰 시스템을 1회 생성하기 위한 작업 지시서다.
> 실행 주체: Claude Code 에이전트.
> 시스템의 shape(카테고리·룰·패턴·invariant)는 [`/docs/design-system/design-token.md`](/docs/design-system/design-token.md) 하네스가 정의. 이 PRD는 그 shape에 **이 프로젝트의 instance 값**을 채워넣는다.
> 산출물: `src/app-init/styles/tokens/*.css` 6개 파일 + `src/app/globals.css` 갱신.

---

## ⚑ Pre-read

- [/docs/design-system/design-token.md](/docs/design-system/design-token.md) — **시스템 하네스 (shape)**
- [/docs/design-system/index.md](/docs/design-system/index.md) — 디자인 컨텍스트
- [/AGENTS.md](/AGENTS.md) — FSD 구조 (`app-init` 위치 확인용)

---

## ⚑ Goal

8개 palette × 13단계의 primitive에서 다음을 모두 도출한다.

1. **104개 OKLCH primitive 색** (8 palette × 13 단계)
2. light + dark 두 벌의 semantic 토큰 (interaction state 변형 포함)
3. typography 18개 스케일 (각 5필드)
4. shape · spacing · elevation · z-index 토큰
5. 위를 담은 6개 CSS 파일 + `globals.css` `@import` 갱신

---

## ⚑ Project Decisions (instance 선언)

| 항목                            | 이 프로젝트 선택                              | 근거 (한 줄)                                         |
| ------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| **Mode**                        | `both` (light + dark)                         | 사용자 시스템 prefers + 수동 토글 모두 지원          |
| **Mode strategy**               | class-based (`<html class="dark">`)           | 사용자 토글 가능. 라이브러리: **`next-themes`**      |
| **Contrast tier**               | WCAG **AA**                                   | 본문 ≥ 4.5:1, 큰 글자/UI ≥ 3:1, 본문 강조 ≥ 7:1 (권장) |
| **Palette cardinality**         | **8 palette × 13 stop = 104 primitive 토큰**  | Brand(primary, secondary) + 구조(neutral, neutral-variant) + Feedback(error, success, warning, info) |
| **External library compat**     | **shadcn/ui**                                 | alias 레이어로 변수명 매핑 (§External Library Aliases) |

### 자기충족 핵심 룰 요약

전체 invariant는 하네스 §시스템 불변 제약 참조. 이 PRD 적용 범위에서 위반 시 출력 거부:

- 모든 색 **OKLCH** (hex / rgb / hsl 금지)
- **semantic = primitive alias only** — literal oklch는 `palette.css`에만 존재
- 컴포넌트는 semantic만 사용 (primitive 직접 호출 금지)
- semantic 이름에 숫자 금지
- 모든 semantic 토큰은 **light + dark 페어** 보유 (mode = both)
- shadcn alias 누락 금지 (기존 shadcn 컴포넌트 호환)

---

## ⚑ Seed (확정)

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| `seed.primary`     | **`oklch(0.58 0.20 260)`** (= `#2E5BFF`)                     |
| `seed.secondary`   | _파생_ (`primary.hue + 60 = 320`, 즉 `oklch(0.58 0.18 320)`) |
| `seed.neutral.hue` | `260` (primary.hue 유지 → 살짝 푸른 회색)                    |
| `seed.error.hue`   | `25` (red-orange)                                            |
| `seed.success.hue` | `145` (green)                                                |
| `seed.warning.hue` | `75` (amber)                                                 |
| `seed.info.hue`    | `250` (primary 260과 살짝 다른 blue)                         |

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

**Palette별 hue + chroma peak (step 40):**

| Palette           | Hue | Chroma peak  | 비고                          |
| ----------------- | --- | ------------ | ----------------------------- |
| `primary`         | 260 | 0.20         | brand                         |
| `secondary`       | 320 | 0.18         | brand (primary + 60° rotate)  |
| `neutral`         | 260 | 0.015 (저채도) | 표면 / 텍스트                 |
| `neutral-variant` | 275 | 0.030 (저채도) | 보더 / outline                |
| `error`           | 25  | 0.20         | red-orange                    |
| `success`         | 145 | 0.18         | green                         |
| `warning`         | 75  | 0.18         | amber                         |
| `info`            | 250 | 0.20         | primary와 분리된 blue (정보성) |

#### Chroma 곡선 (모든 palette 공통)

step 40을 peak으로, step 0과 100을 0으로 두고 부드러운 곡선 보간:

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

neutral / neutral-variant는 같은 곡선을 저채도 peak로 적용. 디자이너 시각 검토 후 ±0.01 미세 조정 가능.

### 2. Semantic Tokens — Light Mode 매핑

| Token                | Primitive            |
| -------------------- | -------------------- |
| `background`         | `neutral-99`         |
| `surface`            | `neutral-95`         |
| `surface-muted`      | `neutral-90`         |
| `surface-elevated`   | `neutral-100`        |
| `surface-overlay`    | `neutral-99 / 0.85`  |
| `foreground`         | `neutral-10`         |
| `foreground-muted`   | `neutral-30`         |
| `foreground-subtle`  | `neutral-50`         |
| `foreground-inverse` | `neutral-99`         |
| `border`             | `neutral-variant-80` |
| `border-muted`       | `neutral-variant-90` |
| `border-strong`      | `neutral-variant-60` |
| `outline`            | `neutral-variant-60` |
| `outline-variant`    | `neutral-variant-80` |
| `primary`            | `primary-40`         |
| `on-primary`         | `primary-100`        |
| `secondary`          | `secondary-40`       |
| `on-secondary`       | `secondary-100`      |
| `error`              | `error-40`           |
| `on-error`           | `error-100`          |
| `success`            | `success-40`         |
| `on-success`         | `success-100`        |
| `warning`            | `warning-40`         |
| `on-warning`         | `warning-100`        |
| `info`               | `info-40`            |
| `on-info`            | `info-100`           |

### 3. Semantic Tokens — Dark Mode 매핑

| Token                | Primitive            |
| -------------------- | -------------------- |
| `background`         | `neutral-10`         |
| `surface`            | `neutral-20`         |
| `surface-muted`      | `neutral-15`\*       |
| `surface-elevated`   | `neutral-25`\*       |
| `surface-overlay`    | `neutral-30 / 0.85`  |
| `foreground`         | `neutral-95`         |
| `foreground-muted`   | `neutral-80`         |
| `foreground-subtle`  | `neutral-70`         |
| `foreground-inverse` | `neutral-10`         |
| `border`             | `neutral-variant-30` |
| `border-muted`       | `neutral-variant-20` |
| `border-strong`      | `neutral-variant-50` |
| `outline`            | `neutral-variant-60` |
| `outline-variant`    | `neutral-variant-30` |
| `primary`            | `primary-70`         |
| `on-primary`         | `primary-10`         |
| `secondary`          | `secondary-70`       |
| `on-secondary`       | `secondary-10`       |
| `error`              | `error-70`           |
| `on-error`           | `error-10`           |
| `success`            | `success-70`         |
| `on-success`         | `success-10`         |
| `warning`            | `warning-70`         |
| `on-warning`         | `warning-10`         |
| `info`               | `info-60`            |
| `on-info`            | `info-10`            |

#### Off-ramp steps (비표준 stop)

`neutral-15`, `neutral-25`는 13-step 표 밖. 인접 stop의 lightness 평균으로 계산:

- `neutral-15` = (L_step10 + L_step20) / 2 = (0.12 + 0.22) / 2 = **0.17**
- `neutral-25` = (L_step20 + L_step30) / 2 = (0.22 + 0.32) / 2 = **0.27**

surface 그라데이션을 매끄럽게 보이기 위해 도입. chroma는 인접 stop과 동일 곡선 값 사용.

### 4. Interaction States (base + hover / active)

base 컬러의 hover / active 변형. focus는 별도 `focus-ring`(반투명). disabled는 §5 State Layer Opacity의 `--state-disabled`.

**Light mode** — L 감소 방향 (눌리는 느낌):

| Base           | Hover          | Active         |
| -------------- | -------------- | -------------- |
| `primary-40`   | `primary-50`   | `primary-60`   |
| `secondary-40` | `secondary-50` | `secondary-60` |
| `error-40`     | `error-50`     | `error-60`     |
| `success-40`   | `success-50`   | `success-60`   |
| `warning-40`   | `warning-50`   | `warning-60`   |
| `info-40`      | `info-50`      | `info-60`      |
| `surface`      | `neutral-92`\* | `neutral-88`\* |

**Dark mode** — L 증가 방향 (올라오는 느낌):

| Base           | Hover          | Active         |
| -------------- | -------------- | -------------- |
| `primary-70`   | `primary-80`   | `primary-88`\* |
| `secondary-70` | `secondary-80` | `secondary-88`\* |
| `error-70`     | `error-80`     | `error-88`\*   |
| `success-70`   | `success-80`   | `success-88`\* |
| `warning-70`   | `warning-80`   | `warning-88`\* |
| `info-60`      | `info-70`      | `info-80`      |
| `surface`      | `neutral-27`\* | `neutral-32`\* |

`*` = off-ramp step (보간식 적용).

**Focus ring** (양 모드 동일): `oklch(0.55 0.2 260 / 0.4)` (primary-50 @ 40% alpha)

### 5. State Layer Opacity (light/dark 공통)

색이 아닌 opacity. CSS 변수로 정의해 ghost / outlined 컴포넌트가 오버레이로 사용.

| Token              | Opacity |
| ------------------ | ------- |
| `--state-hover`    | 0.08    |
| `--state-pressed`  | 0.12    |
| `--state-focus`    | 0.12    |
| `--state-selected` | 0.16    |
| `--state-disabled` | 0.38    |

### 6. Typography

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

### 7. Shape

| Token         | Value  |
| ------------- | ------ |
| `radius-xs`   | 4px    |
| `radius-sm`   | 6px    |
| `radius-md`   | 8px    |
| `radius-lg`   | 12px   |
| `radius-xl`   | 16px   |
| `radius-full` | 9999px |

### 8. Spacing

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

### 9. Elevation (2-layer shadow recipe)

각 레벨 = ambient(넓고 옅음) + key(좁고 진함). dark 모드는 light alpha × 4~5.

| Token     | Light Recipe                                                      | Dark Recipe                                                       |
| --------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `level-0` | `none`                                                            | `none`                                                            |
| `level-1` | `0 1px 2px oklch(0 0 0 / 0.08), 0 1px 1px oklch(0 0 0 / 0.04)`    | `0 1px 2px oklch(0 0 0 / 0.40), 0 1px 1px oklch(0 0 0 / 0.20)`    |
| `level-2` | `0 2px 4px oklch(0 0 0 / 0.10), 0 1px 2px oklch(0 0 0 / 0.06)`    | `0 2px 4px oklch(0 0 0 / 0.50), 0 1px 2px oklch(0 0 0 / 0.30)`    |
| `level-3` | `0 4px 8px oklch(0 0 0 / 0.12), 0 2px 4px oklch(0 0 0 / 0.08)`    | `0 4px 8px oklch(0 0 0 / 0.55), 0 2px 4px oklch(0 0 0 / 0.35)`    |
| `level-4` | `0 8px 16px oklch(0 0 0 / 0.14), 0 4px 8px oklch(0 0 0 / 0.10)`   | `0 8px 16px oklch(0 0 0 / 0.60), 0 4px 8px oklch(0 0 0 / 0.40)`   |
| `level-5` | `0 16px 32px oklch(0 0 0 / 0.16), 0 8px 16px oklch(0 0 0 / 0.12)` | `0 16px 32px oklch(0 0 0 / 0.65), 0 8px 16px oklch(0 0 0 / 0.45)` |

### 10. Z-index

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

## ⚑ External Library Aliases (shadcn/ui)

shadcn 컴포넌트가 사용하는 클래스명을 이 시스템 semantic 이름에 매핑. `semantic.css`에 `var()` alias로 정의 (양 모드 자동 적용).

| shadcn alias                     | 매핑 대상 (semantic)             |
| -------------------------------- | -------------------------------- |
| `--color-primary-foreground`     | `var(--color-on-primary)`        |
| `--color-secondary-foreground`   | `var(--color-on-secondary)`      |
| `--color-destructive`            | `var(--color-error)`             |
| `--color-destructive-foreground` | `var(--color-on-error)`          |
| `--color-muted`                  | `var(--color-surface-muted)`     |
| `--color-muted-foreground`       | `var(--color-foreground-muted)`  |
| `--color-accent`                 | `var(--color-surface)`           |
| `--color-accent-foreground`      | `var(--color-foreground)`        |
| `--color-popover`                | `var(--color-surface-elevated)`  |
| `--color-popover-foreground`     | `var(--color-foreground)`        |
| `--color-card`                   | `var(--color-surface)`           |
| `--color-card-foreground`        | `var(--color-foreground)`        |
| `--color-input`                  | `var(--color-border)`            |
| `--color-ring`                   | `var(--color-outline)`           |

> 신규 컴포넌트는 alias가 아닌 원본 semantic 토큰(`on-primary`, `error` 등) 직접 사용. alias는 기존 shadcn 컴포넌트 호환용.

---

## ⚑ File Layout

토큰 파일은 FSD `app-init` 레이어에 둔다:

```
src/app/globals.css                       # 진입점. 모든 토큰 파일 @import
src/app-init/styles/tokens/
├── palette.css                           # primitive palette (8종 × 13단계)
├── semantic.css                          # semantic 토큰 (light defaults) + shadcn alias
├── dark.css                              # dark mode 오버라이드
├── typography.css                        # 18개 typography 스케일
├── spacing.css                           # spacing + radius
└── elevation.css                         # shadow + z-index (light/dark)
```

---

## ⚑ Output Format

### 파일 1: `src/app-init/styles/tokens/palette.css`

```css
/* Primitive Palette — DO NOT use directly in components. Use semantic tokens. */
@theme {
  --color-primary-0: oklch(0 0 260);
  --color-primary-10: oklch(0.12 0.06 260);
  /* ... 13단계 × 8 palette = 104 entries ... */
}
```

### 파일 2: `src/app-init/styles/tokens/semantic.css`

```css
/* Semantic Tokens — Light mode defaults. Use these in components. */
@theme {
  /* Surface */
  --color-background: var(--color-neutral-99);
  --color-surface: var(--color-neutral-95);
  /* ... */

  /* Text */
  --color-foreground: var(--color-neutral-10);
  /* ... */

  /* Interactive */
  --color-primary: var(--color-primary-40);
  --color-primary-hover: var(--color-primary-50);
  --color-primary-active: var(--color-primary-60);
  --color-on-primary: var(--color-primary-100);
  /* ... 같은 패턴으로 secondary/error/success/warning/info ... */

  /* shadcn 호환 alias */
  --color-primary-foreground: var(--color-on-primary);
  --color-destructive: var(--color-error);
  /* ... 14개 전체 ... */

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
    --color-background: var(--color-neutral-10);
    --color-surface: var(--color-neutral-20);
    --color-foreground: var(--color-neutral-95);
    --color-primary: var(--color-primary-70);
    --color-primary-hover: var(--color-primary-80);
    --color-primary-active: var(--color-primary-88); /* off-ramp */
    --color-on-primary: var(--color-primary-10);
    /* ... 모든 semantic 토큰 다크 매핑 ... */
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

## ⚑ Project Constraints

이 프로젝트 instance에만 적용. 하네스 §시스템 불변 제약과 별개로 위반 시 출력 거부:

- (foreground, background) 페어 **WCAG AA** 통과 결과를 각 CSS 파일 상단 주석에 표 형태로 기록
- `palette.css`에 8 palette × 13 stop **= 104 토큰** 모두 정의
- shadcn alias **14개** 누락 금지 (§External Library Aliases 전체)
- off-ramp step(`neutral-15`, `neutral-25`, `primary-88` 등) 도입 시 §3·§4 인접 위치에 계산식 코멘트 박아둠

---

## ⚑ Self-Verification Checklist (제출 전)

- [ ] **8 palette × 13 stop = 104개 primitive 토큰** 모두 채움
- [ ] 모든 OKLCH가 `L C H` 3필드 + (alpha 있을 때) `/ A` 형식
- [ ] 모든 semantic 토큰이 light + dark 페어 보유
- [ ] (foreground, background) 페어 대비 계산표 작성 + AA 통과 명시
- [ ] hover / active 변형: primary / secondary / error / success / warning / info / surface 모두 light + dark 페어
- [ ] focus-ring 토큰 정의 (primary-50 @ 40% alpha)
- [ ] off-ramp step 보간식 코멘트 박힘 (`neutral-15`, `neutral-25`, hover/active의 `*88`, `*92` 등)
- [ ] State Layer Opacity 5개 (color 없음, opacity 숫자만)
- [ ] Typography 18 스케일 × 5 필드 (size, line-height, weight, letter-spacing, family) 완비
- [ ] Elevation 6 레벨 × light/dark recipe 완비
- [ ] Z-index 7개 값 정의
- [ ] shadcn 호환 alias **14개** 정의
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
