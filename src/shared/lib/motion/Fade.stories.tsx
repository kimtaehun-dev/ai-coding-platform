import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'

import { Fade, type FadeDirection, type FadeProps } from './Fade'

/**
 * Fade — fadeIn/fadeOut wrapper.
 *
 * 사양: docs/design-system/runtime-motion-system.md
 *
 * `show` 전환에 따라 opacity 0 ↔ 1, `direction !== 'none'`이면 미세 translate 동반.
 */
const meta = {
  title: 'Foundations/애니메이션 (Motion)/Fade',
  component: Fade,
  parameters: {
    layout: 'centered',
  },
  args: {
    show: true,
    direction: 'none',
    delay: 0,
    disabled: false,
    children: null,
  },
  argTypes: {
    show: { control: 'boolean' },
    direction: {
      control: 'inline-radio',
      options: [
        'none',
        'up',
        'down',
        'left',
        'right',
      ] satisfies FadeDirection[],
    },
    delay: { control: { type: 'number', min: 0, max: 2, step: 0.05 } },
    disabled: { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof Fade>

export default meta
type Story = StoryObj<typeof meta>

/* ────────────────────────────────────────────────────────────────────────
 * Demo helpers — Storybook 안에서 시각 확인용 카드/버튼.
 * ──────────────────────────────────────────────────────────────────────── */
function DemoCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '20px 28px',
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        minWidth: 220,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </div>
  )
}

function TriggerButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: 'var(--color-primary)',
        color: 'var(--color-on-primary)',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Story demo components — hook 사용을 위해 PascalCase 컴포넌트로 추출.
 * ──────────────────────────────────────────────────────────────────────── */
function ToggleDemo(args: FadeProps) {
  const [show, setShow] = React.useState(args.show)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        minHeight: 140,
      }}
    >
      <TriggerButton onClick={() => setShow((s) => !s)}>
        {show ? 'Hide' : 'Show'}
      </TriggerButton>
      <Fade {...args} show={show}>
        <DemoCard>show: {String(show)}</DemoCard>
      </Fade>
    </div>
  )
}

function AutoDismissDemo(args: FadeProps) {
  const [toast, setToast] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        minHeight: 140,
      }}
    >
      <TriggerButton onClick={() => setToast('Saved successfully')}>
        Trigger toast
      </TriggerButton>
      <Fade {...args} show={!!toast}>
        <DemoCard>{toast}</DemoCard>
      </Fade>
    </div>
  )
}

function StaggerDemo(args: FadeProps) {
  const [show, setShow] = React.useState(false)
  const items = [0, 0.1, 0.2, 0.3]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        minHeight: 320,
      }}
    >
      <TriggerButton onClick={() => setShow((s) => !s)}>
        {show ? 'Reset' : 'Reveal sequence'}
      </TriggerButton>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((d, i) => (
          <Fade {...args} key={i} show={show} delay={d}>
            <DemoCard>
              item {i + 1} · delay {d}s
            </DemoCard>
          </Fade>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Stories
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Default — controls 패널에서 `show` / `direction` / `delay` / `disabled` 전환.
 */
export const Default: Story = {
  render: (args) => (
    <Fade {...args}>
      <DemoCard>Fade content</DemoCard>
    </Fade>
  ),
}

/**
 * Toggle — 버튼으로 show 직접 토글. 사용자 액션 기반 fadeIn/fadeOut.
 */
export const Toggle: Story = {
  args: { show: false, direction: 'up' },
  render: (args) => <ToggleDemo {...args} />,
}

/**
 * AutoDismiss — toast 패턴. 트리거 후 2.5초 뒤 자동 fadeOut.
 */
export const AutoDismiss: Story = {
  args: { direction: 'down' },
  render: (args) => <AutoDismissDemo {...args} />,
}

/**
 * Stagger — 여러 Fade가 `delay` 차이로 순차 등장 (랜딩 스크롤 진입 패턴).
 */
export const Stagger: Story = {
  args: { direction: 'up' },
  render: (args) => <StaggerDemo {...args} />,
}

/**
 * ReducedMotion — OS 설정(prefers-reduced-motion: reduce) 안내.
 * 설정을 켜면 duration이 0으로 강제되어 opacity·transform 모두 즉시 처리.
 * (macOS: 시스템 설정 → 손쉬운 사용 → 디스플레이 → "동작 줄이기")
 */
export const ReducedMotion: Story = {
  args: { show: true, direction: 'up' },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Fade {...args}>
        <DemoCard>OS reduce-motion에서는 즉시 표시</DemoCard>
      </Fade>
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-foreground-muted)',
          maxWidth: 360,
          textAlign: 'center',
          margin: 0,
          fontFamily: 'var(--font-sans)',
        }}
      >
        OS의 <code>prefers-reduced-motion: reduce</code> 설정을 켜고
        새로고침하면 duration 0 으로 강제됩니다.
      </p>
    </div>
  ),
}
