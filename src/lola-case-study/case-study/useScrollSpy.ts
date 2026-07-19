import { useEffect, useMemo, useState } from "react";

/** Nav height + reading line below sticky header */
function defaultScrollOffset() {
  const folio = document.querySelector(".site-nav") || document.querySelector(".folio-nav");
  const mobileBar = document.querySelector(".cs-phase-mobile-bar");
  const navH = folio?.getBoundingClientRect().height ?? 74;
  const barH =
    mobileBar && getComputedStyle(mobileBar).display !== "none"
      ? mobileBar.getBoundingClientRect().height
      : 0;
  return navH + barH + Math.round(window.innerHeight * 0.08);
}

/**
 * Document-order scroll spy with continuous fill between section tops.
 * Active = last section whose top crossed the offset line.
 * Fill keeps advancing through long sticky tracks inside a phase.
 */
export function useScrollSpy(sectionIds: readonly string[], offsetPx?: number) {
  const idsKey = sectionIds.join("|");
  const ids = useMemo(() => (idsKey ? idsKey.split("|") : []), [idsKey]);

  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    if (!ids.length) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];
      if (!sections.length) return;

      const offset = offsetPx ?? defaultScrollOffset();
      let activeIndex = 0;

      for (let i = 0; i < sections.length; i += 1) {
        if (sections[i].getBoundingClientRect().top <= offset) {
          activeIndex = i;
        } else {
          break;
        }
      }

      const next = sections[activeIndex].id;
      setActiveId((prev) => (prev === next ? prev : next));

      const n = sections.length;
      const currentTop = sections[activeIndex].getBoundingClientRect().top;
      const nextTop =
        activeIndex < n - 1
          ? sections[activeIndex + 1].getBoundingClientRect().top
          : currentTop + Math.max(sections[activeIndex].offsetHeight, 1);
      const span = Math.max(nextTop - currentTop, 1);
      const intra = Math.min(1, Math.max(0, (offset - currentTop) / span));
      const pct = n <= 1 ? 100 : ((activeIndex + intra) / (n - 1)) * 100;
      setFillPct(Math.min(100, Math.max(0, pct)));
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [ids, offsetPx]);

  const activeIdx = ids.indexOf(activeId);

  return { activeId, activeIdx, fillPct };
}
