'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * Fixed header that hides on scroll down and reappears on scroll up.
 * Renders a spacer of matching height so the content below the header
 * flows correctly (the fixed wrapper is out of normal document flow).
 *
 * Scroll direction is tracked with requestAnimationFrame throttling to
 * avoid firing setState on every scroll event.
 */
export function StickyHeader({ children }: Props) {
  const [hidden, setHidden] = useState(false)
  const [headerHeight, setHeaderHeight] = useState<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)

  // Measure the actual rendered height once we mount, so the spacer
  // matches exactly regardless of padding/border/content changes.
  useEffect(() => {
    if (wrapperRef.current) {
      setHeaderHeight(wrapperRef.current.offsetHeight)
    }
  }, [])

  // Track scroll direction. rAF throttling batches updates to the
  // browser's paint cycle instead of firing on every scroll event.
  useEffect(() => {
    let ticking = false

    const update = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current

      // Threshold: ignore movements < 5px to avoid flicker on
      // trackpad micro-scrolls or momentum bounces
      if (Math.abs(diff) > 5) {
        if (currentY < 10) {
          // Always show the header near the top of the page
          setHidden(false)
        } else if (diff > 0) {
          // Scrolling down → hide
          setHidden(true)
        } else {
          // Scrolling up → show
          setHidden(false)
        }
        lastScrollY.current = currentY
      }

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        ref={wrapperRef}
        className={`
          fixed inset-x-0 top-0 z-40
          transition-transform duration-300 ease-out
          motion-reduce:transition-none
          ${hidden ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        {children}
      </div>
      {/*
        Spacer: reserves the same vertical space in the normal flow
        so the content below starts below the header, not underneath it.
        Falls back to 64px until we've measured the real height.
      */}
      <div
        aria-hidden
        style={{ height: headerHeight ?? 64 }}
      />
    </>
  )
}