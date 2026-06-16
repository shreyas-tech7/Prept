"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number; // 1 - 10
  size?: number;
  stroke?: number;
  label?: string;
}

function colorFor(score: number) {
  if (score >= 7) return "#10B981";
  if (score >= 4) return "#F59E0B";
  return "#EF4444";
}

export function ScoreRing({
  score,
  size = 120,
  stroke = 9,
  label = "/10",
}: ScoreRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(10, score));
  const targetOffset = circumference * (1 - clamped / 10);
  const color = colorFor(clamped);

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const t = requestAnimationFrame(() => setOffset(targetOffset));
    return () => cancelAnimationFrame(t);
  }, [targetOffset]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className="font-display leading-none"
          style={{ fontSize: size * 0.3, color }}
        >
          {clamped % 1 === 0 ? clamped : clamped.toFixed(1)}
        </span>
        <span
          className="text-[var(--text-secondary)]"
          style={{ fontSize: size * 0.11, marginTop: size * 0.02 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
