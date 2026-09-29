import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstagramGrid } from "@/components/instagram-grid";
import {
  categories,
  districtOf,
  mapsUrl,
  photoFor,
  places,
} from "@/lib/anping-roulette";

export const metadata: Metadata = {
  title: "安平區 | 台南獨旅",
};

// 有 IG 貼文的地點改用 IG 照片格子，取代專案內的照片
const instagram: Record<string, string[]> = {
  "anping-fort": [
    "https://www.instagram.com/p/C8RaPVqpDPJ/",
    "https://www.instagram.com/p/DJzEZZ1T5yM/",
    "https://www.instagram.com/p/C5R6qcgy1_4/",
  ],
  "eternal-castle": [
    "https://www.instagram.com/p/Cm3RuR9yI_h/",
    "https://www.instagram.com/p/CnyDPyUPWMF/",
  ],
  tait: [
    "https://www.instagram.com/p/BCoroBzBlc4/",
    "https://www.instagram.com/p/DWSa1ZNAKbU/",
    "https://www.instagram.com/p/fBGub/",
  ],
  "tree-house": [
    "https://www.instagram.com/p/B1WcALvnYd3/",
    "https://www.instagram.com/p/DXLvqLAmY19/",
    "https://www.instagram.com/p/DFfoE8avME5/",
  ],
  julius: [
    "https://www.instagram.com/p/DdbRz6-DlwQ/",
    "https://www.instagram.com/p/Dbaj3x8CGcR/",
    "https://www.instagram.com/p/DZuYu7iFAbX/",
  ],
};

// 卡片內的分類資訊小框（同中西區頁）
const sections: Record<
  string,
  { title: string; intro?: string; items: { label: string; text: string }[] }[]
> = {
  "anping-fort": [
    {
      title: "🎫 參觀資訊",
      items: [
        {
          label: "如何前往",
          text: "從台南火車站出發，可搭乘台南市區公車（如 2路 或 台灣好行 99安平台江線）直達安平古堡站。若從市區搭乘計程車，車程約 20 分鐘。",
        },
        {
          label: "完美一日遊提案",
          text: "安平古堡緊鄰安平老街。建議早上先到古堡享受避開人潮的清幽，中午直接在老街品嚐蝦捲、蚵仔煎與豆花，下午再步行 10 分鐘到滿是榕樹氣根的安平樹屋探險。",
        },
        {
          label: "門票資訊",
          text: "全票新台幣 70 元，半票 35 元，台南市民憑身分證可免費入場。",
        },
      ],
    },
  ],
  "eternal-castle": [
    {
      title: "🎫 參觀資訊",
      items: [
        { label: "地點", text: "臺南市安平區光州路3號" },
        { label: "電話", text: "06-2951504" },
        {
          label: "門票",
          text: "全票70元，半票35元（臺南市市民憑身分證免費），亦可透過線上旅遊平台（如 KKday）預訂電子票快速入場。",
        },
      ],
    },
  ],
  tait: [
    {
      title: "🎫 旅遊參觀資訊",
      items: [
        { label: "營業時間", text: "週一至週日 08:30 – 17:30。" },
        {
          label: "門票費用",
          text: "全票 70 元、半票 35 元（外縣市學生及 65 歲以上長者）；台南市民憑證件免費。",
        },
      ],
    },
  ],
  "tree-house": [
    {
      title: "🎫 參觀資訊",
      items: [
        { label: "營業時間", text: "每日 08:30 – 17:30" },
        {
          label: "門票費用",
          text: "全票 NT$70、半票 NT$35（台南市民憑身分證免費參觀）",
        },
        {
          label: "線上購票",
          text: "可透過 Klook 安平樹屋門票 或 KKday 線上預訂 購買 9折電子門票，可即買即用掃碼入場。",
        },
        {
          label: "貼心提醒",
          text: "1. 樹屋大樹成蔭，小黑蚊與蚊子較多，強烈建議準備好防蚊液；2. 園區內的「樹屋咖啡」目前僅接受現金支付。",
        },
      ],
    },
  ],
  julius: [
    {
      title: "🏛️ 景點介紹",
      intro:
        "原德商東興洋行是位於臺灣臺南市安平區的一座洋行舊址，原名為「Julius Mannich & CO.」，是直轄市定古蹟、安平五洋行之一。（資料來源：維基百科）",
      items: [
        { label: "地址", text: "708臺南市安平區王城里安北路233巷3號" },
        { label: "電話號碼", text: "06 391 1105" },
      ],
    },
  ],
};

// 每個地點只放在第一個標籤的分類，避免重複出現
const anpingPlaces = places.filter((p) => districtOf(p) === "anping");
const groups = categories
  .map((cat) => ({ cat, items: anpingPlaces.filter((p) => p.tags[0] === cat.id) }))
  .filter((g) => g.items.length > 0);

export default function AnpingPage() {
  return (
    <main className="relative isolate flex-1">
      {/* Page background */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/images/安平古堡.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <section className="px-6 pt-24 pb-24 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm tracking-[0.3em] text-muted">
              ANPING · HARBOR TOWN
            </p>
            <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
              安平區
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground sm:text-xl">
              港邊老城．安平古堡．漁人碼頭
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted">
              四百年前荷蘭人登陸的港口，古堡、洋行、老街和海風都在這裡，一個人從白天逛到夕陽剛剛好。
            </p>
            <Link
              href="/destiny"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              🎡 不知道去哪？交給命運輪盤
              <span aria-hidden>→</span>
            </Link>
          </div>

          <nav aria-label="景點分類" className="mb-12 flex flex-wrap justify-center gap-2 text-sm">
            {groups.map(({ cat, items }) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-border px-4 py-1.5 text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {cat.emoji} {cat.label}（{items.length}）
              </a>
            ))}
          </nav>

          <div className="space-y-16">
            {groups.map(({ cat, items }) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-24">
                <h2 className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground sm:text-3xl">
                  {cat.emoji} {cat.label}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {items.map((place) => {
                    const photo = photoFor(place.id);
                    const posts = instagram[place.id];
                    return (
                      <div
                        key={place.id}
                        className="group overflow-hidden rounded-2xl border border-border bg-background-elevated transition-colors hover:border-accent/40"
                      >
                        {posts ? (
                          <InstagramGrid posts={posts} name={place.name} />
                        ) : photo && (
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={photo}
                              alt={place.name}
                              fill
                              sizes="(min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <span className="text-xs tracking-wide text-accent">
                            {place.goodFor.join("・")}
                          </span>
                          <h3 className="mt-3 font-[family-name:var(--font-serif-tc)] text-xl">
                            <a
                              href={mapsUrl(place.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                            >
                              {place.emoji} {place.name}
                            </a>
                            <span aria-hidden className="ml-1 text-sm text-accent">↗</span>
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-muted">{place.feature}</p>
                          <p className="mt-4 text-xs text-muted/70">⏱ 建議停留 {place.stay}</p>
                          {sections[place.id]?.map((section) => (
                            <div
                              key={section.title}
                              className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-sm leading-7 text-muted"
                            >
                              <p className="mb-2 text-xs tracking-wide text-accent">{section.title}</p>
                              {section.intro && <p className="mb-2">{section.intro}</p>}
                              <ul className="space-y-2">
                                {section.items.map((item) => (
                                  <li key={item.label}>
                                    <span className="text-foreground">{item.label}：</span>
                                    {item.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {posts && (
                            <p className="mt-4 text-xs text-muted/70">
                              本區照片顯示介接 Instagram，照片著作權屬拍攝者所有
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
