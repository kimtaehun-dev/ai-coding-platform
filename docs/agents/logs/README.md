# Agent 운영 로그

> AI 에이전트(Claude Code, Claude Design, Codex)가 작업 중 만난 **하네스 충돌**과 **계획에 없던 추가 질문**을 사건 단위로 기록한다. 회수 루프: 사람이 주기적으로 훑어 `Suggested harness fix`를 PRD/하네스 문서에 반영.

---

## 언제 로그를 남기나 (필수 트리거)

작업 중 다음 둘 중 하나가 발생하면 **즉시 파일 1건 생성**. 선택 아님.

1. **harness-conflict** — PRD 간 / 하네스 문서 간 / 하네스↔코드 컨벤션 간 충돌로 작업이 막히거나, 명문화된 답이 없어 에이전트가 임의 결정을 해야 함.
2. **clarification-question** — PRD `§Open ⬜`로 미리 정의되지 않은 질문을 의뢰자에게 던지게 됨. (= PRD가 예측 못 한 빈틈 = 다음번 PRD 템플릿이 보강돼야 할 신호)

> 일상적 진행(코드 한 줄 수정, 의뢰자 선호 확인 등)은 로그 대상 아님. **하네스/PRD를 고쳐야 재발을 막는 사건**만 기록한다.

---

## 파일 컨벤션

- 위치: `docs/agents/logs/`
- 파일명: `YYYY-MM-DD-<agent>-<short-slug>.md`
  - 예: `2026-06-01-claude-design-text-utility-scale-ambiguity.md`
- 사건 1건 = 파일 1개. 여러 사건을 한 파일에 합치지 않는다.
- 한 세션에서 같은 사건 유형을 여러 번 만나면 묶어서 1건으로 작성 OK (예: 같은 PRD 모호함이 여러 질문으로 파생됐을 때).

---

## 템플릿

````markdown
---
date: 2026-06-01
agent: claude-design          # claude-design | claude-code | codex
type: harness-conflict        # harness-conflict | clarification-question
task: <한 줄 — 무엇을 하던 중이었나>
docs-involved:
  - docs/agents/claude-design.md
  - docs/PRDS/components/text.md
---

## Context
왜 이 작업을 하고 있었나, 어디까지 진행됐었나.

## What happened
무엇이 충돌/질문을 유발했나. 가능하면 원문/라인 인용.

## Resolution this session
이번 세션에서는 어떻게 해결했나 — 의뢰자 답변 / 임의 결정 / 우회 등.

## Suggested harness fix
같은 사건 재발 막으려면 어느 문서를 어떻게 고치면 되나. (optional, 강력 권장)
````

---

## 작성 시 주의

- **민감 정보 금지**: 토큰, 사용자 PII, 비공개 URL 등 git에 올라가면 안 되는 값 포함 금지. 사건 내용은 항상 일반화해서 적는다.
- **사후 평가 금지**: 의뢰자나 다른 에이전트를 평가/비판하는 톤은 쓰지 않는다. 사실(무엇이 일어났나) + 개선안(어떻게 고치면 되나)만.
- **링크 사용**: `docs-involved`와 본문에서 관련 파일·라인을 마크다운 링크로 정확히 가리킨다. 추후 회수 시 바로 점프 가능해야 함.

---

## 회수 루프 (사람이 한다)

- 주기적으로 `docs/agents/logs/`를 훑어 `Suggested harness fix`가 모인 항목을 PRD 템플릿 / 하네스 문서에 반영.
- 반영 완료된 로그는 삭제하지 않는다 — 사건 발생 사실은 보존, harness 변경 이력의 근거가 됨.
