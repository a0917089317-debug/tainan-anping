"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import {
  RouletteWheel,
  type RouletteWheelHandle,
  type WheelSegment,
} from "@/components/roulette-wheel";
import {
  categories,
  dishes,
  googleUrl,
  mapsUrl,
  placeById,
  places,
  photoFor,
  placesIn,
  recommendationsFor,
  routeKm,
  routeUrl,
  shortestRoute,
  type CategoryId,
  type Place,
} from "@/lib/anping-roulette";

// 今天行程存在 localStorage，重新整理頁面也不會消失
const TRIP_KEY = "anping-roulette-trip";
const placeIds = new Set(places.map((p) => p.id));
const NO_TRIP: string[] = [];
const tripListeners = new Set<() => void>();
let tripCache: string[] | null = null;

function readTrip() {
  if (tripCache) return tripCache;
  tripCache = NO_TRIP;
  try {
    const saved = JSON.parse(localStorage.getItem(TRIP_KEY) ?? "[]");
    if (Array.isArray(saved)) tripCache = saved.filter((id) => placeIds.has(id));
  } catch {}
  return tripCache;
}

function setTrip(update: (trip: string[]) => string[]) {
  tripCache = update(readTrip());
  try {
    localStorage.setItem(TRIP_KEY, JSON.stringify(tripCache));
  } catch {}
  tripListeners.forEach((listener) => listener());
}

function subscribeTrip(listener: () => void) {
  tripListeners.add(listener);
  return () => tripListeners.delete(listener);
}

const btnPrimary =
  "rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost =
  "rounded-full border border-border px-5 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50";

export function AnpingRoulette() {
  const wheelRef = useRef<RouletteWheelHandle>(null);
  // 第一層抽中、但還沒打開的類型
  const [landedCat, setLandedCat] = useState<CategoryId | null>(null);
  // 目前打開的第二層輪盤
  const [openCat, setOpenCat] = useState<CategoryId | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [dishId, setDishId] = useState<string | null>(null);
  const [shopIdx, setShopIdx] = useState(0);
  // 最近一次「排出最短路線」省下的距離，行程變動後就不再顯示
  const [sorted, setSorted] = useState<{ key: string; savedKm: number } | null>(null);
  const trip = useSyncExternalStore(subscribeTrip, readTrip, () => NO_TRIP);

  const cat = categories.find((c) => c.id === openCat);
  const landed = categories.find((c) => c.id === landedCat);
  const dish = dishes.find((d) => d.id === dishId);
  const place = placeId ? placeById(placeId) : null;
  const recs = dish ? recommendationsFor(dish) : [];
  const shop = dish ? placeById(recs[shopIdx % recs.length]) : null;

  const options: Place[] = openCat && openCat !== "snack" ? placesIn(openCat) : [];
  const segments: WheelSegment[] = !openCat
    ? categories.map((c) => ({ label: c.label, emoji: c.emoji }))
    : openCat === "snack"
      ? dishes.map((d) => ({ label: d.name, emoji: d.emoji }))
      : options.map((p) => ({ label: p.name.replace(/（.*）/, "") }));

  const clearPick = () => {
    setPlaceId(null);
    setDishId(null);
    setShopIdx(0);
  };

  const goHome = () => {
    setOpenCat(null);
    setLandedCat(null);
    clearPick();
  };

  const openLanded = () => {
    setOpenCat(landedCat);
    setLandedCat(null);
    clearPick();
  };

  const handleResult = (i: number) => {
    if (!openCat) {
      setLandedCat(categories[i].id);
    } else if (openCat === "snack") {
      setPlaceId(null);
      setDishId(dishes[i].id);
      setShopIdx(0);
    } else {
      setDishId(null);
      setPlaceId(options[i].id);
    }
  };

  const spinAgain = () => wheelRef.current?.spin();

  const tripKm = routeKm(trip);
  const bestTrip = trip.length >= 3 ? shortestRoute(trip) : trip;
  const isShortest = routeKm(bestTrip) >= tripKm - 0.001;
  const justSorted = sorted?.key === trip.join() ? sorted : null;

  const sortTrip = () => {
    setSorted({ key: bestTrip.join(), savedKm: tripKm - routeKm(bestTrip) });
    setTrip(() => bestTrip);
  };

  const addToTrip = (id: string) =>
    setTrip((t) => (t.includes(id) ? t : [...t, id]));

  const showPlace = (id: string) => {
    setDishId(null);
    setPlaceId(id);
  };

  const pickCategory = (id: string) => {
    setLandedCat(null);
    setOpenCat(categories.find((c) => c.id === id)?.id ?? null);
    clearPick();
  };

  const pickDish = (id: string) => {
    setPlaceId(null);
    setDishId(id);
    setShopIdx(0);
  };

  return (
    <div className="flex flex-col gap-12">
      <nav aria-label="輪盤層級" className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <button type="button" onClick={goHome} className="text-muted hover:text-accent">
          安平探索 🎡
        </button>
        {cat && (
          <>
            <span className="text-muted">›</span>
            <button type="button" onClick={clearPick} className="text-muted hover:text-accent">
              {cat.emoji} {cat.label}
            </button>
          </>
        )}
        {dish && (
          <>
            <span className="text-muted">›</span>
            <span className="text-foreground">
              {dish.emoji} {dish.name}
            </span>
          </>
        )}
        {place && (
          <>
            <span className="text-muted">›</span>
            <span className="text-foreground">
              {place.emoji} {place.name}
            </span>
          </>
        )}
      </nav>

      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28">
          <RouletteWheel
            key={openCat ?? "root"}
            ref={wheelRef}
            segments={segments}
            onResult={handleResult}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
            <p className="text-sm tracking-[0.2em] text-muted">不想轉？直接選</p>
            <div className="mt-4 grid gap-4">
              <LayerSelect
                label="第一層：類型"
                value={openCat ?? ""}
                placeholder="選擇類型…"
                options={categories.map((c) => ({
                  value: c.id,
                  label: `${c.emoji} ${c.label}（${c.id === "snack" ? dishes.length : placesIn(c.id).length}）`,
                }))}
                onChange={pickCategory}
              />
              {openCat && openCat !== "snack" && (
                <LayerSelect
                  label={`第二層：${cat?.label}`}
                  value={placeId && options.some((p) => p.id === placeId) ? placeId : ""}
                  placeholder="選擇地點…"
                  options={options.map((p) => ({ value: p.id, label: `${p.emoji} ${p.name}` }))}
                  onChange={showPlace}
                />
              )}
              {openCat === "snack" && (
                <LayerSelect
                  label="第二層：想吃什麼"
                  value={dishId ?? ""}
                  placeholder="選擇品項…"
                  options={dishes.map((d) => ({ value: d.id, label: `${d.emoji} ${d.name}` }))}
                  onChange={pickDish}
                />
              )}
              {dish && (
                <LayerSelect
                  label="第三層：推薦店家"
                  value={recs[shopIdx % recs.length]}
                  placeholder="選擇店家…"
                  options={recs.map((id) => {
                    const p = placeById(id);
                    return { value: id, label: `${p.emoji} ${p.name}` };
                  })}
                  onChange={(id) => setShopIdx(recs.indexOf(id))}
                />
              )}
            </div>
          </div>
  
          <div aria-live="polite" className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
            {!openCat && !landed && (
              <Intro
                title="第一層：今天想探索什麼？"
                text="按下開始，小白球會先幫你抽出一種玩法：古蹟、海景、小吃、餐廳、咖啡、拍照、散步或在地特色。"
              />
            )}
  
            {!openCat && landed && (
              <div className="text-center">
                <p className="text-sm tracking-[0.2em] text-muted">第一層結果</p>
                <p className="mt-3 font-[family-name:var(--font-serif-tc)] text-3xl text-foreground">
                  🎉 抽到：{landed.emoji} {landed.label}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={openLanded} className={btnPrimary}>
                    打開「{landed.label}」輪盤 →
                  </button>
                  <button type="button" onClick={spinAgain} className={btnGhost}>
                    再轉一次
                  </button>
                </div>
              </div>
            )}
  
            {cat && !place && !dish && (
              <Intro
                title={`第二層：${cat.emoji} ${cat.label}`}
                text={
                  openCat === "snack"
                    ? "先抽今天要吃哪一味，再推薦附近的店家給你。"
                    : `輪盤上有 ${options.length} 個${cat.label}選項，按下開始，看看命運帶你去哪裡。`
                }
              />
            )}
  
            {place && (
              <PlaceCard
                place={place}
                onNext={() => showPlace(place.next)}
                actions={
                  <>
                    <a href={mapsUrl(place.name)} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                      去這裡
                    </a>
                    <button type="button" onClick={spinAgain} className={btnGhost}>
                      再轉一次
                    </button>
                    <button
                      type="button"
                      onClick={() => addToTrip(place.id)}
                      disabled={trip.includes(place.id)}
                      className={btnGhost}
                    >
                      {trip.includes(place.id) ? "已加入行程 ✓" : "加入今天行程"}
                    </button>
                  </>
                }
              />
            )}
  
            {dish && shop && (
              <div>
                <p className="text-sm tracking-[0.2em] text-muted">第三層：附近推薦</p>
                <p className="mt-2 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
                  🎉 抽到：{dish.emoji} {dish.name}
                </p>
  
                <ul className="mt-5 flex flex-wrap gap-2">
                  {recs.map((id, i) => {
                    const p = placeById(id);
                    const active = i === shopIdx % recs.length;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setShopIdx(i)}
                          className={`rounded-full border px-3 py-1 text-sm transition ${
                            active
                              ? "border-accent bg-accent/15 text-accent"
                              : "border-border text-muted hover:text-foreground"
                          }`}
                        >
                          {p.emoji} {p.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
  
                <div className="mt-6 border-t border-border pt-6">
                  <PlaceCard
                    place={shop}
                    onNext={() => showPlace(shop.next)}
                    actions={
                      <>
                        <a href={mapsUrl(shop.name)} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                          就吃這個
                        </a>
                        <button type="button" onClick={() => setShopIdx((i) => i + 1)} className={btnGhost}>
                          換一家
                        </button>
                        <button
                          type="button"
                          onClick={() => addToTrip(shop.id)}
                          disabled={trip.includes(shop.id)}
                          className={btnGhost}
                        >
                          {trip.includes(shop.id) ? "已加入旅程 ✓" : "加入旅程"}
                        </button>
                      </>
                    }
                  />
                </div>
  
                <button type="button" onClick={spinAgain} className="mt-6 text-sm text-muted underline underline-offset-4 hover:text-accent">
                  不想吃{dish.name}？再轉一次
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
            🗺️ 今天行程
          </h2>
          {trip.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <a
                href={routeUrl(trip.map((id) => placeById(id).name))}
                target="_blank"
                rel="noopener noreferrer"
                className={btnPrimary}
              >
                用 Google Maps 開路線
              </a>
              <button
                type="button"
                onClick={sortTrip}
                disabled={trip.length < 3 || isShortest}
                title={trip.length < 3 ? "至少 3 站才需要排順序" : undefined}
                className={btnGhost}
              >
                {trip.length >= 3 && isShortest ? "✓ 已是最短路線" : "⚡ 排出最短路線"}
              </button>
              <button type="button" onClick={() => setTrip(() => [])} className={btnGhost}>
                清空
              </button>
            </div>
          )}
        </div>

        {trip.length > 1 && (
          <p className="mt-3 text-sm text-muted">
            全程直線距離約 {tripKm.toFixed(1)} 公里
            {justSorted && justSorted.savedKm > 0.05 && (
              <span className="ml-2 text-accent">
                已重新排序，少走約 {justSorted.savedKm.toFixed(1)} 公里
              </span>
            )}
          </p>
        )}

        {trip.length === 0 ? (
          <p className="mt-4 text-muted">還沒有行程，轉到喜歡的地方就按「加入今天行程」。</p>
        ) : (
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {trip.map((id, i) => {
              const p = placeById(id);
              return (
                <li key={id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-background">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-foreground">
                    {p.emoji} {p.name}
                    <span className="ml-2 text-xs text-muted">{p.stay}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setTrip((t) => t.filter((x) => x !== id))}
                    aria-label={`從行程移除 ${p.name}`}
                    className="text-muted hover:text-accent"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}


function Intro({ title, text }: { title: string; text: string }) {
  return (
    <div className="text-center">
      <p className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">{title}</p>
      <p className="mt-4 leading-8 text-muted">{text}</p>
    </div>
  );
}

function PlaceCard({
  place,
  actions,
  onNext,
}: {
  place: Place;
  actions: React.ReactNode;
  onNext: () => void;
}) {
  const next = placeById(place.next);
  const photo = photoFor(place.id);
  return (
    <div>
      <div className={photo ? "grid gap-6 sm:grid-cols-[minmax(0,1fr)_13rem]" : undefined}>
        <div>
          <p className="font-[family-name:var(--font-serif-tc)] text-3xl text-foreground">
            {place.emoji} {place.name}
          </p>
          <dl className="mt-5 space-y-2 leading-7">
            <div>
              <dt className="inline text-muted">特色：</dt>
              <dd className="inline text-foreground">{place.feature}</dd>
            </div>
            <div>
              <dt className="inline text-muted">⏱ 建議停留：</dt>
              <dd className="inline text-foreground">{place.stay}</dd>
            </div>
            <div>
              <dt className="inline text-muted">📸 適合：</dt>
              <dd className="inline text-foreground">{place.goodFor.join("、")}</dd>
            </div>
            <div>
              <dt className="inline text-muted">🚶 下一站：</dt>
              <dd className="inline">
                <button type="button" onClick={onNext} className="text-accent underline underline-offset-4 hover:brightness-110">
                  {next.emoji} {next.name}
                </button>
              </dd>
            </div>
          </dl>
        </div>
        {photo && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border sm:mt-1">
            <Image
              src={photo}
              alt={place.name}
              fill
              sizes="(min-width: 640px) 13rem, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
      <a
        href={googleUrl(place.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-muted underline underline-offset-4 hover:text-accent"
      >
        看 Google 介紹 ↗
      </a>
    </div>
  );
}

function LayerSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
