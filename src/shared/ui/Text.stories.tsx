import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'

import { Text } from './Text'

/**
 * Text — typography wrapper (폴리모픽 텍스트 primitive).
 *
 * `Showcase` story가 PRD §스토리 의무를 한 페이지에 시각화한다:
 *   Hierarchy×Size 매트릭스 · Color · Polymorphic(as) · Truncate · 한영 혼용 · Code.
 * 토큰은 light/dark 자동 매핑 (상단 토글로 비교).
 *
 * 제약: docs/PRDS/components/text.md · design-token.md §시스템 불변 제약.
 */
const meta = {
  title: 'UI/Text',
  component: Text,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: '안녕하세요 Hello World 2026',
    hierarchy: 'body',
    size: 'md',
    color: 'default',
  },
  argTypes: {
    hierarchy: {
      control: 'select',
      options: [
        'display',
        'headline',
        'title',
        'body',
        'label',
        'caption',
        'code',
      ],
      description:
        '\uC2DC\uAC01 \uACC4\uCE35. caption\uC740 size \uBB34\uC2DC, code\uB294 md/sm\uB9CC(lg\uC740 md \uD3F4\uBC31).',
    },
    size: {
      control: 'inline-radio',
      options: ['lg', 'md', 'sm'],
    },
    color: {
      control: 'inline-radio',
      options: ['default', 'muted', 'subtle', 'inverse', 'inherit'],
    },
    truncate: {
      control: 'select',
      options: [false, true, 1, 2, 3],
    },
    as: { control: false },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

/* ────────────────────────────────────────────────────────────────────────
 * Page-level helpers — Button.stories.tsx 와 동일한 쇼케이스 톤
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
  <div className="flex items-baseline gap-3 mb-7">
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
      <div className="px-5 py-3 border-b border-border bg-surface">
        <div className="text-label-md text-foreground font-semibold">
          {title}
        </div>
        {desc ? (
          <div className="font-mono text-caption text-foreground-subtle mt-0.5">
            {desc}
          </div>
        ) : null}
      </div>
    ) : null}
    {children}
  </div>
)

/* mono 메타 라벨 (스케일 이름 · 토큰) */
const Meta_ = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-caption text-foreground-subtle whitespace-nowrap">
    {children}
  </span>
)

/* ────────────────────────────────────────────────────────────────────────
 * Theme toggle — Button.stories.tsx 와 동일
 * ──────────────────────────────────────────────────────────────────────── */
const ThemeToggle = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
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
            'font-sans text-label-sm font-medium px-3 py-1.5 rounded-[5px] cursor-pointer transition-colors outline-none',
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
 * 01. Hierarchy × Size 매트릭스 (main 15)
 * ──────────────────────────────────────────────────────────────────────── */
const SAMPLE = '안녕하세요 Hello World 2026'

const HierarchyMatrix = () => {
  const rows = ['display', 'headline', 'title', 'body', 'label'] as const
  const cols = ['lg', 'md', 'sm'] as const

  return (
    <Card>
      <div className="grid" style={{ gridTemplateColumns: '88px 1fr' }}>
        {rows.map((h, hi) => (
          <React.Fragment key={h}>
            <div
              className={[
                'px-4 py-5 bg-surface border-r border-border flex items-start',
                hi < rows.length - 1 ? 'border-b border-border-muted' : '',
              ].join(' ')}
            >
              <Meta_>{h}</Meta_>
            </div>
            <div
              className={[
                'flex flex-col gap-4 px-6 py-5',
                hi < rows.length - 1 ? 'border-b border-border-muted' : '',
              ].join(' ')}
            >
              {cols.map((s) => (
                <div key={s} className="flex items-baseline gap-4">
                  <Meta_>{s}</Meta_>
                  <Text hierarchy={h} size={s}>
                    {SAMPLE}
                  </Text>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * 02. Color — 5종 같은 본문 비교
 * ──────────────────────────────────────────────────────────────────────── */
const ColorShowcase = () => {
  const swatches = [
    { color: 'default', token: 'text-foreground', use: '본문 · 제목 기본' },
    { color: 'muted', token: 'text-foreground-muted', use: '보조 · 캡션' },
    {
      color: 'subtle',
      token: 'text-foreground-subtle',
      use: 'placeholder · 비활성',
    },
    {
      color: 'inverse',
      token: 'text-foreground-inverse',
      use: '컬러 surface 위',
    },
    { color: 'inherit', token: 'currentColor', use: '부모 색 주입' },
  ] as const

  return (
    <Card>
      <div className="grid" style={{ gridTemplateColumns: '120px 1fr 200px' }}>
        {swatches.map((s, i) => {
          const last = i === swatches.length - 1
          const rowBorder = last ? '' : 'border-b border-border-muted'
          // inverse 는 컬러 surface 위에서만 보이므로 어두운 배경 셀로 감싼다.
          // inherit 는 부모가 primary 색을 주입하는 예시로 보인다.
          const cellBg =
            s.color === 'inverse'
              ? 'bg-primary'
              : s.color === 'inherit'
                ? 'text-primary'
                : ''
          return (
            <React.Fragment key={s.color}>
              <div
                className={[
                  'px-5 py-4 bg-surface border-r border-border flex items-center',
                  rowBorder,
                ].join(' ')}
              >
                <Meta_>{s.color}</Meta_>
              </div>
              <div
                className={[
                  'px-6 py-4 flex items-center',
                  rowBorder,
                  cellBg,
                ].join(' ')}
              >
                <Text hierarchy="body" size="lg" color={s.color}>
                  {SAMPLE}
                </Text>
              </div>
              <div
                className={[
                  'px-5 py-4 border-l border-border-muted flex flex-col justify-center gap-0.5',
                  rowBorder,
                ].join(' ')}
              >
                <Meta_>{s.token}</Meta_>
                <span className="text-body-sm text-foreground-muted">
                  {s.use}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
      <div className="px-5 py-3 border-t border-border-muted bg-surface font-mono text-caption text-foreground-subtle">
        ※ Text는 강조색(primary/error)을 직접 노출하지 않습니다 — 부모/의미
        컴포넌트가 색을 책임지고 Text는 <code>inherit</code>.
      </div>
    </Card>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * 03. Polymorphic (as) — 시각 스케일 ≠ semantic element
 * ──────────────────────────────────────────────────────────────────────── */
const PolymorphicShowcase = () => {
  const cases = [
    { as: 'h1', hierarchy: 'display', size: 'sm', note: '페이지 제목' },
    { as: 'h2', hierarchy: 'headline', size: 'lg', note: '섹션 제목' },
    { as: 'h3', hierarchy: 'headline', size: 'md', note: '하위 섹션' },
    { as: 'h4', hierarchy: 'title', size: 'lg', note: '카드 제목' },
    { as: 'h5', hierarchy: 'title', size: 'md', note: '소제목' },
    { as: 'h6', hierarchy: 'title', size: 'sm', note: '미세 제목' },
    { as: 'p', hierarchy: 'body', size: 'md', note: '본문 (기본 태그)' },
    {
      as: 'span',
      hierarchy: 'body',
      size: 'md',
      note: '인라인 — outline 영향 X',
    },
    { as: 'div', hierarchy: 'label', size: 'md', note: '블록 라벨' },
  ] as const

  return (
    <Card>
      <div className="grid" style={{ gridTemplateColumns: '64px 1fr 220px' }}>
        {cases.map((c, i) => {
          const last = i === cases.length - 1
          const rowBorder = last ? '' : 'border-b border-border-muted'
          return (
            <React.Fragment key={c.as}>
              <div
                className={[
                  'px-4 py-3.5 bg-surface border-r border-border flex items-center',
                  rowBorder,
                ].join(' ')}
              >
                <Meta_>{`<${c.as}>`}</Meta_>
              </div>
              <div
                className={['px-6 py-3.5 flex items-center', rowBorder].join(
                  ' ',
                )}
              >
                <Text as={c.as} hierarchy={c.hierarchy} size={c.size}>
                  {SAMPLE}
                </Text>
              </div>
              <div
                className={[
                  'px-5 py-3.5 border-l border-border-muted flex flex-col justify-center gap-0.5',
                  rowBorder,
                ].join(' ')}
              >
                <Meta_>{`${c.hierarchy} · ${c.size}`}</Meta_>
                <span className="text-body-sm text-foreground-muted">
                  {c.note}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
      <div className="px-5 py-3 border-t border-border-muted bg-surface font-mono text-caption text-foreground-subtle">
        ※ 시각 = hierarchy + size · 시맨틱 = as. 자동 매핑 없음 — 두 축이
        어긋나도 OK (예:{' '}
        <code>hierarchy=&quot;display&quot; as=&quot;span&quot;</code>).
      </div>
    </Card>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * 04. Truncate — 1/2/3 + 짧은 본문(잘리지 않음)
 * ──────────────────────────────────────────────────────────────────────── */
const LONG =
  '안녕하세요. 이것은 truncate 정책을 확인하기 위한 긴 본문입니다. Hello World 2026 — 한영 혼용 텍스트가 정해진 줄 수를 넘어가면 말줄임표(ellipsis)로 잘립니다. 디자인 시스템은 4줄 이상의 클램프를 의도적으로 막습니다.'

const TruncateShowcase = () => {
  const cases = [
    { truncate: 1 as const, label: 'truncate={1} (= true)', desc: '단일 라인' },
    { truncate: 2 as const, label: 'truncate={2}', desc: 'line-clamp-2' },
    { truncate: 3 as const, label: 'truncate={3}', desc: 'line-clamp-3' },
    {
      truncate: undefined,
      label: 'truncate 없음',
      desc: '짧은 본문 — 잘리지 않음',
      short: true,
    },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-4">
      {cases.map((c) => (
        <Card key={c.label} title={c.label} desc={c.desc}>
          <div className="px-5 py-5" style={{ width: 360, maxWidth: '100%' }}>
            <Text hierarchy="body" size="md" truncate={c.truncate}>
              {'short' in c && c.short ? '짧은 한 줄 Hello 2026' : LONG}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * 05. 한영 혼용 — 필수 케이스 (Pretendard sans 가독성)
 * ──────────────────────────────────────────────────────────────────────── */
const MixedScriptShowcase = () => {
  const lines = [
    { hierarchy: 'display', size: 'sm' },
    { hierarchy: 'headline', size: 'md' },
    { hierarchy: 'title', size: 'md' },
    { hierarchy: 'body', size: 'lg' },
    { hierarchy: 'label', size: 'md' },
  ] as const

  return (
    <Card title="한영 혼용 + 숫자" desc="font-sans (Pretendard Variable)">
      <div className="px-6 py-6 flex flex-col gap-4">
        {lines.map((l) => (
          <div
            key={`${l.hierarchy}-${l.size}`}
            className="flex items-baseline gap-4"
          >
            <Meta_>{`${l.hierarchy}/${l.size}`}</Meta_>
            <Text hierarchy={l.hierarchy} size={l.size}>
              안녕하세요 Hello World 2026
            </Text>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * 06. Code 스케일 — font-mono 강제, lg 없음 (md/sm)
 * ──────────────────────────────────────────────────────────────────────── */
const CodeShowcase = () => (
  <div className="grid grid-cols-2 gap-4">
    <Card title="code — md / sm" desc="font-mono 자동 강제 · lg 토큰 없음">
      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="flex items-baseline gap-4">
          <Meta_>code/md</Meta_>
          <Text hierarchy="code" size="md">
            const greeting = &quot;Hello 2026&quot;
          </Text>
        </div>
        <div className="flex items-baseline gap-4">
          <Meta_>code/sm</Meta_>
          <Text hierarchy="code" size="sm">
            npm run build — 안녕하세요 123
          </Text>
        </div>
      </div>
    </Card>

    <Card title="caption — size 무시" desc="단일 토큰 --text-caption">
      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="flex items-baseline gap-4">
          <Meta_>caption</Meta_>
          <Text hierarchy="caption">최종 수정 2026-06-02 · Hello</Text>
        </div>
        <div className="flex items-baseline gap-4">
          <Meta_>caption muted</Meta_>
          <Text hierarchy="caption" color="muted">
            도움말 텍스트 Help text 2026
          </Text>
        </div>
      </div>
    </Card>
  </div>
)

/* ────────────────────────────────────────────────────────────────────────
 * Stories
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * 전체 쇼케이스 — PRD §스토리 의무 6종을 한 페이지에.
 * light/dark 토글로 토큰 자동 매핑 비교.
 */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-[1080px] mx-auto px-12 pt-14 pb-24">
        <header className="flex items-start justify-between gap-6 pb-8 border-b border-border mb-12">
          <div>
            <h1 className="text-headline-lg text-foreground m-0">Text</h1>
            <p className="text-body-md text-foreground-muted mt-2 max-w-[60ch]">
              18 typography 스케일을 의미 토큰으로만 노출하는 폴리모픽 텍스트
              primitive. 시각(hierarchy+size) ≠ 시맨틱(as) 분리 · foreground
              계열 색만 · OKLCH only · light/dark 자동.
            </p>
            <div className="flex gap-2 mt-3.5">
              {['src/shared/ui/text.tsx', 'cva', 'as prop', 'WCAG AA+'].map(
                (c) => (
                  <code
                    key={c}
                    className="font-mono text-caption bg-surface border border-border text-foreground-muted px-2 py-0.5 rounded-sm"
                  >
                    {c}
                  </code>
                ),
              )}
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section style={{ marginBottom: 72 }}>
          <SectionHeader
            num="01"
            title="Hierarchy × Size"
            desc="main 5 계층 × 3 사이즈 = 15 스케일. 본문은 한영 혼용 + 숫자로 시연."
          />
          <HierarchyMatrix />
        </section>

        <section style={{ marginBottom: 72 }}>
          <SectionHeader
            num="02"
            title="Color"
            desc="foreground 계열 5종(default/muted/subtle/inverse/inherit). 강조색은 부모가 주입."
          />
          <ColorShowcase />
        </section>

        <section style={{ marginBottom: 72 }}>
          <SectionHeader
            num="03"
            title="Polymorphic (as)"
            desc="h1~h6 · p · span · div. 렌더 태그는 시각 스케일과 독립."
          />
          <PolymorphicShowcase />
        </section>

        <section style={{ marginBottom: 72 }}>
          <SectionHeader
            num="04"
            title="Truncate"
            desc="1 / 2 / 3 줄 클램프 + 짧은 본문(잘리지 않음). 4+ 는 타입 차단."
          />
          <TruncateShowcase />
        </section>

        <section style={{ marginBottom: 72 }}>
          <SectionHeader
            num="05"
            title="한영 혼용"
            desc="Pretendard Variable — 한국어/영문/숫자 혼용 SaaS 본문 검증."
          />
          <MixedScriptShowcase />
        </section>

        <section>
          <SectionHeader
            num="06"
            title="Code · Caption (utility)"
            desc="code = font-mono 자동 강제(md/sm, lg 폴백) · caption = size 무시 단일 토큰."
          />
          <CodeShowcase />
        </section>
      </div>
    </div>
  ),
}

/** Controls 패널로 props 자유 조합 (디버깅 / 빠른 확인용). */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  render: (args) => (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="bg-background text-foreground font-sans p-10 rounded-lg">
        <Text {...args} />
      </div>
    </>
  ),
}
