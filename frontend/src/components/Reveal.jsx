import { useEffect, useRef, useState } from 'react'

/**
 * Fades and lifts its children into place the first time they scroll
 * into view. Built on the browser's own IntersectionObserver — no
 * animation library needed for something this simple.
 *
 * `delay` staggers multiple Reveals in the same section (in ms) so a
 * group of items settles in one after another rather than all at once.
 *
 * Respects prefers-reduced-motion via Tailwind's motion-reduce:
 * variant — anyone who's asked their OS for less motion just sees the
 * content appear, no transform or fade.
 */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={
        'transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ' +
        (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6') +
        ' ' + className
      }
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

export default Reveal
