"use client";

import { useEffect, useRef } from "react";

export function FloatingCow() {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current as HTMLDivElement;
    const inner = innerRef.current as HTMLDivElement;
    if (!el || !inner) return;

    const isDesktop = window.innerWidth >= 768;

    const SIZE = 72;
    const state = {
      x: Math.random() * (window.innerWidth - SIZE),
      y: Math.random() * (window.innerHeight - SIZE),
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8),
      vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8),
      flipped: false,
      dragging: false,
      raf: 0,
      history: [] as { x: number; y: number; t: number }[],
    };
    state.flipped = state.vx < 0;

    function setSpinSpeed(vx: number, vy: number) {
      const speed = Math.sqrt(vx * vx + vy * vy);
      // 5s at rest, down to 0.4s at max speed (~20px/frame)
      const duration = Math.max(0.4, 5 - speed * 0.23);
      inner.style.animation = `cow-spin ${duration.toFixed(2)}s linear infinite`;
    }

    function render() {
      el.style.transform = `translate(${state.x}px, ${state.y}px) scaleX(${state.flipped ? -1 : 1})`;
    }

    function tick() {
      if (state.dragging) return;
      state.x += state.vx;
      state.y += state.vy;

      const maxX = window.innerWidth - SIZE;
      const maxY = window.innerHeight - SIZE;

      if (state.x <= 0) {
        state.x = 0;
        state.vx = Math.abs(state.vx);
        state.flipped = false;
      }
      if (state.x >= maxX) {
        state.x = maxX;
        state.vx = -Math.abs(state.vx);
        state.flipped = true;
      }
      if (state.y <= 0) {
        state.y = 0;
        state.vy = Math.abs(state.vy);
      }
      if (state.y >= maxY) {
        state.y = maxY;
        state.vy = -Math.abs(state.vy);
      }

      render();
      state.raf = requestAnimationFrame(tick);
    }

    state.raf = requestAnimationFrame(tick);
    setSpinSpeed(state.vx, state.vy);

    if (!isDesktop) {
      // Mobile/tablet: bouncing background only, no interaction
      return () => cancelAnimationFrame(state.raf);
    }

    // ── Drag (desktop only) ──────────────────────────────────────────────────
    el.style.pointerEvents = "auto";
    el.style.cursor = "grab";

    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      state.dragging = true;
      state.history = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      inner.style.animationPlayState = "paused";
    }

    function onPointerMove(e: PointerEvent) {
      if (!state.dragging) return;
      state.x = e.clientX - SIZE / 2;
      state.y = e.clientY - SIZE / 2;
      render();

      const now = performance.now();
      state.history.push({ x: e.clientX, y: e.clientY, t: now });
      // keep only last 80ms
      state.history = state.history.filter((p) => now - p.t < 80);
    }

    function onPointerUp() {
      if (!state.dragging) return;
      state.dragging = false;
      el.style.cursor = "grab";
      inner.style.animationPlayState = "running";

      if (state.history.length >= 2) {
        const first = state.history[0];
        const last = state.history[state.history.length - 1];
        const dt = Math.max(last.t - first.t, 8);
        const vx = ((last.x - first.x) / dt) * 16;
        const vy = ((last.y - first.y) / dt) * 16;

        // clamp to max speed 22, min speed 1.5
        const speed = Math.sqrt(vx * vx + vy * vy);
        const clamped = Math.min(22, Math.max(1.5, speed));
        const scale = speed > 0 ? clamped / speed : 1;
        state.vx = vx * scale;
        state.vy = vy * scale;
      } else {
        state.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
        state.vy = (Math.random() > 0.5 ? 1 : -1) * 3;
      }

      state.flipped = state.vx < 0;
      setSpinSpeed(state.vx, state.vy);
      cancelAnimationFrame(state.raf);
      state.raf = requestAnimationFrame(tick);
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(state.raf);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 select-none opacity-80"
      style={{
        willChange: "transform",
        fontSize: 72,
        lineHeight: 1,
        zIndex: -50,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <div ref={innerRef} style={{ animation: "cow-spin 5s linear infinite" }}>
        🐄
      </div>
    </div>
  );
}
