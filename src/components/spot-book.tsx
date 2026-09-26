"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export type BookPage = {
  name: string;
  icon: string;
  tag: string;
  desc: string;
  address?: string;
  image?: { src: string; alt: string };
  reviewsUrl: string;
};

type Turn = { from: number; dir: "next" | "prev" };

const TURN_MS = 650;

// Pages beneath the current one peeking out on the right, plus a drop shadow.
const stackShadow: CSSProperties = {
  boxShadow:
    "3px 3px 0 -1px #e9dfc9, 6px 6px 0 -2px #dccfb3, 9px 9px 0 -3px #cdbe9f, 0 24px 48px rgba(0,0,0,0.55)",
};

export function SpotBook({
  pages,
  index,
  onIndexChange,
}: {
  pages: BookPage[];
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const [turn, setTurn] = useState<Turn | null>(null);
  const [lastIndex, setLastIndex] = useState(index);
  const timer = useRef<number | undefined>(undefined);
  const touchX = useRef<number | null>(null);

  // Index can also change from outside (e.g. a dart throw), so derive the
  // turn direction from the previous index instead of from button clicks.
  if (index !== lastIndex) {
    setLastIndex(index);
    setTurn({ from: lastIndex, dir: index > lastIndex ? "next" : "prev" });
  }

  useEffect(() => {
    if (!turn) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTurn(null), TURN_MS);
    return () => window.clearTimeout(timer.current);
  }, [turn]);

  const go = (i: number) => {
    if (i < 0 || i >= pages.length || i === index) return;
    onIndexChange(i);
  };

  // While turning forward, the old page lifts off and reveals the new one
  // underneath; turning back, the previous page swings in over the old one.
  const basePage = turn?.dir === "prev" ? pages[turn.from] : pages[index];
  const flyingPage = turn
    ? turn.dir === "next"
      ? pages[turn.from]
      : pages[index]
    : null;

  return (
    <div
      className="outline-none"
      tabIndex={0}
      aria-roledescription="景點書"
      aria-label={`安平景點書，第 ${index + 1} 頁，共 ${pages.length} 頁`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null || Math.abs(end - start) < 40) return;
        go(end < start ? index + 1 : index - 1);
      }}
    >
      <div
        className="relative h-[32rem] rounded-l-md rounded-r-2xl"
        style={{ ...stackShadow, perspective: "2000px" }}
      >
        <Page
          page={basePage}
          number={pages.indexOf(basePage) + 1}
          total={pages.length}
        />
        {flyingPage && (
          <div
            key={`${turn?.from}-${index}`}
            className={`absolute inset-0 ${
              turn?.dir === "next" ? "book-turn-next" : "book-turn-prev"
            }`}
          >
            <Page
              page={flyingPage}
              number={pages.indexOf(flyingPage) + 1}
              total={pages.length}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹ 上一頁
        </button>
        <div className="flex flex-wrap justify-center gap-1.5">
          {pages.map((p, i) => (
            <button
              key={p.name}
              type="button"
              aria-label={`翻到 ${p.name}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-5 bg-accent" : "w-2 bg-muted/40 hover:bg-muted"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === pages.length - 1}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          下一頁 ›
        </button>
      </div>
    </div>
  );
}

function Page({
  page,
  number,
  total,
}: {
  page: BookPage;
  number: number;
  total: number;
}) {
  return (
    <article className="absolute inset-0 flex flex-col overflow-hidden rounded-l-md rounded-r-2xl bg-[#f4ecdc] px-8 py-7 text-[#3b2f22] [backface-visibility:hidden]">
      {/* spine shading */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent" />

      <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-[#8a6a3a]">
        <span>ANPING</span>
        <span>
          {number} / {total}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#e2c9a0] bg-accent text-2xl shadow-md">
          {page.icon}
        </span>
        <div>
          <span className="text-xs tracking-wide text-[#8a6a3a]">
            {page.tag}
          </span>
          <h3 className="font-[family-name:var(--font-serif-tc)] text-2xl leading-tight">
            {page.name}
          </h3>
        </div>
      </div>

      {page.image && (
        <div className="relative mt-5 h-36 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={page.image.src}
            alt={page.image.alt}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <p className="mt-5 text-sm leading-7 text-[#4d3f30]">{page.desc}</p>

      <div className="mt-auto space-y-3 pt-5">
        {page.address && (
          <p className="text-xs text-[#6b5a45]">📍 {page.address}</p>
        )}
        <a
          href={page.reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#8a5a1f] underline-offset-4 hover:underline"
        >
          看 Google 評論 ↗
        </a>
      </div>
    </article>
  );
}
