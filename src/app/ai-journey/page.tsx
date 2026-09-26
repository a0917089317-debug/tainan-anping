import type { Metadata } from "next";
import { TaiwanRegionPicker } from "@/components/taiwan-region-picker";
import { TainanFoodMap } from "@/components/tainan-food-map";

export const metadata: Metadata = {
  title: "AI 旅程 | 台南獨旅",
  description: "用 AI 規劃與打造台南獨旅的過程紀錄。",
};

export default function AiJourneyPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm tracking-[0.3em] text-muted">
            AI JOURNEY
          </p>
          <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
            AI 旅程
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted">
            內容準備中，敬請期待。
          </p>
        </div>
      </section>

      {/* Regions */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs tracking-[0.3em] text-accent">選擇地區</p>
          <h2 className="mt-3 font-[family-name:var(--font-serif-tc)] text-2xl text-foreground sm:text-3xl">
            想去台灣哪裡走走？
          </h2>
          <div className="mt-12">
            <TaiwanRegionPicker />
          </div>
        </div>
      </section>

      {/* Food map */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <TainanFoodMap />
        </div>
      </section>
    </main>
  );
}
