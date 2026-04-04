import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corpora PR — Inteligencia de Compras del Gobierno de Puerto Rico",
  description:
    "Monitorea licitaciones, contratos y gastos del gobierno de Puerto Rico en tiempo real. Alertas de RFP, inteligencia de vendedores y detección de anomalías.",
  keywords: [
    "Puerto Rico",
    "licitaciones",
    "contratos gobierno",
    "procurement",
    "OCPR",
    "ASG",
    "compras gubernamentales",
  ],
  openGraph: {
    title: "Corpora PR",
    description:
      "Inteligencia de compras del gobierno de Puerto Rico en tiempo real",
    locale: "es_PR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
