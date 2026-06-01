# 프로젝트 맵 (AI 에이전트용 진입점)

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 Next.js 15 (App Router) + Storybook 10 + shadcn/ui 위에 적용한다. 코드를 탐색하기 전에 이 파일을 먼저 읽는다.

---

## 디렉토리 맵

```
src/
├── app/             # Next.js 라우트 (얇은 wrapper만, 비즈니스 로직 금지)
├── app-init/        # FSD "app" 레이어: providers, 전역 스타일
├── views/           # FSD "pages": 페이지 단위 조합 (Next 충돌 회피로 rename)
├── widgets/         # 자립형 UI 블록 (Header, MainLayout, ProblemBoard)
├── features/        # 사용자 행위 (auth-login, post-create)
├── entities/        # 도메인 모델 (user, post, problem)
└── shared/          # 도메인 무관 재사용 코드
    ├── ui/          # shadcn primitive
    ├── lib/         # cn(), 포매터, 범용 훅
    ├── api/         # http 클라이언트, query client
    ├── config/      # env, 상수, 플래그
    └── types/       # 범용 타입
```

각 FSD 레이어 폴더에는 자체 `README.md`가 있고, 규칙과 슬라이스 템플릿이 담겨 있다. **해당 레이어에 코드를 추가하기 전에 그 레이어의 README를 먼저 읽는다.**

### FSD 공식 이름 ↔ 이 프로젝트 매핑

외부 FSD 자료/예제를 참조할 때 이 표를 적용해서 폴더명을 치환한다.

| FSD 공식 | 이 프로젝트 | rename 이유                      |
| -------- | ----------- | -------------------------------- |
| `app`    | `app-init`  | Next.js `src/app/` 라우트와 충돌 |
| `pages`  | `views`     | Next.js `pages/` 라우트와 충돌   |

다른 레이어(`widgets`, `features`, `entities`, `shared`)는 FSD 공식 이름 그대로 사용한다.

---

## Import 방향 (엄격)

```
app  →  app-init  →  views  →  widgets  →  features  →  entities  →  shared
                                                                       ▲
                                          (허용: 오른쪽 방향으로만 import)
```

- 어떤 레이어든 위 체인에서 **오른쪽에 있는 레이어**만 import 가능
- 왼쪽 레이어는 **절대 import 금지**
- 같은 레이어 안에서 **슬라이스는 격리**됨: `features/auth-login`은 `features/post-create`를 import 못 함. 두 슬라이스가 서로 필요하면 한 단계 위 레이어에서 조립
- Import 방향/슬라이스 구조는 `pnpm fsd:lint`(steiger)로 검사. ESLint `no-restricted-imports`는 stories import만 차단. CI에는 아직 lint 게이트 없음 — Stop hook(로컬)이 유일.

---

## 결정 트리: "내 코드는 어디에 둘까?"

위에서부터 순서대로 묻고, 첫 **yes**에서 멈춘다.

1. **Next 라우트 파일인가?** (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, ...)
   → `src/app/<route>/`. 얇게 유지하고 view/widget을 import해서 렌더만.
2. **React Context Provider나 전역 셋업인가?** (QueryClient, ThemeProvider)
   → `src/app-init/providers/`.
3. **페이지 한 화면의 시각적 셸인가?**
   → `src/views/<page>/`.
4. **재사용 가능한 합성 UI 블록인가?** (Header, Sidebar, ProblemList)
   → `src/widgets/<widget>/`.
5. **사용자 행위를 나타내는가?** (login, create-post, save-draft)
   → `src/features/<verb-noun>/`.
6. **도메인 엔티티에 종속된 UI/모델인가?** (UserCard, PostBadge, problem 타입)
   → `src/entities/<entity>/`.
7. **도메인과 무관한가?** (Button, cn, formatDate, useDebounce)
   → `src/shared/<ui|lib|api|config|types>/`.

두 레이어 사이에서 애매하면 **더 아래 레이어**(더 재사용 가능한 쪽)를 선택. 나중에 필요하면 위로 올린다.

---

## Slice 구조

`entities/`, `features/`, `widgets/`, `views/`의 모든 슬라이스는 다음 형태를 따른다.

```
<layer>/<slice-name>/
├── ui/             # 컴포넌트 + co-located *.stories.tsx
├── model/          # 상태, 훅, 타입, 스키마 (옵션)
├── api/            # fetcher, mutation, query key (옵션)
├── lib/            # 슬라이스 전용 헬퍼 (옵션)
└── index.ts        # PUBLIC API — 외부에 노출할 것만
```

**`shared/`는 예외**: 슬라이스 개념 없음, `index.ts` 배럴 없음. 깊은 경로로 직접 import (`@/shared/ui/button`).

### Public API 규칙

외부 코드는 **슬라이스 루트**에서만 import한다.

```ts
// ✅ OK
import { LoginForm, useLogin } from '@/features/auth-login'

// ❌ 금지
import { LoginForm } from '@/features/auth-login/ui/login-form'
```

---

## 네이밍 컨벤션

| 대상                  | 컨벤션                                 | 예시                           |
| --------------------- | -------------------------------------- | ------------------------------ |
| 폴더 / 파일명         | `kebab-case`                           | `auth-login/`, `user-card.tsx` |
| Slice 이름 (features) | `<verb>-<noun>` 또는 `<domain>-<verb>` | `auth-login`, `post-create`    |
| Slice 이름 (entities) | 단수 명사                              | `user`, `post`, `problem`      |
| React 컴포넌트        | `PascalCase`                           | `LoginForm`, `UserCard`        |
| 훅                    | `use<X>`                               | `useLogin`, `useDebounce`      |
| 타입                  | `PascalCase`                           | `type User`, `interface Post`  |
| Story 파일            | `<component>.stories.tsx`              | `button.stories.tsx`           |

---

## Storybook 규칙

- `shared/ui`, `entities/*/ui`, `features/*/ui`, `widgets/*/ui`의 모든 UI 컴포넌트는 **co-located `*.stories.tsx`를 가져야 한다**.
- `views/*/ui/`는 **자립 가능한 시각 단위(섹션 컴포넌트)에 한해** stories를 권장. 여러 섹션을 합친 페이지 조립 컴포넌트나 서버 데이터·라우팅에 묶인 컴포넌트는 제외.
- Stories는 **production 코드에서 절대 import하지 않는다** — ESLint로 차단.

---

## 아키텍처 린팅 (steiger)

이 프로젝트는 [steiger](https://github.com/feature-sliced/steiger) + `@feature-sliced/steiger-plugin`으로 FSD 준수 여부를 자동 검증한다. ESLint는 코드 한 줄을, steiger는 **디렉토리 구조와 import 그래프 전체**를 본다.

### 실행

```bash
pnpm fsd:lint     # 1회성 검사
pnpm fsd:watch    # 파일 변경 감시
```

### 하네스 통합

Claude Code는 **Stop hook**으로 `pnpm fsd:lint`를 자동 실행한다 ([.claude/settings.json](.claude/settings.json) 참조). 위반이 있으면 작업 종료가 차단되고, 위반 내용이 Claude에게 피드백되어 자동 수정을 유도한다.

### 활성 규칙

[steiger.config.ts](steiger.config.ts)는 `fsd.configs.recommended`를 베이스로 다음 예외만 둔다.

- `src/shared/**` — `fsd/public-api`, `fsd/segments-by-purpose` off (shared는 슬라이스 개념 없음, `types/` 명명 허용)
- `src/app/**`, `src/app-init/**` — 전체 제외 (Next 라우트 / 전역 셋업)
- `fsd/insignificant-slice` — `warn`으로 완화 (프로젝트 초반엔 production 참조 없는 slice 다수)

### 새 slice 추가 시 자주 걸리는 규칙

| 규칙                         | 의미                                                   |
| ---------------------------- | ------------------------------------------------------ |
| `fsd/public-api`             | slice 루트에 `index.ts` 누락                           |
| `fsd/no-public-api-sidestep` | `features/x/ui/foo`처럼 슬라이스 내부 깊은 경로 import |
| `fsd/no-segmentless-slices`  | slice 바로 아래에 `ui/`/`model/` 없이 파일 둠          |
| `fsd/forbidden-imports`      | 상위 레이어 또는 같은 레이어 다른 slice import         |
| `fsd/inconsistent-naming`    | entities 단/복수 섞임 (`user` + `posts`)               |

---

## 코드 추가 전 체크리스트

- [ ] 대상 레이어의 `src/<layer>/README.md` 읽기
- [ ] Import 방향 위반이 없는지 확인
- [ ] 슬라이스 구조 설계 (`ui/`, `model/`, `api/`, `index.ts`)
- [ ] 새 UI 컴포넌트에는 `.stories.tsx`를 co-locate
- [ ] `index.ts`에 public API만 export
- [ ] 커밋 전 `pnpm lint` + `pnpm fsd:lint` 실행 (Stop hook이 후자는 자동 실행)

---

## 에이전트 운영 로그 (필수)

작업 중 다음 둘 중 하나가 발생하면 **즉시 `docs/agents/logs/`에 사건 파일 1건 생성**한다. 선택 아님.

1. **harness-conflict** — PRD 간 / 하네스 문서 간 / 하네스↔코드 컨벤션 간 충돌로 작업이 막히거나 임의 결정이 필요해짐.
2. **clarification-question** — PRD `§Open ⬜`로 미리 정의되지 않은 질문을 의뢰자에게 던지게 됨.

파일명·템플릿·작성 룰은 [docs/agents/logs/README.md](docs/agents/logs/README.md) 참조. Claude Code, Codex 모두 이 룰을 따른다 (Claude Design은 자체 하네스 `docs/agents/claude-design.md §0`에 같은 룰).

---

## 참고 파일 (비자명한 항목만)

- [tsconfig.json](tsconfig.json) — 개발/IDE/Storybook용 (stories 포함)
- [tsconfig.build.json](tsconfig.build.json) — `next build`용 (stories 제외)
- [components.json](components.json) — shadcn alias = `@/shared/ui`
