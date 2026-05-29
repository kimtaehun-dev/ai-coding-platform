import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/shared/lib/utils'

/**
 * Button — design-token 기반 베이스 컴포넌트
 *
 * 기준 문서:
 *   - docs/design-system/index.md         디자인 철학 / 원칙
 *   - docs/design-system/design-token.md  토큰 정의 + §6 Interaction States + §9 불변 제약
 *
 * 제약(§9) 준수:
 *   - semantic 토큰만 사용 (primitive 직접 호출 금지)
 *   - 상태는 명시 토큰(`-hover`, `-active`)로 처리 (opacity modifier `/80` 금지)
 *   - ghost variant만 §7 보조 패턴인 state-layer overlay 사용
 *   - disabled는 색상 대신 `--state-disabled` opacity로 처리
 *   - focus-visible은 `--color-focus-ring`를 box-shadow ring으로 렌더
 *
 * API:
 *   - variant : 시각 스타일 (solid / surface / outline / ghost)
 *   - color   : 의미 색상 (primary / secondary / error) — MD3 네이밍
 *   - size    : sm / md / lg (+ icon-only 정사각 변형)
 *
 *   `surface` variant는 의도적으로 중립(neutral) 처리 — color prop 영향 없음.
 *   (탭 트리거, 토글 그룹 같은 chrome 용 버튼)
 *
 * 외부 시그니처 유지: `Button`, `buttonVariants`, `asChild`
 */
const buttonVariants = cva(
  // ─ Base ────────────────────────────────────────────────────────────────
  [
    'group/button relative inline-flex shrink-0 items-center justify-center',
    'whitespace-nowrap select-none align-middle',
    'border border-transparent bg-clip-padding',
    'transition-[background-color,color,box-shadow,transform] duration-150 ease-out',
    'outline-none',
    // focus-visible — focus-ring 토큰을 box-shadow ring으로
    'focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-0',
    // pressed micro-translate (단, 메뉴 트리거는 제외)
    'active:not-aria-[haspopup]:translate-y-px',
    // disabled
    'disabled:pointer-events-none disabled:opacity-[var(--state-disabled)]',
    // aria-invalid → 폼 검증 실패 표시 (error 토큰)
    'aria-invalid:border-error aria-invalid:ring-3 aria-invalid:ring-error/30',
    // 아이콘 슬롯 기본 사이즈
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // loading 상태일 때 텍스트만 숨기고 spinner는 노출
    'data-[loading=true]:[&>[data-slot=label]]:opacity-0',
    'data-[loading=true]:[&>[data-slot=spinner]]:opacity-100',
  ].join(' '),
  {
    variants: {
      // ─ variant — 시각 스타일만 정의 (색상은 compoundVariants에서) ──
      variant: {
        solid: 'shadow-level-1',
        surface:
          'bg-surface text-foreground border-border hover:bg-surface-hover active:bg-surface-active',
        outline: 'bg-transparent',
        ghost: 'bg-transparent border-transparent',
      },
      // ─ color — 의미 색상 (MD3: primary / secondary / error) ─────────
      color: {
        primary: '',
        secondary: '',
        error: '',
      },
      size: {
        // h28 / label-sm / radius-md
        sm: [
          'h-7 gap-1.5 px-3 text-label-sm rounded-md',
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(' '),
        // h36 / label-md / radius-md (default)
        md: 'h-9 gap-2 px-4 text-label-md rounded-md',
        // h44 / label-lg / radius-lg
        lg: [
          'h-11 gap-2 px-5 text-label-lg rounded-lg',
          "[&_svg:not([class*='size-'])]:size-5",
        ].join(' '),
        // icon-only — 정사각
        'icon-sm':
          "size-7 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-md': 'size-9 rounded-md p-0',
        'icon-lg':
          "size-11 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      // ─ solid × color ─────────────────────────────────────────────────
      {
        variant: 'solid',
        color: 'primary',
        class:
          'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
      },
      {
        variant: 'solid',
        color: 'secondary',
        class:
          'bg-secondary text-on-secondary hover:bg-secondary-hover active:bg-secondary-active',
      },
      {
        variant: 'solid',
        color: 'error',
        class:
          'bg-error text-on-error hover:bg-error-hover active:bg-error-active',
      },

      // ─ outline × color ───────────────────────────────────────────────
      // text + border가 의미 색상. hover는 currentColor 오버레이로 자동 틴팅.
      {
        variant: 'outline',
        color: 'primary',
        class:
          'text-primary border-primary hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)] active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
      },
      {
        variant: 'outline',
        color: 'secondary',
        class:
          'text-secondary border-secondary hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)] active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
      },
      {
        variant: 'outline',
        color: 'error',
        class:
          'text-error border-error hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)] active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
      },

      // ─ ghost × color ─────────────────────────────────────────────────
      // text-only. hover overlay는 currentColor 사용 → color에 따라 자동 변경.
      {
        variant: 'ghost',
        color: 'primary',
        class:
          'text-primary hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)] active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
      },
      {
        variant: 'ghost',
        color: 'secondary',
        class:
          'text-secondary hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)] active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
      },
      {
        variant: 'ghost',
        color: 'error',
        class:
          'text-error hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)] active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
      },

      // ─ surface × * ───────────────────────────────────────────────────
      // surface는 의도적으로 neutral chrome — color prop을 받아도 무시.
      // 명시적으로 foreground 텍스트로 고정해 의도를 분명히 한다.
      {
        variant: 'surface',
        class: 'text-foreground',
      },

      // ─ ghost — default neutral (color 없이도 동작하도록) ─────────────
      // color 미지정 시 foreground 폴백
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** true일 때 라벨을 숨기고 중앙에 spinner 표시 (버튼 너비 유지) */
    loading?: boolean
  }

function Button({
  className,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, color, size, className }))}
      {...props}
    >
      <span
        data-slot="label"
        className="inline-flex items-center gap-[inherit]"
      >
        {children}
      </span>
      {loading ? (
        <span
          data-slot="spinner"
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="8" cy="8" r="6" opacity="0.25" />
            <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
          </svg>
        </span>
      ) : null}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
