"""Patch competitor-watch server + frontend for permanent portfolio snapshot mode."""
from pathlib import Path

SERVER = Path(r"C:\My Web Sites\competitor-watch\server.py")
APP = Path(r"C:\My Web Sites\competitor-watch\frontend\src\App.jsx")

# --- server.py ---
t = SERVER.read_text(encoding="utf-8")

if "PORTFOLIO_SNAPSHOT_PATH" not in t:
    t = t.replace(
        'API_DATA_CACHE_PATH = os.path.join(DATA_DIR, "api_data_cache.json")',
        'API_DATA_CACHE_PATH = os.path.join(DATA_DIR, "api_data_cache.json")\n'
        'PORTFOLIO_SNAPSHOT_PATH = os.path.join(DATA_DIR, "portfolio_snapshot.json")',
    )

HELPERS = '''

def _portfolio_snapshot_requested(parsed):
    qs = urllib.parse.parse_qs(parsed.query)
    return (qs.get("snapshot") or [""])[0] == "portfolio"


def _read_portfolio_snapshot(kind):
    if not os.path.isfile(PORTFOLIO_SNAPSHOT_PATH):
        return None
    try:
        with open(PORTFOLIO_SNAPSHOT_PATH, encoding="utf-8") as f:
            store = json.load(f)
        payload = store.get(kind)
        return payload if isinstance(payload, dict) else None
    except (json.JSONDecodeError, OSError, TypeError, ValueError):
        return None


def _portfolio_snapshot_api_data():
    snap = _read_portfolio_snapshot("api_data")
    if not snap:
        return None
    out = dict(snap)
    out["portfolio_snapshot"] = True
    out["flipp_scrape_enabled"] = False
    out["flipp_cache_note"] = "Portfolio showcase — frozen snapshot."
    return out
'''

if "_portfolio_snapshot_requested" not in t:
    t = t.replace(
        "def _api_data_cache_ttl():",
        HELPERS + "\ndef _api_data_cache_ttl():",
    )

FORECAST_OLD = """        if route == "/api/forecast":
            try:
                cfg = load_config()
                qs = urllib.parse.parse_qs(parsed.query)
                refresh = "refresh" in qs
                facts = load_facts(cfg, include_owner=True)
                print(f"[{time.strftime('%H:%M:%S')}] building forecast (refresh={refresh}) ...")
                self._send_json(build_forecast_payload(cfg, facts, refresh=refresh))
                print("  forecast done.")
            except Exception as e:
                self._send_json({"error": str(e)}, status=500)
            return"""

FORECAST_NEW = """        if route == "/api/forecast":
            try:
                qs = urllib.parse.parse_qs(parsed.query)
                if _portfolio_snapshot_requested(parsed):
                    snap = _read_portfolio_snapshot("forecast")
                    if snap:
                        out = dict(snap)
                        out["portfolio_snapshot"] = True
                        self._send_json(out)
                        return
                cfg = load_config()
                refresh = "refresh" in qs and not _portfolio_snapshot_requested(parsed)
                facts = load_facts(cfg, include_owner=True)
                print(f"[{time.strftime('%H:%M:%S')}] building forecast (refresh={refresh}) ...")
                self._send_json(build_forecast_payload(cfg, facts, refresh=refresh))
                print("  forecast done.")
            except Exception as e:
                self._send_json({"error": str(e)}, status=500)
            return"""

if FORECAST_OLD in t:
    t = t.replace(FORECAST_OLD, FORECAST_NEW)

DATA_BUSY_OLD = """                if resource_guard.busy_label():
                    self._send_json(
                        {
                            "error": "Server is busy loading data. Wait a moment and refresh.",
                            "busy": resource_guard.busy_label(),
                        },
                        status=503,
                    )
                    return"""

DATA_BUSY_NEW = """                portfolio_snap = _portfolio_snapshot_requested(parsed)
                if resource_guard.busy_label() and not portfolio_snap:
                    self._send_json(
                        {
                            "error": "Server is busy loading data. Wait a moment and refresh.",
                            "busy": resource_guard.busy_label(),
                        },
                        status=503,
                    )
                    return
                if portfolio_snap:
                    snap_payload = _portfolio_snapshot_api_data()
                    if snap_payload:
                        self._send_json(snap_payload)
                        return"""

if DATA_BUSY_OLD in t:
    t = t.replace(DATA_BUSY_OLD, DATA_BUSY_NEW)

DATA_CACHE_INSERT = """                if force:
                    for fn in os.listdir(CACHE_DIR):"""

DATA_CACHE_NEW = """                if _portfolio_snapshot_requested(parsed):
                    snap_payload = _portfolio_snapshot_api_data()
                    if snap_payload:
                        self._send_json(snap_payload)
                        return
                if force and not _portfolio_snapshot_requested(parsed):
                    for fn in os.listdir(CACHE_DIR):"""

if "if _portfolio_snapshot_requested(parsed):" not in t.split('if route == "/api/data":')[1].split("if force:")[0]:
    t = t.replace(DATA_CACHE_INSERT, DATA_CACHE_NEW, 1)

DATA_503_OLD = """                payload = _rg.try_run("api_data", _build)
                if payload is None:
                    self._send_json(
                        {
                            "error": "Server is busy with another job. Wait a moment and refresh.",
                            "busy": _rg.busy_label(),
                        },
                        status=503,
                    )
                    return"""

DATA_503_NEW = """                if _portfolio_snapshot_requested(parsed):
                    snap_payload = _portfolio_snapshot_api_data()
                    if snap_payload:
                        self._send_json(snap_payload)
                        return
                payload = _rg.try_run("api_data", _build)
                if payload is None:
                    if _portfolio_snapshot_requested(parsed):
                        snap_payload = _portfolio_snapshot_api_data()
                        if snap_payload:
                            self._send_json(snap_payload)
                            return
                    self._send_json(
                        {
                            "error": "Server is busy with another job. Wait a moment and refresh.",
                            "busy": _rg.busy_label(),
                        },
                        status=503,
                    )
                    return"""

if DATA_503_OLD in t:
    t = t.replace(DATA_503_OLD, DATA_503_NEW)

SERVER.write_text(t, encoding="utf-8")
print("patched server.py")

# --- App.jsx ---
app = APP.read_text(encoding="utf-8")

SNAP_HELPER = """
function portfolioSnapshotQuery() {
  return isPortfolioEmbed() ? "snapshot=portfolio" : "";
}
"""

if "portfolioSnapshotQuery" not in app:
    app = app.replace(
        "function tabFromUrl() {",
        SNAP_HELPER + "\nfunction tabFromUrl() {",
    )

FORECAST_FETCH_OLD = """      const res = await apiFetch(`${API}/api/forecast${refresh ? "?refresh=1" : ""}`);"""
FORECAST_FETCH_NEW = """      const snap = portfolioSnapshotQuery();
      const qs = [];
      if (snap) qs.push(snap);
      else if (refresh) qs.push("refresh=1");
      const res = await apiFetch(`${API}/api/forecast${qs.length ? "?" + qs.join("&") : ""}`);"""

if FORECAST_FETCH_OLD in app:
    app = app.replace(FORECAST_FETCH_OLD, FORECAST_FETCH_NEW)

DEALS_PARAMS_OLD = """      const params = [];
      if (refresh) params.push("refresh=1");
      if (refreshNational) params.push("refresh_national=1");"""

DEALS_PARAMS_NEW = """      const params = [];
      const snap = portfolioSnapshotQuery();
      if (snap) {
        params.push(snap);
      } else {
        if (refresh) params.push("refresh=1");
        if (refreshNational) params.push("refresh_national=1");
      }"""

if DEALS_PARAMS_OLD in app:
    app = app.replace(DEALS_PARAMS_OLD, DEALS_PARAMS_NEW)

REFRESH_CURRENT_OLD = """    else if (activeTab === "deals") fetchDeals(true, activeZips, benchmarkProfile, true);
    else fetchDeals(true, activeZips, benchmarkProfile);"""

REFRESH_CURRENT_NEW = """    else if (activeTab === "deals") fetchDeals(!portfolioEmbed, activeZips, benchmarkProfile, !portfolioEmbed);
    else fetchDeals(!portfolioEmbed, activeZips, benchmarkProfile);"""

if REFRESH_CURRENT_OLD in app:
    app = app.replace(REFRESH_CURRENT_OLD, REFRESH_CURRENT_NEW)

APP.write_text(app, encoding="utf-8")
print("patched App.jsx")
