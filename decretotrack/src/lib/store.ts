// Simple client-side store using localStorage
// In production, replace with a real database (Supabase, PlanetScale, etc.)

export interface PresenceDay {
  date: string; // YYYY-MM-DD
  present: boolean;
  notes?: string;
}

export interface Donation {
  id: string;
  date: string;
  organization: string;
  amount: number;
  receiptUploaded: boolean;
  notes?: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
  category: "filing" | "donation" | "employment" | "other";
}

export interface UserProfile {
  name: string;
  email: string;
  decreeType: "act20" | "act22" | "act60";
  decreeNumber?: string;
  yearStarted: number;
  annualDonationRequirement: number;
}

const STORAGE_KEYS = {
  presence: "dt_presence_days",
  donations: "dt_donations",
  deadlines: "dt_deadlines",
  profile: "dt_profile",
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Presence Days
export function getPresenceDays(): PresenceDay[] {
  return getFromStorage(STORAGE_KEYS.presence, []);
}

export function togglePresenceDay(date: string): PresenceDay[] {
  const days = getPresenceDays();
  const existing = days.findIndex((d) => d.date === date);
  if (existing >= 0) {
    days.splice(existing, 1);
  } else {
    days.push({ date, present: true });
  }
  saveToStorage(STORAGE_KEYS.presence, days);
  return days;
}

export function getPresenceCount(year: number): number {
  const days = getPresenceDays();
  return days.filter((d) => d.date.startsWith(String(year)) && d.present).length;
}

// Donations
export function getDonations(): Donation[] {
  return getFromStorage(STORAGE_KEYS.donations, []);
}

export function addDonation(donation: Omit<Donation, "id">): Donation[] {
  const donations = getDonations();
  const newDonation = { ...donation, id: crypto.randomUUID() };
  donations.push(newDonation);
  saveToStorage(STORAGE_KEYS.donations, donations);
  return donations;
}

export function removeDonation(id: string): Donation[] {
  const donations = getDonations().filter((d) => d.id !== id);
  saveToStorage(STORAGE_KEYS.donations, donations);
  return donations;
}

export function getDonationTotal(year: number): number {
  return getDonations()
    .filter((d) => d.date.startsWith(String(year)))
    .reduce((sum, d) => sum + d.amount, 0);
}

// Deadlines
export function getDeadlines(): Deadline[] {
  const defaults: Deadline[] = [
    {
      id: "1",
      title: "Annual Report Filing",
      date: `${new Date().getFullYear()}-04-15`,
      description: "File annual compliance report with DDEC",
      completed: false,
      category: "filing",
    },
    {
      id: "2",
      title: "Charitable Donation Deadline",
      date: `${new Date().getFullYear()}-12-31`,
      description: "Complete required charitable donations to PR nonprofits",
      completed: false,
      category: "donation",
    },
    {
      id: "3",
      title: "Employment Report",
      date: `${new Date().getFullYear()}-01-31`,
      description: "Submit employment creation report (Act 20/60 Chapter 3)",
      completed: false,
      category: "employment",
    },
    {
      id: "4",
      title: "PR Tax Return",
      date: `${new Date().getFullYear()}-04-15`,
      description: "File Puerto Rico income tax return",
      completed: false,
      category: "filing",
    },
    {
      id: "5",
      title: "US Tax Return (Extension)",
      date: `${new Date().getFullYear()}-10-15`,
      description: "File US federal tax return (extended deadline)",
      completed: false,
      category: "filing",
    },
  ];
  return getFromStorage(STORAGE_KEYS.deadlines, defaults);
}

export function toggleDeadline(id: string): Deadline[] {
  const deadlines = getDeadlines();
  const dl = deadlines.find((d) => d.id === id);
  if (dl) dl.completed = !dl.completed;
  saveToStorage(STORAGE_KEYS.deadlines, deadlines);
  return deadlines;
}

// Profile
export function getProfile(): UserProfile | null {
  return getFromStorage<UserProfile | null>(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile: UserProfile): void {
  saveToStorage(STORAGE_KEYS.profile, profile);
}
