'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface BeforeAfterSliderProps {
  before: string
  after: string
  alt?: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({ before, after, alt = '', beforeLabel = 'Before', afterLabel = 'After' }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      dragging.current = true
      updatePosition(e.touches[0].clientX)
    },
    [updatePosition]
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) updatePosition(e.clientX)
    }
    const onUp = () => {
      dragging.current = false
    }
    const onTouchMove = (e: TouchEvent) => {
      if (dragging.current) {
        e.preventDefault()
        updatePosition(e.touches[0].clientX)
      }
    }
    const el = containerRef.current
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    el?.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
      el?.removeEventListener('touchmove', onTouchMove)
    }
  }, [updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl select-none cursor-col-resize bg-muted/30"
      style={{ touchAction: 'none', maxHeight: '70vh' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img
        src={after}
        alt={alt}
        draggable={false}
        className="block w-full object-contain pointer-events-none"
        style={{ maxHeight: '70vh' }}
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={before}
          alt={alt}
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_8px_2px_rgba(255,255,255,0.6)] pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <span className="w-px h-4 bg-neutral-400 rounded-full block" />
            <span className="w-px h-4 bg-neutral-400 rounded-full block" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 pointer-events-none z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
          {beforeLabel}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}
