import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Landing } from './Landing'

const meta = {
  title: 'Widgets/Landing',
  component: Landing,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Landing>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — FeaturePage들의 조립 (2-2-1 페어/솔로). Hero는 별도 widget(`LandingHero`)이므로 미포함.
 * 스크롤하여 각 페이지의 stagger fadeIn을 확인.
 */
export const Default: Story = {}
