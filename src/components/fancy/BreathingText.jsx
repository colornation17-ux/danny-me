import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../lib/cn'

/**
 * Letter-by-letter font-variation “breathing” — requires a variable font.
 * Adapted from Fancy Components (no Tailwind dependency).
 */
export default function BreathingText({
  children,
  as: ElementTag = 'span',
  fromFontVariationSettings,
  toFontVariationSettings,
  transition = {
    duration: 1.5,
    ease: 'easeInOut',
  },
  staggerDuration = 0.1,
  staggerFrom = 'first',
  repeatDelay = 0.1,
  /**
   * Infinite by default. Pass a finite number for a short intro breathe, then hold.
   * @default Infinity
   */
  repeat = Infinity,
  className,
  ...props
}) {
  const [reduceMotion, setReduceMotion] = useState(false)
  const text = String(children ?? '')

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const getCustomIndex = (index, total) => {
    if (typeof staggerFrom === 'number') {
      return Math.abs(index - staggerFrom)
    }
    switch (staggerFrom) {
      case 'last':
        return total - 1 - index
      case 'center':
        return Math.abs(index - Math.floor(total / 2))
      case 'first':
      default:
        return index
    }
  }

  const letters = text.split('')

  const letterVariants = {
    initial: { fontVariationSettings: fromFontVariationSettings },
    animate: (i) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        repeat,
        repeatType: repeat === Infinity || repeat > 0 ? 'mirror' : undefined,
        delay: i * staggerDuration,
        repeatDelay: repeat === Infinity || repeat > 0 ? repeatDelay : 0,
      },
    }),
  }

  return (
    <ElementTag
      className={cn('breathing-text', className)}
      data-text={text}
      {...props}
    >
      {reduceMotion
        ? text
        : letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              className="breathing-text__letter"
              aria-hidden="true"
              variants={letterVariants}
              initial="initial"
              animate="animate"
              custom={getCustomIndex(i, letters.length)}
            >
              {letter}
            </motion.span>
          ))}
      {!reduceMotion && <span className="sr-only">{text}</span>}
    </ElementTag>
  )
}
