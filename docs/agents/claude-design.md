# Claude Design 운영 하네스 — 페이지 의뢰

> 이 문서의 목적: 클로드 디자인(별도 도구)에 **페이지 시안을 의뢰**할 때 매번 같은 룰을 재서술하지 않도록 한 곳에 고정한다. 의뢰서는 이 문서를 포인터로 참조한다.
>
> 컴포넌트 의뢰 템플릿은 추후 추가 (현재는 페이지 의뢰만 정의).

---

## 0. 클로드 디자인 사용 절차 (★ 클로드 디자인이 읽을 것)

이 문서는 클로드 디자인이 이 레포에 접근해 **직접 읽고 따른다**는 전제로 작성되었다. 사용자가 *"docs/agents/claude-design.md 따라 <페이지명> 시안 의뢰"* 한 줄만 보내면, 아래 절차대로 진행한다.

1. **이 문서 전체를 먼저 읽는다.** §3 FSD 레이어 결정 테이블, §4 현재 base 인벤토리, §5 코드 산출 기대치, §6 추출 규칙은 모든 페이지 시안에 무조건 적용.
2. **§4 인벤토리에 등록된 컴포넌트는 절대 재생성하지 않는다.** 페이지에서 필요하면 그대로 사용·확장한다.
3. **§2 템플릿의 ⬜ 항목은 사용자에게 직접 질문해서 채운다.** 임의로 추정·가정해서 시안에 반영하지 말 것. 한꺼번에 묻지 말고 *페이지 목적 → 섹션 구조 → 톤/참고 사이트* 순으로 묶어서 묻는다.
4. 모든 ⬜가 채워지면 시안 + 코드 + **승격 후보 목록**(§6 형식)을 함께 산출한다.
5. 산출 직전 마지막 확인: 큰 페이지(랜딩 등)는 한 번에 전체보다 **Hero 먼저 → 컨펌 → 나머지** 로 끊을지 사용자에게 물어본다.

> Figma export · Figma MCP 호출 지시 금지. 코드 리팩토링 지시 금지 (핸드오프 후 별도 단계에서 처리).

---

## 1. 클로드 디자인이란 (전제)

- **클로드 디자인 = 별개의 디자인 도구**. 클로드 코드(이 레포에서 동작하는 에이전트)와는 다른 환경.
- 산출물 = **시각 시안 + 코드를 동시에 산출**. 사용자는 **핸드오프** 기능으로 코드를 클로드 코드 환경에 받아옴.
- **Figma export 단계 없음 · Figma MCP 호출 지시 금지.** 의뢰서에 이 두 단어가 들어가면 잘못된 프롬프트.
- 의뢰서에는 **시각 사양 + 코드 산출 기대치만** 적는다. 코드 리팩토링/통합 지시는 핸드오프 받은 뒤 별도 단계로 처리한다.

---

## 2. 페이지 의뢰서 표준 구조

아래 9개 섹션을 순서대로 채운다. **⬜는 클로드 디자인이 사용자에게 직접 질문해서 채울 변수** — 추정·가정 금지 (§0-3 규칙). 묶음별로 묻고, 답을 받으면 해당 칸을 채운 뒤 다음 묶음으로 진행한다.

````markdown
# <페이지 이름> 시안 의뢰

## 1. 제품 한 줄 요약
프론트엔드 개발자를 위한 코딩 학습/문제 풀이 SaaS 플랫폼.
대시보드 · 문제 풀이 · 학습 진행 추적 · 통계 시각화가 핵심.
자세한 맥락: docs/design-system/index.md "Project Context" 섹션 참조.

## 2. 페이지 목적
- 1차: ⬜ (예: 비방문자 → 회원가입 전환)
- 2차: ⬜ (예: 핵심 가치 한눈에 전달)

## 3. 타깃 사용자
⬜ (예: 프론트엔드 직무 준비 ~ 미드 레벨 개발자)

## 4. 섹션 구조
1. Hero — H1 / sub copy / 1차 CTA / 2차 CTA / 우측 비주얼 ⬜
2. ⬜
3. ⬜
...
N. Footer

## 5. 메시지 톤 & 헤드라인 키워드
- 톤: "dense information을 다루는 SaaS" — 깔끔, 약간 테크니컬, 과장 없는 신뢰감
- 헤드라인에 담길 핵심 단어: ⬜
- 회피: 과장된 카피, 광고성 톤

## 6. 비주얼 톤
- 디자인 시스템: docs/design-system/index.md + docs/design-system/design-token.md 그대로 따를 것
- Material Design 3 철학 + GitHub visual language
- 색상/타이포/spacing/elevation/motion 모두 **기존 토큰만 사용** — 자체 토큰 생성 금지
- 다크/라이트 둘 다 지원, 다크 default
- 참고 사이트: ⬜
- 회피 스타일: ⬜

## 7. 산출물 (코드 기대치)
docs/agents/claude-design.md §5 "코드 산출 기대치" 그대로 적용.

## 8. 재사용 컴포넌트 추출 제안
docs/agents/claude-design.md §6 "추출 규칙" 그대로 적용.
현재 base 인벤토리는 §4 참조.

## 9. 참고 문서
- docs/design-system/index.md
- docs/design-system/design-token.md
- docs/design-system/runtime-motion-system.md
- docs/agents/claude-design.md (이 의뢰의 운영 룰)
- CLAUDE.md (FSD 구조, 슬라이스/공개 API 규칙)
````

> 큰 페이지(랜딩 등)는 한 번에 전체보다 **Hero → 컨펌 → 나머지 섹션** 순으로 끊어서 의뢰하는 게 핸드오프 코드 품질이 더 좋다. 의뢰서 끝에 한 줄로 명시.

---

## 3. FSD 레이어 결정 테이블

페이지 의뢰에서 발생하는 신규 컴포넌트는 아래 기준으로 위치를 잡는다. 클로드 디자인이 직접 위치를 제안하도록 의뢰서 §8에서 이 표를 인용한다.

| 후보 유형 | 위치 | 예 |
| --- | --- | --- |
| 도메인 무관 primitive (한 줄 UI) | `src/shared/ui/<name>.tsx` | Badge, Input, Card, Link, Icon |
| 자립형 합성 블록 (페이지 외에도 쓰일 헤더/푸터/네비) | `src/widgets/<name>/` | Header, Footer, Navbar |
| 페이지 전용 섹션 (다른 페이지에서 안 쓸 것) | `src/views/<page>/ui/` | HeroSection, ValueProps |

판단이 애매하면 **inline / 분리 두 옵션 모두 제시**하도록 요청한다 — 최종 결정은 사용자.

---

## 4. 현재 base 인벤토리

> 컴포넌트가 정식 편입될 때마다 이 섹션 한 곳만 갱신한다. 모든 후속 의뢰서가 이 인벤토리를 인용해 중복 생성을 막는다.

### `@/shared/ui/Button`
- 외부 시그니처: `Button`, `buttonVariants`, `asChild` (Radix Slot)
- variant: `solid`(default) · `surface` · `outline` · `ghost`
- size: `sm` · `md`(default) · `lg`
- 토큰: semantic 토큰만 사용 (primitive 직접 호출 금지)
- 자세한 제약: 파일 상단 docblock + `docs/design-system/design-token.md` §6 §9

(이후 컴포넌트 추가 시 동일 양식으로 한 블록 append)

---

## 5. 코드 산출 기대치

핸드오프 받은 코드는 별도 정리 없이 이 레포의 컨벤션을 만족해야 한다. 의뢰서 §7에서 이 섹션을 인용한다.

- **Next.js App Router** 기준. 페이지는 `src/app/<route>/page.tsx`에 얇은 wrapper로 마운트.
- **페이지 본체 = FSD `src/views/<page>/` 슬라이스**
  - `ui/` 안에 섹션별 컴포넌트
  - `index.ts`에 public API만 export
- **Tailwind v4 + 프로젝트 토큰만** 사용 (예: `bg-primary`, `text-on-surface`). 하드코딩 hex/rgb 금지.
- 기존 primitive (`@/shared/ui/*`) 최대 재사용. §4 인벤토리 항목은 절대 재생성 금지.
- 각 컴포넌트에 **co-located `*.stories.tsx`** (규칙: CLAUDE.md "Storybook 규칙").
- **TypeScript** 필수. `any` 금지.
- **RSC default**. `'use client'`는 실제 인터랙션 필요한 컴포넌트에만.
- 데스크탑(1280) + 모바일(375) 두 폭 시안 산출.
- 다크/라이트 모두 토큰 변수로 자동 처리 (자체 미디어 쿼리 작성 금지).

---

## 6. 재사용 컴포넌트 추출 규칙

페이지를 만들다 같은 시각 패턴이 반복되면 클로드 디자인이 **별도 파일로 분리해서 함께 산출**해야 한다. 인라인 박제 방지.

**기준**
- 같은 패턴이 **2회 이상** 반복, **또는** 명백히 도메인 무관 primitive
- **최대 5개**까지만 분리 제안 (과추출 방지)
- 분리 위치는 §3 FSD 레이어 결정 테이블에 따름
- 애매하면 inline / 분리 두 옵션 모두 제시

**산출 형식**
- 추출한 컴포넌트는 자체 파일 + co-located `*.stories.tsx`
- 산출 끝에 **"승격 후보 목록"** 섹션 별도 포함:
  - 이름 / 제안 위치 / 분리 사유 / 사용된 위치 2곳 이상

**핸드오프 후 사용자 워크플로**
1. 승격 후보 목록 검토 → 채택 / 거부 / 위치 변경 결정
2. 채택된 후보 → `src/shared/ui/` 또는 해당 레이어로 정식 편입, stories 정리, `pnpm fsd:lint` 통과 확인
3. **이 문서 §4 인벤토리에 한 블록 append** ← 빼먹지 말 것
4. 거른 후보는 페이지 슬라이스 내부에 그대로 둠 (다음 페이지에서 또 나타나면 그때 재검토)

---

## 7. 참고 문서 포인터

의뢰서 §9에 그대로 복사해 동봉한다.

- [docs/design-system/index.md](../design-system/index.md) — 디자인 철학, foundations
- [docs/design-system/design-token.md](../design-system/design-token.md) — 토큰 정의 + 불변 제약
- [docs/design-system/runtime-motion-system.md](../design-system/runtime-motion-system.md) — 모션
- [src/app-init/styles/tokens/](../../src/app-init/styles/tokens/) — 실제 토큰 CSS
- [CLAUDE.md](../../CLAUDE.md) — FSD 구조, 슬라이스/공개 API 규칙

---

## 8. 의뢰 전 체크리스트 · 핸드오프 후 워크플로

### 의뢰 전 (사용자 1분 점검)

세부 변수(⬜)는 클로드 디자인이 §0-3 절차에 따라 물어보므로 미리 다 결정할 필요 없음. 다만 아래는 트리거 전 사용자가 직접 챙긴다.

- [ ] **이 문서 §4 인벤토리 최신화** ← 직전 의뢰에서 추가된 컴포넌트가 누락됐다면 먼저 한 블록 append
- [ ] 페이지 목적(전환? 정보 제공?)을 머릿속에 한 줄로 정리해 둘 것 (질문 받으면 답할 수 있도록)
- [ ] 참고 사이트 후보 1~3개 떠올려 둘 것 (없으면 *"없음, 알아서 제안해 줘"* 라고 답해도 됨)

### 핸드오프 후

1. **승격 후보 목록부터 검토** (5분) — 무엇을 정식 편입할지 결정
2. 채택 컴포넌트 → 정식 위치 이동 / stories 정비 / `pnpm fsd:lint` 통과 / 이 문서 §4 갱신
3. 페이지 코드 → `src/views/<page>/` 슬라이스 정착, `src/app/<route>/page.tsx`에서 마운트
4. 본문 토큰 사용 점검: `grep -E '#[0-9a-fA-F]{3,6}|rgb\(' src/views/<page>` 결과가 비어야 함
5. `pnpm lint && pnpm fsd:lint` 통과 → PR
