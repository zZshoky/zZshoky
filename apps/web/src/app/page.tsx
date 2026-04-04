import { getWaitlistCount } from "@/lib/api";
import LandingClient from "@/components/LandingClient";

// Rebuild page with fresh waitlist count every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const count = await getWaitlistCount();
  return <LandingClient initialCount={count} initialLocale="es" />;
}
