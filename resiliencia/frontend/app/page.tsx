import dynamic from "next/dynamic";
import ScoreChart from "@/components/ScoreChart";

const PRMap = dynamic(() => import("@/components/PRMap"), { ssr: false });

const API = process.env.API_BASE_URL || "http://localhost:8000";

async function getMunicipios() {
  try {
    const r = await fetch(`${API}/api/opportunity-score`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const d = await r.json();
    return d.municipios ?? [];
  } catch { return []; }
}

async function getWaveGrid() {
  try {
    const r = await fetch(`${API}/api/wave/grid`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const d = await r.json();
    return d.grid ?? [];
  } catch { return []; }
}

export default async function Dashboard() {
  const [municipios, waveGrid] = await Promise.all([getMunicipios(), getWaveGrid()]);

  const topMuni   = municipios[0];
  const avgPov    = municipios.length
    ? (municipios.reduce((s: number, m: any) => s + m.poverty_pct, 0) / municipios.length).toFixed(1)
    : "—";
  const totalPop  = municipios.reduce((s: number, m: any) => s + (m.population ?? 0), 0);
  const avgWave   = waveGrid.length
    ? (waveGrid.filter((w: any) => w.wave_power_kw_m).reduce((s: number, w: any) => s + w.wave_power_kw_m, 0) /
       waveGrid.filter((w: any) => w.wave_power_kw_m).length).toFixed(2)
    : "—";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Municipios",      val: municipios.length || "—" },
          { label: "Population",      val: totalPop ? totalPop.toLocaleString() : "—" },
          { label: "Avg Poverty",     val: `${avgPov}%` },
          { label: "Avg Wave kW/m",   val: avgWave },
        ].map(({ label, val }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
            <div className="text-2xl font-bold text-pr-gold mt-1">{val}</div>
          </div>
        ))}
      </div>

      {/* Map + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Puerto Rico — Resilience Map
          </h2>
          {/* leaflet CSS must be loaded client-side */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />
          <PRMap municipios={municipios} waveGrid={waveGrid} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <ScoreChart data={municipios} />

          {topMuni && (
            <div className="border-t border-gray-800 pt-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Top Municipio</div>
              <div className="text-lg font-bold text-white">{topMuni.name}</div>
              <div className="text-sm text-pr-gold">Score {topMuni.score}</div>
              <div className="text-xs text-gray-400 mt-1">
                Poverty {topMuni.poverty_pct}% · Pop {topMuni.population?.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Municipio table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 text-sm font-semibold text-gray-300">
          All Municipios
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500">
                {["Municipio","Score","Population","Poverty %","Median Income"].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {municipios.map((m: any) => (
                <tr key={m.geoid} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-2 font-medium text-gray-200">{m.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-black font-bold text-xs"
                      style={{
                        background: m.score >= 70 ? "#22c55e" : m.score >= 50 ? "#eab308" : m.score >= 30 ? "#f97316" : "#ef4444"
                      }}
                    >
                      {m.score}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-300">{m.population?.toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-300">{m.poverty_pct}%</td>
                  <td className="px-4 py-2 text-gray-300">
                    {m.median_inc ? `$${m.median_inc.toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
