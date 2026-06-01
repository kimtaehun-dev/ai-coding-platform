# Design Token System — 사용 가이드

이 문서는 디자인 토큰 시스템의 **shape**(어떤 카테고리·룰·패턴이 존재하는가)를 정의한다. 구체 값·개수·경로·도구 선택 등 instance 콘텐츠는 별도 PRD에서 다룬다.

---

## Architecture

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

**규칙 1**: 컴포넌트는 semantic 이름만 사용한다. primitive를 직접 호출하면 PR에서 거부된다.

**규칙 2**: semantic은 반드시 primitive palette의 한 stop을 `var()`로 참조한다. literal oklch 값을 `semantic.css` / `dark.css`에 직접 박지 않는다. 새 hue가 필요하면 palette에 13 stop 풀 ramp를 먼저 정의한 후 alias한다.

**규칙 3**: PRD는 이 하네스를 의존할 수 있지만, 핵심 제약을 "하네스 참조"로 생략할 수 없다. PRD는 자기충족이어야 하며, 의존 항목 중 핵심 룰은 PRD에도 짧게 재진술한다.

---

## 색공간

모든 색은 **OKLCH**로 표기한다.

```css
/* ✅ */
--color-primary: oklch(0.58 0.2 260);

/* ❌ 금지 */
--color-primary: #2e5bff;
--color-primary: rgb(46 91 255);
```

---

## Token Categories (Shape)

각 카테고리의 **구조**를 정의한다. 실제 토큰 이름·값·개수는 PRD가 결정.

### Color

**Primitive Palette**: tonal ramp의 집합. 각 ramp은 lightness 단계를 공유하며 chroma는 중간 톤 근처 peak에서 양 끝으로 점감.

활성 palette 카테고리는 PRD가 선택. 일반 분류:

- **Brand**: 제품 정체성 — primary, secondary 등
- **구조**: 표면/텍스트/보더 — neutral, neutral-variant 등
- **Feedback**: 상태 알림 — error, success, warning, info 등

**Semantic Tokens**: primitive를 참조하는 의미 토큰. 다음 그룹으로 묶임:

| 그룹                   | 의미                                |
| ---------------------- | ----------------------------------- |
| **Surface**            | 배경 표면 계층                      |
| **Foreground**         | 텍스트 · 아이콘                     |
| **Border**             | 경계 · 구분                         |
| **Interactive**        | 사용자가 액션 트리거하는 색         |
| **Feedback**           | 상태 표현 색                        |
| **Interaction States** | hover/active/focus/disabled 변형    |

각 그룹의 구체 토큰 이름·primitive 매핑은 PRD가 결정.

### Typography

각 typography 스케일은 5 필드로 구성:

- `font-size`
- `line-height`
- `font-weight`
- `letter-spacing`
- `font-family` (예: sans / mono)

스케일 그룹(Display/Headline/Title/Body/Label/Utility 등)과 개수는 PRD가 선택.

### Spacing

선형 스케일. 4px 또는 8px 그리드 기반 권장. 개수·이름·값은 PRD가 결정.

### Shape (Radius)

코너 반경 스케일. `radius-full`(원형) 포함 권장. 개수·값은 PRD가 결정.

### Elevation

다층 shadow 레시피. 각 level은 ambient(넓고 옅음) + key(좁고 진함) 두 그림자의 조합. dark 모드는 alpha 강화(통상 4~5배). level 개수·구체 recipe는 PRD가 결정.

### Z-index

레이어 계층. 일반 권장 순서: base < sticky < dropdown < popover < modal < toast < tooltip. 구체 토큰명·값은 PRD가 결정.

---

## Naming Patterns

토큰 이름을 구성하는 패턴. 시스템 일관성 확보가 목적.

### `on-<color>` — 컬러 표면 위 텍스트/아이콘

해당 컬러 위에 올라가는 contrasted 컬러. 대비 검증 필수.

예: `on-primary` = primary 표면 위 텍스트 색

### `<base>-<state>` — 상태 변형

base 토큰의 상태 변형. 표준 state: `hover`, `active`, `focus`, `disabled`, `selected`.

예: `primary-hover`, `surface-active`

명시 상태 토큰을 우선 사용. `color-mix`, opacity modifier(`/80`)는 보조.

### `<token> / <alpha>` — Alpha alias

기존 토큰에 alpha를 추가해 반투명 의미 토큰 생성.

예: `surface-overlay = neutral-99 / 0.85`

### Off-ramp step — 비표준 stop

13-step 외 중간 톤이 필요하면 step 번호를 13-step 표 밖으로 확장 가능 (예: `neutral-15`). 보간 식은 인접 stop의 평균. PRD에 보간 식 + 정당화 명시 필수.

---

## Mode Strategy

PRD가 어떤 mode를 지원하는지 선언: `light only` / `dark only` / `both`.

`both` 선택 시: 모든 semantic 토큰은 light + dark 두 값 보유. 변수 이름 동일, 값만 교체.

**구현 전략 (선택)**:

| 전략             | 트리거                              | 트레이드오프                                                |
| ---------------- | ----------------------------------- | ----------------------------------------------------------- |
| **class-based**  | `<html class="dark">` 토글          | 사용자 토글 가능. 시스템 prefers + 수동 조합 가능. 라이브러리 필요 |
| **media query**  | `prefers-color-scheme: dark`        | 자동, 라이브러리 불필요. 사용자 수동 토글 불가              |

PRD가 전략 + (필요 시) 라이브러리 선택.

---

## State System

### Naming model

base 컬러 상태 변형은 `<base>-hover`, `<base>-active`. focus는 별도 `focus-ring`(반투명) 토큰. disabled는 opacity 토큰(`--state-disabled`).

### L 변화 방향

모드별 방향은 반대지만 인지 효과는 동일.

| Mode  | hover/active 방향 | 인지 효과   |
| ----- | ----------------- | ----------- |
| Light | L 감소 (어두워짐) | 눌리는 느낌 |
| Dark  | L 증가 (밝아짐)   | 올라오는 느낌 |

### State Layer Opacity (보조)

명시 상태 토큰으로 커버 안 되는 케이스(ghost/outlined 버튼 등)에선 alpha 오버레이 사용 (Material 스타일).

`--state-hover`, `--state-pressed`, `--state-focus`, `--state-selected`, `--state-disabled` — alpha 값만 정의, color 없음. 구체 수치는 PRD가 결정.

### 적용 우선순위

신규 컴포넌트는 명시 토큰(`primary-hover` 등) 우선. State Layer는 base가 transparent인 경우 보조용.

---

## 시스템 불변 제약

- **OKLCH only** — 모든 색 표기
- **Contrast tier 선언 필수** — PRD가 WCAG tier(AA/AAA) 선언. 모든 (foreground, background) 페어가 그 tier 통과
  - 본문 ≥ 4.5:1 (AA) · 큰 글자/UI ≥ 3:1 (AA) · 본문 강조 ≥ 7:1 (AAA)
- **No primitive in components** — primitive 토큰을 컴포넌트가 직접 참조 금지
- **Semantic = primitive alias only** — 모든 semantic 색 토큰은 palette stop을 `var()`로 참조. literal oklch는 palette에만 존재
- **Palette before alias** — palette에 없는 hue가 필요하면 풀 ramp를 palette에 먼저 정의한 후 semantic alias 작성
- **Mode pair coverage** — `both` 모드 선택 시 모든 semantic 토큰은 light + dark 두 값 보유
- **No numbers in semantic names** — semantic 이름에 숫자 금지
- **Off-ramp justification** — 비표준 stop 도입 시 PRD에 보간 식 + 사용 정당화 기록
- **Palette cardinality is PRD-owned** — palette 수 · stop 수 · 토큰 개수는 PRD가 결정. 하네스에 하드코딩 금지
- **reduced-motion** — `prefers-reduced-motion: reduce` 사용자에게 모션 토큰 적용 안 함

---

## 검증

### Visual verification

각 토큰 카테고리는 런타임 시각 검증 표면을 가져야 한다. 검증 표면은 CSS 변수를 직접 읽어 렌더 → 토큰 값 변경 시 자동 동기화. 도구 선택은 PRD.

### Contrast verification

토큰 추가/변경 시:

- (foreground, background) 페어 전체 대비 표 작성
- PRD가 선언한 contrast tier 통과 명시
- 결과는 토큰 CSS 파일 상단 주석에 표 형태로 기록

### Code verification

- 린트 통과 (ESLint + 아키텍처 린터)
- 빌드 통과 (build + visual verification 빌드)

---

## Version

v1.0
