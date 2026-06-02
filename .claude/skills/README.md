# 팀 하네스 — Skills

이 디렉토리는 Claude Code의 **프로젝트 스코프 스킬** 저장소다. 여기 있는 각 하위 폴더는 슬래시 커맨드 하나에 대응한다 (`<폴더명>` = `/<폴더명>`).

원본 출처: [obra/superpowers](https://github.com/obra/superpowers) (MIT). 가져온 후 **우리 팀이 소유·편집**하며, 업스트림과 자동 동기화하지 않는다. 다른 하네스(Codex, Cursor 등)의 기법을 특정 스킬에 머지해도 됨.

---

## 트리거

| 명령어                                                         | 동작                                |
| -------------------------------------------------------------- | ----------------------------------- |
| `/superpowers`                                                 | 진입점. 스킬 사용 규칙 전반을 로드. |
| `/brainstorming`                                               | 구현 전 설계 브레인스토밍.          |
| `/writing-plans`                                               | 실행 계획 문서화.                   |
| `/executing-plans`                                             | 작성된 계획 실행.                   |
| `/systematic-debugging`                                        | 체계적 디버깅 절차.                 |
| `/test-driven-development`                                     | TDD 워크플로우.                     |
| `/verification-before-completion`                              | 완료 선언 전 검증.                  |
| `/requesting-code-review`, `/receiving-code-review`            | 코드 리뷰 양방향.                   |
| `/finishing-a-development-branch`                              | 브랜치 마무리.                      |
| `/using-git-worktrees`                                         | git worktree 기반 병렬 작업.        |
| `/subagent-driven-development`, `/dispatching-parallel-agents` | 서브에이전트 활용.                  |
| `/writing-skills`                                              | 새 스킬 작성 가이드.                |

(폴더 이름이 곧 명령어. 필요 없는 스킬은 폴더째 삭제하면 명령어도 사라짐.)

---

## "첫 대화부터 자동 활성" vs "명시 호출만" 토글

[../superpowers.config.json](../superpowers.config.json)의 `mode` 필드.

```json
{ "mode": "auto" }   // 새 세션마다 superpowers/SKILL.md 내용을 첫 컨텍스트에 주입
{ "mode": "manual" } // 주입 안 함. 슬래시 커맨드로만 발화. (기본값)
```

수정 후 커밋하면 **팀 전원에게 즉시 반영**된다 (이 repo로 `claude` 실행 시).

내부 동작: [../hooks/superpowers-session-start.sh](../hooks/superpowers-session-start.sh)가 `SessionStart` 훅으로 등록돼 있고, `mode == "auto"`일 때만 `additionalContext`를 emit한다.

---

## 다른 프로젝트에는 영향 없음

- 모든 스킬·훅·config가 이 repo의 `.claude/` 내부.
- `/plugin install`로 user-global 설치한 게 아니므로 `~/.claude/` 오염 없음.
- 다른 프로젝트에서 `claude`를 띄우면 슬래시 커맨드는 보이지 않음.

---

## 스킬 편집 가이드

- 각 스킬은 `<폴더>/SKILL.md` 1개 + 부속 파일들로 구성.
- frontmatter `name`은 폴더명과 일치시킬 것.
- `description`은 Claude가 자동 발화 판단에 쓰는 값. 좁히면 덜 발화, 넓히면 더 발화.
- 자동 발화를 완전히 막고 싶으면 frontmatter에 `disable-model-invocation: true` 추가.
- 편집은 자유. 단 `superpowers/SKILL.md`의 `name: superpowers`는 SessionStart 훅이 참조하므로 유지.
