# Layer: `shared`

재사용 가능한 **도메인 무관** 코드. FSD 스택의 최하단.

## 규칙

- **Import 가능 대상:** 외부 패키지와 다른 `shared/*`만
- **Import 가능한 상위 레이어:** 모든 상위 레이어
- **도메인 지식 금지.** `User`, `Order` 등이 등장한다면 여기가 아니라 `entities/`에 속한다.

## 하위 폴더

| Folder    | 용도                                                    |
| --------- | ------------------------------------------------------- |
| `ui/`     | 디자인 시스템 primitive (shadcn 컴포넌트가 여기에 위치) |
| `lib/`    | 순수 헬퍼 (`cn`, 포매터, API/도메인 의존성 없는 훅)     |
| `api/`    | HTTP 클라이언트, query client, 베이스 fetcher           |
| `config/` | 상수, env, 기능 플래그                                  |
| `types/`  | 범용 타입 primitive                                     |

## 코드 추가 방법

1. 컴포넌트 파일 생성 (PascalCase): `src/shared/ui/Badge.tsx` — `lib/`·`api/`·`config/` 하위 helper 파일은 kebab-case (`format-date.ts`)
2. Story co-locate: `src/shared/ui/Badge.stories.tsx`
3. 파일에서 바로 export — `shared/*`는 슬라이스 배럴(`index.ts`)을 **쓰지 않는다**. 깊은 경로로 직접 import: `@/shared/ui/Badge`

## Import 경로 예시

```ts
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/utils'
```
