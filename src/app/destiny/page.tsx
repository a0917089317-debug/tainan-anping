import type { Metadata } from "next";
import { AnpingRoulette } from "@/components/anping-roulette";

export const metadata: Metadata = {
  title: "安平命運輪盤 | 台南獨旅",
};

export default function DestinyPage() {
  return (
    <main className="flex-1">
      <section className="px-6 pt-24 pb-24 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm tracking-[0.3em] text-muted">
              ANPING · ROULETTE
            </p>
            <h1 className="font-[family-name:var(--font-serif-tc)] text-4xl leading-tight text-foreground sm:text-5xl">
              安平命運輪盤
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground sm:text-xl">
              🎡 輕鬆旅行，讓命運替你選一站。
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted">
              轉一下，看看今天的安平會帶你去哪裡。
            </p>
          </div>

          <AnpingRoulette />
        </div>
      </section>
    </main>
  );
}
