const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface WaitlistPayload {
  email:    string;
  org_type: string;
  name?:    string;
}

export interface WaitlistResult {
  id:       number;
  position: number;
}

export async function joinWaitlist(payload: WaitlistPayload): Promise<WaitlistResult> {
  const res = await fetch(`${API_URL}/api/waitlist`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });

  if (res.status === 409) throw new Error("duplicate");
  if (!res.ok) throw new Error("server_error");

  return res.json() as Promise<WaitlistResult>;
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/api/waitlist/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return (data as { count: number }).count ?? 0;
  } catch {
    return 0;
  }
}
