/**
 * Hero 도메인 카피. LandingHero가 기본값으로 사용.
 *
 * TODO(Q3): picsum.photos는 임시 외부 의존. 실제 자산 확보 시 교체:
 *   1. `public/images/landing-hero.{jpg,webp}` 같은 로컬 정적 파일로 이동
 *   2. next/image로 교체 (CLS·LCP 최적화)
 *   3. 외부 도메인 유지하려면 next.config의 `images.remotePatterns`에 화이트리스트 추가
 */
export interface HeroContent {
  title: string
  subtitle: string
  imageUrl: string
}

export const heroContent: HeroContent = {
  title: 'AI와 함께 매일 코딩테스트',
  subtitle:
    '하루 2문제, 꾸준한 습관과 AI 맞춤 학습으로 코딩테스트를 준비하세요.',
  imageUrl: 'https://picsum.photos/seed/landing-hero/640/400',
}
