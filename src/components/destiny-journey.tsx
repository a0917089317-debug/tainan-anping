"use client";

import { useRef, useState } from "react";
import {
  RouletteWheel,
  type RouletteWheelHandle,
  type WheelSegment,
} from "@/components/roulette-wheel";
import { hasPlacePhoto, PlacePhoto } from "@/components/place-photo";
import {
  setDistricts,
  setTrip,
  TripPanel,
  useDistricts,
  useDistrictScope,
  useMyLocation,
} from "@/components/anping-roulette";
import {
  districtsWithPlaces,
  mapsUrl,
  placeById,
  routeKm,
  routeUrl,
  shortestRoute,
} from "@/lib/anping-roulette";
import {
  budgetLabel,
  budgetOptions,
  costOf,
  districtById,
  districts,
  drawCandidates,
  formatMinutes,
  journeyCost,
  journeyMinutes,
  MAX_MOODS,
  minutesOf,
  moods,
  stopEmoji,
  timeLabel,
  timeOptions,
  TRAVEL_MIN,
  whisperOf,
  type DistrictId,
  type MoodId,
} from "@/lib/destiny-journey";

const btnPrimary =
  "rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost =
  "rounded-full border border-border px-5 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50";
const chip = (active: boolean) =>
  `rounded-full border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
    active
      ? "border-accent bg-accent/15 text-accent"
      : "border-border text-foreground hover:border-accent/60"
  }`;

const ordinals = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const ordinal = (i: number) => ordinals[i] ?? String(i + 1);

const randomOf = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/** 候選太少時重複排列，讓輪盤至少有 4 格 */
function wheelSegments(ids: string[]): WheelSegment[] {
  const base = ids.map((id) => {
    const p = placeById(id);
    return { label: p.name.replace(/（.*）/, ""), emoji: p.emoji };
  });
  if (base.length >= 4) return base;
  const reps = Math.ceil(4 / base.length);
  return Array.from({ length: base.length * reps }, (_, i) => base[i % base.length]);
}

type Phase = "region" | "setup" | "journey" | "done";

export function DestinyJourney() {
  const wheelRef = useRef<RouletteWheelHandle>(null);
  const [phase, setPhase] = useState<Phase>("region");
  const regions = useDistricts();
  const scope = useDistrictScope();
  const [minutes, setMinutes] = useState<number | null>(null);
  const [budgetPick, setBudgetPick] = useState<number | "custom" | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [picked, setPicked] = useState<MoodId[]>([]);
  const [fate, setFate] = useState(false);
  const [stops, setStops] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [landed, setLanded] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  // 最近一次「截取最短路線」省下的距離，路線變動後就不再顯示
  const [sorted, setSorted] = useState<{ key: string; savedKm: number } | null>(null);
  const { origin, toggleOrigin, locating, locError } = useMyLocation();
  const [error, setError] = useState<string | null>(null);

  const customValue = Number(customBudget);
  const budget =
    budgetPick === "custom"
      ? customBudget.trim() !== "" && Number.isFinite(customValue) && customValue >= 0
        ? customValue
        : null
      : budgetPick;
  const ready = minutes !== null && budget !== null;
  const moodIds = fate ? [] : picked;

  const moodText = fate
    ? "🎰 全部交給命運"
    : picked.length
      ? picked
          .map((id) => moods.find((m) => m.id === id)!)
          .map((m) => `${m.emoji} ${m.label}`)
          .join("＋")
      : "🎲 沒有特別想法";

  const begin = (m: number, b: number, list: MoodId[]) => {
    const first = drawCandidates({
      visited: [],
      moodIds: list,
      minutes: m,
      budget: b,
      districts: scope,
    });
    if (!first.length) {
      setError("這樣的條件找不到適合的地方，放寬一點時間或預算試試看？");
      return;
    }
    setError(null);
    setStops([]);
    setCandidates(first);
    setLanded(null);
    setSaved(false);
    setPhase("journey");
  };

  const start = () => {
    if (minutes === null || budget === null) return;
    setFate(false);
    begin(minutes, budget, picked);
  };

  // 沒選的時間、預算也一起交給命運
  const leaveToFate = () => {
    const m = minutes ?? randomOf(timeOptions).minutes;
    const b = budget ?? randomOf(budgetOptions).amount;
    setMinutes(m);
    if (budget === null) setBudgetPick(b);
    setFate(true);
    begin(m, b, []);
  };

  const toggleMood = (id: MoodId) =>
    setPicked((list) =>
      list.includes(id)
        ? list.filter((x) => x !== id)
        : list.length >= MAX_MOODS
          ? list
          : [...list, id],
    );

  const accept = () => {
    if (!landed || minutes === null || budget === null) return;
    const next = [...stops, landed];
    setStops(next);
    setLanded(null);
    const more = drawCandidates({ visited: next, moodIds, minutes, budget, districts: scope });
    if (more.length) setCandidates(more);
    else setPhase("done");
  };

  // 只重抽這一站的輪盤，已加入的站保留
  const redrawRound = () => {
    if (minutes === null || budget === null) return;
    setCandidates(drawCandidates({ visited: stops, moodIds, minutes, budget, districts: scope }));
    setLanded(null);
  };

  // 保持和區域清單相同的順序
  const toggleRegion = (id: DistrictId) =>
    setDistricts((list) =>
      list.includes(id)
        ? list.filter((x) => x !== id)
        : districts.map((d) => d.id).filter((x) => x === id || list.includes(x)),
    );

  const saveToTrip = () => {
    setTrip((t) => [...t, ...stops.filter((id) => !t.includes(id))]);
    setSaved(true);
  };

  const bestStops = stops.length >= 3 ? shortestRoute(stops) : stops;
  const isShortest = routeKm(bestStops) >= routeKm(stops) - 0.001;
  const justSorted = sorted?.key === stops.join() ? sorted : null;

  const sortStops = () => {
    setSorted({ key: bestStops.join(), savedKm: routeKm(stops) - routeKm(bestStops) });
    setStops(bestStops);
  };

  const summary = (
    <ul className="flex flex-wrap justify-center gap-2 text-sm">
      <li className="rounded-full border border-border px-3 py-1">⏰ {timeLabel(minutes ?? 0)}</li>
      <li className="rounded-full border border-border px-3 py-1">💰 {budgetLabel(budget ?? 0)}</li>
      <li className="rounded-full border border-border px-3 py-1">{moodText}</li>
    </ul>
  );

  const regionText = regions.map((id) => districtById(id).label).join(" × ");
  const scopeText = scope.map((id) => districtById(id).label).join(" × ");
  const noData = regions.filter((id) => !districtsWithPlaces.has(id));
  const hasData = regions.length > noData.length;

  if (phase === "region") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Step no="第一步" title="🎡 今天去哪裡？交給命運決定" hint="先勾選想探索的區域">
          {districts.map((d) => {
            const active = regions.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggleRegion(d.id)}
                className={chip(active)}
              >
                {active ? "☑️" : "☐"} {d.label}
              </button>
            );
          })}
        </Step>

        <div className="flex flex-col items-center gap-3 text-center">
          {regions.length ? (
            <>
              <p className="text-sm text-muted">已選 {regions.length} 個區域</p>
              <p className="font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
                {regionText}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">至少勾選一個區域</p>
          )}
          {noData.length > 0 && (
            <p className="text-xs text-muted">
              {noData.map((id) => districtById(id).label).join("、")}的景點還在整理中，目前只會轉到
              {hasData ? scopeText : "已收錄的區域"}
            </p>
          )}
          <button
            type="button"
            onClick={() => setPhase("setup")}
            disabled={!hasData}
            className="mt-2 rounded-full bg-accent px-10 py-3 text-base font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🎡 開始命運輪盤
          </button>
        </div>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-center text-sm text-muted">
          📍 今天的區域：{regionText} ·{" "}
          <button
            type="button"
            onClick={() => setPhase("region")}
            className="underline underline-offset-4 hover:text-accent"
          >
            重新選區域
          </button>
        </p>
        <Step no="第二步" title="⏰ 今天想玩多久？">
          {timeOptions.map((t) => (
            <button
              key={t.minutes}
              type="button"
              aria-pressed={minutes === t.minutes}
              onClick={() => setMinutes(t.minutes)}
              className={chip(minutes === t.minutes)}
            >
              {t.label}
            </button>
          ))}
        </Step>

        <Step no="第三步" title="💰 今天想花多少？">
          {budgetOptions.map((b) => (
            <button
              key={b.label}
              type="button"
              aria-pressed={budgetPick === b.amount}
              onClick={() => setBudgetPick(b.amount)}
              className={chip(budgetPick === b.amount)}
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={budgetPick === "custom"}
            onClick={() => setBudgetPick("custom")}
            className={chip(budgetPick === "custom")}
          >
            自訂預算
          </button>
          {budgetPick === "custom" && (
            <label className="flex w-full items-center gap-2 text-sm text-muted">
              $
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={50}
                autoFocus
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                placeholder="例如 650"
                className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none"
              />
            </label>
          )}
        </Step>

        <Step no="第四步" title="😌 今天想怎麼旅行？" hint={`最多選 ${MAX_MOODS} 個，不選也可以`}>
          {moods.map((m) => {
            const active = picked.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleMood(m.id)}
                disabled={!active && picked.length >= MAX_MOODS}
                className={chip(active)}
              >
                {m.emoji} {m.label}
              </button>
            );
          })}
        </Step>

        {error && <p className="text-center text-sm text-accent">{error}</p>}

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={start}
            disabled={!ready}
            className="rounded-full bg-accent px-10 py-3 text-base font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🎰 開始我的命運旅行
          </button>
          {!ready && <p className="text-xs text-muted">先選好時間和預算</p>}
          <button
            type="button"
            onClick={leaveToFate}
            className="text-sm text-muted underline underline-offset-4 hover:text-accent"
          >
            🎰 都不要選，全部交給命運
          </button>
        </div>

        <TripPanel />
      </div>
    );
  }

  const usedMin = journeyMinutes(stops);
  const spent = journeyCost(stops);

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background-elevated p-6 text-center sm:p-10">
        <ol className="flex flex-col items-center gap-2">
          <FlowItem first>🎰 命運輪盤</FlowItem>
          <FlowItem>今天想怎麼玩？</FlowItem>
          <FlowItem>{summary}</FlowItem>
          {stops.map((id, i) => {
            const p = placeById(id);
            return (
              <FlowItem key={id}>
                <span className="block text-xs tracking-[0.2em] text-muted">
                  {i === 0 ? "🎯" : stopEmoji(p)} 第{ordinal(i)}站
                </span>
                <span className="font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
                  {p.name}
                </span>
              </FlowItem>
            );
          })}
          <FlowItem>
            <span className="font-[family-name:var(--font-serif-tc)] text-2xl text-accent">
              ✨ 今日命運旅程完成
            </span>
          </FlowItem>
        </ol>

        <p className="mt-6 text-sm text-muted">
          共 {stops.length} 站 · 約 {formatMinutes(usedMin)}（含移動）· 約 ${spent.toLocaleString()}
          {stops.length > 1 && <> · 直線約 {routeKm(stops).toFixed(1)} 公里</>}
        </p>
        {origin && <p className="mt-2 text-sm text-accent">📍 路線會從你目前的位置出發</p>}
        {locError && <p className="mt-2 text-sm text-amber-300">{locError}</p>}
        {justSorted && justSorted.savedKm > 0.05 && (
          <p className="mt-2 text-sm text-accent">
            已重新排序，少走約 {justSorted.savedKm.toFixed(1)} 公里
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={routeUrl(stops.map((id) => placeById(id).name), origin ?? undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className={btnPrimary}
          >
            用 Google Maps 開路線
          </a>
          <button
            type="button"
            onClick={sortStops}
            disabled={stops.length < 3 || isShortest}
            title={stops.length < 3 ? "至少 3 站才需要排順序" : undefined}
            className={btnGhost}
          >
            {stops.length >= 3 && isShortest ? "✓ 已是最短路線" : "⚡ 截取最短路線"}
          </button>
          <button type="button" onClick={toggleOrigin} disabled={locating} className={btnGhost}>
            {locating ? "定位中…" : origin ? "✓ 從我的位置出發" : "📍 我目前的位置"}
          </button>
          <button type="button" onClick={saveToTrip} disabled={saved} className={btnGhost}>
            {saved ? "已存進今天行程 ✓" : "存進下方今天行程"}
          </button>
          <button
            type="button"
            onClick={() => {
              saveToTrip();
              document.getElementById("travel-diary")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={btnGhost}
          >
            💬 寫今天的旅途日記
          </button>
          <button
            type="button"
            onClick={() => begin(minutes ?? 0, budget ?? 0, moodIds)}
            className={btnGhost}
          >
            同樣條件再抽一次
          </button>
          <button type="button" onClick={() => setPhase("setup")} className={btnGhost}>
            重新設定
          </button>
        </div>
      </div>
    );
  }

  const place = landed ? placeById(landed) : null;
  const photo = place ? hasPlacePhoto(place.id) : false;
  const total = minutes ?? 0;
  const cap = budget ?? 0;

  return (
    <div className="flex flex-col gap-8">
      {summary}

      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <p className="mb-4 text-center font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
            🎯 命運第{ordinal(stops.length)}站
          </p>
          <RouletteWheel
            key={stops.length}
            ref={wheelRef}
            segments={wheelSegments(candidates)}
            onResult={(i) => setLanded(candidates[i % candidates.length])}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div aria-live="polite" className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
            {!place ? (
              <div className="text-center">
                <p className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
                  轉轉看第{ordinal(stops.length)}站
                </p>
                <p className="mt-4 leading-8 text-muted">
                  輪盤上的 {candidates.length} 個地方都符合你今天的心情，也塞得進剩下的時間和預算。
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm tracking-[0.2em] text-muted">🎯 命運第{ordinal(stops.length)}站</p>
                <div className={photo ? "mt-3 grid gap-6 sm:grid-cols-[minmax(0,1fr)_12rem]" : "mt-3"}>
                  <div>
                    <p className="font-[family-name:var(--font-serif-tc)] text-3xl text-foreground">
                      {place.emoji} {place.name}
                    </p>
                    <p className="mt-4 text-lg leading-8 text-foreground">「{whisperOf(place.id)}」</p>
                    <p className="mt-4 text-sm text-muted">
                      ⏱ {place.stay} · 💰 {costOf(place.id) ? `約 $${costOf(place.id)}` : "免費"}
                    </p>
                  </div>
                  <PlacePhoto id={place.id} alt={place.name} sizes="(min-width: 640px) 12rem, 100vw" />
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={accept} className={btnPrimary}>
                    加入旅程
                  </button>
                  <button type="button" onClick={() => wheelRef.current?.spin()} className={btnGhost}>
                    再轉一次
                  </button>
                  <a
                    href={mapsUrl(place.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-center text-sm text-muted underline underline-offset-4 hover:text-accent"
                  >
                    看地圖 ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
            <Meter
              label="⏰ 時間"
              value={`${formatMinutes(usedMin)} / ${formatMinutes(total)}`}
              ratio={usedMin / total}
              preview={place ? (minutesOf(place) + (stops.length ? TRAVEL_MIN : 0)) / total : 0}
            />
            <div className="mt-4">
              <Meter
                label="💰 預算"
                value={
                  Number.isFinite(cap)
                    ? `$${spent.toLocaleString()} / $${cap.toLocaleString()}`
                    : `$${spent.toLocaleString()}（不設上限）`
                }
                ratio={Number.isFinite(cap) && cap > 0 ? spent / cap : 0}
                preview={place && Number.isFinite(cap) && cap > 0 ? costOf(place.id) / cap : 0}
              />
            </div>

            {stops.length > 0 && (
              <ol className="mt-6 flex flex-col items-center gap-1 border-t border-border pt-6">
                {stops.map((id, i) => {
                  const p = placeById(id);
                  return (
                    <FlowItem key={id} first={i === 0}>
                      <span className="text-xs tracking-[0.2em] text-muted">
                        {i === 0 ? "🎯" : stopEmoji(p)} 第{ordinal(i)}站
                      </span>{" "}
                      <span className="text-foreground">{p.name}</span>
                    </FlowItem>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setPhase("done")}
                disabled={stops.length === 0}
                className={btnGhost}
              >
                旅程就到這裡
              </button>
              <button
                type="button"
                onClick={redrawRound}
                className={btnGhost}
              >
                重新排一次
              </button>
              <button type="button" onClick={() => setPhase("setup")} className={btnGhost}>
                重新設定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  no,
  title,
  hint,
  children,
}: {
  no: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <p className="text-sm tracking-[0.2em] text-muted">{no}</p>
      <p className="mt-2 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function FlowItem({ first, children }: { first?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-2">
      {!first && (
        <span aria-hidden className="text-muted">
          ↓
        </span>
      )}
      <div>{children}</div>
    </li>
  );
}

function Meter({
  label,
  value,
  ratio,
  preview,
}: {
  label: string;
  value: string;
  ratio: number;
  preview: number;
}) {
  const used = Math.min(ratio, 1) * 100;
  const next = Math.min(preview, 1 - Math.min(ratio, 1)) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-border">
        <div className="bg-accent transition-all" style={{ width: `${used}%` }} />
        <div className="bg-accent/40 transition-all" style={{ width: `${next}%` }} />
      </div>
    </div>
  );
}
