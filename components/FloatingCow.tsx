"use client";

import { useEffect, useRef } from "react";

function CowSvg() {
  return (
    <svg
      width="72"
      height="62"
      viewBox="0 0 80 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter:
          "drop-shadow(0 0 8px rgba(100,255,23,0.45)) drop-shadow(0 0 2px rgba(100,255,23,0.25))",
      }}
    >
      {/* body */}
      <ellipse cx="36" cy="40" rx="22" ry="15" fill="#f0f0f0" />
      {/* spots */}
      <ellipse cx="28" cy="36" rx="7" ry="5.5" fill="#2a2a2a" opacity="0.85" />
      <ellipse cx="44" cy="43" rx="5" ry="4" fill="#2a2a2a" opacity="0.85" />
      <circle cx="20" cy="42" r="3" fill="#2a2a2a" opacity="0.6" />
      {/* head */}
      <circle cx="58" cy="28" r="12" fill="#f0f0f0" />
      {/* ears */}
      <ellipse
        cx="49"
        cy="18"
        rx="3.5"
        ry="6"
        fill="#f5a0b8"
        transform="rotate(-20 49 18)"
      />
      <ellipse
        cx="65"
        cy="20"
        rx="3.5"
        ry="6"
        fill="#f5a0b8"
        transform="rotate(15 65 20)"
      />
      {/* horns */}
      <path
        d="M50 16 L46 5"
        stroke="#e8c84a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M64 18 L68 7"
        stroke="#e8c84a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* eye */}
      <circle cx="61" cy="25" r="3" fill="#1a1a1a" />
      <circle cx="62.2" cy="23.8" r="1.2" fill="#fff" />
      {/* snout */}
      <ellipse cx="65" cy="32" rx="6.5" ry="4.5" fill="#f5a0b8" />
      <circle cx="63" cy="32.5" r="1.3" fill="#d4748a" />
      <circle cx="67" cy="32.5" r="1.3" fill="#d4748a" />
      {/* legs */}
      <rect x="18" y="51" width="6" height="13" rx="3" fill="#f0f0f0" />
      <rect x="28" y="51" width="6" height="13" rx="3" fill="#f0f0f0" />
      <rect x="38" y="51" width="6" height="13" rx="3" fill="#f0f0f0" />
      <rect x="48" y="51" width="6" height="13" rx="3" fill="#f0f0f0" />
      {/* hooves */}
      <rect x="18" y="61" width="6" height="4" rx="2" fill="#2a2a2a" />
      <rect x="28" y="61" width="6" height="4" rx="2" fill="#2a2a2a" />
      <rect x="38" y="61" width="6" height="4" rx="2" fill="#2a2a2a" />
      <rect x="48" y="61" width="6" height="4" rx="2" fill="#2a2a2a" />
      {/* tail */}
      <path
        d="M14 36 Q7 28 9 22"
        stroke="#f0f0f0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="9" cy="20" rx="3.5" ry="4" fill="#f0f0f0" />
      {/* udder */}
      <ellipse cx="33" cy="53" rx="5" ry="3" fill="#f5a0b8" opacity="0.7" />
    </svg>
  );
}

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
      return () => cancelAnimationFrame(state.raf);
    }

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
        width: 72,
        height: 68,
        zIndex: 40,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <div ref={innerRef} style={{ animation: "cow-spin 5s linear infinite" }}>
        <CowSvg />
      </div>
    </div>
  );
}
