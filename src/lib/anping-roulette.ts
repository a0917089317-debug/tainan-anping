import type { DistrictId } from "@/lib/destiny-journey";

export type CategoryId =
  | "heritage"
  | "sea"
  | "snack"
  | "restaurant"
  | "cafe"
  | "photo"
  | "walk"
  | "local";

export type Category = { id: CategoryId; emoji: string; label: string };

export type Place = {
  id: string;
  name: string;
  emoji: string;
  feature: string;
  stay: string;
  goodFor: string[];
  // 建議的下一站（Place id）
  next: string;
  tags: CategoryId[];
  // 沒寫就是安平區
  district?: DistrictId;
};

// 小吃輪盤抽的是「品項」，再從品項推薦店家
export type Dish = { id: string; name: string; emoji: string; shops: string[] };

export const categories: Category[] = [
  { id: "heritage", emoji: "🏛️", label: "古蹟" },
  { id: "sea", emoji: "🌊", label: "海景" },
  { id: "snack", emoji: "🍜", label: "小吃" },
  { id: "restaurant", emoji: "🍽️", label: "餐廳" },
  { id: "cafe", emoji: "☕", label: "咖啡" },
  { id: "photo", emoji: "📸", label: "拍照" },
  { id: "walk", emoji: "🚶", label: "散步" },
  { id: "local", emoji: "🎁", label: "在地特色" },
];

export const places: Place[] = [
  {
    id: "anping-fort",
    name: "安平古堡",
    emoji: "🏰",
    feature: "1624 年荷蘭人興建的熱蘭遮城遺址，登上瞭望台能俯瞰整個安平",
    stay: "40～60 分鐘",
    goodFor: ["歷史", "拍照"],
    next: "old-street",
    tags: ["heritage", "photo"],
  },
  {
    id: "eternal-castle",
    name: "億載金城",
    emoji: "🛡️",
    feature: "清末沈葆楨奏建的西式砲台，護城河環繞、城內草坪開闊",
    stay: "40～60 分鐘",
    goodFor: ["歷史", "散步"],
    next: "yuguang",
    tags: ["heritage", "photo", "walk"],
  },
  {
    id: "tait",
    name: "英商德記洋行",
    emoji: "🏛️",
    feature: "清末英商洋行的白色洋樓，現為台灣開拓史料蠟像館",
    stay: "20～30 分鐘",
    goodFor: ["歷史"],
    next: "tree-house",
    tags: ["heritage"],
  },
  {
    id: "tree-house",
    name: "安平樹屋",
    emoji: "🌳",
    feature: "老榕樹氣根層層包覆百年倉庫，樹與屋融為一體",
    stay: "40～60 分鐘",
    goodFor: ["拍照", "歷史"],
    next: "anping-fort",
    tags: ["heritage", "photo"],
  },
  {
    id: "julius",
    name: "東興洋行",
    emoji: "🏘️",
    feature: "清末德商洋行，紅磚拱廊配木造百葉窗，異國風情濃厚",
    stay: "20～30 分鐘",
    goodFor: ["歷史", "拍照"],
    next: "small-fort",
    tags: ["heritage", "photo"],
  },
  {
    id: "small-fort",
    name: "安平小砲台",
    emoji: "💥",
    feature: "鴉片戰爭時期為防英軍而建的海口砲台，紅磚砲座上仍陳列古砲",
    stay: "15～20 分鐘",
    goodFor: ["歷史"],
    next: "sword-lion",
    tags: ["heritage"],
  },
  {
    id: "haishan",
    name: "海山館",
    emoji: "🏠",
    feature: "清代班兵會館，紅瓦閩式老屋，院子裡有咖啡館可以歇腳",
    stay: "20～40 分鐘",
    goodFor: ["歷史", "咖啡"],
    next: "sword-lion",
    tags: ["heritage", "cafe"],
  },
  {
    id: "tianhou",
    name: "開臺天后宮",
    emoji: "🙏",
    feature: "安平的媽祖信仰中心，廟宇彩繪與木雕細緻",
    stay: "20～30 分鐘",
    goodFor: ["參拜", "在地文化"],
    next: "old-street",
    tags: ["heritage", "local"],
  },
  {
    id: "zhu",
    name: "朱玖瑩故居（因鹽玖定）",
    emoji: "✒️",
    feature: "書法家朱玖瑩主管鹽務時的宿舍，能賞書法，也能安靜坐一下",
    stay: "30～40 分鐘",
    goodFor: ["藝文", "咖啡"],
    next: "yuu",
    tags: ["heritage", "cafe"],
  },
  {
    id: "oyster-kiln",
    name: "安平蚵灰窯文化館",
    emoji: "🐚",
    feature: "認識用蚵殼燒製蚵灰的安平傳統產業",
    stay: "20～30 分鐘",
    goodFor: ["在地文化", "歷史"],
    next: "tree-house",
    tags: ["heritage", "local"],
  },
  {
    id: "sword-lion",
    name: "劍獅埕",
    emoji: "🦁",
    feature: "安平特有的劍獅辟邪文化，彩繪劍獅牆與文創小物",
    stay: "15～30 分鐘",
    goodFor: ["拍照", "在地文化"],
    next: "haishan",
    tags: ["photo", "local"],
  },
  {
    id: "old-street",
    name: "安平老街（延平街）",
    emoji: "🏮",
    feature: "號稱台灣第一街，蜜餞、蝦餅、劍獅紀念品與小吃隨走隨逛",
    stay: "40～60 分鐘",
    goodFor: ["散步", "小吃"],
    next: "tianhou",
    tags: ["walk", "local"],
  },
  {
    id: "fishermans-wharf",
    name: "安平漁人碼頭",
    emoji: "⚓",
    feature: "港邊步道開闊，入夜點燈後很適合散步收尾",
    stay: "30～60 分鐘",
    goodFor: ["散步", "夜景"],
    next: "big-fish",
    tags: ["sea", "walk"],
  },
  {
    id: "big-fish",
    name: "大魚的祝福",
    emoji: "🐋",
    feature: "漁人碼頭岸邊的巨型鯨魚裝置藝術，藍天大海當背景超出片",
    stay: "15～20 分鐘",
    goodFor: ["拍照"],
    next: "fishermans-wharf",
    tags: ["sea", "photo"],
  },
  {
    id: "sunset",
    name: "觀夕平台",
    emoji: "🌅",
    feature: "面向台灣海峽的開闊平台，看夕陽的首選",
    stay: "20～40 分鐘",
    goodFor: ["夕陽", "拍照"],
    next: "linmoniang",
    tags: ["sea", "photo"],
  },
  {
    id: "linmoniang",
    name: "林默娘公園",
    emoji: "🌿",
    feature: "運河出海口旁的大草地，海風舒服、適合野餐",
    stay: "30～45 分鐘",
    goodFor: ["散步", "野餐"],
    next: "sunset",
    tags: ["sea", "walk"],
  },
  {
    id: "canal",
    name: "安平運河",
    emoji: "🚤",
    feature: "堤岸步道沿著運河延伸，傍晚看夕陽很經典",
    stay: "30～60 分鐘",
    goodFor: ["散步", "夕陽"],
    next: "yuu",
    tags: ["sea", "walk", "photo"],
  },
  {
    id: "yuguang",
    name: "漁光島",
    emoji: "🏖️",
    feature: "木麻黃林與沙灘，人少安靜的海邊",
    stay: "1～2 小時",
    goodFor: ["海邊", "散步", "拍照"],
    next: "eternal-castle",
    tags: ["sea", "walk", "photo"],
  },
  {
    id: "harbor-park",
    name: "安平港濱歷史公園",
    emoji: "🌊",
    feature: "港邊綠地與步道，看船隻進出安平港",
    stay: "30～45 分鐘",
    goodFor: ["散步", "看海"],
    next: "fishermans-wharf",
    tags: ["sea", "walk"],
  },
  {
    id: "deyang",
    name: "德陽艦園區",
    emoji: "🚢",
    feature: "退役驅逐艦改成的軍艦博物館，可以登艦參觀",
    stay: "40～60 分鐘",
    goodFor: ["軍事", "親子"],
    next: "sunset",
    tags: ["sea", "local"],
  },
  {
    id: "yuu",
    name: "夕遊出張所",
    emoji: "🧂",
    feature: "日治時期鹽務辦公室改建，鹽冰淇淋與生日鹽伴手禮",
    stay: "30～40 分鐘",
    goodFor: ["咖啡", "伴手禮", "拍照"],
    next: "canal",
    tags: ["cafe", "local", "photo"],
  },
  {
    id: "fish-market",
    name: "安平觀光魚市",
    emoji: "🐟",
    feature: "現撈海鮮攤位集中，可以代客料理",
    stay: "40～60 分鐘",
    goodFor: ["海鮮"],
    next: "fishermans-wharf",
    tags: ["restaurant", "local"],
  },
  {
    id: "niuyuan",
    name: "牛園火鍋 安平店",
    emoji: "🍲",
    feature: "中式庭園風格的火鍋店，肉盤海鮮豐盛，一個人也能自在吃",
    stay: "60～90 分鐘",
    goodFor: ["正餐", "火鍋"],
    next: "fishermans-wharf",
    tags: ["restaurant"],
  },
  {
    id: "qingping",
    name: "慶平海產",
    emoji: "🦀",
    feature: "安平在地的台式海產餐廳，現點現炒的海鮮合菜",
    stay: "60～90 分鐘",
    goodFor: ["海鮮", "正餐"],
    next: "canal",
    tags: ["restaurant"],
  },
  {
    id: "chou",
    name: "周氏蝦捲",
    emoji: "🍤",
    feature: "安平代表小吃，招牌蝦捲外酥內鮮",
    stay: "30～40 分鐘",
    goodFor: ["小吃"],
    next: "canal",
    tags: ["snack", "restaurant"],
  },
  {
    id: "chen",
    name: "陳家蚵捲",
    emoji: "🦪",
    feature: "鮮蚵包進豆皮炸得酥脆，安平在地老味道",
    stay: "20～30 分鐘",
    goodFor: ["小吃"],
    next: "old-street",
    tags: ["snack"],
  },
  {
    id: "tongji",
    name: "同記安平豆花",
    emoji: "🍮",
    feature: "老字號豆花，口感綿密，逛累了來一碗剛好",
    stay: "15～20 分鐘",
    goodFor: ["甜點"],
    next: "tianhou",
    tags: ["snack"],
  },
  {
    id: "wang",
    name: "王氏魚皮",
    emoji: "🐟",
    feature: "虱目魚皮湯與魚肚，台南人的早午餐",
    stay: "20～30 分鐘",
    goodFor: ["小吃", "早午餐"],
    next: "anping-fort",
    tags: ["snack"],
  },
  {
    id: "oyster-omelette",
    name: "安平老街蚵仔煎",
    emoji: "🍳",
    feature: "老街上的蚵仔煎攤，現煎現吃",
    stay: "15～20 分鐘",
    goodFor: ["小吃"],
    next: "old-street",
    tags: ["snack"],
  },
  {
    id: "shrimp-cracker",
    name: "安平老街蝦餅",
    emoji: "🦐",
    feature: "現炸蝦餅香脆，邊走邊吃也能帶回家",
    stay: "10～15 分鐘",
    goodFor: ["小吃", "伴手禮"],
    next: "old-street",
    tags: ["snack", "local"],
  },
  {
    id: "lin",
    name: "林永泰興蜜餞",
    emoji: "🍬",
    feature: "百年蜜餞老舖，古早味伴手禮",
    stay: "10～20 分鐘",
    goodFor: ["伴手禮"],
    next: "anping-fort",
    tags: ["local"],
  },
  {
    id: "wenzhang",
    name: "文章牛肉湯",
    emoji: "🥩",
    feature: "現切溫體牛肉湯，台南人的早餐儀式",
    stay: "20～30 分鐘",
    goodFor: ["小吃", "早餐"],
    next: "canal",
    tags: ["snack", "restaurant"],
  },
  {
    id: "kingfish",
    name: "金魚京鍋燒意麵",
    emoji: "🍲",
    feature: "安北路上的在地人口袋名單，料多湯鮮的一大碗鍋燒意麵",
    stay: "20～30 分鐘",
    goodFor: ["小吃", "正餐"],
    next: "yuu",
    tags: ["snack"],
  },
  // —— 中西區 ——
  {
    id: "shennong",
    name: "神農街",
    emoji: "🏮",
    feature: "台南最老的街道之一，老屋掛滿燈籠，傍晚點燈後最有味道",
    stay: "40～60 分鐘",
    goodFor: ["拍照", "散步"],
    next: "kanxi-church",
    tags: ["walk", "photo", "local"],
    district: "west-central",
  },
  {
    id: "chihkan",
    name: "赤崁樓",
    emoji: "🏯",
    feature: "荷蘭人興建的普羅民遮城遺址，紅瓦飛簷立在老榕樹下",
    stay: "30～40 分鐘",
    goodFor: ["歷史", "拍照"],
    next: "shennong",
    tags: ["heritage", "photo"],
    district: "west-central",
  },
  {
    id: "confucius",
    name: "孔廟文化園區",
    emoji: "🏛️",
    feature: "全臺首學，老榕樹與紅牆巷弄交錯，安靜得可以坐著發呆",
    stay: "40～60 分鐘",
    goodFor: ["歷史", "散步"],
    next: "fuzhong",
    tags: ["heritage", "walk"],
    district: "west-central",
  },
  {
    id: "fuzhong",
    name: "府中街",
    emoji: "🌸",
    feature: "孔廟對面的莿桐花巷，假日有手作市集和在地小吃",
    stay: "20～30 分鐘",
    goodFor: ["散步", "逛市集"],
    next: "hayashi",
    tags: ["walk", "local"],
    district: "west-central",
  },
  {
    id: "hayashi",
    name: "林百貨",
    emoji: "🏬",
    feature: "台灣第一間百貨公司，頂樓有神社遺跡與展望台",
    stay: "40～60 分鐘",
    goodFor: ["歷史", "拍照", "伴手禮"],
    next: "zhengxing",
    tags: ["heritage", "photo", "local"],
    district: "west-central",
  },
  {
    id: "zhengxing",
    name: "正興街",
    emoji: "🐈",
    feature: "老屋改建的咖啡館、選物店與貓巷弄，隨興晃進一間店就是小旅程",
    stay: "40～60 分鐘",
    goodFor: ["散步", "拍照"],
    next: "kokiyo",
    tags: ["walk", "photo", "local"],
    district: "west-central",
  },
  {
    id: "guohua",
    name: "國華街",
    emoji: "🥟",
    feature: "永樂市場一帶割包、春捲、小卷米粉一攤接一攤",
    stay: "40～60 分鐘",
    goodFor: ["小吃", "散步"],
    next: "zhengxing",
    tags: ["snack", "walk"],
    district: "west-central",
  },
  {
    id: "kanxi-church",
    name: "看西街長老教會",
    emoji: "⛪",
    feature: "仿倫敦聖保羅大教堂的白色圓頂教堂，基督教在台宣教的發源地",
    stay: "20～30 分鐘",
    goodFor: ["歷史", "拍照"],
    next: "guohua",
    tags: ["heritage", "photo"],
    district: "west-central",
  },
  {
    id: "kokiyo",
    name: "蜷尾家甘味處",
    emoji: "🍦",
    feature: "把日式散步霜淇淋帶進台南的名店，每日限量兩款口味",
    stay: "20～30 分鐘",
    goodFor: ["甜點"],
    next: "taicheng",
    tags: ["snack"],
    district: "west-central",
  },
  {
    id: "taicheng",
    name: "泰成水果店",
    emoji: "🍈",
    feature: "1935 年創立的冰品老字號，招牌是哈密瓜冰碗",
    stay: "20～30 分鐘",
    goodFor: ["甜點", "水果"],
    next: "brian",
    tags: ["snack"],
    district: "west-central",
  },
  {
    id: "brian",
    name: "布萊恩紅茶正興總店",
    emoji: "🧋",
    feature: "以特調茶品與嚴選茶葉聞名的在地人氣茶飲",
    stay: "20～30 分鐘",
    goodFor: ["飲料"],
    next: "zhengxing",
    tags: ["cafe"],
    district: "west-central",
  },
];

export const dishes: Dish[] = [
  { id: "shrimp-roll", name: "蝦捲", emoji: "🍤", shops: ["chou"] },
  { id: "oyster-roll", name: "蚵捲", emoji: "🦪", shops: ["chen"] },
  { id: "oyster-omelette", name: "蚵仔煎", emoji: "🍳", shops: ["oyster-omelette"] },
  { id: "douhua", name: "豆花", emoji: "🍮", shops: ["tongji"] },
  { id: "fish-skin", name: "魚皮湯", emoji: "🐟", shops: ["wang"] },
  { id: "beef-soup", name: "牛肉湯", emoji: "🥩", shops: ["wenzhang"] },
  { id: "shrimp-cracker", name: "蝦餅", emoji: "🦐", shops: ["shrimp-cracker"] },
  { id: "candied", name: "蜜餞", emoji: "🍬", shops: ["lin"] },
  { id: "nabeyaki", name: "鍋燒意麵", emoji: "🍲", shops: ["kingfish"] },
  { id: "soft-serve", name: "霜淇淋", emoji: "🍦", shops: ["kokiyo"] },
  { id: "fruit-ice", name: "水果冰", emoji: "🍈", shops: ["taicheng"] },
  { id: "gua-bao", name: "割包", emoji: "🥟", shops: ["guohua"] },
];

export const placeById = (id: string) => places.find((p) => p.id === id)!;

export const districtOf = (place: Place): DistrictId => place.district ?? "anping";

/** 已收錄景點的區域 */
export const districtsWithPlaces = new Set(places.map(districtOf));

/** districts 沒給就是全部區域 */
const inDistricts = (place: Place, districts?: DistrictId[]) =>
  !districts || districts.includes(districtOf(place));

export const placesIn = (cat: CategoryId, districts?: DistrictId[]) =>
  places.filter((p) => p.tags.includes(cat) && inDistricts(p, districts));

export const dishesIn = (districts?: DistrictId[]) =>
  dishes.filter((d) => d.shops.some((id) => inDistricts(placeById(id), districts)));

/** 抽到的品項店家排前面，其餘小吃店當「換一家」的附近推薦。 */
export const recommendationsFor = (dish: Dish, districts?: DistrictId[]) => [
  ...dish.shops,
  ...placesIn("snack", districts)
    .map((p) => p.id)
    .filter((id) => !dish.shops.includes(id)),
];

// 搜尋時加上所在區域，避免搜到同名店家
const areaOf = (name: string) =>
  places.find((p) => p.name === name)?.district === "west-central" ? "台南中西區" : "台南安平";

export const mapsUrl = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${areaOf(name)} ${name}`)}`;

export const googleUrl = (name: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${areaOf(name)} ${name}`)}`;

/** origin 為「緯度,經度」時，會當成路線的第一站 */
export const routeUrl = (names: string[], origin?: string) =>
  `https://www.google.com/maps/dir/${[
    ...(origin ? [origin] : []),
    ...names.map((n) => encodeURIComponent(`${areaOf(n)} ${n}`)),
  ].join("/")}`;

// 各地點的約略座標 [緯度, 經度]，只用來排順路的先後順序
const coords: Record<string, [number, number]> = {
  "anping-fort": [23.0015, 120.1606],
  "eternal-castle": [22.988, 120.16],
  tait: [23.0032, 120.1596],
  "tree-house": [23.0035, 120.159],
  julius: [23.0003, 120.1591],
  "small-fort": [22.999, 120.1553],
  haishan: [22.9998, 120.1585],
  tianhou: [23.002, 120.1618],
  zhu: [22.9975, 120.1608],
  "oyster-kiln": [23.0037, 120.1622],
  "sword-lion": [22.9995, 120.158],
  "old-street": [23.001, 120.162],
  "fishermans-wharf": [22.9955, 120.1545],
  "big-fish": [22.996, 120.1535],
  sunset: [22.9906, 120.153],
  linmoniang: [22.9937, 120.1567],
  canal: [22.995, 120.17],
  yuguang: [22.978, 120.16],
  "harbor-park": [22.996, 120.156],
  deyang: [22.9912, 120.1545],
  yuu: [22.9978, 120.1603],
  "fish-market": [22.998, 120.1545],
  niuyuan: [22.9955, 120.165],
  qingping: [22.991, 120.172],
  chou: [22.9975, 120.178],
  chen: [22.999, 120.1625],
  tongji: [23.0018, 120.164],
  wang: [22.9985, 120.169],
  "oyster-omelette": [23.001, 120.1615],
  "shrimp-cracker": [23.0012, 120.1612],
  lin: [23.0013, 120.1608],
  wenzhang: [22.9975, 120.184],
  kingfish: [22.9985, 120.158],
  shennong: [22.9973, 120.1968],
  chihkan: [22.9975, 120.2025],
  confucius: [22.9905, 120.2045],
  fuzhong: [22.9898, 120.2048],
  hayashi: [22.992, 120.1995],
  zhengxing: [22.9915, 120.1968],
  guohua: [22.9935, 120.1978],
  "kanxi-church": [22.9965, 120.1955],
  kokiyo: [22.9914, 120.1966],
  taicheng: [22.9912, 120.1961],
  brian: [22.9913, 120.197],
};

/** 兩地直線距離（公里） */
function km(a: string, b: string) {
  const [lat1, lng1] = coords[a];
  const [lat2, lng2] = coords[b];
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export const routeKm = (ids: string[]) =>
  ids.slice(1).reduce((sum, id, i) => sum + km(ids[i], id), 0);

/** 排出總距離最短的順序（起點、終點不限）。12 站以內求精確解，更多站用近似解。 */
export function shortestRoute(ids: string[]): string[] {
  const n = ids.length;
  if (n < 3) return ids;
  const d = ids.map((a) => ids.map((b) => km(a, b)));

  if (n <= 12) {
    // Held-Karp：best[mask][j] = 走過 mask 這些點、停在 j 的最短距離
    const full = 1 << n;
    const best = Array.from({ length: full }, () => new Array<number>(n).fill(Infinity));
    const prev = Array.from({ length: full }, () => new Array<number>(n).fill(-1));
    for (let j = 0; j < n; j++) best[1 << j][j] = 0;
    for (let mask = 1; mask < full; mask++) {
      for (let j = 0; j < n; j++) {
        const cur = best[mask][j];
        if (cur === Infinity) continue;
        for (let k = 0; k < n; k++) {
          if (mask & (1 << k)) continue;
          const nextMask = mask | (1 << k);
          if (cur + d[j][k] < best[nextMask][k]) {
            best[nextMask][k] = cur + d[j][k];
            prev[nextMask][k] = j;
          }
        }
      }
    }
    let end = 0;
    for (let j = 1; j < n; j++) if (best[full - 1][j] < best[full - 1][end]) end = j;
    const order: number[] = [];
    for (let mask = full - 1, j = end; j !== -1; ) {
      order.push(j);
      const p = prev[mask][j];
      mask ^= 1 << j;
      j = p;
    }
    return order.reverse().map((i) => ids[i]);
  }

  // 站數多時：每個起點各跑一次最近鄰，再用 2-opt 修短
  const length = (o: number[]) => o.slice(1).reduce((s, x, i) => s + d[o[i]][x], 0);
  let bestOrder: number[] = [];
  let bestLen = Infinity;
  for (let start = 0; start < n; start++) {
    const order = [start];
    const left = new Set(ids.keys());
    left.delete(start);
    while (left.size) {
      const last = order[order.length - 1];
      let pick = -1;
      for (const k of left) if (pick === -1 || d[last][k] < d[last][pick]) pick = k;
      order.push(pick);
      left.delete(pick);
    }
    for (let improved = true; improved; ) {
      improved = false;
      for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          const cand = [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1)];
          if (length(cand) < length(order) - 1e-9) {
            order.splice(0, n, ...cand);
            improved = true;
          }
        }
      }
    }
    const len = length(order);
    if (len < bestLen) {
      bestLen = len;
      bestOrder = order;
    }
  }
  return bestOrder.map((i) => ids[i]);
}

// 有照片的地點（public/images），沒有的就不顯示
const photos: Record<string, string> = {
  "anping-fort": "/images/安平古堡.webp",
  "eternal-castle": "/images/億載金城.webp",
  tait: "/images/英商德記洋行.webp",
  "tree-house": "/images/安平樹屋.jpg",
  julius: "/images/德商東興洋行.webp",
  "small-fort": "/images/安平小砲台.webp",
  haishan: "/images/海山館.webp",
  zhu: "/images/朱玖瑩故居.webp",
  "old-street": "/images/安平老街.webp",
  "fishermans-wharf": "/images/安平漁人碼頭夜晚點燈照片.jpg",
  "big-fish": "/images/大魚的祝福.jpg",
  tianhou: "/images/開台天后宮.jpg",
  "oyster-kiln": "/images/安平蚵灰窯文化館.jpg",
  sunset: "/images/觀夕平台.jpg",
  linmoniang: "/images/林默娘公園.webp",
  canal: "/images/安平運河.jpg",
  yuguang: "/images/漁光島.jpg",
  "harbor-park": "/images/安平港濱歷史公園.jpg",
  deyang: "/images/德陽艦園區.jpg",
  niuyuan: "/images/牛園火鍋-1.jpg",
  qingping: "/images/慶平海產.jpg",
  kingfish: "/images/金魚京.jpg",
  shennong: "/images/神農街.webp",
  chihkan: "/images/赤崁樓.jpg",
  confucius: "/images/臺南孔子廟_大成坊.jpg",
  hayashi: "/images/林百貨.webp",
  zhengxing: "/images/正興街.png",
};

export const photoFor = (id: string): string | undefined => photos[id];
