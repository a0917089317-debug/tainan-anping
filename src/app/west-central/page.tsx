import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstagramGrid } from "@/components/instagram-grid";

export const metadata: Metadata = {
  title: "中西區 | 台南獨旅",
};

// 圖片區塊最多擇一：image 為專案內照片；instagram 為 IG 貼文格子（圖片經 /api/instagram 向 IG 取得）
const spots: ({
  tag: string;
  name: string;
  desc: string;
  // 營業時間說明：intro 為開頭說明，items 為各類店家時段
  hours?: { intro: string; items: { label: string; text: string }[] };
  // 分類推薦清單（如美食、文創景點），每區一個小框
  sections?: { title: string; intro?: string; items: { label: string; text: string }[] }[];
  // 順路一站：卡片內的小格子
  nearby?: { tag: string; name: string; desc: string };
} & (
  | { image: string; instagram?: never }
  | { image?: never; instagram: string[] }
  | { image?: never; instagram?: never }
))[] = [
  {
    tag: "歷史街區",
    name: "神農街",
    desc: "台南最老的街道之一，兩側老屋掛著燈籠與招牌，白天寧靜、入夜氛圍更迷人，很適合一個人放慢腳步拍照。",
    instagram: [
      "https://www.instagram.com/p/B8OHLhvgf0o/",
      "https://www.instagram.com/p/CTD1ndBlAZX/",
      "https://www.instagram.com/p/BHRUNubjTHz/",
    ],
    hours: {
      intro:
        "台南神農街本身為開放式戶外老街，全天候 24 小時免費開放，沒有管制進出時間。不過，街區內的個別店家、咖啡廳與餐酒館則有各自的營業時間：",
      items: [
        {
          label: "多數文創小舖與選物店",
          text: "約於中午或下午（11:00 至 13:00 之間）陸續開門，營業至晚間 20:00 或 22:00 左右。",
        },
        {
          label: "餐酒館與酒吧",
          text: "多於傍晚 17:30 或 18:00 後營業至深夜（凌晨 01:00 至 02:00）。",
        },
        {
          label: "最佳造訪時間",
          text: "建議於傍晚 17:00 至晚間 22:00 之間前往，此時紅燈籠會亮起，老街氛圍最具特色。",
        },
      ],
    },
  },
  {
    tag: "百年建築",
    name: "林百貨",
    desc: "台灣第一間百貨公司，頂樓有神社遺跡與展望台，逛一層樓大約半小時，一個人也很自在。",
    instagram: ["https://www.instagram.com/p/DR4mEjBkVUz/"],
    hours: {
      intro: "台南林百貨的營業時間為每日 11:00 – 21:00（星期一至星期日無公休）。",
      items: [
        { label: "地址", text: "臺南市中西區忠義路二段63號" },
        { label: "電話", text: "(06) 221-3000" },
      ],
    },
  },
  {
    tag: "文青選物",
    name: "正興街",
    desc: "咖啡館、獨立選物店與老屋改建的小店聚集地，隨興晃進一間店就是一段小旅程。",
    instagram: [
      "https://www.instagram.com/p/BhOzOsjFKPB/",
      "https://www.instagram.com/p/9QA-AlNdRL/",
      "https://www.instagram.com/p/DSpMRFdiVvS/",
      "https://www.instagram.com/p/DSjT3NYEwnQ/",
    ],
    sections: [
      {
        title: "🍧 經典必訪美食",
        items: [
          {
            label: "蜷尾家甘味處",
            text: "將日式散步霜淇淋引入台南的指標名店，每日提供限量兩款獨特茶香或在地風味口味。",
          },
          {
            label: "泰成水果店",
            text: "創立於1935年的近百年冰品老字號，最著名的為哈密瓜冰碗及浮誇新鮮水果組合。",
          },
          {
            label: "布萊恩紅茶正興總店",
            text: "以特調茶品與嚴選茶葉聞名的在地人氣茶飲。",
          },
          { label: "王家庄狀元粿", text: "傳承古早味的傳統散步甜點。" },
        ],
      },
      {
        title: "🎨 特色文創與景點",
        items: [
          {
            label: "西門淺草新天地",
            text: "鄰近國華街口，聚集許多年輕手作與創意攤商的小型市集。",
          },
          {
            label: "正興貓巷弄",
            text: "61巷與77巷等周邊小弄，藏有老宅改造的獨立選物店、古著店及壁畫驚喜。",
          },
          { label: "荒地", text: "由老空間改造而成的特色聚落與拍照打卡點。" },
        ],
      },
    ],
  },
  {
    tag: "老樹院落",
    name: "孔廟文化園區",
    desc: "全台首學，老榕樹與紅牆巷弄交錯，安靜到可以一個人坐著發呆一下午。",
    instagram: [
      "https://www.instagram.com/p/CYgdfGMPdaT/",
      "https://www.instagram.com/p/CB9zr91DMjS/",
    ],
    sections: [
      {
        title: "🏛️ 園區亮點與特色",
        intro:
          "台南孔廟文化園區結合了三百年歷史的古蹟與充滿文創氣息的孔廟魅力商圈（府中街）。",
        items: [
          {
            label: "全臺首學",
            text: "建於西元1665年（明永曆19年），是臺灣最早的官辦學宮。",
          },
          {
            label: "府中街（莿桐花巷）",
            text: "位於孔廟對面，假日有熱鬧的手作市集，能找到各種文創商品、手作雜貨與在地特色小吃（如炒泡麵、2元黑輪）。",
          },
        ],
      },
    ],
  },
  {
    tag: "國定古蹟",
    name: "赤崁樓",
    desc: "前身是荷蘭人興建的普羅民遮城，如今紅瓦飛簷的文昌閣與海神廟立在老榕樹下，入夜點燈後更有味道。",
    instagram: ["https://www.instagram.com/p/Clc3eOApNqr/"],
    sections: [
      {
        title: "🎫 參觀資訊",
        items: [
          { label: "開放時間", text: "每日 08:30 – 21:00。" },
          {
            label: "門票資訊",
            text: "全票 NT$70（可臨櫃購票，亦可在 Klook 線上訂票 隨買隨用）；台南市民憑身分證免費參觀。",
          },
          {
            label: "貼心叮嚀",
            text: "中西區道路較為狹窄、車流量大，開車極難尋找路邊車位。強烈建議租借機車/Goshare，或從台南火車站搭乘 3路、5路公車 至「赤崁樓站」下車，步行最為輕鬆順暢。",
          },
        ],
      },
    ],
  },
  {
    tag: "小吃老街",
    name: "國華街",
    desc: "台南人從小吃到大的小吃街，永樂市場一帶割包、春捲、小卷米粉一攤接一攤，一個人也能一路吃過去，建議空著肚子來。",
    instagram: [
      "https://www.instagram.com/p/CvACxKsBwhI/",
      "https://www.instagram.com/p/DNr6o965DxD/",
      "https://www.instagram.com/p/DH2QONRJc2D/",
    ],
    sections: [
      {
        title: "🎫 景點資訊（西市場）",
        items: [
          {
            label: "開放時間",
            text: "週六、週日 11:00 – 21:00；週一、週二、週四、週五 11:00 – 20:00；週三休息。",
          },
          { label: "門票資訊", text: "免門票" },
          { label: "地址", text: "臺南市中西區西門路、中正路、正興街與國華街街廓內" },
          { label: "分類", text: "歷史古蹟、在地藝文" },
        ],
      },
    ],
    nearby: {
      tag: "順路一站",
      name: "看西街長老教會",
      desc: "1865 年馬雅各醫生在看西街開始醫療傳教，被視為基督教在台宣教的發源地。現在的白色圓頂教堂 1955 年落成，仿倫敦聖保羅大教堂，藏在巷弄裡很好認。",
    },
  },
];

const mapsUrl = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`台南 ${name}`)}`;

export default function WestCentralPage() {
  return (
    <main className="relative isolate flex-1">
      {/* Page background */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <Image
          src="/images/神農街.webp"
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
              WEST CENTRAL · OLD TOWN
            </p>
            <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
              中西區
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground sm:text-xl">
              孔廟．林百貨．老城核心
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted">
              台南最老的城區，古蹟、老街和小店都在走路可到的距離，最適合一個人慢慢晃。
            </p>
            <Link
              href="/destiny"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              🎡 不知道去哪？交給命運輪盤
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {spots.map((spot) => (
              <div
                key={spot.name}
                className="group overflow-hidden rounded-2xl border border-border bg-background-elevated transition-colors hover:border-accent/40"
              >
                {spot.instagram ? (
                  <InstagramGrid posts={spot.instagram} name={spot.name} />
                ) : spot.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <span className="text-xs tracking-wide text-accent">{spot.tag}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-serif-tc)] text-xl">
                    <a
                      href={mapsUrl(spot.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                    >
                      {spot.name}
                    </a>
                    <span aria-hidden className="ml-1 text-sm text-accent">↗</span>
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{spot.desc}</p>
                  {spot.hours && (
                    <div className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-sm leading-7 text-muted">
                      <p className="mb-2 text-xs tracking-wide text-accent">🕒 開放與營業時間</p>
                      <p>{spot.hours.intro}</p>
                      <ul className="mt-2 space-y-2">
                        {spot.hours.items.map((item) => (
                          <li key={item.label}>
                            <span className="text-foreground">{item.label}：</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {spot.sections?.map((section) => (
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
                  {spot.nearby && (
                    <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                      <div>
                        <span className="text-xs tracking-wide text-accent">{spot.nearby.tag}</span>
                        <h4 className="mt-1 font-[family-name:var(--font-serif-tc)] text-base">
                          <a
                            href={mapsUrl(spot.nearby.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                          >
                            {spot.nearby.name}
                          </a>
                          <span aria-hidden className="ml-1 text-xs text-accent">↗</span>
                        </h4>
                        <p className="mt-1 text-xs leading-6 text-muted">{spot.nearby.desc}</p>
                      </div>
                    </div>
                  )}
                  {spot.instagram && (
                    <p className="mt-4 text-xs text-muted/70">
                      本區內容由 Instagram 公開貼文嵌入顯示，照片著作權歸原著作權人所有，本站不主張相關照片之著作權。
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
