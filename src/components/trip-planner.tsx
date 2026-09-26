"use client";

import { useState } from "react";
import { cityDistricts, placeCoords } from "@/lib/trip-data";

// Google Maps directions links accept at most 9 waypoints between origin and
// destination, so a route can hold 11 points in total (including the
// visitor's location when they start from it).
const MAX_POINTS = 11;

type Category = "spots" | "eats";
type Stop = { city: string; name: string };
type LatLng = [number, number];

const coordsOf = (stop: Stop): LatLng | undefined =>
  placeCoords[`${stop.city} ${stop.name}`];

function mapsRouteUrl(stops: Stop[], origin: LatLng | null) {
  const places = stops.map((stop) => `${stop.city} ${stop.name}`);
  if (origin) places.unshift(origin.join(","));
  const params = new URLSearchParams({
    api: "1",
    destination: places[places.length - 1],
  });
  // With a single place and no origin, Google Maps starts from the viewer's
  // current location.
  if (places.length > 1) params.set("origin", places[0]);
  if (places.length > 2) params.set("waypoints", places.slice(1, -1).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

function distance([lat1, lng1]: LatLng, [lat2, lng2]: LatLng) {
  // Equirectangular approximation; accurate enough to compare nearby stops.
  const x = (lng2 - lng1) * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
  return Math.hypot(x, lat2 - lat1);
}

/**
 * Reorders stops into the shortest open path by straight-line distance, using
 * Held-Karp DP (fine for up to MAX_POINTS points). With `origin` the path
 * starts there; otherwise any stop can start. Stops without coordinates keep
 * their order and go last.
 */
function shortestRoute(stops: Stop[], origin: LatLng | null): Stop[] {
  const known = stops.filter((s) => coordsOf(s));
  const unknown = stops.filter((s) => !coordsOf(s));

  // Node 0 is the origin when there is one.
  const coords = known.map((s) => coordsOf(s)!);
  if (origin) coords.unshift(origin);
  const offset = origin ? 1 : 0;
  const n = coords.length;
  if (n < 3) return [...known, ...unknown];

  const size = 1 << n;
  const cost = Array.from({ length: size }, () =>
    new Array<number>(n).fill(Infinity),
  );
  const prev = Array.from({ length: size }, () =>
    new Array<number>(n).fill(-1),
  );
  if (origin) cost[1][0] = 0;
  else for (let i = 0; i < n; i++) cost[1 << i][i] = 0;

  for (let mask = 1; mask < size; mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last)) || cost[mask][last] === Infinity) continue;
      for (let next = 0; next < n; next++) {
        if (mask & (1 << next)) continue;
        const nextMask = mask | (1 << next);
        const c = cost[mask][last] + distance(coords[last], coords[next]);
        if (c < cost[nextMask][next]) {
          cost[nextMask][next] = c;
          prev[nextMask][next] = last;
        }
      }
    }
  }

  const full = size - 1;
  let end = 0;
  for (let i = 1; i < n; i++) if (cost[full][i] < cost[full][end]) end = i;

  const order: number[] = [];
  for (let mask = full, i = end; i !== -1;) {
    order.push(i);
    const p = prev[mask][i];
    mask &= ~(1 << i);
    i = p;
  }
  return [
    ...order
      .reverse()
      .filter((i) => i >= offset)
      .map((i) => known[i - offset]),
    ...unknown,
  ];
}

export function TripPlanner({ cities }: { cities: string[] }) {
  const [activeCity, setActiveCity] = useState(cities[0]);
  const [activeDistricts, setActiveDistricts] = useState<
    Record<string, string>
  >({});
  const [category, setCategory] = useState<Category>("spots");
  // Insertion order is the route order.
  const [stops, setStops] = useState<Stop[]>([]);
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const city = cities.includes(activeCity) ? activeCity : cities[0];
  const districts = cityDistricts[city] ?? [];
  const district =
    districts.find((d) => d.name === activeDistricts[city]) ?? districts[0];
  const items = district ? district[category] : [];

  const isChecked = (name: string) =>
    stops.some((stop) => stop.city === city && stop.name === name);

  const toggleStop = (name: string) => {
    setStops((prev) =>
      prev.some((stop) => stop.city === city && stop.name === name)
        ? prev.filter((stop) => !(stop.city === city && stop.name === name))
        : [...prev, { city, name }],
    );
  };

  const routeStops = stops.filter((stop) => cities.includes(stop.city));
  const pointCount = routeStops.length + (origin ? 1 : 0);
  const tooMany = pointCount > MAX_POINTS;
  const canSort = pointCount >= 3 && !tooMany;

  const toggleOrigin = () => {
    if (origin) {
      setOrigin(null);
      return;
    }
    if (!navigator.geolocation) {
      setLocateError("你的瀏覽器不支援定位。");
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocateError("無法取得你的位置，請確認已允許定位權限。");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="rounded-3xl border border-border bg-background-elevated p-6 sm:p-8">
      <h3 className="font-[family-name:var(--font-serif-tc)] text-2xl text-accent">
        各區景點／小吃
      </h3>
      <p className="mt-2 text-sm text-muted">
        勾選想去的景點與店家，下方會自動排出 Google 地圖路線
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {cities.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveCity(name)}
            className={`rounded-full px-6 py-2.5 text-sm transition-colors ${
              name === city
                ? "bg-accent font-medium text-background"
                : "border border-border text-foreground hover:border-accent/40"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        {districts.length === 0 ? (
          <p className="text-sm text-muted">{city}的資料準備中，敬請期待。</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2.5">
              {districts.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() =>
                    setActiveDistricts((prev) => ({ ...prev, [city]: d.name }))
                  }
                  className={`rounded-lg border px-3.5 py-1.5 text-sm transition-colors ${
                    d.name === district.name
                      ? "border-accent text-foreground"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="mr-2 font-medium text-foreground">
                  {district.name}
                </span>
                {(
                  [
                    ["spots", "景點"],
                    ["eats", "小吃／名店"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`rounded-full px-5 py-2 text-sm transition-colors ${
                      key === category
                        ? "bg-accent font-medium text-background"
                        : "border border-border text-muted hover:text-foreground"
                    }`}
                  >
                    {label}（{district[key].length}）
                  </button>
                ))}
              </div>

              {items.length === 0 ? (
                <p className="mt-5 text-sm text-muted">
                  這個分類的資料準備中。
                </p>
              ) : (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {items.map((name) => (
                    <label
                      key={name}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                        isChecked(name)
                          ? "border-accent bg-accent/15 text-foreground"
                          : "border-border text-muted hover:text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked(name)}
                        onChange={() => toggleStop(name)}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      {name}
                      {district.notes?.[name] && (
                        <span className="text-xs text-muted">
                          {district.notes[name]}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {routeStops.length > 0 && (
        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h4 className="font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
              我的路線（{routeStops.length} 站）
            </h4>
            {!tooMany && (
              <a
                href={mapsRouteUrl(routeStops, origin)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                在 Google 地圖開啟整條路線
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canSort}
              onClick={() => setStops(shortestRoute(routeStops, origin))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-500/10"
            >
              <span aria-hidden className="text-amber-500">
                ⚡
              </span>
              排出最短路線
            </button>
            <span className="text-sm text-muted">
              {tooMany
                ? `Google 地圖路線最多 ${MAX_POINTS} 個點（含你的位置），請取消幾個。`
                : canSort
                  ? "依直線距離估算，重新排列下方順序"
                  : "至少 3 個點（含你的位置）才需要排順序"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleOrigin}
              disabled={locating}
              aria-pressed={origin !== null}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm transition-colors disabled:cursor-wait disabled:opacity-60 ${
                origin
                  ? "border-sky-400 bg-sky-500/25 text-sky-300"
                  : "border-sky-500/50 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
              }`}
            >
              <span aria-hidden>◎</span>
              {locating
                ? "定位中…"
                : origin
                  ? "從你的位置出發（點擊取消）"
                  : "從你的位置出發"}
            </button>
            {locateError && (
              <span className="text-sm text-red-400">{locateError}</span>
            )}
          </div>

          <ol className="mt-5 space-y-2 text-sm text-foreground">
            {origin && (
              <li className="flex gap-3">
                <span className="w-5 text-right text-sky-400">◎</span>
                <span className="text-sky-300">你的位置</span>
              </li>
            )}
            {routeStops.map((stop, i) => (
              <li key={`${stop.city}-${stop.name}`} className="flex gap-3">
                <span className="w-5 text-right text-accent">{i + 1}</span>
                <span>
                  {stop.name}
                  <span className="ml-2 text-muted">{stop.city}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
