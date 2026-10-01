import { districtOf, km, placeById, places, type Place } from "@/lib/anping-roulette";

export type MoodId =
  | "sea"
  | "food"
  | "cafe"
  | "photo"
  | "walk"
  | "heritage"
  | "relax"
  | "random";

export type Mood = { id: MoodId; emoji: string; label: string };

export const moods: Mood[] = [
  { id: "sea", emoji: "🌊", label: "看海" },
  { id: "food", emoji: "🍜", label: "吃美食" },
  { id: "cafe", emoji: "☕", label: "喝咖啡" },
  { id: "photo", emoji: "📸", label: "拍照" },
  { id: "walk", emoji: "🚶", label: "散步" },
  { id: "heritage", emoji: "🏛", label: "看古蹟" },
  { id: "relax", emoji: "😌", label: "放空" },
  { id: "random", emoji: "🎲", label: "隨便走走" },
];

export const MAX_MOODS = 2;

export const timeOptions = [
  { minutes: 30, label: "30分鐘" },
  { minutes: 60, label: "1小時" },
  { minutes: 120, label: "2小時" },
  { minutes: 180, label: "3小時" },
  { minutes: 240, label: "半天" },
  { minutes: 480, label: "一天" },
];

export const budgetOptions = [
  { amount: 300, label: "$300以下" },
  { amount: 500, label: "$500" },
  { amount: 800, label: "$800" },
  { amount: Infinity, label: "$1,000+" },
];

// 站與站之間的步行／移動時間（分鐘）
export const TRAVEL_MIN = 10;

// 每人約略花費（門票＋一份餐點），0 代表免費
const costs: Record<string, number> = {
  "anping-fort": 70,
  "eternal-castle": 70,
  tait: 70,
  "tree-house": 70,
  haishan: 120,
  zhu: 150,
  "old-street": 100,
  deyang: 60,
  yuu: 100,
  "fish-market": 400,
  niuyuan: 500,
  qingping: 450,
  chou: 150,
  chen: 120,
  tongji: 60,
  wang: 120,
  "oyster-omelette": 80,
  "shrimp-cracker": 100,
  lin: 150,
  wenzhang: 150,
  kingfish: 70,
  chihkan: 70,
  confucius: 40,
  hayashi: 200,
  zhengxing: 100,
  guohua: 150,
  kokiyo: 90,
  taicheng: 200,
  brian: 70,
};

// 抽到時的一句話
const whispers: Record<string, string> = {
  "anping-fort": "爬上瞭望台，四百年的風會替你把煩惱吹散。",
  "eternal-castle": "護城河邊的草地很大，今天就在砲台旁慢慢走。",
  tait: "推開洋樓的白色木門，聽聽一百多年前的貿易故事。",
  "tree-house": "讓老榕樹的氣根陪你安靜一會兒，時間在這裡走得很慢。",
  julius: "紅磚拱廊下的光影很好看，記得抬頭看看百葉窗。",
  "small-fort": "小小的砲台守著海口很多年了，去跟它打聲招呼吧。",
  haishan: "在清代老屋的院子裡坐一下，喝杯東西再出發。",
  tianhou: "去跟媽祖說聲你好，接下來的旅程會更順利。",
  zhu: "在書法家的老宿舍裡，找一個角落放空。",
  "oyster-kiln": "原來蚵殼也能燒成白灰，安平人的智慧藏在這裡。",
  "sword-lion": "找找看哪一隻劍獅最像今天的你。",
  "old-street": "台灣第一街，邊走邊吃就對了。",
  "fishermans-wharf": "沿著港邊走一走，等燈一盞盞亮起來。",
  "big-fish": "去跟大魚合照，讓牠把好運遞給你。",
  sunset: "今天最後一抹橘色，留給台灣海峽。",
  linmoniang: "找塊草地坐下，海風會自己來找你。",
  canal: "沿著運河慢慢走，傍晚的水面會變成金色。",
  yuguang: "今天不用趕行程，去吹吹海風吧。",
  "harbor-park": "看船進港、看船出港，什麼都不用想。",
  deyang: "登上真正的軍艦，當一回艦長。",
  yuu: "來一支鹽冰淇淋，順便找找你的生日鹽。",
  "fish-market": "挑幾樣現撈海鮮，一個人也能吃得很豐盛。",
  niuyuan: "一個人吃火鍋，是對自己最溫柔的款待。",
  qingping: "點兩道現炒海產，好好吃一頓安平的味道。",
  chou: "酥脆的蝦捲，是安平給你的見面禮。",
  chen: "咬下第一口蚵捲，就懂安平人為什麼吃了幾十年。",
  tongji: "走累了嗎？來一碗綿密的豆花。",
  wang: "一碗魚皮湯，是台南人最日常的幸福。",
  "oyster-omelette": "看老闆現煎一盤蚵仔煎，熱熱的最好吃。",
  "shrimp-cracker": "邊走邊咬蝦餅，喀滋喀滋是旅行的聲音。",
  lin: "挑幾包百年蜜餞，把安平的甜帶回家。",
  wenzhang: "一碗現切牛肉湯，暖胃也暖心。",
  kingfish: "一大碗熱呼呼的鍋燒意麵，在地人的私房好味道。",
  shennong: "等紅燈籠亮起來，老街會換上另一種表情。",
  chihkan: "在老榕樹下抬頭看飛簷，三百多年的故事都在這裡。",
  confucius: "找張長椅坐下，讓全臺首學的安靜陪你一會兒。",
  fuzhong: "逛逛巷口的手作小攤，帶一件小東西回家。",
  hayashi: "搭上老電梯到頂樓，看看神社遺跡和台南的天空。",
  zhengxing: "隨便晃進一間小店，也許會遇到巷弄裡的貓。",
  guohua: "空著肚子來，一攤接一攤慢慢吃。",
  "kanxi-church": "繞進巷子找找那座白色圓頂，安靜地待一下。",
  kokiyo: "一支限定口味的霜淇淋，今天的小確幸。",
  taicheng: "一碗滿滿的哈密瓜冰，夏天就該這樣吃。",
  brian: "來一杯特調紅茶，邊走邊喝最台南。",
};

// 適合放空的地方：人少、能坐、能發呆
const relaxIds = new Set([
  "yuguang",
  "linmoniang",
  "sunset",
  "canal",
  "harbor-park",
  "tree-house",
  "zhu",
  "haishan",
  "yuu",
  "tongji",
  "confucius",
]);

export const costOf = (id: string) => costs[id] ?? 0;
export const whisperOf = (id: string) => whispers[id] ?? "";

/** 由「40～60 分鐘」「1～2 小時」取中間值，進位到 5 分鐘。 */
export function minutesOf(place: Place) {
  const m = place.stay.match(/(\d+)～(\d+)\s*(分鐘|小時)/);
  if (!m) return 30;
  const unit = m[3] === "小時" ? 60 : 1;
  const mid = ((Number(m[1]) + Number(m[2])) / 2) * unit;
  return Math.ceil(mid / 5) * 5;
}

export const journeyMinutes = (ids: string[]) =>
  ids.reduce((sum, id) => sum + minutesOf(placeById(id)), 0) +
  TRAVEL_MIN * Math.max(0, ids.length - 1);

export const journeyCost = (ids: string[]) =>
  ids.reduce((sum, id) => sum + costOf(id), 0);

type Kind = "food" | "cafe" | "spot";

function kindOf(place: Place): Kind {
  if (place.tags.includes("snack") || place.tags.includes("restaurant")) return "food";
  if (place.tags.includes("cafe")) return "cafe";
  return "spot";
}

/** 行程時間軸上每一站的小圖示 */
export function stopEmoji(place: Place) {
  const kind = kindOf(place);
  if (kind === "food") return "🍜";
  if (kind === "cafe") return "☕";
  if (place.goodFor.includes("夕陽")) return "🌅";
  if (place.tags.includes("sea")) return "🌊";
  return "🎯";
}

function matchesMood(place: Place, mood: MoodId) {
  switch (mood) {
    case "sea":
      return place.tags.includes("sea");
    case "food":
      return kindOf(place) === "food";
    case "cafe":
      return place.tags.includes("cafe");
    case "photo":
      return place.tags.includes("photo");
    case "walk":
      return place.tags.includes("walk");
    case "heritage":
      return place.tags.includes("heritage");
    case "relax":
      return relaxIds.has(place.id);
    case "random":
      return true;
  }
}

const WHEEL_MAX = 8;

/**
 * 抽出下一站可以上輪盤的地點：符合心情、還塞得進剩下的時間與預算、沒去過。
 * 盡量和上一站不同類型（吃完就去走走），最多 8 個。
 */
export function drawCandidates({
  visited,
  moodIds,
  minutes,
  budget,
  districts,
}: {
  visited: string[];
  moodIds: MoodId[];
  minutes: number;
  budget: number;
  districts: DistrictId[];
}): string[] {
  const minutesLeft = minutes - journeyMinutes(visited);
  const budgetLeft = budget - journeyCost(visited);
  const travel = visited.length ? TRAVEL_MIN : 0;

  const pool = places.filter(
    (p) =>
      !visited.includes(p.id) &&
      districts.includes(districtOf(p)) &&
      (moodIds.length === 0 || moodIds.some((m) => matchesMood(p, m))) &&
      minutesOf(p) + travel <= minutesLeft &&
      costOf(p.id) <= budgetLeft,
  );

  const last = visited.length ? kindOf(placeById(visited[visited.length - 1])) : null;
  const varied = pool.filter((p) => kindOf(p) !== last);
  const picks = varied.length ? varied : pool;

  const shuffled = [...picks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, WHEEL_MAX).map((p) => p.id);
}

export type TransportId = "walk" | "youbike" | "bus" | "lrt" | "mrt" | "taxi" | "scooter";

// speed：平均時速（公里）；wait：等車、借還車、找停車位的固定時間（分鐘）
export const transports: { id: TransportId; emoji: string; label: string; speed: number; wait: number }[] = [
  { id: "walk", emoji: "🚶", label: "徒步", speed: 4.5, wait: 0 },
  { id: "youbike", emoji: "🚲", label: "YouBike", speed: 12, wait: 5 },
  { id: "bus", emoji: "🚌", label: "公車", speed: 15, wait: 12 },
  { id: "lrt", emoji: "🚊", label: "輕軌", speed: 20, wait: 10 },
  { id: "mrt", emoji: "🚇", label: "捷運", speed: 30, wait: 10 },
  { id: "taxi", emoji: "🚕", label: "Uber計程車", speed: 25, wait: 5 },
  { id: "scooter", emoji: "🛵", label: "機車", speed: 25, wait: 5 },
];

export const transportById = (id: TransportId) => transports.find((t) => t.id === id)!;

// 直線距離換算成實際路程的係數
const ROAD_FACTOR = 1.3;

/** 兩站之間的移動時間（分鐘），進位到 5 分鐘、至少 5 分鐘 */
export function legMinutes(from: string, to: string, mode: TransportId) {
  const { speed, wait } = transportById(mode);
  const raw = (km(from, to) * ROAD_FACTOR * 60) / speed + wait;
  return Math.max(5, Math.ceil(raw / 5) * 5);
}

// 開始時間下拉選單：06:00～22:00，每 30 分鐘一格（以當天分鐘數表示）
export const startTimeOptions = Array.from({ length: 33 }, (_, i) => 360 + i * 30);
export const DEFAULT_START = 540;

export const clockOf = (total: number) => {
  const m = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** 依開始時間與交通方式排出每站的抵達、離開時間 */
export function schedule(ids: string[], start: number, mode: TransportId) {
  let clock = start;
  return ids.map((id, i) => {
    const leg = i === 0 ? 0 : legMinutes(ids[i - 1], id, mode);
    const arrive = clock + leg;
    const stay = minutesOf(placeById(id));
    clock = arrive + stay;
    return { id, leg, arrive, stay, leave: clock };
  });
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} 分鐘`;
  return m ? `${h} 小時 ${m} 分` : `${h} 小時`;
}

export function budgetLabel(amount: number) {
  return (
    budgetOptions.find((b) => b.amount === amount)?.label ??
    `$${amount.toLocaleString()}`
  );
}

export function timeLabel(minutes: number) {
  return timeOptions.find((t) => t.minutes === minutes)?.label ?? formatMinutes(minutes);
}

export type DistrictId = "anping" | "west-central" | "north" | "east" | "south" | "yongkang";

// 命運輪盤第一步先勾選要探索的區域
export const districts: { id: DistrictId; label: string; emoji: string }[] = [
  { id: "anping", label: "安平區", emoji: "🏰" },
  { id: "west-central", label: "中西區", emoji: "🏮" },
  { id: "north", label: "北區", emoji: "🏘️" },
  { id: "east", label: "東區", emoji: "🌳" },
  { id: "south", label: "南區", emoji: "🌾" },
  { id: "yongkang", label: "永康區", emoji: "🍜" },
];

export const DEFAULT_DISTRICTS: DistrictId[] = ["anping", "west-central"];

export const districtById = (id: DistrictId) => districts.find((d) => d.id === id)!;
