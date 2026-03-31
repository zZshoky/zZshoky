import threading
import os
from flask import Flask, render_template, request, jsonify
import requests
import time
import pandas as pd
from datetime import datetime
import whois

app = Flask(__name__)

# === CONFIG (set via env vars in production) ===
GODADDY_API_KEY = os.environ.get("GODADDY_API_KEY", "")
GODADDY_SECRET  = os.environ.get("GODADDY_SECRET", "")

NICHES = [
    "drone", "vista", "aerial", "inspection", "solar", "energia", "verde", "eco", "limpio", "clean",
    "pet", "vibe", "groom", "movil", "notary", "notario", "prompt", "ai", "vault", "remote", "gear",
    "trabajo", "content", "seo", "caribe", "prints", "job", "flow", "mayaguez", "prclub"
]
SUFFIXES = [".com", ".pr", ".com.pr"]

job_status = {"running": False, "results": [], "log": []}

def generate_candidates():
    candidates = []
    for niche in NICHES:
        for v in [f"{niche}pr", f"pr{niche}", f"{niche}vista", f"{niche}caribe",
                  f"{niche}mayaguez", f"eco{niche}", f"movil{niche}", f"{niche}hub"]:
            for suf in SUFFIXES:
                candidates.append(f"{v}{suf}")
    return list(set(candidates))[:5000]

def check_godaddy_availability(domains_batch):
    headers = {"Authorization": f"sso-key {GODADDY_API_KEY}:{GODADDY_SECRET}"}
    available = []
    try:
        params = {"domain": ",".join(domains_batch)}
        r = requests.get("https://api.godaddy.com/v1/domains/available",
                         headers=headers, params=params, timeout=15)
        if r.status_code == 200:
            for dom in r.json().get("domains", []):
                if dom.get("available"):
                    available.append(dom["domain"])
    except Exception as e:
        job_status["log"].append(f"API error: {e}")
    return available

def run_checker():
    job_status["running"] = True
    job_status["results"] = []
    job_status["log"] = ["Starting domain hunt..."]
    candidates = generate_candidates()
    job_status["log"].append(f"Generated {len(candidates)} candidates")
    batch_size = 50
    for i in range(0, len(candidates), batch_size):
        batch = candidates[i:i+batch_size]
        hits = check_godaddy_availability(batch)
        job_status["results"].extend(hits)
        job_status["log"].append(f"Batch {i//batch_size + 1}: {len(hits)} available (total: {len(job_status['results'])})")
        time.sleep(1.5)
    job_status["log"].append(f"Done. Found {len(job_status['results'])} available domains.")
    job_status["running"] = False

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start", methods=["POST"])
def start():
    if job_status["running"]:
        return jsonify({"error": "Already running"}), 400
    t = threading.Thread(target=run_checker, daemon=True)
    t.start()
    return jsonify({"status": "started"})

@app.route("/status")
def status():
    return jsonify(job_status)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
