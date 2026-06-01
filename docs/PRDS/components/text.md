# Component Spec: Text — 타이포그래피 wrapper 의뢰서

> 이 문서는 **클로드 디자인의 진입점**이다. 사용자가 _"docs/PRDS/components/text.md 따라 의뢰"_ 한 줄만 보내면, 아래 §Procedure 순서로 진행한다.
> 산출물: `src/shared/ui/text.tsx` + `text.stories.tsx` + claude-design.md §2 인벤토리 한 블록 append.

---

## ⚑ Procedure (클로드 디자인이 반드시 이 순서로)

1. **이 PRD 전체를 먼저 읽는다.** §Pre-decided + §Decided는 모두 확정값이므로 의뢰자에게 묻지 않는다.
2. **§Pre-read의 하네스 문서를 모두 읽는다.** 거기 정의된 공통 룰(FSD 위치, 토큰 규칙, 코드 산출 기대치, 컴포넌트 의뢰서 템플릿)은 이 PRD에 다시 적지 않아도 그대로 적용된다.
3. §Deliverables에 따라 산출.
4. §Post-handoff Checklist를 모두 통과한 뒤 종료.

---

## ⚑ Pre-read (필독)

작업 시작 전 아래를 모두 읽는다. 위 문서의 규칙은 이 PRD에 다시 적지 않아도 그대로 적용된다.

- [/docs/agents/claude-design.md](/docs/agents/claude-design.md) — 공통 하네스 (FSD 위치 §1, base 인벤토리 §2, 코드 산출 기대치 §3)
- [/docs/agents/claude-design-component.md](/docs/agents/claude-design-component.md) — 컴포넌트 의뢰 절차/템플릿
- [/docs/design-system/index.md](/docs/design-system/index.md) — 디자인 철학
- [/docs/design-system/design-token.md](/docs/design-system/design-token.md) — 토큰 정의·불변 제약 (§6 Typography 18 스케일, §9 제약)
- [/src/app-init/styles/tokens/typography.css](/src/app-init/styles/tokens/typography.css) — 실제 토큰 변수 (18 스케일 × 5필드, font-sans/mono)

---

## ⚑ Goal

18개 typography 스케일을 의미 토큰으로만 노출하는 폴리모픽 텍스트 primitive 1개를 생성한다.

- 시각 스케일(hierarchy/size)과 semantic element(h1~h6, p, span) **분리**
- foreground 계열 색만 노출, 강조색은 부모가 주입
- design-token.md §9 제약 100% 준수 (semantic 토큰만, hex/rgb 금지, light/dark 자동)

---

## ⚑ FSD 위치 (claude-design.md §1 적용)

도메인 무관 primitive → `src/shared/ui/text.tsx` + co-located `text.stories.tsx`.

---

## ⚑ Pre-decided (PRD가 답을 못 박는다 — 의뢰자에게 묻지 않음)

### 1. 스케일 노출 방식 — `hierarchy + size` 2축 분리

```ts
hierarchy: 'display' | 'headline' | 'title' | 'body' | 'label'  // 5
size:      'lg' | 'md' | 'sm'                                    // 3
```

- 5 × 3 = 메인 15 스케일을 커버
- utility 그룹(caption, code, code-sm)의 노출 방식은 §Decided 1 참조 (hierarchy 확장)

### 2. color prop — foreground 계열만 + inherit

```ts
color: 'default' | 'muted' | 'subtle' | 'inverse' | 'inherit'
```

| 값        | 매핑                          | 용도                              |
| --------- | ----------------------------- | --------------------------------- |
| `default` | `text-foreground`             | 본문/제목 기본 (생략 시 기본값)   |
| `muted`   | `text-foreground-muted`       | 보조 텍스트, 캡션                 |
| `subtle`  | `text-foreground-subtle`      | placeholder, 비활성 라벨          |
| `inverse` | `text-foreground-inverse`     | 컬러 surface 위 텍스트            |
| `inherit` | `text-current` (= currentColor) | 부모가 색을 주입할 때 (Button 내부) |

**MD3 원칙**: type scale과 color는 직교(orthogonal). Text 컴포넌트는 강조색(primary/error)을 직접 노출하지 않는다. 강조가 필요한 케이스는:

- **부모 컴포넌트가 색을 책임**: Button/Badge/Alert가 surface 색을 결정하고 Text는 `inherit`
- **도메인 컴포넌트가 색을 책임**: Link/ErrorMessage 같은 의미 컴포넌트가 직접 색 결정

### 3. polymorphic — `as` prop

```ts
as?: ElementType  // default 'p'
```

- 직관적 props 패턴 채택
- 시각 스케일(hierarchy/size) ≠ semantic element(h1~h6, p, span, div) **명시적 분리**
- 예:
  ```tsx
  <Text hierarchy="display" size="lg" as="h1">페이지 제목</Text>
  <Text hierarchy="display" size="lg" as="span">큰 글씨 (outline 영향 없음)</Text>
  <Text hierarchy="body" size="md">본문 (기본 p)</Text>
  ```
- **자동 매핑 금지**: hierarchy='display' → `<h1>` 강제 같은 거 절대 하지 않는다. 페이지 outline은 소비자가 `as`로 명시 책임.

> **Button 패턴 차이 (의도된 결정)**: [Button](/src/shared/ui/button.tsx)은 `asChild`(Radix Slot)을 그대로 유지한다. Button은 Link로 자주 감싸는 패턴(`<Button asChild><Link/></Button>`)이라 `asChild`가 적합하고, Text는 렌더 태그만 바꾸는 게 99%라 `as`가 적합. 두 패턴이 코드베이스에 공존하는 건 컴포넌트 성격상 자연스러운 선택.

### 4. font family 자동 매핑

- 기본: `font-sans` (Pretendard Variable — 한영 혼용 최적)
- **code 스케일은 자동 `font-mono` 강제** (§Decided 1에서 code 노출 확정)
- 소비자가 family를 prop으로 오버라이드 불가 — 디자인 시스템 일관성 우선

### 5. truncate 정책

```ts
truncate?: boolean | 1 | 2 | 3
```

| 값            | 매핑                          |
| ------------- | ----------------------------- |
| `true` 또는 `1` | `truncate` (single-line ellipsis) |
| `2`           | `line-clamp-2`                |
| `3`           | `line-clamp-3`                |

4 이상은 의도적으로 막는다. 더 긴 본문이 잘려야 한다면 디자인 자체를 재검토하는 게 맞다.

### 6. 시각 스케일 ≠ semantic element 분리 원칙

위 §3과 동일한 원칙의 명시적 선언. 코드 리뷰/스토리/문서에서 반복 적용:

- "시각 = hierarchy + size" / "시맨틱 = as"
- 두 축이 어긋나도 OK (`hierarchy="display" as="span"`)
- 페이지 outline의 책임은 소비자 (자동 매핑 안 함)

---

## ⚑ Decided (의뢰자 응답 — 확정값)

### 묶음 1. utility 스케일(caption, code, code-sm) 노출 방식 → **(a) hierarchy 확장**

`hierarchy` enum에 `'caption' | 'code'`를 추가하여 단일 컴포넌트 유지.

```ts
hierarchy: 'display' | 'headline' | 'title' | 'body' | 'label'  // main 15 (× lg/md/sm)
        | 'caption' | 'code'                                     // utility
```

- `caption`: `size` 무시 (토큰이 size 분기 없음 — `--text-caption` 단일).
- `code`: `size: 'md' | 'sm'` 만 허용 (lg 토큰 없음). `font-mono` 자동 강제 — §Pre-decided §4 적용.

### 묶음 2. weight override 허용 여부 → **(a) 허용 안 함**

스케일에 내장된 weight(typography.css `--text-*--font-weight`)만 사용. `weight` prop 노출하지 않음. 강조가 필요하면 hierarchy를 바꾸거나(`body` → `title`) 부모 컴포넌트가 색·배경으로 처리.

### 묶음 3. 참고 컴포넌트 → **없음, 알아서 제안**

특정 참고 라이브러리 지정 없음. §Pre-decided + §Decided + design-token.md + typography.css 만 보고 클로드 디자인이 자체 제안.

---

## ⚑ Deliverables (코드 산출 기대치)

claude-design.md §3 "코드 산출 기대치"를 그대로 적용한 위에 다음을 추가한다.

### 파일

- `src/shared/ui/text.tsx`
- `src/shared/ui/text.stories.tsx`

### 시그니처 (Pre-decided + Decided 반영 후 최종)

```ts
type TextProps = React.ComponentProps<'p'> &
  VariantProps<typeof textVariants> & {
    as?: React.ElementType        // §3
    truncate?: boolean | 1 | 2 | 3 // §5
  }

export { Text, textVariants }
export type { TextProps }
```

### 스토리 의무 (text.stories.tsx)

| 스토리                | 필수 조합                                                |
| --------------------- | -------------------------------------------------------- |
| Hierarchy × Size 매트릭스 | 5 × 3 = 15 스케일 라이트/다크 비교                       |
| Color                 | 5종(default/muted/subtle/inverse/inherit) 같은 본문 비교 |
| Polymorphic (as)      | h1~h6, p, span, div 각 1케이스                            |
| Truncate              | 1/2/3 케이스 + 짧은 본문(잘리지 않음) 1케이스             |
| **한영 혼용**          | "안녕하세요 Hello World 2026" 같은 본문 1케이스 **필수**  |
| Code 스케일            | mono family 강제 확인 케이스 (lg 없음, md/sm만)           |

---

## ⚑ Post-handoff Checklist (산출 후 모두 통과)

- [ ] `grep -E '#[0-9a-fA-F]{3,6}|rgb\(' src/shared/ui/text.tsx` 결과 비어 있음 (hex/rgb 인라인 금지)
- [ ] primitive 토큰 직접 호출 없음 (semantic 토큰만 — `primary-40` 같은 거 금지)
- [ ] 스토리에 한영 혼용 + 숫자 본문 1케이스 이상 포함
- [ ] `as` prop으로 h1~h6 케이스 시연
- [ ] truncate 1/2/3 시연
- [ ] `pnpm lint && pnpm fsd:lint` 통과
- [ ] **claude-design.md §2 인벤토리에 한 블록 append**:
  ```markdown
  ### `@/shared/ui/Text`
  - 외부 시그니처: `Text`, `textVariants`, `as` prop
  - hierarchy: display · headline · title · body · label · caption · code
  - size: lg · md · sm
  - color: default · muted · subtle · inverse · inherit
  - polymorphic: `as` prop (default 'p')
  - 토큰: typography.css 18 스케일 + foreground 계열만
  - 자세한 제약: 파일 상단 docblock + docs/PRDS/components/text.md
  ```

---

## Version

v1.0
