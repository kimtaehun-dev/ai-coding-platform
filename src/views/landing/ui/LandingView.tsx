import { Landing } from '@/widgets/landing'
import { LandingHero } from '@/widgets/landing-hero'

/**
 * LandingView — `/` 라우트에 렌더되는 랜딩 페이지 view.
 *
 * 사양: docs/PRDS/view/landing.md §FSD §Deliverables 4
 *
 * 지금: <LandingHero /> + <Landing /> + scroll-snap 컨테이너 + 배경 레이어.
 * 추후: <Header /> + 위 + <Footer />.
 *
 * FSD 슬라이스 격리상 widget이 widget을 import 못 함 → Hero와 Features의 조립은 view 레이어 책임.
 *
 * scroll-snap-type: y mandatory — 휠/스와이프 1회당 한 페이지(Hero or FeaturePage) 이동.
 * h-dvh + overflow-y-auto — 컨테이너 내부 스크롤. 모바일 URL 바 영향 최소화.
 *
 * 배경 (Q8 결정 — 약):
 *   1. Vertical gradient: background → surface-elevated → background (위/아래 살짝 어둡고 중앙 밝음)
 *   2. Dot grid overlay: 1.5px / 22px / opacity 0.45 (semantic token color-mix로 다크모드 자동)
 *   배경은 main에 직접 부착 → 컨테이너 스크롤 시 자리 유지 (parallax 효과)
 */
const BACKGROUND_LAYERS = [
  // 위에 깔리는 점 패턴
  'radial-gradient(circle, color-mix(in oklch, var(--color-foreground-subtle) 45%, transparent) 1.5px, transparent 1.5px) 0 0 / 22px 22px',
  // 아래 깔리는 그라데이션
  'linear-gradient(180deg, var(--color-background) 0%, var(--color-surface-elevated) 50%, var(--color-background) 100%)',
].join(', ')

export function LandingView() {
  return (
    <main
      className="h-dvh overflow-y-auto snap-y snap-mandatory"
      style={{ background: BACKGROUND_LAYERS }}
    >
      <div className="snap-start">
        <LandingHero />
      </div>
      <Landing />
    </main>
  )
}
