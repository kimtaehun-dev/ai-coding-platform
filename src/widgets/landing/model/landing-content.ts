/**
 * 랜딩 피처 섹션 데이터. FeaturePage가 2개씩 묶어 풀스크린 페이지로 렌더.
 *
 * TODO(Q3): picsum.photos는 임시 외부 의존. 실제 자산 확보 시 교체:
 *   1. `public/images/landing-features/<id>.{jpg,webp}` 같은 로컬 정적 파일로 이동
 *   2. next/image로 교체 (CLS·LCP 최적화)
 *   3. 외부 도메인 유지하려면 next.config의 `images.remotePatterns`에 화이트리스트 추가
 */
export interface LandingFeature {
  id: string
  title: string
  description: string
  imageUrl: string
}

export const features: readonly LandingFeature[] = [
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
      'Level과 알고리즘 유형을 고르면 AI가 해당 수준의 새 문제를 만들어줍니다. (예: Level 2 해시)',
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
] as const
