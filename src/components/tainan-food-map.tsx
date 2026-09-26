"use client";

import { useState } from "react";
import {
  boundaryPath,
  districts,
  type Zone,
} from "@/components/tainan-district-map";

// Food picks per district, keyed by the district name used on the map.
const foods: Record<string, string[]> = {
  安平區: [
    "文章牛肉湯",
    "阿財牛肉湯",
    "丹丹漢堡平豐店",
    "王氏魚皮",
    "牛園火鍋",
    "慶平海產",
  ],
  中西區: [
    "度小月擔仔麵",
    "阿堂鹹粥",
    "富盛號碗粿",
    "福記肉圓",
    "矮仔成蝦仁飯",
    "八寶彬圓仔惠",
  ],
  北區: ["阿憨鹹粥", "花園夜市"],
  東區: ["大東夜市"],
  鹽水: ["鹽水意麵"],
  麻豆: ["麻豆碗粿"],
  關廟區: ["關廟麵"],
  玉井: ["玉井芒果冰"],
  學甲: ["學甲虱目魚"],
};

const zoneFills: Record<Zone, string> = {
  urban: "fill-rose-400/45 hover:fill-rose-400/70",
  north: "fill-orange-300/45 hover:fill-orange-300/70",
  coast: "fill-sky-400/45 hover:fill-sky-400/70",
  hills: "fill-lime-400/40 hover:fill-lime-400/65",
};

// "安平區" → "安平", but keep two-character names like "北區" whole.
const shortName = (name: string) =>
  name.length > 2 && name.endsWith("區") ? name.slice(0, -1) : name;

const mapsSearchUrl = (district: string, place: string) =>
  `https://www.google.com/maps/search/?${new URLSearchParams({
    api: "1",
    query: `台南 ${shortName(district)} ${place}`,
  })}`;

export function TainanFoodMap() {
  const [selected, setSelected] = useState("安平區");
  const picks = foods[selected] ?? [];

  return (
    <div className="rounded-3xl border border-border bg-background-elevated p-6 sm:p-8">
      <h3 className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
        台南市美食地圖
      </h3>
      <p className="mt-2 text-sm text-muted">點地圖上的行政區，看看在地美食</p>

      <div className="mx-auto mt-6 max-w-xl">
        <svg viewBox="-15 -15 630 545" className="w-full">
          <path
            d={boundaryPath}
            className="fill-none stroke-border"
            strokeWidth={1.5}
          />
          {districts.map((d) => (
            <path
              key={d.name}
              d={d.path}
              onClick={() => setSelected(d.name)}
              className={`cursor-pointer stroke-background transition-colors ${
                d.name === selected ? "fill-accent/80" : zoneFills[d.zone]
              }`}
              strokeWidth={1.5}
            >
              <title>{d.name}</title>
            </path>
          ))}
          {districts.map((d) => (
            <text
              key={d.name}
              x={d.labelX}
              y={d.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none select-none fill-foreground font-medium"
              style={{
                fontSize: 11,
                paintOrder: "stroke",
                stroke: "#0c0a08",
                strokeWidth: 2.5,
              }}
            >
              {shortName(d.name)}
            </text>
          ))}
        </svg>
      </div>

      <h4 className="mt-8 font-medium text-accent">
        {shortName(selected)}美食
      </h4>
      {picks.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {picks.map((place) => (
            <a
              key={place}
              href={mapsSearchUrl(selected, place)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              {place} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">這一區的美食資料準備中。</p>
      )}
    </div>
  );
}
