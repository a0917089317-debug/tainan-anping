"use client";

import { useState } from "react";
import { TripPlanner } from "@/components/trip-planner";

const regions = [
  { name: "台北市", highlights: "台北101、故宮、士林夜市" },
  { name: "新北市", highlights: "九份、十分、淡水老街" },
  { name: "基隆市", highlights: "廟口夜市、和平島、正濱漁港" },
  { name: "桃園市", highlights: "大溪老街、石門水庫、拉拉山" },
  { name: "新竹市", highlights: "城隍廟、十七公里海岸線" },
  { name: "新竹縣", highlights: "內灣老街、司馬庫斯" },
  { name: "苗栗縣", highlights: "勝興車站、南庄老街" },
  { name: "台中市", highlights: "高美濕地、審計新村、逢甲夜市" },
  { name: "彰化縣", highlights: "鹿港老街、扇形車庫" },
  { name: "南投縣", highlights: "日月潭、清境農場、合歡山" },
  { name: "雲林縣", highlights: "北港朝天宮、劍湖山" },
  { name: "嘉義市", highlights: "檜意森活村、文化路夜市" },
  { name: "嘉義縣", highlights: "阿里山、奮起湖" },
  { name: "台南市", highlights: "安平古堡、赤崁樓、神農街" },
  { name: "高雄市", highlights: "駁二、旗津、蓮池潭" },
  { name: "屏東縣", highlights: "墾丁、小琉球、恆春古城" },
  { name: "宜蘭縣", highlights: "礁溪溫泉、太平山、龜山島" },
  { name: "花蓮縣", highlights: "太魯閣、七星潭、清水斷崖" },
  { name: "台東縣", highlights: "池上、三仙台、綠島、蘭嶼" },
  { name: "澎湖縣", highlights: "雙心石滬、跨海大橋、花火節" },
  { name: "金門縣", highlights: "莒光樓、翟山坑道、水頭聚落" },
  { name: "連江縣", highlights: "馬祖藍眼淚、芹壁聚落" },
];

const timetables = [
  {
    label: "火車時刻表",
    href: "https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytime",
  },
  {
    label: "高鐵時刻表",
    href: "https://www.thsrc.com.tw/ArticleContent/a3b630bb-1066-4352-a1ef-58c7b4e8ef7c",
  },
];

export function TaiwanRegionPicker() {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(["台南市", "高雄市"]),
  );

  const [submitted, setSubmitted] = useState<string[] | null>(null);
  const [origin, setOrigin] = useState("");

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(
      regions.filter((r) => selected.has(r.name)).map((r) => r.name),
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-3 text-sm text-muted">
          出發點
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="rounded-full border border-border bg-background-elevated px-4 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="">請選擇縣市</option>
            {regions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </label>
        {timetables.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
          >
            {link.label}
            <span aria-hidden>↗</span>
          </a>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => {
          const checked = selected.has(region.name);
          return (
            <label
              key={region.name}
              className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                checked
                  ? "border-accent bg-accent/15"
                  : "border-border bg-background-elevated hover:border-accent/40"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(region.name)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <span className="font-medium text-foreground">
                  {region.name}
                </span>
              </span>
              <span className="mt-1 block text-sm text-muted">
                {region.highlights}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selected.size === 0}
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          送出
        </button>
      </div>

      {submitted && (
        <div className="mt-12">
          <TripPlanner cities={submitted} />
        </div>
      )}
    </div>
  );
}
