import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FeatureSection } from './FeatureSection'

const meta = {
  title: 'UI/FeatureSection',
  component: FeatureSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: '하루 딱 2문제, 무리 없이 매일',
    description:
      '과부하 대신 꾸준함. 매일 정해진 분량으로 학습 습관을 만듭니다.',
    imageUrl: 'https://picsum.photos/seed/landing-daily-limit/640/360',
    imageAlt: '',
    imageSide: 'left',
  },
  argTypes: {
    imageSide: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
  },
} satisfies Meta<typeof FeatureSection>

export default meta
type Story = StoryObj<typeof meta>

/**
 * ImageLeft — 홀수 섹션 (0, 2, 4) 패턴: 이미지 좌 / 텍스트 우.
 * 스크롤하여 섹션이 뷰포트에 들어오면 fadeIn 트리거.
 */
export const ImageLeft: Story = {
  args: { imageSide: 'left' },
}

/**
 * ImageRight — 짝수 섹션 (1, 3) 패턴: 이미지 우 / 텍스트 좌.
 */
export const ImageRight: Story = {
  args: { imageSide: 'right' },
  decorators: [
    (Story) => (
      <div>
        <div style={{ height: '60vh' }} />
        <Story />
      </div>
    ),
  ],
}

/**
 * LongDescription — 디스크립션이 여러 줄인 케이스.
 */
export const LongDescription: Story = {
  args: {
    description:
      '과부하 대신 꾸준함. 매일 정해진 분량으로 학습 습관을 만듭니다. 무리한 문제 풀이보다 지속 가능한 루틴이 결국 더 멀리 갑니다. 작은 단위로 매일 반복하면 장기 기억으로 굳어집니다.',
  },
}

/**
 * MeaningfulImageAlt (D4) — 실제 자산 시 의미 있는 alt 텍스트 예시.
 */
export const MeaningfulImageAlt: Story = {
  args: {
    imageAlt: '하루 학습 진행도를 보여주는 대시보드 미리보기',
  },
}

/**
 * BrokenImage (D4) — 잘못된 URL로 이미지 로드 실패. aspect-video wrapper + width/height 덕에 영역 유지.
 */
export const BrokenImage: Story = {
  args: {
    imageUrl: '/this-file-does-not-exist.png',
    imageAlt: 'broken image placeholder',
  },
}

/**
 * ReducedMotion (D4) — OS "동작 줄이기" ON 시 동작 안내 (수동 검증).
 * `Fade` 내부 `useReducedMotion` → duration 0, 즉시 표시.
 */
export const ReducedMotion: Story = {}

/**
 * Stack — 5섹션 연속. 지그재그 매핑 검증. 스크롤하여 각 섹션의 fadeIn 트리거 확인.
 */
export const Stack: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const items = [
      {
        id: 'daily-limit',
        title: '하루 딱 2문제, 무리 없이 매일',
        description:
          '과부하 대신 꾸준함. 매일 정해진 분량으로 학습 습관을 만듭니다.',
        imageUrl: 'https://picsum.photos/seed/landing-daily-limit/640/360',
      },
      {
        id: 'ai-generate',
        title: '원하는 난이도·유형으로 즉시 생성',
        description:
          'Level과 알고리즘 유형을 고르면 AI가 새 문제를 만들어줍니다.',
        imageUrl: 'https://picsum.photos/seed/landing-ai-generate/640/360',
      },
      {
        id: 'ai-hint',
        title: '답이 아닌 방향을 알려주는 힌트',
        description:
          '"Map을 활용해보세요", "반례를 생각해보세요" — 사고를 막지 않는 단계별 안내.',
        imageUrl: 'https://picsum.photos/seed/landing-ai-hint/640/360',
      },
      {
        id: 'review',
        title: '틀린 문제는 자동으로 모입니다',
        description:
          '실패한 문제는 오답 노트로 저장되어 언제든 다시 풀 수 있습니다.',
        imageUrl: 'https://picsum.photos/seed/landing-review/640/360',
      },
      {
        id: 'heatmap',
        title: '잔디로 보는 나의 성장',
        description: 'GitHub 잔디 형태로 매일의 학습 기록을 시각화합니다.',
        imageUrl: 'https://picsum.photos/seed/landing-heatmap/640/360',
      },
    ]
    return (
      <div>
        {items.map((it, idx) => (
          <FeatureSection
            key={it.id}
            title={it.title}
            description={it.description}
            imageUrl={it.imageUrl}
            imageSide={idx % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    )
  },
}
