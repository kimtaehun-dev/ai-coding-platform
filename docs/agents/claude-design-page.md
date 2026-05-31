# Claude Design — 페이지 시안 의뢰

> **전제: 이 문서를 읽기 전에 [docs/agents/claude-design.md](./claude-design.md)를 먼저 읽었다.**
> 공통 룰(FSD 위치, base 인벤토리, 코드 산출 기대치, 참고 문서)은 거기에 있다. 이 문서는 페이지 의뢰 전용 추가 룰만 정의.

---

## 1. 페이지 의뢰 절차

1. **claude-design.md 공통 룰을 모두 적용한 상태**에서 §2 템플릿의 ⬜를 채운다.
2. ⬜는 임의 추정 금지. 한꺼번에 묻지 말고 *페이지 목적 → 섹션 구조 → 톤/참고 사이트* 순으로 묶어서 묻는다.
3. 큰 페이지(랜딩 등)는 한 번에 전체보다 **Hero 먼저 → 컨펌 → 나머지 섹션** 순으로 끊을지 사용자에게 먼저 물어본다.
4. 모든 ⬜가 채워지면 시안 + 코드 + **승격 후보 목록**(§3 형식)을 함께 산출한다.

---

## 2. 페이지 의뢰서 표준 구조

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
- 참고 사이트: ⬜
- 회피 스타일: ⬜

## 7. 산출물 (코드 기대치)
docs/agents/claude-design.md §3 "코드 산출 기대치" 그대로 적용.
- 데스크탑(1280) + 모바일(375) 두 폭 시안 산출.

## 8. 재사용 컴포넌트 추출 제안
docs/agents/claude-design-page.md §3 "추출 규칙" 그대로 적용.
현재 base 인벤토리는 docs/agents/claude-design.md §2 참조.

## 9. 참고 문서
- docs/design-system/index.md
- docs/design-system/design-token.md
- docs/design-system/runtime-motion-system.md
````

---

## 3. 재사용 컴포넌트 추출 규칙 (페이지 전용)

페이지를 만들다 같은 시각 패턴이 반복되면 클로드 디자인이 **별도 파일로 분리해서 함께 산출**해야 한다. 인라인 박제 방지.

**기준**
- 같은 패턴이 **2회 이상** 반복, **또는** 명백히 도메인 무관 primitive
- **최대 5개**까지만 분리 제안 (과추출 방지)
- 분리 위치는 claude-design.md §1 FSD 레이어 결정 테이블에 따름
- 애매하면 inline / 분리 두 옵션 모두 제시

**산출 형식**
- 추출한 컴포넌트는 자체 파일 + co-located `*.stories.tsx`
- 산출 끝에 **"승격 후보 목록"** 섹션 별도 포함:
  - 이름 / 제안 위치 / 분리 사유 / 사용된 위치 2곳 이상

---

## 4. 의뢰 전 체크리스트 · 핸드오프 후 워크플로

### 의뢰 전 (사용자 1분 점검)

세부 변수(⬜)는 클로드 디자인이 §1 절차에 따라 물어보므로 미리 다 결정할 필요 없음. 다만 아래는 트리거 전 사용자가 직접 챙긴다.

- [ ] **claude-design.md §2 인벤토리 최신화** ← 직전 의뢰에서 추가된 컴포넌트가 누락됐다면 먼저 한 블록 append
- [ ] 페이지 목적(전환? 정보 제공?)을 머릿속에 한 줄로 정리
- [ ] 참고 사이트 후보 1~3개 (없으면 *"없음, 알아서 제안해 줘"* 라고 답해도 됨)

### 핸드오프 후

1. **승격 후보 목록부터 검토** (5분) — 무엇을 정식 편입할지 결정
2. 채택 컴포넌트:
   - 정식 위치 이동 (claude-design.md §1 기준)
   - **co-located `*.stories.tsx` 페어링** (production 코드에서 stories import 금지)
   - `pnpm fsd:lint` 통과
   - **claude-design.md §2 인벤토리에 한 블록 append** ← 빼먹지 말 것
3. 페이지 코드 → `src/views/<page>/` 슬라이스 정착, `src/app/<route>/page.tsx`에서 마운트
4. 본문 토큰 사용 점검: `grep -E '#[0-9a-fA-F]{3,6}|rgb\(' src/views/<page>` 결과가 비어야 함
5. `pnpm lint && pnpm fsd:lint` 통과 → PR
6. 거른 후보는 페이지 슬라이스 내부에 그대로 둠 (다음 페이지에서 또 나타나면 그때 재검토)
