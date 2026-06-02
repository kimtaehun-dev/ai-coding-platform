# Text component — 하네스 충돌 로그

- 의뢰: [docs/PRDS/components/text.md](../../PRDS/components/text.md) (v1.0)
- 일시: 2026-06-02
- 작성: 클로드 디자인

---

## 충돌 1 — 로그 목적지 경로 불일치 + 로그 인프라 부재

**유형**: 하네스↔하네스 (메타 충돌)

**상황**:

- 이 의뢰의 작업 지시(및 사용자 메시지)는 충돌 발생 시 **`/docs/logs/README.md`** 를 보고 로그를 작성하라고 명시.
- 그러나 하네스 [claude-design.md](../claude-design.md) §0-6은 로그 목적지를 **`docs/agents/logs/`** (링크 타깃 `../agents/logs/README.md`)로 못박음.
- 실제 레포에는 `/docs/logs/`, `/docs/agents/logs/` **둘 다 존재하지 않았고**, 로그 포맷/템플릿을 정의한 README도 없었다. 즉 "즉시 사건 파일 1건 생성"이라는 §0-6 의무를 수행할 인프라 자체가 부재.

**영향**: 충돌 로그를 어디에·어떤 형식으로 남길지 정해지지 않아, 로깅 의무 수행 자체가 막힘.

**결정 (의뢰자 확인 후 갱신)**: 하네스 §0-6 링크가 가리키는 **정본 위치 `docs/agents/logs/`** 로 단일화. 최초엔 작업 지시문의 `/docs/logs/` 경로를 따라 생성했으나, 의뢰자가 정본을 `docs/agents/logs/`로 확정하여 README + 본 사건 파일을 이전. `docs/logs/` 디렉토리는 제거.

**경과**:

1. 최초: 둘 다 부재한 상태에서 작업 지시문의 `/docs/logs/`에 README·사건 파일 생성.
2. 의뢰자 확인: 정본은 `docs/agents/logs/` (= §0-6 링크 타깃).
3. 이전: `docs/logs/*` → `docs/agents/logs/*`, 내부 상대 링크 정정. **이로써 §0-6 링크가 실제 파일과 일치(충돌 해소).**

**남은 액션 (의뢰자)**: `docs/agents/logs/` 디렉토리 자체를 dev에 커밋(현재 레포엔 부재했음). 작업 지시 표준 문구도 `/docs/logs/` 대신 `docs/agents/logs/`로 통일 권장.

---

## 충돌 2 — 2축(hierarchy × size) cva 모델 ↔ caption/code의 비대칭 size 규칙

**유형**: PRD 미결정 (임의 결정 필요)

**상황**:

- PRD §Pre-decided 1 + §Deliverables 시그니처는 `TextProps = React.ComponentProps<'p'> & VariantProps<typeof textVariants> & {...}` 로, `hierarchy`와 `size`를 **단일 cva의 독립 2축 variant**로 노출하도록 확정.
- 그런데 PRD §Decided 1은 두 가지 비대칭 규칙을 추가로 확정:
  - `caption`: `size` **무시** (토큰이 `--text-caption` 단일, size 분기 없음)
  - `code`: `size: 'md' | 'sm'` 만 허용 (`--text-code-lg` 토큰 **없음**)
- 충돌: 단일 `textVariants`의 독립 2축 모델 + `VariantProps<typeof textVariants>` 타입은 "hierarchy 값에 따라 size 도메인이 달라진다"를 **타입 레벨에서도 런타임에서도 강제하지 못한다.** 소비자가 `<Text hierarchy="code" size="lg">` 또는 `<Text hierarchy="caption" size="sm">` 를 작성할 수 있으나 대응 토큰(`text-code-lg`, `text-caption-*`)이 존재하지 않음.
- 타입으로 분기(discriminated union)하려면 PRD가 못박은 단일 `VariantProps` 시그니처를 깨야 함 → 시그니처 준수와 규칙 강제가 동시 성립 불가.

**영향**: `caption`/`code`에 들어오는 "정의되지 않은 size 조합"의 처리 방식을 PRD가 명시하지 않아, 임의 결정 필요.

**결정** (시그니처 유지 + compoundVariants 매핑):

- **caption**: `hierarchy` variant가 `text-caption`을 직접 부여하고, caption 행에 대한 size compoundVariant를 **두지 않음** → 어떤 size가 와도 클래스 미기여(=무시). PRD 규칙 그대로.
- **code**: `code+md → text-code`, `code+sm → text-code-sm`, 그리고 토큰 없는 **`code+lg → text-code(=md) 폴백`**.

**근거**:

- PRD가 못박은 단일 `VariantProps` 시그니처를 보존(§Deliverables 우선)하면서 규칙을 최대한 표현하는 유일한 방법이 compoundVariants 매핑.
- `code+lg` 폴백을 md로 둔 이유: 가장 가까운 정의 토큰이며, 깨진 텍스트(미정의 클래스 → 브라우저 기본 폰트)보다 안전. 스토리/문서에서는 code를 md/sm로만 시연하여 lg 사용을 유도하지 않음.

**되돌릴 조건 (의뢰자 액션)**: 의뢰자가 "타입 안전 우선"을 택하면 시그니처를 discriminated union(예: `{hierarchy:'code', size:'md'|'sm'}` 등)으로 바꾸는 후속 의뢰를 연다 — 단 이는 PRD §Deliverables의 단일 `VariantProps` 시그니처 변경이라 PRD 개정이 선행되어야 함. 그 전까지 본 폴백 유지.
