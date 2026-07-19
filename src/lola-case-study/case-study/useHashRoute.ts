import { useCallback, useEffect, useState } from "react";

/** Legacy section ids → canonical Double Diamond ids */
const LEGACY_SECTION: Record<string, string> = {
  hook: "prologue",
  overview: "prologue",
  problem: "discover",
  evidence: "discover",
  flows: "develop",
  solution: "develop",
  system: "develop",
  craft: "develop",
  design: "reference",
  proof: "deliver",
  appendix: "reference",
};

export function parseHashLocation() {
  const raw = window.location.hash.replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  let section = parts[0] ?? "";
  if (section && LEGACY_SECTION[section]) {
    section = LEGACY_SECTION[section];
  }
  return { section, segments: parts.slice(1) };
}

export function writeHash(section: string, ...segments: string[]) {
  const path = [section, ...segments.filter(Boolean)].join("/");
  const next = `#${path}`;
  if (window.location.hash !== next) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${next}`,
    );
  }
}

function focusHashTarget(section: string, segments: string[]) {
  if (!section) return;

  let target: HTMLElement | null = null;

  if (section === "develop" && segments[0] === "flows") {
    target = document.getElementById("flow-explorer-panel");
  } else if (section === "discover") {
    target = document.getElementById("problem-tabpanel");
  } else if (section === "reference") {
    target = document.getElementById("reference-tabpanel");
  } else {
    const sectionEl = document.getElementById(section);
    const heading = sectionEl?.querySelector("h2");
    target = heading instanceof HTMLElement ? heading : sectionEl;
  }

  if (!target) return;
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: false });
}

export function useHashLocation() {
  const [loc, setLoc] = useState(() =>
    typeof window === "undefined" ? { section: "", segments: [] as string[] } : parseHashLocation(),
  );

  useEffect(() => {
    const sync = () => {
      const parsed = parseHashLocation();
      const raw = window.location.hash.replace(/^#/, "");
      const first = raw.split("/")[0];
      if (first && LEGACY_SECTION[first]) {
        writeHash(parsed.section, ...parsed.segments);
      }
      setLoc(parsed);
    };

    const onHashChange = () => {
      sync();
      const { section, segments } = parseHashLocation();
      if (section) focusHashTarget(section, segments);
    };

    sync();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setHash = useCallback((section: string, ...segments: string[]) => {
    writeHash(section, ...segments);
    setLoc({ section, segments: segments.filter(Boolean) });
    focusHashTarget(section, segments.filter(Boolean));
  }, []);

  return { ...loc, setHash };
}
