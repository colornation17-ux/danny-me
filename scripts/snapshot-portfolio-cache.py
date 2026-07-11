"""Freeze competitor-watch API payloads for portfolio embed (no expiry)."""
from __future__ import annotations

import json
import time
from pathlib import Path

CW_DATA = Path(r"C:\My Web Sites\competitor-watch\data")
API_CACHE = CW_DATA / "api_data_cache.json"
FORECAST_CACHE = CW_DATA / "forecast_cache.json"
OUT = CW_DATA / "portfolio_snapshot.json"


def newest_api_payload() -> dict | None:
    if not API_CACHE.is_file():
        return None
    store = json.loads(API_CACHE.read_text(encoding="utf-8"))
    entries = list((store.get("entries") or {}).values())
    if not entries:
        return None
    entries.sort(key=lambda e: float(e.get("_epoch") or 0), reverse=True)
    payload = entries[0].get("payload")
    return payload if isinstance(payload, dict) else None


def read_forecast_payload() -> dict | None:
    if not FORECAST_CACHE.is_file():
        return None
    obj = json.loads(FORECAST_CACHE.read_text(encoding="utf-8"))
    out = {k: v for k, v in obj.items() if k != "_epoch"}
    return out if out else None


def main() -> None:
    api_data = newest_api_payload()
    forecast = read_forecast_payload()
    if not api_data:
        raise SystemExit("No api_data cache entry — load /api/data once, then re-run.")
    if not forecast:
        raise SystemExit("No forecast cache — load /api/forecast once, then re-run.")

    snapshot = {
        "captured_at": time.strftime("%Y-%m-%d %H:%M"),
        "api_data": api_data,
        "forecast": forecast,
    }
    OUT.write_text(json.dumps(snapshot, separators=(",", ":")), encoding="utf-8")
    deals = sum(len(v) for v in (api_data.get("deals_by_category") or {}).values())
    print(f"wrote {OUT} ({deals} deals, forecast ok)")


if __name__ == "__main__":
    main()
