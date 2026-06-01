# Claude Design 운영 하네스 — 공통 룰

> 이 문서의 목적: 클로드 디자인(별도 도구)에 시안을 의뢰할 때 매번 같은 룰을 재서술하지 않도록 한 곳에 고정한다.
> 이 문서는 **모든 의뢰의 공통 진입점**. 의뢰 대상이 페이지냐 컴포넌트냐에 따라 §0에서 추가 문서로 이어진다.

---

## 0. 클로드 디자인 사용 절차 (★ 클로드 디자인이 가장 먼저 읽을 것)

이 문서는 클로드 디자인이 이 레포에 접근해 **직접 읽고 따른다**는 전제로 작성되었다. 사용자가 _"docs/agents/claude-design.md 따라 <대상> 의뢰"_ 한 줄만 보내면, 아래 절차대로 진행한다.

1. **이 문서 전체를 먼저 읽는다.** §1 FSD 레이어 결정 테이블, §2 base 인벤토리, §3 코드 산출 기대치는 모든 의뢰에 무조건 적용.
2. **의뢰 대상에 따라 아래 문서 중 하나를 이어서 읽고 그 안의 템플릿을 사용한다.**
   - **페이지 의뢰** → [docs/agents/claude-design-page.md](./claude-design-page.md)
   - **컴포넌트 의뢰** → [docs/agents/claude-design-component.md](./claude-design-component.md)
3. **§2 인벤토리에 등록된 컴포넌트는 절대 재생성하지 않는다.** 필요하면 그대로 사용·확장한다.
4. **의뢰서 템플릿의 ⬜ 항목은 사용자에게 직접 질문해서 채운다.** 임의 추정·가정 금지. 묶음별로 묻고, 답을 받으면 해당 칸을 채운 뒤 다음 묶음으로 진행한다.
5. 모든 ⬜가 채워지면 시안 + 코드를 산출한다.
6. 작업 중 **하네스 충돌**(PRD 간/하네스 문서 간/하네스↔코드 컨벤션 간 모순으로 작업이 막히거나 임의 결정이 필요해진 경우) 또는 **PRD `§Open ⬜`에 없던 추가 질문**을 의뢰자에게 던지게 된 경우, 즉시 [docs/agents/logs/](../agents/logs/README.md)에 사건 파일 1건 생성. 선택 아님.

> 코드 리팩토링/통합 지시 금지 — 핸드오프 후 별도 단계에서 처리.

---

## 1. FSD 레이어 결정 테이블

페이지·컴포넌트 의뢰에서 발생하는 신규 컴포넌트는 아래 기준으로 위치를 잡는다.

| 후보 유형                                            | 위치                       | 예                             |
| ---------------------------------------------------- | -------------------------- | ------------------------------ |
| 도메인 무관 primitive (한 줄 UI)                     | `src/shared/ui/<name>.tsx` | Badge, Input, Card, Link, Icon |
| 자립형 합성 블록 (페이지 외에도 쓰일 헤더/푸터/네비) | `src/widgets/<name>/`      | Header, Footer, Navbar         |
| 페이지 전용 섹션 (다른 페이지에서 안 쓸 것)          | `src/views/<page>/ui/`     | HeroSection, ValueProps        |

판단이 애매하면 **inline / 분리 두 옵션 모두 제시** — 최종 결정은 사용자.

---

## 2. 현재 base 인벤토리

> 컴포넌트가 정식 편입될 때마다 이 섹션 한 곳만 갱신한다. 모든 후속 의뢰서가 이 인벤토리를 인용해 중복 생성을 막는다.

### `@/shared/ui/Button`

- 외부 시그니처: `Button`, `buttonVariants`, `asChild` (Radix Slot)
- variant: `solid`(default) · `surface` · `outline` · `ghost`
- size: `sm` · `md`(default) · `lg`
- 토큰: semantic 토큰만 사용 (primitive 직접 호출 금지)
- 자세한 제약: 파일 상단 docblock + `docs/design-system/design-token.md` §Token Categories · §시스템 불변 제약

(이후 컴포넌트 추가 시 동일 양식으로 한 블록 append)

---

## 3. 코드 산출 기대치

핸드오프 받은 코드는 별도 정리 없이 이 레포의 컨벤션을 만족해야 한다. 페이지/컴포넌트 의뢰서 모두 이 섹션을 인용한다.

- **Next.js App Router** 기준. 페이지는 `src/app/<route>/page.tsx`에 얇은 wrapper로 마운트.
- **페이지 본체** = FSD `src/views/<page>/` 슬라이스. **신규 컴포넌트** = §1 FSD 레이어 결정 테이블에 따라 배치.
- 슬라이스는 `ui/` + `index.ts`(public API) 구조 준수.
- **Tailwind v4 + 프로젝트 토큰만** 사용 (예: `bg-primary`, `text-on-surface`). 하드코딩 hex/rgb 금지.
- 기존 primitive (`@/shared/ui/*`) 최대 재사용. §2 인벤토리 항목은 절대 재생성 금지.
- 각 컴포넌트에 **co-located `*.stories.tsx`** 페어 산출. production 코드에서 stories import 금지.
- 스토리 분할·각 케이스의 props 조합은 클로드 디자인이 만든 **시안 쇼케이스 프레임을 1:1로 옮긴다** (임의 추가/누락 금지).
- **TypeScript** 필수. `any` 금지.
- **RSC default**. `'use client'`는 실제 인터랙션 필요한 컴포넌트에만.
- 다크/라이트 모두 토큰 변수로 자동 처리 (자체 미디어 쿼리 작성 금지).
- **네이밍**: 컴포넌트 파일 = `PascalCase` (예: `HeroSection.tsx`, `HeroSection.stories.tsx`), 그 외 파일 = `kebab-case` (예: `use-toggle.ts`, `utils.ts`), 폴더 = `kebab-case` (예: `hero-section/`), React 컴포넌트 이름 = `PascalCase` (예: `HeroSection`), 훅 = `use<X>`.

### 토큰 적용 패턴

- **Tailwind 자동 매핑**: `@theme` 정의된 `--color-*`, `--text-*`, `--spacing-*`, `--radius-*`, `--shadow-*`는 같은 이름의 유틸리티(`bg-primary`, `text-headline-lg`, `p-4`, `rounded-md`, `shadow-level-2`)로 자동 변환됨.
- **인터랙션 상태**: 명시 토큰 사용 — `hover:bg-primary-hover`, `active:bg-primary-active`. opacity modifier(`/80`)나 `color-mix`로 hover 표현 금지.
- **Focus ring**: `focus-visible:ring-3 focus-visible:ring-focus-ring` 패턴. 임의 hex로 ring 색 지정 금지.
- **Ghost / outlined 변형** (base가 transparent): 명시 상태 토큰 대신 `--state-hover` opacity 오버레이 사용 (예: `bg-[color-mix(in_oklch,currentColor_8%,transparent)]`).
- **금지 패턴**: `bg-primary-40` ❌ (primitive 직접) · `style={{background:'#2E5BFF'}}` ❌ (hex 인라인) · `text-foreground-2` ❌ (semantic에 숫자) · `hover:bg-primary/80` ❌ (opacity로 hover) · `focus-visible:ring-[#3b82f6]` ❌ (임의 hex).

```tsx
// 표준 인터랙티브 버튼
<button
  className="
    bg-primary text-on-primary
    hover:bg-primary-hover active:bg-primary-active
    focus-visible:outline-none
    focus-visible:ring-3 focus-visible:ring-focus-ring
    disabled:opacity-(--state-disabled)
    px-4 py-2 rounded-md
  "
>
  Submit
</button>
```

---

## 4. 참고 문서 포인터

의뢰서 "참고 문서" 섹션에 그대로 동봉한다.

- [docs/design-system/index.md](../design-system/index.md) — 디자인 철학, foundations
- [docs/design-system/design-token.md](../design-system/design-token.md) — 토큰 정의 + 불변 제약
- [docs/design-system/runtime-motion-system.md](../design-system/runtime-motion-system.md) — 모션
- [src/app-init/styles/tokens/](../../src/app-init/styles/tokens/) — 실제 토큰 CSS
