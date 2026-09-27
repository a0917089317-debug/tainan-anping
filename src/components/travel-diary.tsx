"use client";

import { useState } from "react";
import { useTrip } from "@/components/anping-roulette";
import { useVisitorName } from "@/hooks/use-visitor-name";
import { placeById } from "@/lib/anping-roulette";

const feelings = [
  { id: "happy", emoji: "😊", label: "很開心" },
  { id: "calm", emoji: "😌", label: "很平靜" },
  { id: "lonely", emoji: "🥹", label: "有點孤單" },
  { id: "tired", emoji: "😵", label: "有點累" },
  { id: "brave", emoji: "❤️", label: "覺得自己很勇敢" },
];

// 卡片底下那句打氣的話，依心情換
const cheers: Record<string, string> = {
  happy: "開心的一天，值得被記住。",
  calm: "安靜的旅行，也是很好的旅行。",
  lonely: "有點孤單也沒關係，很多人也正一個人走在路上。",
  tired: "累了就休息，今天已經走得很好了。",
  brave: "一個人出發，本來就是很勇敢的事。",
};

const MAX_TEXT = 40;
const DEFAULT_TEXT = "今天一個人去了安平。";
// 旅行卡底圖，每次生成隨機換一張
const backgrounds = [
  "億載金城.webp",
  "大魚的祝福.jpg",
  "安平古堡.webp",
  "安平小砲台.webp",
  "安平樹屋.jpg",
  "安平港濱歷史公園.jpg",
  "安平漁人碼頭夜晚點燈照片.jpg",
  "安平老街.webp",
  "安平蚵灰窯文化館.jpg",
  "安平運河.jpg",
  "德商東興洋行.webp",
  "德陽艦園區.jpg",
  "朱玖瑩故居.webp",
  "朱玖瑩故居2.webp",
  "林默娘公園.webp",
  "海山館.webp",
  "漁光島.jpg",
  "牛園火鍋-2.jpg",
  "英商德記洋行.webp",
  "觀夕平台.jpg",
  "開台天后宮.jpg",
].map((f) => `/images/${f}`);

/** 隨機抽一張底圖，不跟上一張重複 */
function pickBackground(previous?: string) {
  const pool = backgrounds.filter((b) => b !== previous);
  return pool[Math.floor(Math.random() * pool.length)];
}
const W = 1080;
const H = 1350; // 4:5，IG 貼文與 Threads 都能完整顯示

const btnPrimary =
  "rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost =
  "rounded-full border border-border px-5 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50";

type Feeling = (typeof feelings)[number];

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** 中文逐字斷行 */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const ch of Array.from(text)) {
    if (ctx.measureText(line + ch).width > width && line) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function drawCard({
  feeling,
  text,
  stops,
  name,
  photo,
}: {
  feeling: Feeling;
  text: string;
  stops: string[];
  name: string | null;
  photo: string;
}) {
  await document.fonts.ready;
  const serifVar = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-serif-tc")
    .trim();
  const serif = `${serifVar ? `${serifVar}, ` : ""}"Noto Serif TC", "PMingLiU", serif`;
  const sans = `"Noto Sans TC", "Microsoft JhengHei", sans-serif`;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const img = await loadImage(photo);
  ctx.fillStyle = "#0c0a08";
  ctx.fillRect(0, 0, W, H);
  if (img) {
    const scale = Math.max(W / img.width, H / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }
  const shade = ctx.createLinearGradient(0, 0, 0, H);
  shade.addColorStop(0, "rgba(12,10,8,0.55)");
  shade.addColorStop(0.45, "rgba(12,10,8,0.72)");
  shade.addColorStop(1, "rgba(12,10,8,0.94)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(211,164,90,0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#d3a45a";
  ctx.font = `600 26px ${sans}`;
  ctx.letterSpacing = "8px";
  ctx.fillText("ANPING · SOLO TRIP", W / 2, 130);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "#f1ece1";
  ctx.font = `700 68px ${serif}`;
  ctx.fillText("我的安平旅行卡", W / 2, 215);

  const today = new Date();
  ctx.fillStyle = "#a89e8d";
  ctx.font = `30px ${sans}`;
  ctx.fillText(
    `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`,
    W / 2,
    280,
  );

  ctx.font = `150px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.fillText(feeling.emoji, W / 2, 460);

  ctx.fillStyle = "#d3a45a";
  ctx.font = `500 40px ${serif}`;
  ctx.fillText(`今天的我，${feeling.label}`, W / 2, 590);

  ctx.fillStyle = "#f1ece1";
  ctx.font = `700 58px ${serif}`;
  const lines = wrap(ctx, `「${text}」`, W - 220).slice(0, 3);
  const quoteTop = 720;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, quoteTop + i * 84));

  const y = quoteTop + lines.length * 84 + 50;
  if (stops.length) {
    ctx.fillStyle = "#a89e8d";
    ctx.font = `26px ${sans}`;
    ctx.fillText("今日路線", W / 2, y);
    ctx.fillStyle = "#f1ece1";
    ctx.font = `34px ${sans}`;
    const route = stops.map((id) => placeById(id).name.replace(/（.*）/, "")).join(" → ");
    wrap(ctx, route, W - 220)
      .slice(0, 3)
      .forEach((l, i) => ctx.fillText(l, W / 2, y + 56 + i * 50));
  }

  ctx.fillStyle = "#a89e8d";
  ctx.font = `italic 30px ${serif}`;
  ctx.fillText(cheers[feeling.id], W / 2, H - 190);

  ctx.fillStyle = "#d3a45a";
  ctx.font = `28px ${sans}`;
  ctx.fillText(`${name ? `${name} · ` : ""}台南獨旅 #一個人的安平`, W / 2, H - 110);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

export function TravelDiary() {
  const trip = useTrip();
  const { name } = useVisitorName();
  const [feelingId, setFeelingId] = useState<string | null>(null);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [withRoute, setWithRoute] = useState(true);
  const [card, setCard] = useState<{ url: string; file: File; photo: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const feeling = feelings.find((f) => f.id === feelingId);
  const sentence = text.trim() || DEFAULT_TEXT;
  const shareText = `${feeling?.emoji ?? ""} ${sentence}\n#台南獨旅 #一個人的安平`;

  const generate = async () => {
    if (!feeling) return;
    setBusy(true);
    setNotice(null);
    try {
      const photo = pickBackground(card?.photo);
      const blob = await drawCard({
        feeling,
        text: sentence,
        stops: withRoute ? trip : [],
        name,
        photo,
      });
      if (card) URL.revokeObjectURL(card.url);
      setCard({
        url: URL.createObjectURL(blob),
        file: new File([blob], "我的安平旅行卡.png", { type: "image/png" }),
        photo,
      });
    } catch {
      setNotice("旅行卡生成失敗了，再試一次看看？");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!card) return;
    const a = document.createElement("a");
    a.href = card.url;
    a.download = card.file.name;
    a.click();
  };

  // 手機上會跳出系統分享選單，可以直接選 IG、Threads；不支援的瀏覽器就改成下載
  const share = async () => {
    if (!card) return;
    if (navigator.canShare?.({ files: [card.file] })) {
      try {
        await navigator.share({ files: [card.file], text: shareText });
      } catch {
        // 使用者取消分享
      }
      return;
    }
    download();
    setNotice("這個瀏覽器不能直接分享圖片，已幫你下載，打開 IG 或 Threads 上傳就可以了。");
  };

  const threadsUrl = `https://www.threads.com/intent/post?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
          <p className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
            今天的你，旅行得還好嗎？
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {feelings.map((f) => {
              const active = f.id === feelingId;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFeelingId(f.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border text-foreground hover:border-accent/60"
                  }`}
                >
                  {f.emoji} {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
          <label className="grid gap-3">
            <span className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
              寫一句話給今天
            </span>
            <input
              type="text"
              value={text}
              maxLength={MAX_TEXT}
              onChange={(e) => setText(e.target.value)}
              placeholder={DEFAULT_TEXT}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none"
            />
            <span className="text-right text-xs text-muted">
              {Array.from(text).length} / {MAX_TEXT}
            </span>
          </label>

          {trip.length > 0 && (
            <label className="mt-2 flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={withRoute}
                onChange={(e) => setWithRoute(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              把今天行程（{trip.length} 站）放進卡片
            </label>
          )}

          <button
            type="button"
            onClick={generate}
            disabled={!feeling || busy}
            className={`${btnPrimary} mt-6`}
          >
            {busy ? "生成中…" : card ? "重新生成旅行卡" : "✨ 生成我的安平旅行卡"}
          </button>
          {!feeling && <p className="mt-2 text-xs text-muted">先選一個今天的心情</p>}
        </div>
      </div>

      <div aria-live="polite" className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
        {card ? (
          <div className="flex flex-col items-center gap-6">
            {/* blob URL，不經過 next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.url}
              alt={`我的安平旅行卡：${sentence}`}
              className="w-full max-w-sm rounded-xl border border-border shadow-2xl"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={share} className={btnPrimary}>
                分享到 IG / Threads
              </button>
              <button type="button" onClick={download} className={btnGhost}>
                下載圖片
              </button>
              <a href={threadsUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                在 Threads 發文 ↗
              </a>
            </div>
            <p className="text-center text-xs leading-6 text-muted">
              手機上按「分享」可以直接選 IG 或 Threads；電腦上先下載圖片再上傳。
              <br />
              「在 Threads 發文」只會帶入文字，圖片要自己附上。
            </p>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <p className="text-5xl">{feeling?.emoji ?? "💌"}</p>
            <p className="mt-4 font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
              「{sentence}」
            </p>
            <p className="mt-4 text-sm text-muted">選好心情、寫一句話，就能生成專屬旅行卡。</p>
          </div>
        )}
        {notice && <p className="mt-4 text-center text-sm text-accent">{notice}</p>}
      </div>
    </div>
  );
}
