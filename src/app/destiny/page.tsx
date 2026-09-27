import type { Metadata } from "next";
import Image from "next/image";
import { Parallax } from "@/components/parallax";
import { AnpingRoulette } from "@/components/anping-roulette";

export const metadata: Metadata = {
  title: "安平命運輪盤 | 台南獨旅",
};

const landmarks = [
  {
    title: "大魚的祝福",
    desc: "矗立在安平漁人碼頭岸邊的巨型鯨魚裝置藝術，藍天大海為背景相當壯觀，是近年來安平新興的熱門打卡地標，白天光線好時拍起來特別出片。",
    address: "台南市安平區安平漁人碼頭",
    image: { src: "/images/大魚的祝福.jpg", alt: "安平漁人碼頭大魚的祝福鯨魚裝置藝術" },
  },
  {
    title: "安平漁人碼頭夜景",
    desc: "入夜後碼頭的燈光陸續點亮，海面倒映著燈影，海風徐徐吹來，是結束一天行程後很適合一個人靜靜散步收尾的地方。",
    address: "台南市安平區安平漁人碼頭",
    image: {
      src: "/images/安平漁人碼頭夜晚點燈照片.jpg",
      alt: "安平漁人碼頭夜晚點燈景色",
    },
  },
];

const buskers = [
  {
    name: "Kenny Tim 薩克斯「瘋」手",
    tag: "薩克斯風演奏",
    url: "https://www.youtube.com/@tim1231",
    platform: "YouTube",
  },
  {
    name: "皇貴妃樂團",
    tag: "樂團演出",
    url: "https://www.facebook.com/profile.php?id=100088664447887&mibextid=ZbWKwL",
    platform: "Facebook",
  },
  {
    name: "肉腳團的堅持",
    tag: "樂團演出",
    url: "https://www.facebook.com/profile.php?id=100088664447887&mibextid=ZbWKwL",
    platform: "Facebook",
  },
  {
    name: "永恆之夜",
    tag: "樂團演出",
    url: "https://www.facebook.com/profile.php?id=100083175616744&mibextid=wwXIfr&rdid=o5Ua6fTh9l8uzWzb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BXAiSXBgN%2F%3Fmibextid%3DwwXIfr",
    platform: "Facebook",
  },
];

const venueScheduleUrl =
  "https://buskersapply.tainan.gov.tw/index.php?inter=space&area=5&location=103&id=103t";

const eats = [
  {
    name: "牛園火鍋 安平店",
    desc: "開在安億路上，鄰近安平漁人碼頭，中式庭園風格的用餐空間，紅燈籠與梅花裝飾很有氛圍。肉盤、海鮮拼盤新鮮豐盛，湯頭選擇多，一個人也能自在吃火鍋。",
    address: "台南市安平區安億路．鄰近安平漁人碼頭",
    images: [
      { src: "/images/牛園火鍋室內用餐環境.webp", alt: "牛園火鍋安平店室內用餐環境" },
      { src: "/images/牛園火鍋-1.jpg", alt: "牛園火鍋安平店肉盤與海鮮拼盤" },
      { src: "/images/牛園火鍋-2.jpg", alt: "牛園火鍋安平店門口" },
    ],
    map: "/images/牛園火鍋安平位置圖.png",
  },
];

export default function DestinyPage() {
  return (
    <main className="relative isolate flex-1">
      {/* Page background */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/images/安平漁人碼頭夜晚點燈照片.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/75" />
      </div>
      <section className="px-6 pt-24 pb-24 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm tracking-[0.3em] text-muted">
              ANPING · ROULETTE
            </p>
            <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
              安平命運輪盤
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground sm:text-xl">
              🎡 輕鬆旅行，讓命運替你選一站。
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted">
              轉一下，看看今天的安平會帶你去哪裡。
            </p>
          </div>

          <AnpingRoulette />
        </div>
      </section>

      {/* Landmarks */}
      <section id="anping-landmarks" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs tracking-[0.3em] text-accent">安平地標</p>
          <h2 className="mt-3 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground sm:text-3xl">
            碼頭邊的打卡風景
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {landmarks.map((spot) => (
              <div
                key={spot.title}
                className="overflow-hidden rounded-2xl border border-border bg-background-elevated"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Parallax
                    speed={0.06}
                    range={26}
                    className="absolute inset-x-0 -top-[13%] h-[126%]"
                  >
                    <Image
                      src={spot.image.src}
                      alt={spot.image.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </Parallax>
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-serif-tc)] text-xl">
                    {spot.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {spot.desc}
                  </p>
                  <p className="mt-4 text-xs text-muted/70">
                    📍 {spot.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live */}
      <section id="anping-live" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs tracking-[0.3em] text-accent">現場演出</p>
          <h2 className="mt-3 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground sm:text-3xl">
            漁人碼頭廣場，常態街頭演出
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            廣場上常有不同樂團與演奏家輪番登場，點下方連結可以先聽聽看、認識一下這些表演者。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {buskers.map((busker) => (
              <a
                key={busker.name}
                href={busker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-accent/40"
              >
                <div>
                  <span className="text-xs tracking-wide text-accent">
                    {busker.tag} · {busker.platform}
                  </span>
                  <h3 className="mt-2 font-[family-name:var(--font-serif-tc)] text-lg">
                    {busker.name}
                  </h3>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 text-muted transition-colors group-hover:text-accent"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
          <a
            href={venueScheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            查詢廣場場地表演行程
            <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      {/* Eats */}
      <section id="anping-eats" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs tracking-[0.3em] text-accent">安平美食</p>
          <h2 className="mt-3 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground sm:text-3xl">
            逛累了，安平在地推薦
          </h2>
          <div className="mt-12 space-y-8">
            {eats.map((eat) => (
              <div
                key={eat.name}
                className="overflow-hidden rounded-2xl border border-border bg-background-elevated"
              >
                <div className="grid gap-1 sm:grid-cols-3">
                  {eat.images.map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-[4/3] overflow-hidden"
                    >
                      <Parallax
                        speed={0.05}
                        range={20}
                        className="absolute inset-x-0 -top-[11%] h-[122%]"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </Parallax>
                    </div>
                  ))}
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-[2fr_1fr] sm:p-8">
                  <div>
                    <h3 className="font-[family-name:var(--font-serif-tc)] text-xl">
                      {eat.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {eat.desc}
                    </p>
                    <p className="mt-4 text-xs text-muted/70">
                      📍 {eat.address}
                    </p>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-border sm:aspect-auto">
                    <Image
                      src={eat.map}
                      alt={`${eat.name}位置圖`}
                      fill
                      sizes="(min-width: 640px) 20vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
