import { features, type LandingFeature } from '../model/landing-content'
import { FeaturePage } from './FeaturePage'

/**
 * Landing — 랜딩 본문(피처 섹션) 컴포지션 widget.
 *
 * 사양: docs/PRDS/view/landing.md §FSD §Deliverables 3
 *
 * FeaturePage들을 조립. features는 2개씩 묶어 풀스크린 페이지로,
 * 홀수 잔여는 solo 페이지로.
 *
 * Hero는 별도 widget(`widgets/landing-hero`)이고, FSD 슬라이스 격리 룰상
 * widget이 widget을 import 못 함 → 두 widget 조립은 `LandingView`에서.
 */

/** features를 2개씩 묶어 페이지 단위로 분할. 홀수면 마지막 페이지는 solo. */
function chunkPairs(arr: readonly LandingFeature[]): LandingFeature[][] {
  const result: LandingFeature[][] = []
  for (let i = 0; i < arr.length; i += 2) {
    result.push(arr.slice(i, i + 2))
  }
  return result
}

export function Landing() {
  const pages = chunkPairs(features)

  return (
    <>
      {pages.map((page, idx) => (
        <FeaturePage key={page[0].id} features={page} startIndex={idx * 2} />
      ))}
    </>
  )
}
