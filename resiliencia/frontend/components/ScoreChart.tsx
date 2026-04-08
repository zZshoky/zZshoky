"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Muni { name: string; score: number; poverty_pct: number }

function color(s: number) {
  if (s >= 70) return "#22c55e";
  if (s >= 50) return "#eab308";
  if (s >= 30) return "#f97316";
  return "#ef4444";
}

export default function ScoreChart({ data }: { data: Muni[] }) {
  const top20 = data.slice(0, 20);
  return (
    <div className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 mb-2">Top 20 — Opportunity Score</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={top20} layout="vertical" margin={{ left: 80, right: 16 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: "#d1d5db" }}
            width={78}
          />
          <Tooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151", fontSize: 12 }}
            formatter={(v: number, _: string, p: any) => [
              `${v} (poverty ${p.payload.poverty_pct}%)`,
              "Score",
            ]}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {top20.map((m, i) => <Cell key={i} fill={color(m.score)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
