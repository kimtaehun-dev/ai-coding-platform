# Design System

## Overview

이 디자인 시스템은 프론트엔드 개발자 플랫폼을 위한 UI 시스템이다.

단순히 화면을 예쁘게 만드는 것이 아니라,  
일관성 있고 확장 가능하며 유지보수 가능한 제품 UI 시스템 구축을 목표로 한다.

---

## Project Context

이 프로젝트는 프론트엔드 개발자 중심 플랫폼을 목표로 한다.

예상 기능:

- 인증 (로그인 / 회원가입)
- 개인 대시보드
- 코딩 테스트
- 문제 풀이 인터페이스
- 학습 진행 추적
- 통계 및 데이터 시각화

UI는 단순 랜딩 페이지가 아니라  
**복잡한 interaction과 dense information을 다루는 SaaS 제품 UI**를 전제로 설계한다.

---

## Design Philosophy

### Material Design 3 System Philosophy

다음 개념을 차용한다.

- tonal palette
- semantic token architecture
- elevation system
- state layer
- typography hierarchy
- motion consistency
- component-driven design

단, Material Design 3의 모바일 앱 visual language를 그대로 복제하지 않는다.

웹 SaaS 제품에 맞게 재해석한다.

---

### GitHub Visual Language

다음 요소를 적극 참고한다.

- dense but readable layout
- engineering-focused aesthetic
- neutral-driven interface
- border-based hierarchy
- minimal decorative effects
- practical interaction patterns

---

### Developer Friendly Implementation

디자인은 반드시 구현 친화적이어야 한다.

기준:

허용:

- Tailwind utility 기반 구현
- shadcn/ui customization
- reusable component composition
- Framer Motion runtime animation system

금지:

- canvas 의존 UI
- 구현 난이도만 높은 visual gimmick
- 재사용 불가능한 decorative effects

---

## Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion

---

## Design Principles

### 1. System First

페이지보다 시스템을 먼저 설계한다.

모든 UI는 토큰과 컴포넌트 규칙 기반으로 구성한다.

---

### 2. Realistic Over Flashy

실제 구현 가능한 제품 UI를 우선한다.

피해야 할 것:

- 과한 glassmorphism
- decorative gradients
- fake concept UI
- visual-only design

---

### 3. Reusability

컴포넌트는 반복 사용 가능한 구조로 설계한다.

---

### 4. Consistency

spacing, color, typography, interaction은 시스템 기준을 따른다.

---

### 5. Interaction Matters

motion은 decoration이 아니라 UX 일부다.

---

## Document Structure

### Foundations

정적/런타임 시스템 정의

- `./design-tokens.md`
- `./runtime-motion-system.md`

---

### Components

컴포넌트 스펙 문서

예정:

- Button
- Input
- Card
- Dialog
- Table
- Sidebar
- Tabs

---

## Architecture

디자인 시스템은 두 계층으로 분리한다.

### Static Design System

CSS 기반 정적 토큰

포함:

- primitive palette
- semantic tokens
- typography
- spacing
- radius
- elevation
- z-index

Tailwind CSS v4 `@theme` 기준으로 관리

---

### Runtime Design System

TypeScript 기반 런타임 인터랙션 시스템

포함:

- motion tokens
- easing presets
- spring presets
- animation variants
- component motion rules

Framer Motion 기준으로 관리

---

## Version

Current Version: v1.0
