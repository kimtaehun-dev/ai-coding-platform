'use client'

import * as React from 'react'
import { useInView } from 'motion/react'

import { Fade } from '@/shared/lib/motion'
import { cn } from '@/shared/lib/utils'

/**
 * FeatureSection — 좌우 분할 + 스크롤 fadeIn primitive.
 *
 * 사양: docs/PRDS/view/landing.md §FSD §Pre-decided 1~3
 *
 * 섹션이 뷰포트 30%에 들어왔을 때 1회 fadeIn.
 * 양쪽 콘텐츠는 imageSide 반대 방향에서 들어옴.
 * 내부 stagger: 텍스트 먼저 등장, 이미지가 `INTERNAL_IMAGE_OFFSET`초 뒤 따라옴.
 * 도메인-무관 — 카피·데이터는 상위에서 주입.
 */

/** 텍스트 등장 후 이미지가 따라오는 내부 지연 (초). */
const INTERNAL_IMAGE_OFFSET = 0.2

export interface FeatureSectionProps {
  title: string
  description: string
  imageUrl: string
  imageAlt?: string
  imageSide?: 'left' | 'right'
  /** fadeIn delay in seconds (상위에서 페어 내 stagger 제어용) */
  delay?: number
}

export function FeatureSection({
  title,
  description,
  imageUrl,
  imageAlt = '',
  imageSide = 'left',
  delay = 0,
}: FeatureSectionProps) {
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const textDirection = imageSide === 'right' ? 'left' : 'right'
  const imageDirection = imageSide

  const imageOrderClass = imageSide === 'left' ? 'md:order-1' : 'md:order-2'
  const textOrderClass = imageSide === 'left' ? 'md:order-2' : 'md:order-1'

  return (
    <section ref={ref} className="w-full px-6 py-6 md:py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className={cn('order-1', imageOrderClass)}>
          {/*
           * 이미지 셀: aspect-video 유지하되 max-h-[28dvh]로 캡.
           * - 컬럼 폭이 충분하면: width 100%, height = w × 9/16 (정상 16:9)
           * - 좁고 키 큰 viewport: height 28dvh로 캡, width는 비율 유지(축소), mx-auto 가운데 정렬
           * - 결과: 페어(2섹션)가 ~700~1440px 높이 viewport 전부에서 한 화면에 맞음
           */}
          <div className="aspect-video w-full max-h-[28dvh] mx-auto overflow-hidden rounded-lg bg-surface">
            <Fade
              show={inView}
              direction={imageDirection}
              delay={delay + INTERNAL_IMAGE_OFFSET}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageAlt}
                width={640}
                height={360}
                className="block w-full h-auto"
              />
            </Fade>
          </div>
        </div>
        <div className={cn('order-2', textOrderClass)}>
          <Fade show={inView} direction={textDirection} delay={delay}>
            <div className="flex flex-col gap-3">
              <h2 className="text-headline-md text-foreground m-0">{title}</h2>
              <p className="text-body-md text-foreground-muted m-0 max-w-[56ch]">
                {description}
              </p>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  )
}
