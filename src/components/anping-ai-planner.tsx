"use client";

import { useState } from "react";
import {
  categories,
  paces,
  type Plan,
  type Preferences,
  type SpotCategory,
} from "@/lib/anping-plan";

const steps = ["景點分類", "選擇偏好", "AI 排行程"];

function mapsRouteUrl(places: string[]) {
  const named = places.map((p) => `台南市安平區 ${p}`);
  const params = new URLSearchParams({
    api: "1",
    destination: named[named.length - 1],
    travelmode: "walking",
  });
  if (named.length > 1) params.set("origin", named[0]);
  // Google Maps accepts at most 9 waypoints.
  if (named.length > 2) params.set("waypoints", named.slice(1, -1).slice(0, 9).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}

export function AnpingAiPlanner() {
  const [step, setStep] = useState(0);
  const [cats, setCats] = useState<SpotCategory[]>([]);
  const [pace, setPace] = useState<Preferences["pace"]>("normal");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCat = (id: SpotCategory) =>
    setCats(cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id]);

  const generate = async () => {
    setStep(2);
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/anping-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: cats, pace }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "排行程失敗");
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "排行程失敗，請再試一次");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
      {/* Stepper */}
      <ol className="flex items-center gap-2 text-xs sm:text-sm">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              disabled={i > step || loading}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                i === step ? "text-accent" : i < step ? "text-foreground" : "text-muted/60"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                  i <= step ? "border-accent bg-accent/10" : "border-border"
                }`}
              >
                {i + 1}
              </span>
              {label}
            </button>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        ))}
      </ol>

      {/* Step 1: categories */}
      {step === 0 && (
        <div className="mt-8">
          <h3 className="font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
            你想去哪裡？
          </h3>
          <p className="mt-2 text-sm text-muted">可以複選。</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((cat) => {
              const on = cats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCat(cat.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-base transition-colors ${
                    on
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-foreground hover:border-accent/40"
                  }`}
                >
                  <span className="text-2xl" aria-hidden>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={cats.length === 0}
              onClick={() => setStep(1)}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              下一步
            </button>
          </div>
        </div>
      )}

      {/* Step 2: pace */}
      {step === 1 && (
        <div className="mt-8">
          <h3 className="font-[family-name:var(--font-serif-tc)] text-xl text-foreground">
            旅行節奏
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {paces.map((p) => {
              const on = pace === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPace(p.id)}
                  className={`rounded-xl border p-5 text-left transition-colors ${
                    on ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"
                  }`}
                >
                  <span className="text-3xl" aria-hidden>
                    {p.icon}
                  </span>
                  <p className={`mt-3 text-base ${on ? "text-accent" : "text-foreground"}`}>
                    {p.label}
                  </p>
                  <p className="mt-1 text-xs text-muted">{p.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full border border-border px-6 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              上一步
            </button>
            <button
              type="button"
              onClick={generate}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              ✨ 幫我安排獨旅
            </button>
          </div>
        </div>
      )}

      {/* Step 3: result */}
      {step === 2 && (
        <div className="mt-8">
          {loading && (
            <p className="animate-pulse py-16 text-center text-sm text-muted">
              AI 正在幫你排安平獨旅…
            </p>
          )}

          {error && (
            <div className="py-12 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                type="button"
                onClick={generate}
                className="mt-4 rounded-full border border-accent/40 px-5 py-2 text-sm text-accent"
              >
                再試一次
              </button>
            </div>
          )}

          {plan && (
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-[family-name:var(--font-serif-tc)] text-2xl text-foreground">
                  {plan.title}
                </h3>
                <span className="text-xs text-muted">
                  {plan.source === "ai" ? "✨ 由 AI 安排" : "AI 暫時無法使用，改用基本規則排程"}
                </span>
              </div>
              {plan.summary && (
                <p className="mt-3 text-sm leading-7 text-muted">{plan.summary}</p>
              )}

              <div className="mt-8">
                {plan.items.map((item, i) => (
                  <div key={`${item.time}-${item.place}`} className="flex gap-5">
                    <div className="flex w-12 shrink-0 flex-col items-center">
                      <span className="text-sm text-accent">{item.time}</span>
                      <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                      {i !== plan.items.length - 1 && <span className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-8">
                      <h4 className="font-[family-name:var(--font-serif-tc)] text-lg text-foreground">
                        {item.place}
                        {item.minutes > 0 && (
                          <span className="ml-2 text-xs text-muted">約 {item.minutes} 分</span>
                        )}
                      </h4>
                      <p className="mt-1 text-sm leading-7 text-muted">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {plan.tips.length > 0 && (
                <ul className="space-y-2 rounded-xl border border-border bg-background p-4 text-sm leading-7 text-muted">
                  {plan.tips.map((tip) => (
                    <li key={tip}>💡 {tip}</li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="rounded-full border border-border px-6 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  重新選擇
                </button>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={generate}
                    className="rounded-full border border-accent/40 bg-accent/10 px-6 py-2.5 text-sm text-accent transition-colors hover:bg-accent/20"
                  >
                    換一個行程
                  </button>
                  <a
                    href={mapsRouteUrl(plan.items.map((it) => it.place))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Google 地圖路線 ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
