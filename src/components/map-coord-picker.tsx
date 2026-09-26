"use client";

import { useState } from "react";

// Dev-only overlay: click the map to read a point's position (as % of the
// image) for placing pins in anping-spot-map.tsx.
export function MapCoordPicker() {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="absolute inset-0 cursor-crosshair"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
        setPoint({ x, y });
        navigator.clipboard?.writeText(`x: ${x}, y: ${y}`).catch(() => {});
      }}
    >
      {point && (
        <>
          <span
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-500"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          />
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-1.5 font-mono text-sm text-white">
            x: {point.x}, y: {point.y}（已複製）
          </span>
        </>
      )}
    </div>
  );
}
