import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '@/shared/ui/Button'

import { LandingHero } from './LandingHero'

const meta = {
  title: 'Widgets/LandingHero',
  component: LandingHero,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    imageSide: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
  },
} satisfies Meta<typeof LandingHero>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — 모든 props 생략, 내부 기본값(landing-hero/model/hero-content) + 기본 버튼(로그인/홈으로).
 */
export const Default: Story = {}

/**
 * ImageLeft — imageSide='left'.
 */
export const ImageLeft: Story = {
  args: { imageSide: 'left' },
}

/**
 * NoSubtitle — subtitle='' 로 빈 문자열 전달해 숨김.
 */
export const NoSubtitle: Story = {
  args: { subtitle: '' },
}

/**
 * NoActions — actions=null 로 버튼 영역 자체 숨김.
 */
export const NoActions: Story = {
  args: { actions: null },
}

/**
 * CustomActions — actions slot 오버라이드 케이스.
 */
export const CustomActions: Story = {
  args: {
    actions: (
      <>
        <Button type="button" size="lg" color="secondary">
          무료 체험
        </Button>
        <Button type="button" variant="ghost" size="lg">
          데모 보기
        </Button>
      </>
    ),
  },
}

/**
 * LongContent (D4) — 긴 제목/서브카피/CTA 라벨로 오버플로 확인.
 */
export const LongContent: Story = {
  args: {
    title:
      'AI와 함께 매일 코딩테스트 — 꾸준함과 맞춤 학습으로 다음 단계의 개발자가 되는 가장 빠른 방법',
    subtitle:
      '하루 2문제 제한 · AI 문제 생성 · 단계별 힌트 · 오답 자동 복습 · GitHub 잔디 시각화까지. 모든 것을 한 곳에서.',
    actions: (
      <>
        <Button type="button" size="lg">
          무료로 시작하고 첫 문제 풀기
        </Button>
        <Button type="button" variant="outline" size="lg">
          데모 영상 먼저 보기
        </Button>
      </>
    ),
  },
}

/**
 * MeaningfulImageAlt (D4) — 실제 자산 시 의미 있는 alt 텍스트 예시.
 */
export const MeaningfulImageAlt: Story = {
  args: {
    imageAlt:
      'AI가 사용자 코드를 분석해 단계별 힌트를 제시하는 코드 편집 화면 스크린샷',
  },
}

/**
 * BrokenImage (D4) — 잘못된 URL로 이미지 로드 실패. width/height 속성 덕에 영역은 reserved.
 */
export const BrokenImage: Story = {
  args: {
    imageUrl: '/this-file-does-not-exist.png',
    imageAlt: 'broken image placeholder',
  },
}

/**
 * ReducedMotion (D4) — OS "동작 줄이기" ON 시 동작 안내 (수동 검증 필요).
 * `Fade` 내부 `useReducedMotion` → duration 0, 즉시 표시.
 * (macOS: 시스템 설정 → 손쉬운 사용 → 디스플레이 → "동작 줄이기")
 */
export const ReducedMotion: Story = {}
