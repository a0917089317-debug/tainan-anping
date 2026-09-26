import {
  categories,
  fallbackPlan,
  paces,
  spotsFor,
  startTimeFor,
  type Plan,
  type Preferences,
} from "@/lib/anping-plan";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Only accept categories and options we know about.
  const cats: unknown[] = Array.isArray(body?.categories) ? body.categories : [];
  const prefs: Preferences = {
    categories: categories.map((c) => c.id).filter((id) => cats.includes(id)),
    pace: paces.some((p) => p.id === body?.pace) ? body.pace : "normal",
  };

  if (prefs.categories.length === 0) {
    return Response.json({ error: "請至少選擇一個想去的類型" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json(fallbackPlan(prefs));

  try {
    return Response.json(await aiPlan(apiKey, prefs));
  } catch (err) {
    console.error("AI plan failed, using fallback:", err);
    return Response.json(fallbackPlan(prefs));
  }
}

async function aiPlan(apiKey: string, prefs: Preferences): Promise<Plan> {
  const pace = paces.find((p) => p.id === prefs.pace)!;
  const labels = categories
    .filter((c) => prefs.categories.includes(c.id))
    .map((c) => c.label)
    .join("、");

  const prompt = [
    "你是台南安平在地導遊，請為一位獨自旅行的旅人安排安平一日（或半日）行程。",
    `旅人想去的類型：${labels}。`,
    `旅行節奏：${pace.label}（${pace.desc}），從 ${startTimeFor(prefs.pace)} 出發，總長約 ${pace.hours} 小時，以步行為主。`,
    "可以使用的地點（名稱、建議停留分鐘、簡介）：",
    ...spotsFor(prefs.categories).map((s) => `- ${s.name}（${s.minutes} 分）：${s.desc}`),
    "",
    "規則：依地理位置排出順路的順序；夕陽、夜景地點排在傍晚之後；景點多在 17:30 左右關門；",
    "不必每個地點都去，依節奏挑選；可以另外安排用餐或休息；place 要寫地點名稱；",
    "note 用一兩句寫在這裡做什麼，語氣像給一個人旅行的朋友建議。",
    "用繁體中文，只回傳 JSON：",
    '{"title":"行程標題","summary":"一兩句總覽","items":[{"time":"HH:MM","place":"地點","minutes":60,"note":"說明"}],"tips":["實用提醒"]}',
  ].join("\n");

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
  if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
    throw new Error("AI response has no items");
  }

  return {
    title: String(parsed.title ?? "安平獨旅散策"),
    summary: String(parsed.summary ?? ""),
    items: parsed.items.map((it: Record<string, unknown>) => ({
      time: String(it.time ?? ""),
      place: String(it.place ?? ""),
      minutes: Number(it.minutes) || 0,
      note: String(it.note ?? ""),
    })),
    tips: Array.isArray(parsed.tips) ? parsed.tips.map(String) : [],
    source: "ai",
  };
}
