"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DartControls } from "@/components/dart-controls";
import { MapCoordPicker } from "@/components/map-coord-picker";
import { SpotBook, type BookPage } from "@/components/spot-book";

type SpotCategory = "heritage";

// Pin outline colour per category, so each kind of place reads at a glance.
const categoryBorder: Record<SpotCategory, string> = {
  heritage: "border-[#e2c9a0]",
};

const categoryLabel: Record<SpotCategory, string> = {
  heritage: "古蹟",
};

type MapSpot = {
  name: string;
  icon: string;
  category: SpotCategory;
  desc: string;
  address?: string;
  image?: { src: string; alt: string };
  // Query used for the embedded Google Maps place card.
  mapsQuery: string;
  // Google search page with the place's reviews, opened on click.
  reviewsUrl: string;
  // Pin centre as a percentage of the map image's width / height.
  x: number;
  y: number;
  // Extra pixel offset (at full pin size) for pins that sit right next to
  // another pin; scaled with the pins so they touch without overlapping.
  nudge?: [number, number];
};

const mapSpots: MapSpot[] = [
  {
    name: "安平古堡",
    icon: "🏰",
    category: "heritage",
    desc: "1624 年荷蘭人興建的熱蘭遮城，是台灣最早的城堡。現在還看得到當年的紅磚城牆殘蹟，以及日治時期改建的白色洋樓，登上瞭望台可以俯瞰整個安平街區。",
    address: "台南市安平區國勝路82號",
    image: { src: "/images/安平古堡.webp", alt: "安平古堡石碑、紅磚城牆與白色瞭望台" },
    mapsQuery: "安平古堡 台南市安平區國勝路82號",
    reviewsUrl:
      "https://www.google.com/search?sa=X&sca_esv=687af446f448273f&sxsrf=APpeQnsR4IJcykKy7g5k6MBmZgS4y9_dRg:1790409497621&q=%E5%AE%89%E5%B9%B3%E5%8F%A4%E5%A0%A1&si=APenkKnvnG18lUM2uw1Munh626dOA-PkzSVhvlsNbFcAluV9RTUkOh2Euu07zm3xRr4-73GUPSeKNEwxxWjJBqJA6R17RBv1bmGObHD0els6s_3g25vq8uc%3D&ved=2ahUKEwjGgYOS44uXAxUne_UHHThYCukQyNoBKAB6BAgaEAA&ictx=1&biw=1536&bih=791&dpr=1.25",
    x: 40.5,
    y: 8.4,
    nudge: [4, 8],
  },
  {
    name: "億載金城",
    icon: "💣",
    category: "heritage",
    desc: "清末牡丹社事件後，由沈葆楨奏請興建的西式砲台，又稱二鯤鯓砲臺。護城河環繞、紅磚拱門古樸，城內草坪開闊，傍晚來散步特別寧靜。",
    address: "台南市安平區光州路3號",
    image: { src: "/images/億載金城.webp", alt: "億載金城紅磚拱門城門與護城河白色石橋" },
    mapsQuery: "億載金城 台南市安平區光州路3號",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("億載金城")}`,
    x: 38.6,
    y: 42.8,
  },
  {
    name: "東興洋行",
    icon: "🏛️",
    category: "heritage",
    desc: "清末安平開港後，德國商人設立的洋行。紅磚拱廊搭配木造百葉門窗，前院老榕樹遮蔭，洋樓帶著濃濃的異國風情，是安平通商歷史的見證。",
    address: "台南市安平區安北路233巷3號",
    image: { src: "/images/德商東興洋行.webp", alt: "德商東興洋行紅磚拱廊洋樓與老榕樹" },
    mapsQuery: "東興洋行 台南市安平區安北路233巷3號",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("東興洋行")}`,
    x: 37.8,
    y: 8.1,
    nudge: [-14, 6],
  },
  {
    name: "英商德記洋行",
    icon: "🏢",
    category: "heritage",
    desc: "清末英國商人設立的洋行，是當年安平重要的洋行之一。白色兩層洋樓如今是台灣開拓史料蠟像館，後方就連著安平樹屋，可以一起逛。",
    address: "台南市安平區古堡街108號",
    image: { src: "/images/英商德記洋行.webp", alt: "英商德記洋行白色兩層拱廊洋樓" },
    mapsQuery: "英商德記洋行 台南市安平區古堡街108號",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("英商德記洋行")}`,
    x: 39.4,
    y: 3.6,
  },
  {
    name: "安平小砲台",
    icon: "💥",
    category: "heritage",
    desc: "清道光二十年（1840 年）中英鴉片戰爭爆發，臺灣道姚瑩為防英軍入侵，在安平海口加強防務而建。紅磚砲座上仍陳列著古砲，規模不大但很有味道，逛古堡周邊時可以順路看看。",
    image: { src: "/images/安平小砲台.webp", alt: "安平小砲臺紅磚砲座與古砲" },
    mapsQuery: "安平小砲臺 台南市安平區",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("安平小砲台")}`,
    x: 37.2,
    y: 13.8,
    nudge: [-4, 8],
  },
  {
    name: "朱玖瑩故居（因鹽玖定）",
    icon: "🖌️",
    category: "heritage",
    desc: "書法家朱玖瑩曾主管台南鹽務，這棟老宿舍就是他當年的居所。如今以「因鹽玖定」之名開放，可以欣賞書法作品，也能感受老屋的安靜氛圍。",
    image: { src: "/images/朱玖瑩故居2.webp", alt: "朱玖瑩故居日式老宿舍與庭院，窗上展示書法" },
    mapsQuery: "朱玖瑩故居 因鹽玖定 台南市安平區",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("朱玖瑩故居 因鹽玖定")}`,
    x: 39.4,
    y: 3.6,
    nudge: [21, 0],
  },
  {
    name: "海山館",
    icon: "🏮",
    category: "heritage",
    desc: "清代來台戍守的班兵所建立的會館，是台灣現存少數的班兵會館之一，紅瓦屋頂配上彩繪山牆的閩式老屋很好拍，院子裡還有海山咖啡館，逛累了可以坐下來歇歇腳。",
    image: { src: "/images/海山館.webp", alt: "海山館閩式紅瓦老屋與紅磚庭院" },
    mapsQuery: "海山館 台南市安平區",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("安平 海山館")}`,
    x: 44.0,
    y: 8.9,
    nudge: [16, -2],
  },
  {
    name: "安平老街（延平街）",
    icon: "🛍️",
    category: "heritage",
    desc: "號稱「台灣第一街」，街道兩旁擠滿蜜餞、蝦餅、劍獅紀念品與各式小吃，邊走邊吃、隨逛隨停最有樂趣。",
    address: "台南市安平區延平街",
    image: { src: "/images/安平老街.webp", alt: "安平老街人潮熙攘的街道與兩旁商店" },
    mapsQuery: "安平老街 延平街 台南市安平區",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("安平老街 延平街")}`,
    x: 44.5,
    y: 10.7,
    nudge: [14, 16],
  },
  {
    name: "安平樹屋",
    icon: "🌳",
    category: "heritage",
    desc: "原本是德記洋行的倉庫，廢棄後被老榕樹的氣根層層盤據包覆，樹與屋融為一體。走在棧道上看光影從枝葉間灑下，非常魔幻。",
    address: "台南市安平區古堡街108號",
    image: { src: "/images/安平樹屋.jpg", alt: "安平樹屋老榕樹盤根錯節景觀" },
    mapsQuery: "安平樹屋 台南市安平區古堡街108號",
    reviewsUrl: `https://www.google.com/search?q=${encodeURIComponent("安平樹屋")}`,
    x: 39.4,
    y: 3.6,
    nudge: [-21, 0],
  },
];

const bookPages: BookPage[] = mapSpots.map((spot) => ({
  name: spot.name,
  icon: spot.icon,
  tag: categoryLabel[spot.category],
  desc: spot.desc,
  address: spot.address,
  image: spot.image,
  reviewsUrl: spot.reviewsUrl,
}));

type Hit = { key: string; spot: MapSpot };

// Map width at which pins are full size (desktop, lg two-column layout).
const FULL_PIN_MAP_WIDTH = 667;
// Pins shrink with the map but stay big enough to tap.
const MIN_PIN_SCALE = 0.65;

export function AnpingSpotMap() {
  const [dartCount, setDartCount] = useState(3);
  const [hits, setHits] = useState<Hit[]>([]);
  const [throwing, setThrowing] = useState(false);
  const [page, setPage] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const [pinScale, setPinScale] = useState(1);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const scale = entry.contentRect.width / FULL_PIN_MAP_WIDTH;
      setPinScale(Math.min(1, Math.max(MIN_PIN_SCALE, scale)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const throwDarts = () => {
    if (throwing) return;
    setThrowing(true);
    const newHits = Array.from({ length: dartCount }, (_, i) => ({
      key: `${Date.now()}-${i}`,
      spot: mapSpots[Math.floor(Math.random() * mapSpots.length)],
    }));
    setHits(newHits);
    // Open the book at the first dart's spot.
    setPage(mapSpots.indexOf(newHits[0].spot));
    window.setTimeout(() => setThrowing(false), 500 + dartCount * 120);
  };

  const grouped = hits.reduce<
    Record<string, { spot: MapSpot; darts: number[] }>
  >((acc, hit, i) => {
    const existing = acc[hit.spot.name];
    if (existing) existing.darts.push(i + 1);
    else acc[hit.spot.name] = { spot: hit.spot, darts: [i + 1] };
    return acc;
  }, {});

  return (
    <div>
      <DartControls
        dartCount={dartCount}
        onDartCountChange={setDartCount}
        onThrow={throwDarts}
        throwing={throwing}
      />

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div ref={mapRef} className="relative">
          <div className="relative aspect-[1187/896] overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/安平區google截圖.png"
              alt="台南安平區地圖"
              fill
              sizes="(min-width: 1024px) 690px, 100vw"
              className="object-cover"
            />
            {process.env.NODE_ENV === "development" && <MapCoordPicker />}
          </div>

          {mapSpots.map((spot, i) => {
            const isHit = hits.some((h) => h.spot === spot);
            const isOpen = i === page;
            return (
              <div
                key={spot.name}
                className="group absolute -translate-x-1/2 -translate-y-[10px] hover:z-20 focus-within:z-20"
                style={pinStyle(spot, pinScale)}
              >
                <a
                  href={spot.reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${spot.name}（開啟 Google 評論）`}
                  className="relative flex flex-col items-center focus:outline-none"
                  style={{ scale: pinScale }}
                >
                  <span className="absolute top-[3px] h-3.5 w-3.5 animate-ping rounded-full bg-accent/40" />
                  <span
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 ${categoryBorder[spot.category]} bg-accent text-[11px] shadow-lg transition-transform group-hover:scale-110 group-focus-within:scale-110 ${
                      isHit ? "ring-2 ring-foreground" : ""
                    } ${isOpen ? "scale-150" : isHit ? "scale-125" : ""}`}
                  >
                    {spot.icon}
                  </span>
                </a>

                {/* pt-2 instead of a margin so the hover area stays continuous */}
                <div className="invisible absolute left-1/2 top-full w-[min(20rem,80vw)] -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-accent/40 bg-background-elevated shadow-xl">
                    <iframe
                      title={`${spot.name} Google 地圖與評論`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(spot.mapsQuery)}&hl=zh-TW&z=16&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="block h-56 w-full border-0"
                    />
                    <a
                      href={spot.reviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 text-sm text-accent transition-colors hover:bg-accent/10"
                    >
                      查看 {spot.name} 的 Google 評論
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {hits.map((hit, i) => {
            // Darts on the same spot fan out to its upper right so they don't
            // stack on top of each other or hide the pin.
            const nth = hits
              .slice(0, i)
              .filter((h) => h.spot === hit.spot).length;
            const [nudgeX, nudgeY] = hit.spot.nudge ?? [0, 0];
            return (
              <span
                key={hit.key}
                title={`第 ${i + 1} 支飛鏢：${hit.spot.name}`}
                style={{
                  left: `${hit.spot.x}%`,
                  top: `${hit.spot.y}%`,
                  marginLeft: (nudgeX + 10 + nth * 8) * pinScale,
                  marginTop: (nudgeY - 10) * pinScale,
                  scale: pinScale,
                  animationDelay: `${i * 130}ms`,
                }}
                className="dart-land pointer-events-none absolute z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-foreground text-[9px] font-bold text-background shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
              >
                {i + 1}
              </span>
            );
          })}

          {hits.length === 0 && (
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-muted">
              按下「擲飛鏢」，讓緣分決定接下來要去哪裡逛逛
            </p>
          )}
        </div>

        <SpotBook pages={bookPages} index={page} onIndexChange={setPage} />
      </div>

      {hits.length > 0 && (
        <div className="mx-auto mt-8 max-w-2xl">
          <p className="text-center text-xs tracking-[0.3em] text-accent">
            本輪命中．點景點看 Google 評論
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {Object.values(grouped).map(({ spot, darts }) => (
              <a
                key={spot.name}
                href={spot.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated px-4 py-2 text-sm transition-colors hover:border-accent/50 hover:bg-accent/10"
              >
                <span className="flex -space-x-1">
                  {darts.map((n) => (
                    <span
                      key={n}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-background ring-1 ring-background-elevated"
                    >
                      {n}
                    </span>
                  ))}
                </span>
                <span aria-hidden>{spot.icon}</span>
                {spot.name}
                <span aria-hidden className="text-muted">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function pinStyle(spot: MapSpot, pinScale: number) {
  const [nudgeX, nudgeY] = spot.nudge ?? [0, 0];
  return {
    left: `${spot.x}%`,
    top: `${spot.y}%`,
    marginLeft: nudgeX * pinScale,
    marginTop: nudgeY * pinScale,
  };
}
