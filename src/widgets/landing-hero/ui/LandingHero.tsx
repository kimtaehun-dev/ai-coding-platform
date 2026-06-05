'use client'

import type { ReactNode } from 'react'

import { Fade } from '@/shared/lib/motion'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/utils'

import { heroContent } from '../model/hero-content'

/**
 * LandingHero — 랜딩 페이지 헤로 widget.
 *
 * 사양: docs/PRDS/view/landing.md §FSD §Pre-decided 5
 *
 * 마운트 즉시 양쪽 stagger fadeIn (텍스트 0.3s, 이미지 0.5s).
 * 기본값으로 widgets/landing-hero/model/hero-content 사용.
 * 모든 props는 optional — 스토리북·테스트 변형 위해 노출.
 */

export interface LandingHeroProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  imageAlt?: string
  imageSide?: 'left' | 'right'
  /** undefined: 기본 로그인/홈으로 버튼 렌더. null: actions div 자체 숨김. */
  actions?: ReactNode
}

// TODO(D2): auth 흐름 연결 시 onClick 핸들러 주입 또는 <Button asChild><Link/></Button>로 라우팅 연결.
const defaultActions: ReactNode = (
  <>
    <Button type="button" size="lg">
      로그인
    </Button>
    <Button type="button" variant="outline" size="lg">
      홈으로
    </Button>
  </>
)

export function LandingHero({
  title = heroContent.title,
  subtitle = heroContent.subtitle,
  imageUrl = heroContent.imageUrl,
  imageAlt = '',
  imageSide = 'right',
  actions,
}: LandingHeroProps = {}) {
  const textDirection = imageSide === 'right' ? 'left' : 'right'
  const imageDirection = imageSide

  const textOrderClass = imageSide === 'right' ? 'md:order-1' : 'md:order-2'
  const imageOrderClass = imageSide === 'right' ? 'md:order-2' : 'md:order-1'

  const resolvedActions = actions === undefined ? defaultActions : actions

  return (
    <section className="min-h-screen flex items-center px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full">
        <div className={cn('order-1', textOrderClass)}>
          <Fade show direction={textDirection} delay={0.3}>
            <div className="flex flex-col gap-5">
              <h1 className="text-display-md text-foreground m-0">{title}</h1>
              {subtitle ? (
                <p className="text-body-lg text-foreground-muted m-0 max-w-[56ch]">
                  {subtitle}
                </p>
              ) : null}
              {resolvedActions ? (
                <div className="flex flex-wrap gap-3 mt-2">
                  {resolvedActions}
                </div>
              ) : null}
            </div>
          </Fade>
        </div>
        <div className={cn('order-2', imageOrderClass)}>
          <Fade show direction={imageDirection} delay={0.5}>
            {/* TODO(Q3): 실제 자산 확보 시 next/image로 교체 + 도메인 화이트리스트 추가. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={imageAlt}
              width={640}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </Fade>
        </div>
      </div>
    </section>
  )
}
