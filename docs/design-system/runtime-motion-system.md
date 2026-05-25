# Runtime Motion System

## Overview

이 문서는 Runtime Design System을 정의한다.

이 시스템은 Framer Motion 기반 interaction architecture를 정의한다.

motion은 decoration이 아니라 UX 시스템의 일부다.

---

## Principles

### Purposeful

모든 motion은 목적이 있어야 한다.

예:

- feedback
- state transition
- hierarchy communication
- navigation continuity

---

### Responsive

interaction은 즉각적으로 반응해야 한다.

---

### Consistent

컴포넌트마다 제각각 motion 사용 금지

---

### Non-Distracting

과한 animation 금지

---

# 1. Motion Tokens

TypeScript runtime token으로 관리

---

## Duration

- instant
- fast
- normal
- slow
- slower

---

## Easing

- standard
- decelerate
- accelerate
- emphasized
- spring

---

## Scale Tokens

- press
- hover
- micro

---

## Distance Tokens

- xs
- sm
- md
- lg
- xl

---

# 2. Motion Presets

재사용 가능한 animation preset 정의

---

## Basic

- fade
- fade-up
- fade-down
- fade-left
- fade-right

---

## Scale

- scale-in
- scale-out

---

## Overlay

- dialog-enter
- dialog-exit
- drawer-enter
- drawer-exit

---

## Notification

- toast-enter
- toast-exit

---

## List

- stagger-list
- stagger-item

---

## Layout

- shared-layout
- shared-indicator

---

# 3. Component Motion Rules

## Button

필수:

- hover feedback
- press feedback
- disabled transition

---

## Card

선택:

- hover emphasis
- selection transition

---

## Input

필수:

- focus transition
- validation state transition

---

## Dropdown

필수:

- open
- close

권장:

fade + scale

---

## Tooltip

필수:

- fade

---

## Dialog

필수:

- enter
- exit
- overlay transition

---

## Drawer

필수:

- slide enter
- slide exit

---

## Toast

필수:

- enter
- exit
- stack transition

---

## Tabs

권장:

- shared indicator animation

---

# 4. Implementation Rules

## Rule 1

animation 로직 직접 반복 작성 금지

---

## Rule 2

preset 재사용 우선

---

## Rule 3

inline animate 남발 금지

금지:

random transition object

---

## Rule 4

공통 wrapper abstraction 우선

예:

- AnimatedDialog
- AnimatedDrawer
- MotionButton

---

# 5. Architecture

추천 구조

src/shared/lib/motion/

예:

- tokens.ts
- easing.ts
- springs.ts
- presets.ts
- component-rules.ts

---

## Version

Current Version: v1.0
