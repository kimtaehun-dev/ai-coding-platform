# Runtime Motion System

런타임 모션 시스템 — framer-motion(`motion` 패키지) 기반. 신규 모션 추가 시 토큰·variant·wrapper·접근성 처리를 이 파일에 기입한다.

---

## fadeIn / fadeOut

`show` prop의 `true`/`false` 전환에 따라 opacity `0` ↔ `1` 전환. `direction`이 `'none'`이 아닌 경우 transform(translateX/Y)을 함께 변경. `<AnimatePresence>`로 `show=false`가 되면 exit 애니메이션 후 unmount.

### Token

| 토큰            | 값          |
| --------------- | ----------- |
| `duration.fade` | `0.2` (초)  |
| `easing.fade`   | `'easeOut'` |
| `distance.fade` | `8` (px)    |

### Variant

```ts
const directionOffset = {
  none: { x: 0, y: 0 },
  up: { x: 0, y: 8 }, // 아래에서 위로
  down: { x: 0, y: -8 }, // 위에서 아래로
  left: { x: 8, y: 0 }, // 오른쪽에서 왼쪽으로
  right: { x: -8, y: 0 }, // 왼쪽에서 오른쪽으로
}

// hidden은 direction에 따라 빌드 (framer-motion custom prop 활용)
const fadeVariants = {
  hidden: (direction: 'none' | 'up' | 'down' | 'left' | 'right') => ({
    opacity: 0,
    ...directionOffset[direction],
  }),
  visible: { opacity: 1, x: 0, y: 0 },
}

const fadeTransition = {
  duration: 0.2, // duration.fade
  ease: 'easeOut', // easing.fade
}
```

### Wrapper: `<Fade>`

| prop        | 타입                                             | 의미                                      |
| ----------- | ------------------------------------------------ | ----------------------------------------- |
| `show`      | `boolean`                                        | `true` → fadeIn, `false` → fadeOut        |
| `direction` | `'none' \| 'up' \| 'down' \| 'left' \| 'right'?` | 진입 방향. 기본 `'none'` (opacity만 전환) |
| `delay`     | `number?`                                        | 지연 시간(초). stagger 구성에 사용        |
| `disabled`  | `boolean?`                                       | 모션 끄고 즉시 토글                       |
| `children`  | `ReactNode`                                      | —                                         |

`direction` 의미:

| 값      | 시작 transform     | 끝 transform    | 시각적 효과                         |
| ------- | ------------------ | --------------- | ----------------------------------- |
| `none`  | —                  | —               | opacity만 전환                      |
| `up`    | `translateY(8px)`  | `translateY(0)` | 아래에서 위로 올라오며 fadeIn       |
| `down`  | `translateY(-8px)` | `translateY(0)` | 위에서 아래로 내려오며 fadeIn       |
| `left`  | `translateX(8px)`  | `translateX(0)` | 오른쪽에서 왼쪽으로 들어오며 fadeIn |
| `right` | `translateX(-8px)` | `translateX(0)` | 왼쪽에서 오른쪽으로 들어오며 fadeIn |

fadeOut은 대칭으로 동일 transform을 향해 빠진다 (`visible` → `hidden`).

내부 구성: framer-motion의 `<AnimatePresence>` + `<motion.div>`에 `fadeVariants` 적용, `custom={direction}` prop으로 hidden variant를 빌드. `fadeTransition`을 transition으로 사용. `delay`는 `fadeTransition.delay`로 주입. `disabled=true`이면 motion을 우회하고 `show` 그대로 children 렌더 (direction 무시).

사용 예시:

```tsx
// Modal — 사용자 액션으로 close, 방향 없음
<Fade show={open}>
  <Modal onClose={() => setOpen(false)} />
</Fade>

// Toast — 위에서 내려오며 등장
<Fade show={!!toast} direction="down">
  <Toast>{toast?.message}</Toast>
</Fade>

// 스크롤 진입 + stagger — 아래에서 올라오며 fadeIn
const ref = useRef(null)
const inView = useInView(ref, { once: true })
return (
  <div ref={ref}>
    <Fade show={inView} direction="up" delay={0}>
      <Thumbnail />
    </Fade>
    <Fade show={inView} direction="up" delay={0.15}>
      <Description />
    </Fade>
  </div>
)
```

### Accessibility

framer-motion의 `useReducedMotion()` hook을 사용해 사용자 OS 설정(`prefers-reduced-motion: reduce`)을 감지한다. `true`이면 `fadeTransition.duration`을 `0`으로 강제 — DOM enter/exit 흐름은 유지하되 시각 전환(opacity·transform)만 즉시 처리.
