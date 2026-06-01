# Claude Design — 컴포넌트 시안 의뢰

> **전제: 이 문서를 읽기 전에 [docs/agents/claude-design.md](./claude-design.md)를 먼저 읽었다.**
> 공통 룰(FSD 위치, base 인벤토리, 코드 산출 기대치, 참고 문서)은 거기에 있다. 이 문서는 컴포넌트 의뢰 전용 추가 룰만 정의.

---

## 1. 컴포넌트 의뢰 절차

1. **claude-design.md 공통 룰을 모두 적용한 상태**에서 §2 템플릿의 ⬜를 채운다.
2. **claude-design.md §2 인벤토리에 이미 있는 컴포넌트면 재생성 금지** — 사용자에게 "확장 의도인지 / 새 variant 추가인지" 먼저 확인.
3. ⬜는 임의 추정 금지. 묶음별로 묻는다: *역할 / 분류 → props(variant/size/state) → 인터랙션·a11y → 참고 컴포넌트* 순.
4. 모든 ⬜가 채워지면 시안 + 코드를 산출한다.

---

## 2. 컴포넌트 의뢰서 표준 구조

````markdown
# <컴포넌트 이름> 시안 의뢰

## 1. 컴포넌트 역할 한 줄
⬜ (예: 사용자 상태/카테고리를 짧게 표시하는 라벨)

## 2. 분류 (FSD 위치)
docs/agents/claude-design.md §1 FSD 레이어 결정 테이블에 따른 위치:
⬜ (예: `src/shared/ui/badge.tsx` — 도메인 무관 primitive)

## 3. Props 시그니처
- variant: ⬜ (예: solid · outline · subtle)
- size: ⬜ (예: sm · md · lg)
- state: ⬜ (예: default · hover · disabled · focus-visible)
- 기타 props: ⬜ (예: leadingIcon, asChild)

## 4. 사용 컨텍스트
- 어디에 쓸 건지: ⬜ (예: 문제 카드의 난이도 라벨, 사용자 프로필의 역할 라벨)
- 함께 쓰일 컴포넌트: ⬜ (예: Card, Avatar 옆에 같이 놓임)

## 5. 인터랙션 · 모션
- 인터랙티브 여부: ⬜ (클릭/호버 동작 있나)
- 모션 토큰: docs/design-system/runtime-motion-system.md 그대로 따를 것 — 자체 transition/duration 정의 금지

## 6. 접근성 (a11y)
- 역할(role): ⬜
- 키보드 동작: ⬜ (필요한 경우만)
- 스크린리더 라벨: ⬜

## 7. 비주얼 톤
- docs/agents/claude-design.md §3 코드 산출 기대치 그대로 적용 (Tailwind 토큰만, 다크/라이트, MD3 + GitHub 톤).
- 디자인 시스템: docs/design-system/index.md + docs/design-system/design-token.md 그대로 따를 것
- 참고 컴포넌트: ⬜ (예: shadcn Badge, Material Chip)

## 8. 산출물 (코드 기대치)
docs/agents/claude-design.md §3 "코드 산출 기대치" 그대로 적용.
- variant × size × state 조합을 시안에서 모두 보일 것.

## 9. 참고 문서
- docs/design-system/index.md
- docs/design-system/design-token.md
- docs/design-system/runtime-motion-system.md
````

---

## 3. 의뢰 전 체크리스트 · 핸드오프 후 워크플로

### 의뢰 전 (사용자 1분 점검)

- [ ] **claude-design.md §2 인벤토리에서 중복 여부 확인** — 이미 있으면 확장 의뢰로 전환
- [ ] 컴포넌트 역할 한 줄 정리 (질문 받으면 답할 수 있도록)
- [ ] 참고 컴포넌트(shadcn/Material 등) 떠올려 두기 (없으면 *"없음, 알아서 제안해 줘"*)

### 핸드오프 후

1. 코드를 claude-design.md §1 FSD 결정에 맞는 위치로 이동
2. variant × size × state 스토리 케이스가 시안 쇼케이스와 일치하는지 확인 (claude-design.md §3)
3. 본문 토큰 사용 점검: `grep -E '#[0-9a-fA-F]{3,6}|rgb\(' <컴포넌트 경로>` 결과가 비어야 함
4. **claude-design.md §2 인벤토리에 한 블록 append** ← 빼먹지 말 것
5. `pnpm lint && pnpm fsd:lint` 통과 → PR
