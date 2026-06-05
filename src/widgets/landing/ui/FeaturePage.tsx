import { FeatureSection } from '@/shared/ui/FeatureSection'

import type { LandingFeature } from '../model/landing-content'

/**
 * FeaturePage — FeatureSection 1~N개를 풀스크린 한 페이지로 묶는 widget 헬퍼.
 *
 * 사양: docs/PRDS/view/landing.md §FSD §Pre-decided 6 (Toss 풀스크린 패턴)
 *
 * - 페어(2개): 풀스크린 안에 위·아래 stack, 상단부터 stagger fadeIn
 * - 솔로(1개): 풀스크린 중앙 정렬
 * - scroll-snap-align: start 부여 → 부모 snap 컨테이너에서 페이지 단위 스냅
 *
 * 섹션 추가 시 Landing.tsx의 chunkPairs가 자동으로 페이지를 분할하므로
 * 이 컴포넌트는 length만 보고 분기.
 */

/** 페이지 진입 후 첫 섹션 등장까지 base delay (초). snap 완료 후 인지를 위해. */
const PAGE_ENTRY_DELAY = 0.3
/** 페어 내 상·하 섹션 사이 stagger delay (초). */
const PAIR_STAGGER_DELAY = 0.3

interface FeaturePageProps {
  features: readonly LandingFeature[]
  /** 전역 인덱스 — 페이지 간 imageSide 지그재그 일관성 유지 */
  startIndex: number
}

export function FeaturePage({ features, startIndex }: FeaturePageProps) {
  if (features.length === 0) return null

  const isSolo = features.length === 1

  if (isSolo) {
    const f = features[0]
    return (
      <div className="min-h-screen flex items-center snap-start">
        <FeatureSection
          title={f.title}
          description={f.description}
          imageUrl={f.imageUrl}
          imageSide={startIndex % 2 === 0 ? 'left' : 'right'}
          delay={PAGE_ENTRY_DELAY}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center snap-start">
      {features.map((f, i) => (
        <FeatureSection
          key={f.id}
          title={f.title}
          description={f.description}
          imageUrl={f.imageUrl}
          imageSide={(startIndex + i) % 2 === 0 ? 'left' : 'right'}
          delay={PAGE_ENTRY_DELAY + i * PAIR_STAGGER_DELAY}
        />
      ))}
    </div>
  )
}
