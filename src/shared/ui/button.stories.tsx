import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'

import { Button } from './button'

/**
 * Button — design-token 기반 베이스 컴포넌트.
 *
 * `Showcase` story가 모든 variant/size/state/slot을 한 페이지에 시각화한다.
 * 토큰은 light/dark 자동 매핑.
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: 'Button',
    variant: 'solid',
    size: 'md',
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'surface', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon-sm', 'icon-md', 'icon-lg'],
    },
    asChild: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/* ────────────────────────────────────────────────────────────────────────
 * Local icons — Storybook에서 외부 의존 없이 동작하도록 인라인 SVG
 * 실제 앱에서는 lucide-react 등을 사용하세요.
 * ──────────────────────────────────────────────────────────────────────── */
const Icon = {
  Plus: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M6 3l5 5-5 5" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6l4 4 4-4" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 3L4 8l6 5" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="4" />
      <path d="M10 10l3 3" strokeLinecap="round" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.5 4h11M5 8h6M7 12h2" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v1.7M8 12.8v1.7M14.5 8h-1.7M3.2 8H1.5M12.6 3.4l-1.2 1.2M4.6 11.4l-1.2 1.2M12.6 12.6l-1.2-1.2M4.6 4.6L3.4 3.4" />
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M3 3h8l2 2v8H3V3zM5 3v4h6V3M5 13v-4h6v4" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 2l3 3-8 8H3v-3l8-8z" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  ),
  More: () => (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <circle cx="4" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="12" cy="8" r="1.2" />
    </svg>
  ),
  Sort: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6l4-3 4 3M4 10l4 3 4-3" />
    </svg>
  ),
}

/* ────────────────────────────────────────────────────────────────────────
 * Force-state CSS — 실제 Button 컴포넌트의 :hover/:active/:focus-visible을
 * 정적으로 표시하기 위해 wrapper class로 강제. data-variant 속성에 의존.
 * (Button 컴포넌트에 이미 `data-slot`, `data-variant` 가 자동 추가됨)
 * ──────────────────────────────────────────────────────────────────────── */
const ForceStateStyle = () => (
  <style>{`
    /* hover ─────────────────────────────────────────────── */
    .force-hover [data-slot="button"][data-variant="solid"] {
      background-color: var(--color-primary-hover) !important;
    }
    .force-hover [data-slot="button"][data-variant="surface"] {
      background-color: var(--color-surface-hover) !important;
    }
    .force-hover [data-slot="button"][data-variant="outline"] {
      background-color: var(--color-surface-hover) !important;
      border-color: var(--color-border-strong) !important;
    }
    .force-hover [data-slot="button"][data-variant="ghost"] {
      background-color: color-mix(in oklch, currentColor calc(var(--state-hover) * 100%), transparent) !important;
    }

    /* pressed ───────────────────────────────────────────── */
    .force-pressed [data-slot="button"][data-variant="solid"] {
      background-color: var(--color-primary-active) !important;
    }
    .force-pressed [data-slot="button"][data-variant="surface"],
    .force-pressed [data-slot="button"][data-variant="outline"] {
      background-color: var(--color-surface-active) !important;
    }
    .force-pressed [data-slot="button"][data-variant="ghost"] {
      background-color: color-mix(in oklch, currentColor calc(var(--state-pressed) * 100%), transparent) !important;
    }
    .force-pressed [data-slot="button"]:not([aria-haspopup]) {
      transform: translateY(1px) !important;
    }

    /* focus-visible ─────────────────────────────────────── */
    .force-focus [data-slot="button"] {
      box-shadow: 0 0 0 3px var(--color-focus-ring) !important;
    }
  `}</style>
)

/* ────────────────────────────────────────────────────────────────────────
 * Page-level helpers — Tailwind v4 + token CSS로 쇼케이스 레이아웃 구성
 * ──────────────────────────────────────────────────────────────────────── */
const SectionHeader = ({
  num,
  title,
  desc,
}: {
  num: string
  title: string
  desc: React.ReactNode
}) => (
  <div className="flex items-baseline gap-4 mb-8">
    <span className="font-mono text-caption text-foreground-subtle tracking-wider">
      {num}
    </span>
    <div>
      <h2 className="text-title-lg text-foreground m-0">{title}</h2>
      <p className="text-body-sm text-foreground-muted mt-1 max-w-[68ch]">
        {desc}
      </p>
    </div>
  </div>
)

const Card = ({
  title,
  desc,
  children,
}: {
  title?: string
  desc?: string
  children: React.ReactNode
}) => (
  <div className="rounded-lg border border-border bg-surface-elevated overflow-hidden">
    {title ? (
      <div className="px-6 py-4 border-b border-border bg-surface">
        <div className="text-label-md text-foreground font-semibold">{title}</div>
        {desc ? (
          <div className="font-mono text-caption text-foreground-subtle mt-1">
            {desc}
          </div>
        ) : null}
      </div>
    ) : null}
    {children}
  </div>
)

/* ────────────────────────────────────────────────────────────────────────
 * Theme toggle — Storybook 자체 toolbar 없이도 light/dark 비교 가능하게
 * ──────────────────────────────────────────────────────────────────────── */
const ThemeToggle = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className="inline-flex p-[3px] bg-surface border border-border rounded-md gap-0">
      {(['light', 'dark'] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
          className={[
            'font-sans text-label-sm font-medium px-4 py-2 rounded-[5px] cursor-pointer transition-colors outline-none',
            theme === t
              ? 'bg-surface-elevated text-foreground shadow-level-1'
              : 'text-foreground-muted hover:text-foreground bg-transparent border-0',
          ].join(' ')}
        >
          {t === 'light' ? 'Light' : 'Dark'}
        </button>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Sub-sections
 * ──────────────────────────────────────────────────────────────────────── */
const VariantSizeMatrix = () => {
  const cols: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg']
  const variants = ['solid', 'surface', 'outline', 'ghost'] as const
  const labels: Record<(typeof variants)[number], string> = {
    solid: 'Submit',
    surface: 'Cancel',
    outline: 'Details',
    ghost: 'More',
  }
  const iconFor: Record<(typeof variants)[number], React.ReactNode> = {
    solid: <Icon.Plus />,
    surface: <Icon.Filter />,
    outline: <Icon.Settings />,
    ghost: <Icon.Close />,
  }

  return (
    <Card>
      <div
        className="grid"
        style={{ gridTemplateColumns: '96px repeat(4, 1fr)' }}
      >
        {/* Head */}
        <div className="px-6 py-4 bg-surface border-b border-border border-r border-border-muted" />
        {(['sm — h28', 'md — h36 (default)', 'lg — h44', 'icon-only'] as const).map(
          (h, i, arr) => (
            <div
              key={h}
              className={[
                'px-6 py-4 bg-surface border-b border-border font-mono text-caption text-foreground-subtle flex items-center justify-center whitespace-nowrap',
                i < arr.length - 1 ? 'border-r border-border-muted' : '',
              ].join(' ')}
            >
              {h}
            </div>
          ),
        )}

        {/* Rows */}
        {variants.map((v, vi) => {
          const isLast = vi === variants.length - 1
          const rowBorder = isLast ? '' : 'border-b border-border-muted'
          return (
            <React.Fragment key={v}>
              <div
                className={[
                  'px-6 py-4 bg-surface border-r border-border font-mono text-label-sm text-foreground-muted flex items-center',
                  rowBorder,
                ].join(' ')}
              >
                {v}
              </div>
              {cols.map((s) => (
                <div
                  key={s}
                  className={[
                    'px-6 py-4 border-r border-border-muted flex items-center justify-center',
                    rowBorder,
                  ].join(' ')}
                >
                  <Button variant={v} size={s}>
                    {labels[v]}
                  </Button>
                </div>
              ))}
              <div
                className={[
                  'px-6 py-4 flex items-center justify-center gap-4',
                  rowBorder,
                ].join(' ')}
              >
                <Button variant={v} size="icon-sm" aria-label={labels[v]}>
                  {iconFor[v]}
                </Button>
                <Button variant={v} size="icon-md" aria-label={labels[v]}>
                  {iconFor[v]}
                </Button>
                <Button variant={v} size="icon-lg" aria-label={labels[v]}>
                  {iconFor[v]}
                </Button>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </Card>
  )
}

const StateMatrix = () => {
  const variants = ['solid', 'surface', 'outline', 'ghost'] as const
  const labels: Record<(typeof variants)[number], string> = {
    solid: 'Submit',
    surface: 'Cancel',
    outline: 'Details',
    ghost: 'More',
  }
  const states = [
    { key: 'default', cls: '' },
    { key: 'hover', cls: 'force-hover' },
    { key: 'pressed', cls: 'force-pressed' },
    { key: 'focus-visible', cls: 'force-focus' },
    { key: 'disabled', cls: '' },
  ] as const

  return (
    <Card>
      <div
        className="grid"
        style={{ gridTemplateColumns: '112px repeat(5, 1fr)' }}
      >
        <div className="px-6 py-4 bg-surface border-b border-border border-r border-border-muted" />
        {states.map((s, i) => (
          <div
            key={s.key}
            className={[
              'px-6 py-4 bg-surface border-b border-border font-mono text-caption text-foreground-subtle',
              i < states.length - 1 ? 'border-r border-border-muted' : '',
            ].join(' ')}
          >
            {s.key}
          </div>
        ))}

        {variants.map((v, vi) => {
          const isLast = vi === variants.length - 1
          const rowBorder = isLast ? '' : 'border-b border-border-muted'
          return (
            <React.Fragment key={v}>
              <div
                className={[
                  'px-6 py-4 bg-surface border-r border-border font-mono text-label-sm text-foreground-muted flex items-center',
                  rowBorder,
                ].join(' ')}
              >
                {v}
              </div>
              {states.map((s, si) => {
                const isDisabled = s.key === 'disabled'
                const border = si < states.length - 1 ? 'border-r border-border-muted' : ''
                return (
                  <div
                    key={s.key}
                    className={[
                      'px-6 py-4 flex items-center justify-center',
                      border,
                      rowBorder,
                      s.cls,
                    ].join(' ')}
                  >
                    <Button variant={v} disabled={isDisabled}>
                      {labels[v]}
                    </Button>
                  </div>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    </Card>
  )
}

const SlotShowcase = () => (
  <div className="grid grid-cols-2 gap-6">
    <Card title="Leading icon + label" desc="아이콘이 라벨 앞에 위치">
      <div className="px-6 py-6 flex flex-wrap gap-4 items-center">
        <Button variant="solid">
          <Icon.Plus />
          New problem
        </Button>
        <Button variant="surface">
          <Icon.Plus />
          Add
        </Button>
        <Button variant="ghost">
          <Icon.ChevronLeft />
          Back
        </Button>
      </div>
    </Card>

    <Card title="Label + trailing icon" desc="아이콘이 라벨 뒤에 위치">
      <div className="px-6 py-6 flex flex-wrap gap-4 items-center">
        <Button variant="solid">
          Continue
          <Icon.ChevronRight />
        </Button>
        <Button variant="outline">
          Sort
          <Icon.Sort />
        </Button>
        <Button variant="ghost" aria-haspopup="menu">
          Options
          <Icon.ChevronDown />
        </Button>
      </div>
    </Card>

    <Card title="Icon-only" desc="aria-label 필수">
      <div className="px-6 py-6 flex flex-wrap gap-4 items-center">
        <Button variant="solid" size="icon-md" aria-label="Save">
          <Icon.Save />
        </Button>
        <Button variant="surface" size="icon-md" aria-label="Edit">
          <Icon.Edit />
        </Button>
        <Button variant="outline" size="icon-md" aria-label="Search">
          <Icon.Search />
        </Button>
        <Button variant="ghost" size="icon-md" aria-label="More">
          <Icon.More />
        </Button>
      </div>
    </Card>

    <Card title="Loading" desc='data-loading="true" — 너비 유지, 라벨 숨김'>
      <div className="px-6 py-6 flex flex-wrap gap-4 items-center">
        <Button variant="solid" loading>
          Submit
        </Button>
        <Button variant="surface" loading>
          Saving…
        </Button>
        <Button variant="outline" loading>
          Loading data
        </Button>
      </div>
    </Card>
  </div>
)

const TokenMap = () => {
  const cols = [
    {
      title: 'solid',
      items: [
        { label: 'bg → primary', color: 'var(--color-primary)' },
        { label: 'fg → on-primary', color: 'var(--color-on-primary)' },
        { label: 'hover → primary-hover', color: 'var(--color-primary-hover)' },
        { label: 'active → primary-active', color: 'var(--color-primary-active)' },
      ],
    },
    {
      title: 'surface',
      items: [
        { label: 'bg → surface', color: 'var(--color-surface)' },
        { label: 'fg → foreground', color: 'var(--color-foreground)' },
        { label: 'border → border', color: 'var(--color-border)' },
        { label: 'hover → surface-hover', color: 'var(--color-surface-hover)' },
      ],
    },
    {
      title: 'outline',
      items: [
        { label: 'bg → transparent', color: 'transparent' },
        { label: 'fg → foreground', color: 'var(--color-foreground)' },
        { label: 'border → border', color: 'var(--color-border)' },
        { label: 'hover-border → border-strong', color: 'var(--color-border-strong)' },
      ],
    },
    {
      title: 'ghost',
      items: [
        { label: 'bg → transparent', color: 'transparent' },
        { label: 'fg → foreground', color: 'var(--color-foreground)' },
        { label: 'hover → state-hover (0.08)', color: null },
        { label: 'active → state-pressed (0.12)', color: null },
      ],
    },
  ]

  return (
    <Card>
      <div className="grid grid-cols-4">
        {cols.map((c, i) => (
          <div
            key={c.title}
            className={[
              'px-6 py-4',
              i < cols.length - 1 ? 'border-r border-border-muted' : '',
            ].join(' ')}
          >
            <h4 className="font-mono text-caption text-foreground-subtle tracking-wider m-0 mb-2 font-medium">
              {c.title}
            </h4>
            {c.items.map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-2 py-1 font-mono text-caption text-foreground-muted"
              >
                {it.color !== null ? (
                  <span
                    className="size-3 rounded-[3px] border border-border shrink-0"
                    style={{ background: it.color }}
                  />
                ) : (
                  <span className="size-3 shrink-0" />
                )}
                {it.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}

const InContextSample = () => (
  <Card title="문제 제출 — Action bar" desc="primary action + outline + ghost cancel">
    <div className="px-6 py-6 flex items-center justify-end gap-4">
      <Button variant="ghost">취소</Button>
      <Button variant="outline">
        <Icon.Save />
        임시 저장
      </Button>
      <Button variant="solid">
        제출하기
        <Icon.ChevronRight />
      </Button>
    </div>
  </Card>
)

/* ────────────────────────────────────────────────────────────────────────
 * Stories
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * 전체 쇼케이스. 4 variants × 3 sizes 매트릭스 + 모든 인터랙션 상태 +
 * 슬롯 + 토큰 맵 + 실제 컨텍스트 예시. light/dark 토글로 비교 가능.
 */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <ForceStateStyle />
      <div className="min-h-screen bg-background text-foreground font-sans flex justify-center">
        <div className="w-full max-w-[1120px] px-20 pt-16 pb-20">
          <header className="flex items-start justify-between gap-6 pb-8 border-b border-border mb-12">
            <div>
              <h1 className="text-headline-lg text-foreground m-0">Button</h1>
              <p className="text-body-md text-foreground-muted mt-2 max-w-[56ch]">
                Design-token 기반 베이스 버튼. 4 variants × 3 sizes (+ icon-only),
                5 states. semantic 토큰만 사용 · OKLCH only · light/dark 자동 대응.
              </p>
              <div className="flex gap-2 mt-4">
                {['src/shared/ui/button.tsx', 'cva', 'WCAG AA+'].map((c) => (
                  <code
                    key={c}
                    className="font-mono text-caption bg-surface border border-border text-foreground-muted px-2 py-1 rounded-sm"
                  >
                    {c}
                  </code>
                ))}
              </div>
            </div>
            <ThemeToggle />
          </header>

          <section className="mb-20" style={{ marginBottom: 80 }}>
            <SectionHeader
              num="01"
              title="Variants × Sizes"
              desc="가로축: 사이즈 · 세로축: 변형. solid이 기본값, md가 기본 사이즈."
            />
            <VariantSizeMatrix />
          </section>

          <section style={{ marginBottom: 80 }}>
            <SectionHeader
              num="02"
              title="Interaction States"
              desc="design-token.md §6 매핑 그대로. opacity modifier 없이 명시 토큰(primary-hover, primary-active) 사용."
            />
            <StateMatrix />
          </section>

          <section style={{ marginBottom: 80 }}>
            <SectionHeader
              num="03"
              title="Slots"
              desc="leading-icon + label / label + trailing-icon / icon-only / loading spinner."
            />
            <SlotShowcase />
          </section>

          <section style={{ marginBottom: 80 }}>
            <SectionHeader
              num="04"
              title="Token Map"
              desc="각 variant가 참조하는 semantic 토큰. 모두 light/dark 자동 매핑."
            />
            <TokenMap />
          </section>

          <section>
            <SectionHeader
              num="05"
              title="In context"
              desc="실제 액션 바 예시. 호버 · 포커스 · 눌림 모두 인터랙티브."
            />
            <InContextSample />
          </section>
        </div>
      </div>
    </>
  ),
}

/** Controls 패널로 props 자유 조합 (디버깅 / 빠른 확인용). */
export const Playground: Story = {
  args: { children: 'Button' },
  parameters: { layout: 'centered' },
}
