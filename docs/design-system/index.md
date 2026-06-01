# Design System

## Design Constraints

### 제품 컨텍스트

- **밀도**: compact — dense information을 다룬다. spacing은 빡빡한 쪽 우선.
- **코드 비중**: 높음 — mono typography / code block 토큰은 1급 시민

### Known Gaps

- **Categorical palette 부재** — 데이터 시각화용 다중 hue palette 정의 없음.
  - 해결: 통계 / 차트 화면 PRD 진입 시 N-hue palette 설계 + tonal stop 정의.

---

## Influences

| 시스템            | 차용 개념                                                 |
| ----------------- | --------------------------------------------------------- |
| Material Design 3 | tonal palette · semantic tokens · elevation · state layer |
| GitHub            | neutral-driven · border-based hierarchy                   |

---

## Tech Stack

Next.js · React · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion

---

## Architecture

### Static (CSS, Tailwind v4 `@theme`)

primitive palette · semantic tokens · typography · spacing · radius · elevation · z-index

### Runtime (TypeScript, Framer Motion)

motion tokens · easing presets · spring presets · animation variants · component motion rules

---

## Document Structure

- [`./design-token.md`](./design-token.md) — 정적 토큰 시스템 정의 (color, typography, spacing, radius, elevation, z-index)
- [`./runtime-motion-system.md`](./runtime-motion-system.md) — 런타임 모션 토큰
- 토큰 시각 검증: Storybook **Foundations** 그룹 ([`src/app-init/styles/tokens/*.mdx`](../../src/app-init/styles/tokens/))

---

## Version

v1.0
