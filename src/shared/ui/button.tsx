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
 * 외부 시그니처 유지: `Button`, `buttonVariants`, `asChild`, cva variants
 */
const buttonVariants = cva(
  // ─ Base ────────────────────────────────────────────────────────────────
  // 레이아웃 / 전이 / 포커스 / disabled / 아이콘 슬롯
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
      variant: {
        // 1) solid — primary 채움 (default)
        solid: [
          'bg-primary text-on-primary',
          'hover:bg-primary-hover',
          'active:bg-primary-active',
          'shadow-level-1',
        ].join(' '),

        // 2) surface — surface 채움 + 1px border
        surface: [
          'bg-surface text-foreground border-border',
          'hover:bg-surface-hover',
          'active:bg-surface-active',
        ].join(' '),

        // 3) outline — transparent + border (호버 시 surface 오버레이로 인지)
        outline: [
          'bg-transparent text-foreground border-border',
          'hover:bg-surface-hover hover:border-border-strong',
          'active:bg-surface-active',
        ].join(' '),

        // 4) ghost — text-only, state-layer overlay (§7 보조 패턴)
        // base가 transparent라 명시 hover 토큰 대신 currentColor 오버레이 사용
        ghost: [
          'bg-transparent text-foreground border-transparent',
          'hover:bg-[color-mix(in_oklch,currentColor_calc(var(--state-hover)*100%),transparent)]',
          'active:bg-[color-mix(in_oklch,currentColor_calc(var(--state-pressed)*100%),transparent)]',
        ].join(' '),
      },
      size: {
        // h28 / label-sm / radius-md
        sm: [
          'h-7 gap-1.5 px-3 text-label-sm rounded-md',
          "has-data-[icon=inline-start]:pl-2 has-data-[icon=inline-end]:pr-2",
          "[&_svg:not([class*='size-'])]:size-3.5",
        ].join(' '),
        // h36 / label-md / radius-md (default)
        md: [
          'h-9 gap-2 px-4 text-label-md rounded-md',
          "has-data-[icon=inline-start]:pl-3 has-data-[icon=inline-end]:pr-3",
        ].join(' '),
        // h44 / label-lg / radius-lg
        lg: [
          'h-11 gap-2 px-5 text-label-lg rounded-lg',
          "has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-end]:pr-4",
          "[&_svg:not([class*='size-'])]:size-5",
        ].join(' '),
        // icon-only — 정사각
        'icon-sm': "size-7 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-md': 'size-9 rounded-md p-0',
        'icon-lg': "size-11 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: 'solid',
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
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <span data-slot="label" className="inline-flex items-center gap-[inherit]">
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
