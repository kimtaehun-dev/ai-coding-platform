import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

/**
 * Text — typography wrapper (폴리모픽 텍스트 primitive)
 *
 * 기준 문서:
 *   - docs/PRDS/components/text.md          이 컴포넌트 의뢰서 (제약의 원본)
 *   - docs/agents/claude-design.md §3       코드 산출 기대치 (토큰 적용 패턴)
 *   - docs/design-system/design-token.md    토큰 정의 + §시스템 불변 제약
 *   - src/app-init/styles/tokens/typography.css   18 스케일 × 5필드 토큰
 *
 * 핵심 원칙 (design-token.md §시스템 불변 제약 준수):
 *   - semantic 토큰만 사용. primitive(`neutral-10` 등) 직접 호출 금지.
 *   - hex/rgb 인라인 금지 — 색은 foreground 계열 semantic 토큰으로만.
 *   - light/dark 는 토큰 변수로 자동 처리 (자체 미디어 쿼리 없음).
 *
 * 설계 (PRD §Pre-decided / §Decided):
 *   - 시각 스케일(hierarchy + size) ≠ semantic element(`as`) **명시적 분리**.
 *     자동 매핑 금지: hierarchy='display' 가 <h1>을 강제하지 않는다.
 *     페이지 outline 책임은 소비자가 `as`로 명시.
 *   - color 는 foreground 계열 + inherit 만 노출. 강조색(primary/error)은
 *     부모(Button/Badge/Alert) 또는 의미 컴포넌트(Link/ErrorMessage)가 주입.
 *   - weight prop 없음 (§Decided 2). 스케일 내장 weight만 사용.
 *   - family 오버라이드 불가 (§Pre-decided 4). code 스케일은 font-mono 자동 강제.
 *
 * 비대칭 size 규칙 (§Decided 1 — docs/agents/logs/2026-06-02-text-component.md 충돌 2 참조):
 *   - `caption`: size 무시 (단일 토큰 `--text-caption`).
 *   - `code`: md/sm 만 토큰 존재. lg 는 md(`text-code`)로 폴백.
 *
 * 외부 시그니처: `Text`, `textVariants`, `as` prop.
 */
const textVariants = cva(
  // ─ Base ─ 기본 family 는 sans. 색/스케일은 variants 에서. ─────────────
  'font-sans',
  {
    variants: {
      // ─ hierarchy ─ 시각 계층. main 5 + utility 2(caption/code) ─────────
      // main 5 의 실제 토큰은 size 와 함께 compoundVariants 에서 결정.
      hierarchy: {
        display: '',
        headline: '',
        title: '',
        body: '',
        label: '',
        caption: 'text-caption', // size 무시 — 단일 토큰
        code: 'font-mono', // 스케일은 compound, family 는 mono 강제
      },
      // ─ size ─ lg/md/sm. 실제 토큰 매핑은 compoundVariants. ──────────────
      size: {
        lg: '',
        md: '',
        sm: '',
      },
      // ─ color ─ foreground 계열 + inherit 만 (§Pre-decided 2) ───────────
      color: {
        default: 'text-foreground',
        muted: 'text-foreground-muted',
        subtle: 'text-foreground-subtle',
        inverse: 'text-foreground-inverse',
        inherit: 'text-current', // 부모가 currentColor 주입
      },
    },
    // ─ hierarchy × size → 실제 typography 토큰 유틸 매핑 ──────────────────
    compoundVariants: [
      // display
      { hierarchy: 'display', size: 'lg', class: 'text-display-lg' },
      { hierarchy: 'display', size: 'md', class: 'text-display-md' },
      { hierarchy: 'display', size: 'sm', class: 'text-display-sm' },
      // headline
      { hierarchy: 'headline', size: 'lg', class: 'text-headline-lg' },
      { hierarchy: 'headline', size: 'md', class: 'text-headline-md' },
      { hierarchy: 'headline', size: 'sm', class: 'text-headline-sm' },
      // title
      { hierarchy: 'title', size: 'lg', class: 'text-title-lg' },
      { hierarchy: 'title', size: 'md', class: 'text-title-md' },
      { hierarchy: 'title', size: 'sm', class: 'text-title-sm' },
      // body
      { hierarchy: 'body', size: 'lg', class: 'text-body-lg' },
      { hierarchy: 'body', size: 'md', class: 'text-body-md' },
      { hierarchy: 'body', size: 'sm', class: 'text-body-sm' },
      // label
      { hierarchy: 'label', size: 'lg', class: 'text-label-lg' },
      { hierarchy: 'label', size: 'md', class: 'text-label-md' },
      { hierarchy: 'label', size: 'sm', class: 'text-label-sm' },
      // code — md/sm 만 토큰 존재. lg 는 md 로 폴백 (충돌 2 결정).
      { hierarchy: 'code', size: 'lg', class: 'text-code' },
      { hierarchy: 'code', size: 'md', class: 'text-code' },
      { hierarchy: 'code', size: 'sm', class: 'text-code-sm' },
      // caption — size compound 없음 → 어떤 size 가 와도 무시 (text-caption 유지).
    ],
    defaultVariants: {
      hierarchy: 'body',
      size: 'md',
      color: 'default',
    },
  },
)

/**
 * truncate 정책 (§Pre-decided 5):
 *   true | 1 → 단일 라인 ellipsis, 2 → line-clamp-2, 3 → line-clamp-3.
 *   4 이상은 타입 레벨에서 차단 (디자인 재검토 신호).
 */
function truncateClass(
  truncate: boolean | 1 | 2 | 3 | undefined,
): string | undefined {
  if (truncate === true || truncate === 1) return 'truncate'
  if (truncate === 2) return 'line-clamp-2'
  if (truncate === 3) return 'line-clamp-3'
  return undefined
}

type TextProps = React.ComponentProps<'p'> &
  VariantProps<typeof textVariants> & {
    /** 렌더 태그. 시각 스케일과 무관 — 페이지 outline 책임은 소비자. default 'p'. */
    as?: React.ElementType
    /** true|1 단일줄 / 2 / 3 line-clamp. 4+ 금지. */
    truncate?: boolean | 1 | 2 | 3
  }

function Text({
  as,
  hierarchy = 'body',
  size = 'md',
  color = 'default',
  truncate,
  className,
  ...props
}: TextProps) {
  const Comp = as ?? 'p'

  return (
    <Comp
      data-slot="text"
      data-hierarchy={hierarchy ?? undefined}
      data-size={size ?? undefined}
      className={cn(
        textVariants({ hierarchy, size, color }),
        truncateClass(truncate),
        className,
      )}
      {...props}
    />
  )
}

export { Text, textVariants }
export type { TextProps }
