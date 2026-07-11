"""Patch competitor-watch for portfolio embed showcase."""
from pathlib import Path

ROOT = Path(r"C:\My Web Sites\competitor-watch\frontend\src")

# portfolio-embed.css
(ROOT / "styles" / "portfolio-embed.css").write_text(
    """/* Portfolio iframe — hide chrome that blocks the hero crop */
html.cw-portfolio-embed footer { display: none !important; }
html.cw-portfolio-embed [data-slot="sidebar"],
html.cw-portfolio-embed [data-sidebar="sidebar"] { display: none !important; }
html.cw-portfolio-embed [data-slot="sidebar-inset"],
html.cw-portfolio-embed main { margin-left: 0 !important; width: 100% !important; max-width: 100% !important; }
html.cw-portfolio-embed [data-sidebar="trigger"] { display: none !important; }
html.cw-portfolio-embed [data-sidebar="footer"] { display: none !important; }
html.cw-portfolio-embed #insights-upload,
html.cw-portfolio-embed .cw-portfolio-hide { display: none !important; }
html.cw-portfolio-embed header.sticky { padding-top: 0.35rem; padding-bottom: 0.35rem; }
html.cw-portfolio-embed [aria-labelledby="insights-page-title"] > div:first-of-type { margin-bottom: 0.5rem; }
html.cw-portfolio-embed [aria-labelledby="insights-page-title"] h1 { font-size: 1.35rem; }
html.cw-portfolio-embed #market-settings-panel { display: none !important; }
html.cw-portfolio-embed .scroll-mt-section,
html.cw-portfolio-embed [id^="insights-"] { scroll-margin-top: 4.5rem; }
""",
    encoding="utf-8",
)

(ROOT / "lib" / "portfolioEmbed.js").write_text(
    '''/** True when loaded inside the danny-me portfolio iframe (?embed=portfolio). */
export function isPortfolioEmbed() {
  return new URLSearchParams(window.location.search).get("embed") === "portfolio";
}
''',
    encoding="utf-8",
)

# MarketSettingsBar
msb = ROOT / "components" / "MarketSettingsBar.jsx"
t = msb.read_text(encoding="utf-8")
if "isPortfolioEmbed" not in t:
    t = t.replace(
        'import { cn } from "@/lib/utils";',
        'import { cn } from "@/lib/utils";\nimport { isPortfolioEmbed } from "@/lib/portfolioEmbed";',
    )
    t = t.replace(
        "  const isMobile = useIsMobile();\n  const [open, setOpen] = useState(false);",
        "  const isMobile = useIsMobile();\n  const portfolioEmbed = isPortfolioEmbed();\n  const [open, setOpen] = useState(false);",
    )
    t = t.replace(
        "  useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect -- expand/collapse the bar to match the viewport size\n    setOpen(!isMobile);\n  }, [isMobile]);",
        "  useEffect(() => {\n    if (portfolioEmbed) return;\n    // eslint-disable-next-line react-hooks/set-state-in-effect -- expand/collapse the bar to match the viewport size\n    setOpen(!isMobile);\n  }, [isMobile, portfolioEmbed]);",
    )
    msb.write_text(t, encoding="utf-8")

# App.jsx
app = ROOT / "App.jsx"
t = app.read_text(encoding="utf-8")
if "<SidebarProvider defaultOpen>" in t:
    t = t.replace("<SidebarProvider defaultOpen>", "<SidebarProvider defaultOpen={!portfolioEmbed}>")

SCROLL_OLD = """      const scrollToHash = () => {
        if (!data.hash) return;
        const el = document.getElementById(data.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      };
      requestAnimationFrame(scrollToHash);
      [450, 1200, 2000, 2800].forEach((ms) => window.setTimeout(scrollToHash, ms));"""

SCROLL_NEW = """      const scrollToTarget = () => {
        if (data.hash) {
          const el = document.getElementById(data.hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const main = document.getElementById("main-content");
          if (main) main.scrollTop = 0;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      };
      requestAnimationFrame(scrollToTarget);
      [450, 1200, 2000, 2800].forEach((ms) => window.setTimeout(scrollToTarget, ms));"""

if SCROLL_OLD in t:
    t = t.replace(SCROLL_OLD, SCROLL_NEW)
elif "scrollToTarget" not in t:
    t = t.replace("scrollToHash", "scrollToTarget")

# InsightsSection
ins = ROOT / "components" / "InsightsSection.jsx"
t2 = ins.read_text(encoding="utf-8")
old = 'if (hash === "insights-owner" || hash === "insights-merchandising") return "owner";'
new = 'if (hash === "insights-owner" || hash === "insights-merchandising" || hash === "insights-demand") return "owner";'
if old in t2:
    t2 = t2.replace(old, new)
if "portfolioEmbed" not in t2:
    t2 = t2.replace(
        "import DemandForecastPanel",
        'import { isPortfolioEmbed } from "../lib/portfolioEmbed";\nimport DemandForecastPanel',
    )
    t2 = t2.replace(
        '  const [insightsTab, setInsightsTab] = useState("sales");',
        """  const portfolioEmbed = isPortfolioEmbed();
  const showcaseMeta = portfolioEmbed
    ? { ...appMeta, owner_features_available: true, owner_features: appMeta?.owner_features ?? false }
    : appMeta;
  const [insightsTab, setInsightsTab] = useState("sales");""",
    )
    t2 = t2.replace("{appMeta?.owner_features_available && (", "{showcaseMeta?.owner_features_available && (")
    t2 = t2.replace("{!appMeta?.owner_features ? (", "{!showcaseMeta?.owner_features ? (")
    t2 = t2.replace("<OwnerToolsGuestPreviews appMeta={appMeta} />", "<OwnerToolsGuestPreviews appMeta={showcaseMeta} />")
    t2 = t2.replace(
        """      <StoreDataConnectPanel
        dataSource={data.data_source}
        onComplete={onUploadComplete}
        hasLiveData={hasUploadedData}
        demoLocked={appMeta?.demo_mode}
        guestLocked={guestLocked}
      />""",
        """      {!portfolioEmbed && (
      <StoreDataConnectPanel
        dataSource={data.data_source}
        onComplete={onUploadComplete}
        hasLiveData={hasUploadedData}
        demoLocked={appMeta?.demo_mode}
        guestLocked={guestLocked}
      />
      )}""",
    )
    t2 = t2.replace("{!hasUploadedData && !guestLocked && (", "{!portfolioEmbed && !hasUploadedData && !guestLocked && (")
ins.write_text(t2, encoding="utf-8")
app.write_text(t, encoding="utf-8")

print("patched competitor-watch portfolio embed")
