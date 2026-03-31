import requests
import time
import json
import pandas as pd
from datetime import datetime
# pip install python-whois if using fallback
import whois  # fallback

# === CONFIG ===
GODADDY_API_KEY = "YOUR_API_KEY_HERE"
GODADDY_SECRET = "YOUR_SECRET_HERE"
HEADERS = {"Authorization": f"sso-key {GODADDY_API_KEY}:{GODADDY_SECRET}"}

# Niche keywords for our PYME factory (expand ruthlessly)
NICHES = [
    "drone", "vista", "aerial", "inspection", "solar", "energia", "verde", "eco", "limpio", "clean",
    "pet", "vibe", "groom", "movil", "notary", "notario", "prompt", "ai", "vault", "remote", "gear",
    "trabajo", "content", "seo", "caribe", "prints", "job", "flow", "mayaguez", "prclub"
]

SUFFIXES = [".com", ".pr", ".com.pr"]  # .pr for local premium trust

def generate_candidates(count_per_niche=50):
    candidates = []
    for niche in NICHES:
        for i in range(count_per_niche):
            # Smart variations: exact, prefix, suffix, geo-blend
            vars = [
                f"{niche}pr", f"pr{niche}", f"{niche}vista", f"{niche}caribe",
                f"{niche}mayaguez", f"eco{niche}", f"movil{niche}", f"{niche}hub"
            ]
            for v in vars:
                for suf in SUFFIXES:
                    candidates.append(f"{v}{suf}")
    return list(set(candidates))[:5000]  # dedupe + cap

def check_godaddy_availability(domains_batch):
    """Bulk check via GoDaddy API (max ~500 per call, but loop safely)"""
    available = []
    try:
        params = {"domain": ",".join(domains_batch)}  # or individual calls for reliability
        response = requests.get("https://api.godaddy.com/v1/domains/available", headers=HEADERS, params=params, timeout=15)
        if response.status_code == 200:
            data = response.json()
            for dom in data.get("domains", []):
                if dom.get("available"):
                    available.append(dom["domain"])
    except Exception as e:
        print(f"API error: {e}")
    return available

def fallback_whois_check(domain):
    try:
        w = whois.whois(domain)
        if w.status is None or "available" in str(w).lower():
            return True
    except:
        pass
    return False

# === MAIN EXECUTION ===
print(f"[{datetime.now()}] Generating & hunting domains for PR PYME factory...")

candidates = generate_candidates(100)  # Start conservative; scale up
available_hits = []

batch_size = 50
for i in range(0, len(candidates), batch_size):
    batch = candidates[i:i+batch_size]
    hits = check_godaddy_availability(batch)
    available_hits.extend(hits)
    print(f"Batch {i//batch_size + 1}: {len(hits)} available")
    time.sleep(1.5)  # Rate limit safety

# Save results
df = pd.DataFrame({"domain": available_hits})
df.to_csv(f"available_pyme_domains_{datetime.now().strftime('%Y%m%d_%H%M')}.csv", index=False)
print(f"\nFound {len(available_hits)} available domains! Saved to CSV.")
print("Top recommendations for immediate registration:")
print(df.head(20))

# Optional: Filter for expired-like (older creation via WHOIS if needed)
