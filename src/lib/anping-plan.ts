export type SpotCategory =
  | "heritage"
  | "sea"
  | "nature"
  | "cafe"
  | "food"
  | "photo"
  | "art"
  | "shopping";

export type PlanSpot = {
  name: string;
  categories: SpotCategory[];
  // Suggested visit length in minutes.
  minutes: number;
  desc: string;
  // Rough walking order across Anping, used by the fallback planner to keep
  // neighbouring stops together.
  order: number;
  // Best around sunset or after dark, so it goes at the end of the day.
  evening?: boolean;
};

export const categories: { id: SpotCategory; icon: string; label: string }[] = [
  { id: "heritage", icon: "🏛️", label: "古蹟" },
  { id: "sea", icon: "🌊", label: "海邊" },
  { id: "nature", icon: "🌾", label: "自然" },
  { id: "cafe", icon: "☕", label: "咖啡" },
  { id: "food", icon: "🍜", label: "美食" },
  { id: "photo", icon: "📷", label: "拍照" },
  { id: "art", icon: "🎨", label: "藝文" },
  { id: "shopping", icon: "🛍️", label: "商圈" },
];

export const planSpots: PlanSpot[] = [
  { name: "朱玖瑩故居（因鹽玖定）", categories: ["cafe", "art"], minutes: 30, order: 0, desc: "書法家老宿舍，安靜好坐" },
  { name: "英商德記洋行", categories: ["heritage"], minutes: 30, order: 1, desc: "白色洋樓，台灣開拓史料蠟像館" },
  { name: "安平樹屋", categories: ["nature", "photo"], minutes: 45, order: 2, desc: "榕樹氣根包覆的老倉庫" },
  { name: "安平古堡", categories: ["heritage", "photo"], minutes: 60, order: 3, desc: "荷蘭時期熱蘭遮城，登瞭望台俯瞰安平" },
  { name: "東興洋行", categories: ["heritage"], minutes: 20, order: 4, desc: "德商紅磚拱廊洋樓" },
  { name: "安平小砲台", categories: ["heritage"], minutes: 15, order: 5, desc: "鴉片戰爭時期的海口砲台" },
  { name: "安平老街（延平街）", categories: ["food", "shopping"], minutes: 60, order: 6, desc: "台灣第一街，小吃伴手禮集中" },
  { name: "海山館", categories: ["heritage", "cafe"], minutes: 30, order: 7, desc: "清代班兵會館，院子裡有咖啡館" },
  { name: "劍獅埕", categories: ["art", "shopping"], minutes: 20, order: 7.5, desc: "認識安平劍獅文化與文創小物" },
  { name: "同記安平豆花", categories: ["food"], minutes: 30, order: 8, desc: "老字號豆花" },
  { name: "開臺天后宮", categories: ["art", "photo"], minutes: 30, order: 9, desc: "開基媽祖廟之一，廟宇彩繪細緻" },
  { name: "周氏蝦捲", categories: ["food"], minutes: 40, order: 10, desc: "安平代表小吃蝦捲" },
  { name: "億載金城", categories: ["heritage", "nature"], minutes: 60, order: 12, desc: "清末西式砲台，護城河與草坪" },
  { name: "林默娘公園", categories: ["sea", "nature"], minutes: 30, order: 13, desc: "運河出海口的海濱公園" },
  { name: "觀夕平台", categories: ["sea", "photo"], minutes: 30, order: 11, desc: "海邊看夕陽的開闊平台", evening: true },
  { name: "漁光島", categories: ["sea", "nature", "photo"], minutes: 60, order: 17, desc: "木麻黃林與沙灘，安靜的海邊" },
  { name: "夕遊出張所", categories: ["cafe", "shopping"], minutes: 40, order: 15, desc: "日治鹽務辦公室，鹽冰淇淋與伴手禮" },
  { name: "安平運河", categories: ["photo"], minutes: 40, order: 14, desc: "堤岸看夕陽的經典角度", evening: true },
  { name: "安平漁人碼頭", categories: ["sea", "photo"], minutes: 60, order: 16, desc: "大魚的祝福、夜晚點燈", evening: true },
];

export const paces = [
  { id: "easy", icon: "🐢", label: "輕鬆", desc: "少排幾站，走走停停", factor: 1.3, hours: 4 },
  { id: "normal", icon: "🚶", label: "普通", desc: "半天到一天的舒服節奏", factor: 1, hours: 6 },
  { id: "full", icon: "🏃", label: "充實", desc: "從早到晚能看就看", factor: 0.8, hours: 9 },
] as const;

export type Preferences = {
  categories: SpotCategory[];
  pace: (typeof paces)[number]["id"];
};

export type PlanItem = { time: string; place: string; minutes: number; note: string };
export type Plan = {
  title: string;
  summary: string;
  items: PlanItem[];
  tips: string[];
  source: "ai" | "fallback";
};

export const spotsFor = (cats: SpotCategory[]) =>
  planSpots.filter((s) => s.categories.some((c) => cats.includes(c)));

/** Start time: long days start in the morning, shorter ones after lunch. */
export const startTimeFor = (pace: Preferences["pace"]) =>
  pace === "full" ? "09:00" : "13:00";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** Rule-based itinerary used when the AI service is unavailable. */
export function fallbackPlan(prefs: Preferences): Plan {
  const pace = paces.find((p) => p.id === prefs.pace)!;
  const spots = spotsFor(prefs.categories);
  const start = toMinutes(startTimeFor(prefs.pace));
  const end = start + pace.hours * 60;
  const travel = 15;

  // Keep sunset/night spots for the end of the day.
  const sorted = [...spots].sort(
    (a, b) => Number(!!a.evening) - Number(!!b.evening) || a.order - b.order,
  );

  const items: PlanItem[] = [];
  let t = start;
  for (const spot of sorted) {
    const stay = Math.round((spot.minutes * pace.factor) / 5) * 5;
    if (t + stay > end) continue;
    items.push({ time: toHHMM(t), place: spot.name, minutes: stay, note: spot.desc });
    t += stay + travel;
  }

  const labels = categories
    .filter((c) => prefs.categories.includes(c.id))
    .map((c) => c.label)
    .join("、");
  return {
    title: "安平獨旅散策",
    summary: `以${labels}為主，${pace.label}的節奏，從 ${startTimeFor(prefs.pace)} 出發串起 ${items.length} 個地點。`,
    items,
    tips: [
      ...(items.length < spots.length
        ? [`時間有限，有 ${spots.length - items.length} 個地點沒排進去，想多看可以改成「充實」。`]
        : []),
      "安平古堡、樹屋等景點大多 17:30 左右關門，出發前再確認開放時間。",
    ],
    source: "fallback",
  };
}
