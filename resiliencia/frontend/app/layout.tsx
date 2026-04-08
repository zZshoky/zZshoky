import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resiliencia Boricua",
  description: "Puerto Rico resilience & opportunity intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased">
        <header className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
          <div className="w-2 h-8 bg-pr-red rounded-sm" />
          <h1 className="text-lg font-bold tracking-tight text-white">
            Resiliencia <span className="text-pr-gold">Boricua</span>
          </h1>
          <span className="ml-auto text-xs text-gray-500">MVP · Puerto Rico Data Engine</span>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
