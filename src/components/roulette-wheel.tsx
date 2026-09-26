"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

export type WheelSegment = { label: string; emoji?: string };
export type RouletteWheelHandle = { spin: () => void };

const SIZE = 400;
const C = SIZE / 2;
const HUB_R = 36;
const SEG_R = 172;
const TRACK_R = 184; // 小球在外圈木頭軌道滾動
const POCKET_R = 162; // 小球最後落在格子外緣
const BALL_R = 7;
const SPIN_MS = 3000;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function polar(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
}

function slicePath(a0: number, a1: number) {
  const o0 = polar(a0, SEG_R);
  const o1 = polar(a1, SEG_R);
  const i0 = polar(a0, HUB_R);
  const i1 = polar(a1, HUB_R);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${i0.x} ${i0.y}`,
    `L ${o0.x} ${o0.y}`,
    `A ${SEG_R} ${SEG_R} 0 ${large} 1 ${o1.x} ${o1.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${HUB_R} ${HUB_R} 0 ${large} 0 ${i0.x} ${i0.y}`,
    "Z",
  ].join(" ");
}

function sliceColor(i: number, n: number) {
  // 奇數格時最後一格用綠色，避免紅黑相鄰撞色
  if (n % 2 === 1 && i === n - 1) return "#1f7a3f";
  return i % 2 === 0 ? "#b3261e" : "#1b1b1b";
}

export function RouletteWheel({
  segments,
  onResult,
  ref,
}: {
  segments: WheelSegment[];
  onResult: (index: number) => void;
  ref?: Ref<RouletteWheelHandle>;
}) {
  const ballRef = useRef<SVGCircleElement>(null);
  const angleRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const n = segments.length;
  const seg = 360 / n;

  const placeBall = (angle: number, r: number) => {
    const ball = ballRef.current;
    if (!ball) return;
    const p = polar(angle, r);
    ball.setAttribute("cx", String(p.x));
    ball.setAttribute("cy", String(p.y));
  };

  useEffect(() => {
    placeBall(angleRef.current, TRACK_R);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const spin = () => {
    if (frameRef.current !== null) return;
    setSpinning(true);

    const result = Math.floor(Math.random() * n);
    const target = result * seg + seg / 2;
    const from = angleRef.current;
    // 小球逆時針滾 5 圈以上，最後停在目標格
    const back = (((from - target) % 360) + 360) % 360;
    const to = from - 360 * 5 - back;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / SPIN_MS, 1);
      const angle = from + (to - from) * easeOutCubic(t);
      const drop = t < 0.6 ? 0 : easeOutCubic((t - 0.6) / 0.4);
      placeBall(angle, TRACK_R - (TRACK_R - POCKET_R) * drop);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        angleRef.current = ((to % 360) + 360) % 360;
        frameRef.current = null;
        setSpinning(false);
        onResult(result);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  useImperativeHandle(ref, () => ({ spin }));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-md drop-shadow-2xl"
        role="img"
        aria-label={`輪盤：${segments.map((s) => s.label).join("、")}`}
      >
        <defs>
          <radialGradient id="wheel-wood" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="#7a4a22" />
            <stop offset="92%" stopColor="#a8703a" />
            <stop offset="100%" stopColor="#5a3417" />
          </radialGradient>
          <radialGradient id="wheel-hub" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f3d98b" />
            <stop offset="100%" stopColor="#9c7424" />
          </radialGradient>
          <radialGradient id="wheel-ball" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#dcdcdc" />
            <stop offset="100%" stopColor="#8f8f8f" />
          </radialGradient>
        </defs>

        <circle cx={C} cy={C} r={C - 2} fill="url(#wheel-wood)" stroke="#d3a45a" strokeWidth={3} />
        <circle cx={C} cy={C} r={SEG_R + 2} fill="#d3a45a" />

        {segments.map((s, i) => {
          const a0 = i * seg;
          const mid = a0 + seg / 2;
          const flip = mid > 180;
          const textR = s.emoji ? 88 : 100;
          const avail = s.emoji ? 90 : 116;
          const fontSize = Math.max(9, Math.min(16, avail / s.label.length));
          const tp = polar(mid, textR);
          const ep = polar(mid, 140);
          return (
            <g key={i}>
              <path d={slicePath(a0, a0 + seg)} fill={sliceColor(i, n)} stroke="#d3a45a" strokeWidth={1.5} />
              <text
                x={tp.x}
                y={tp.y}
                fill="#fff"
                fontSize={fontSize}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${flip ? mid + 90 : mid - 90} ${tp.x} ${tp.y})`}
              >
                {s.label}
              </text>
              {s.emoji && (
                <text x={ep.x} y={ep.y} fontSize={20} textAnchor="middle" dominantBaseline="central">
                  {s.emoji}
                </text>
              )}
            </g>
          );
        })}

        <circle cx={C} cy={C} r={155} fill="none" stroke="#d3a45a" strokeOpacity={0.6} strokeWidth={1} />
        <circle cx={C} cy={C} r={HUB_R} fill="url(#wheel-hub)" stroke="#6b4a12" strokeWidth={2} />
        <circle cx={C} cy={C} r={8} fill="#6b4a12" />
        <circle ref={ballRef} cx={C} cy={C - TRACK_R} r={BALL_R} fill="url(#wheel-ball)" stroke="#555" strokeWidth={0.5} />
      </svg>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="rounded-full bg-accent px-10 py-3 text-base font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {spinning ? "轉動中…" : "開始"}
      </button>
    </div>
  );
}
