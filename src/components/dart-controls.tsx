"use client";

const presets = [1, 3, 5];
export const MAX_DARTS = 10;

export function DartControls({
  dartCount,
  onDartCountChange,
  onThrow,
  throwing,
}: {
  dartCount: number;
  onDartCountChange: (count: number) => void;
  onThrow: () => void;
  throwing: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="text-sm text-muted">飛鏢數量</span>
      <div className="flex gap-2">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onDartCountChange(n)}
            className={`h-9 w-9 rounded-full border text-sm transition-colors ${
              dartCount === n
                ? "border-accent bg-accent/20 text-accent"
                : "border-border text-muted hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 rounded-full border border-border px-1">
        <button
          type="button"
          aria-label="減少飛鏢數量"
          onClick={() => onDartCountChange(Math.max(1, dartCount - 1))}
          className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-foreground">
          {dartCount}
        </span>
        <button
          type="button"
          aria-label="增加飛鏢數量"
          onClick={() => onDartCountChange(Math.min(MAX_DARTS, dartCount + 1))}
          className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={onThrow}
        disabled={throwing}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        🎯 擲飛鏢
      </button>
    </div>
  );
}
