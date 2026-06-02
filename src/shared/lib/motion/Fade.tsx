'use client'

import * as React from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react'

import { motionDistance, motionDuration, motionEasing } from './tokens'

/**
 * Fade — fadeIn/fadeOut wrapper.
 *
 * 사양: docs/design-system/runtime-motion-system.md
 *
 * `show` 전환에 따라 opacity 0 ↔ 1.
 * `direction !== 'none'` 이면 translateX/Y(±motionDistance.fade)를 함께 변경.
 * `disabled` 이면 motion 우회하여 즉시 토글.
 * `prefers-reduced-motion: reduce` 사용자는 duration 0 으로 즉시 처리.
 */

export type FadeDirection = 'none' | 'up' | 'down' | 'left' | 'right'

export interface FadeProps {
  show: boolean
  direction?: FadeDirection
  delay?: number
  disabled?: boolean
  children: React.ReactNode
}

const directionOffset: Record<FadeDirection, { x: number; y: number }> = {
  none: { x: 0, y: 0 },
  up: { x: 0, y: motionDistance.fade },
  down: { x: 0, y: -motionDistance.fade },
  left: { x: motionDistance.fade, y: 0 },
  right: { x: -motionDistance.fade, y: 0 },
}

const fadeVariants: Variants = {
  hidden: (direction: FadeDirection) => ({
    opacity: 0,
    ...directionOffset[direction],
  }),
  visible: { opacity: 1, x: 0, y: 0 },
}

export function Fade({
  show,
  direction = 'none',
  delay,
  disabled = false,
  children,
}: FadeProps) {
  const shouldReduce = useReducedMotion()

  if (disabled) {
    return show ? <>{children}</> : null
  }

  const transition = {
    duration: shouldReduce ? 0 : motionDuration.fade,
    ease: motionEasing.fade,
    delay,
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          custom={direction}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
