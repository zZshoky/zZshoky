"use client";
import { useEffect, useRef } from "react";
import type { Map as LMap } from "leaflet";

// Municipio centroid lookup (FIPS → [lat, lon])
const CENTROIDS: Record<string, [number, number]> = {
  "72001": [18.45, -67.15], "72003": [18.45, -66.70], "72005": [18.38, -66.86],
  "72007": [18.49, -66.97], "72009": [18.43, -66.56], "72011": [18.22, -66.16],
  "72013": [18.08, -66.92], "72015": [18.38, -65.97], "72017": [18.47, -66.39],
  "72019": [18.43, -66.30], "72021": [18.25, -66.49], "72023": [18.36, -65.88],
  "72025": [18.40, -66.08], "72027": [18.45, -66.47], "72029": [18.35, -66.22],
  "72031": [18.15, -66.74], "72033": [18.29, -67.18], "72035": [18.42, -66.85],
  "72037": [18.46, -67.04], "72039": [18.30, -65.62], "72041": [18.18, -65.83],
  "72043": [18.30, -65.74], "72045": [18.47, -67.18], "72047": [18.38, -66.75],
  "72049": [18.11, -66.12], "72051": [18.03, -66.26], "72053": [18.47, -65.67],
  "72054": [18.00, -66.62], "72055": [18.37, -67.15], "72057": [18.08, -66.75],
  "72059": [18.35, -66.42], "72061": [18.25, -66.80], "72063": [18.01, -66.02],
  "72065": [18.47, -65.92], "72067": [18.30, -66.35], "72069": [18.20, -66.65],
  "72071": [18.42, -67.03], "72073": [18.22, -67.05], "72075": [18.19, -66.55],
  "72077": [18.46, -66.55], "72079": [18.32, -66.59], "72081": [18.33, -66.18],
  "72083": [18.07, -66.45], "72085": [18.47, -65.48], "72087": [18.42, -65.88],
  "72089": [18.40, -66.96], "72091": [18.38, -66.65], "72093": [18.16, -65.72],
  "72095": [18.43, -67.13], "72097": [18.30, -66.88], "72099": [18.47, -66.24],
  "72101": [18.09, -67.15], "72103": [18.47, -66.80], "72105": [18.02, -66.80],
  "72107": [18.47, -65.78], "72109": [18.38, -65.76], "72111": [18.47, -67.08],
  "72113": [18.47, -66.62], "72115": [18.47, -65.55], "72117": [18.03, -66.55],
  "72119": [18.03, -66.38], "72121": [18.31, -66.04], "72123": [18.12, -66.95],
  "72125": [18.30, -67.08], "72127": [18.47, -66.31], "72129": [18.47, -65.84],
  "72131": [18.25, -65.83], "72133": [18.47, -66.17], "72135": [18.47, -65.68],
  "72137": [18.36, -66.10], "72139": [18.35, -66.73], "72141": [18.08, -66.62],
  "72143": [18.47, -67.18], "72145": [18.47, -65.72], "72147": [18.35, -65.62],
  "72149": [18.13, -66.28], "72151": [18.47, -66.44], "72153": [18.25, -65.65],
};

interface Muni {
  geoid: string;
  name: string;
  score: number;
  poverty_pct: number;
  population: number;
}

interface WavePoint {
  lat: number;
  lon: number;
  wave_power_kw_m: number | null;
}

interface Props {
  municipios: Muni[];
  waveGrid?: WavePoint[];
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#eab308";
  if (score >= 30) return "#f97316";
  return "#ef4444";
}

export default function PRMap({ municipios, waveGrid = [] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(ref.current!, {
        center: [18.22, -66.4],
        zoom: 9,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Municipio circles
      municipios.forEach((m) => {
        const coords = CENTROIDS[m.geoid];
        if (!coords) return;
        const r = Math.sqrt(m.population / Math.PI) / 10;
        L.circleMarker(coords, {
          radius:      Math.max(6, Math.min(r, 20)),
          fillColor:   scoreColor(m.score),
          color:       "#1f2937",
          weight:      1,
          opacity:     0.9,
          fillOpacity: 0.75,
        })
          .bindPopup(`
            <div class="text-sm font-mono">
              <strong>${m.name}</strong><br/>
              Score: <b>${m.score}</b><br/>
              Poverty: ${m.poverty_pct}%<br/>
              Pop: ${m.population?.toLocaleString()}
            </div>
          `)
          .addTo(map);
      });

      // Wave grid heatmap markers
      waveGrid.forEach((pt) => {
        if (!pt.wave_power_kw_m) return;
        const intensity = Math.min(pt.wave_power_kw_m / 30, 1); // norm 0–30 kW/m
        const blue = Math.round(100 + intensity * 155);
        L.circleMarker([pt.lat, pt.lon], {
          radius:      8,
          fillColor:   `rgb(0,${Math.round(intensity * 180)},${blue})`,
          color:       "#0ea5e9",
          weight:      1,
          opacity:     0.7,
          fillOpacity: 0.5,
        })
          .bindPopup(`Wave: ${pt.wave_power_kw_m} kW/m`)
          .addTo(map);
      });

      // Legend
      const legend = new (L.Control.extend({
        onAdd() {
          const div = L.DomUtil.create("div", "bg-gray-900 p-2 rounded text-xs text-white");
          div.innerHTML = `
            <div class="font-bold mb-1">Opp. Score</div>
            ${[["#22c55e","≥70"],["#eab308","50–69"],["#f97316","30–49"],["#ef4444","<30"]]
              .map(([c,l]) => `<div class="flex items-center gap-1"><span style="background:${c}" class="w-3 h-3 rounded-full inline-block"></span>${l}</div>`)
              .join("")}
            <div class="mt-1 font-bold">Wave (blue ●)</div>
          `;
          return div;
        },
      }))({ position: "bottomright" });
      legend.addTo(map);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // mount once; data passed as props on first render

  return (
    <div
      ref={ref}
      className="w-full rounded-lg overflow-hidden border border-gray-700"
      style={{ height: 480 }}
    />
  );
}
