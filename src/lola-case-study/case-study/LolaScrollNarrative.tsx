import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { CTA, PROJECT, WHATSAPP_LIVE } from "./constants";
import {
  HERO_FRAME,
  LOLA_CHARACTER_FRAME,
  LOLA_FEATURES,
  LOLA_SCROLL_ACTS,
  LOLA_SCROLL_ASSETS,
  PROBLEM_BUBBLES,
  SERVICE_LOOP_STEPS,
} from "./lolaScrollCopy";

gsap.registerPlugin(ScrollTrigger);

const WAVE_HEIGHTS = [35, 65, 50, 80, 42, 70, 48, 85, 55];

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function segT(p: number, start: number, end: number) {
  return clamp01((p - start) / (end - start));
}

function crossOpacity(p: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  if (p < inStart) return 0;
  if (p < inEnd) return segT(p, inStart, inEnd);
  if (p < outStart) return 1;
  if (p < outEnd) return 1 - segT(p, outStart, outEnd);
  return 0;
}

export function LolaScrollNarrative() {
  const reduce = useReducedMotion();
  const [staticView, setStaticView] = useState(false);
  const isStatic = reduce || staticView;
  const [scrollActTitle, setScrollActTitle] = useState(LOLA_SCROLL_ACTS[0]?.title ?? "");
  const lastActRef = useRef(0);
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLImageElement>(null);
  const lolaRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStatic) return;

    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    const lenisRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    const apply = (p: number) => {
      const store = storeRef.current;
      const lola = lolaRef.current;
      const service = serviceRef.current;
      const bg = bgRef.current;
      const cta = ctaRef.current;

      if (bg) {
        const whiteMix = segT(p, 0.88, 0.98);
        const r = Math.round(238 + (255 - 238) * whiteMix);
        const g = Math.round(237 + (255 - 237) * whiteMix);
        const b = Math.round(236 + (255 - 236) * whiteMix);
        bg.style.background = `rgb(${r},${g},${b})`;
        stage.style.setProperty("--lola-scrim", `rgb(${r},${g},${b})`);
      }

      const storeScale = 1 + 0.1 * segT(p, 0.22, 0.5);
      const storeOpacity = 1 - segT(p, 0.48, 0.58);
      if (store) {
        store.style.opacity = String(storeOpacity);
        store.style.transform = `scale(${storeScale})`;
      }

      if (lola) {
        const lolaOpacity = crossOpacity(p, 0.48, 0.56, 0.68, 0.76);
        lola.style.opacity = String(lolaOpacity);
        lola.style.transform = `translateY(${(1 - lolaOpacity) * 20}px)`;
      }

      if (service) {
        service.style.opacity = String(segT(p, 0.72, 0.8));
        service.style.transform = `translateY(${(1 - segT(p, 0.72, 0.8)) * 16}px)`;
      }

      if (cta) {
        const ctaOpacity = segT(p, 0.84, 0.94);
        cta.style.opacity = String(ctaOpacity);
        cta.style.transform = `translate(-50%, ${(1 - ctaOpacity) * 12}px)`;
        cta.style.pointerEvents = ctaOpacity > 0.5 ? "auto" : "none";
      }

      const panelRanges: [number, number, number, number][] = [
        [0, 0.06, 0.18, 0.24],
        [0.22, 0.28, 0.44, 0.5],
        [0.5, 0.56, 0.66, 0.72],
        [0.72, 0.78, 0.92, 0.98],
      ];

      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const [inS, inE, outS, outE] = panelRanges[i];
        const opacity = crossOpacity(p, inS, inE, outS, outE);
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 10}px)`;
      });

      bubbleRefs.current.forEach((el, i) => {
        if (!el) return;
        const seed = PROBLEM_BUBBLES[i];
        if (!seed) return;
        const reveal = segT(p, 0.24 + seed.delay, 0.24 + seed.delay + 0.12);
        const hide = 1 - segT(p, 0.46, 0.54);
        const opacity = p >= 0.22 && p < 0.54 ? reveal * hide : 0;
        el.style.opacity = String(opacity * 0.92);
        el.style.transform = `translateY(${(1 - reveal) * 16}px)`;
      });

      const lolaSub = clamp01((p - 0.5) / 0.22);
      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = i * 0.18;
        const featOpacity = p >= 0.5 && p < 0.72 ? segT(lolaSub, start, start + 0.28) : 0;
        el.style.opacity = String(featOpacity);
        el.style.transform = `translateX(${(1 - featOpacity) * -12}px)`;
        el.classList.toggle("is-active", featOpacity > 0.85);
      });

      const loopSub = clamp01((p - 0.72) / 0.28);
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = i * 0.2;
        const stepOpacity = p >= 0.72 ? segT(loopSub, start, start + 0.35) : 0;
        el.style.opacity = String(stepOpacity);
        el.classList.toggle("is-active", stepOpacity > 0.85);
      });

      const actIndex = p < 0.22 ? 0 : p < 0.5 ? 1 : p < 0.72 ? 2 : 3;
      stage.dataset.scrollAct = String(actIndex);
      if (actIndex !== lastActRef.current) {
        lastActRef.current = actIndex;
        const act = LOLA_SCROLL_ACTS[actIndex];
        if (act) setScrollActTitle(act.title);
      }
    };

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: stage,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => apply(self.progress),
      onLeave: () => {
        stage.classList.add("lola-scroll-stage--past");
      },
      onEnterBack: () => {
        stage.classList.remove("lola-scroll-stage--past");
      },
    });

    apply(0);

    return () => {
      st.kill();
      lenis.destroy();
      gsap.ticker.remove(lenisRaf);
      ScrollTrigger.refresh();
    };
  }, [isStatic]);

  return (
    <section
      ref={wrapperRef}
      className={`lola-scroll${isStatic ? " lola-scroll--static" : ""}`}
      aria-label="Project Lola scroll narrative"
    >
      <div className="lola-scroll-top-actions">
        <a href="#discover" className="lola-scroll-skip">
          Skip scroll story
        </a>
        {!reduce ? (
          <button
            type="button"
            className="lola-scroll-static-toggle"
            aria-pressed={staticView}
            onClick={() => setStaticView((v) => !v)}
          >
            {staticView ? "Scroll story" : "Show full story"}
          </button>
        ) : null}
        <a href="#discover" className="lola-scroll-continue">
          Continue to Discover ↓
        </a>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {scrollActTitle}
      </p>
      <div className="lola-scroll-pin">
        <div ref={stageRef} className="lola-scroll-stage">
          <div ref={bgRef} className="lola-scroll-bg" aria-hidden />

          <div className="lola-scroll-progress" aria-label="Scroll progress">
            {LOLA_SCROLL_ACTS.map((act, i) => (
              <span
                key={act.id}
                className="lola-scroll-progress-dot"
                data-act={i}
                aria-label={act.title}
              />
            ))}
          </div>

          <div className="lola-scroll-canvas" aria-hidden>
            <img
              ref={storeRef}
              className="lola-scroll-img lola-scroll-img--store"
              src={LOLA_SCROLL_ASSETS.store}
              alt=""
              width={HERO_FRAME.width}
              height={HERO_FRAME.height}
              decoding="async"
              fetchPriority="high"
            />
          </div>

          <div className="lola-scroll-visual-mask" aria-hidden />

          <div className="lola-scroll-bubbles" aria-hidden>
            {PROBLEM_BUBBLES.map((seed, i) => (
              <div
                key={seed.id}
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                className={`lola-scroll-bubble${"waveform" in seed && seed.waveform ? " lola-scroll-bubble--wave" : ""}`}
                style={{ left: `${seed.x}%`, top: `${seed.y}%` }}
              >
                {seed.text}
                {"waveform" in seed && seed.waveform ? (
                  <div className="lola-scroll-bubble-wave" aria-hidden>
                    {WAVE_HEIGHTS.map((h, j) => (
                      <span key={j} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div ref={lolaRef} className="lola-scroll-lola-reveal" style={{ opacity: 0 }}>
            <img
              className="lola-scroll-lola-portrait"
              src={LOLA_SCROLL_ASSETS.lolaCharacter}
              alt="Lola — La Bodega's bilingual WhatsApp assistant"
              width={LOLA_CHARACTER_FRAME.width}
              height={LOLA_CHARACTER_FRAME.height}
              decoding="async"
            />
            <div className="lola-scroll-features" aria-label="What Lola does">
              {LOLA_FEATURES.map((feat, i) => (
                <div
                  key={feat.id}
                  ref={(el) => {
                    featureRefs.current[i] = el;
                  }}
                  className="lola-scroll-feature"
                  style={{ opacity: 0 }}
                >
                  <span className="lola-scroll-feature-icon" aria-hidden>
                    {feat.icon}
                  </span>
                  <div>
                    <p className="lola-scroll-feature-label">{feat.label}</p>
                    <p className="lola-scroll-feature-detail">{feat.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={serviceRef} className="lola-scroll-service" style={{ opacity: 0 }}>
            <ol className="lola-scroll-loop" aria-label="End-to-end service loop">
              {SERVICE_LOOP_STEPS.map((step, i) => (
                <li
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="lola-scroll-loop-step"
                  style={{ opacity: 0 }}
                >
                  <span className="lola-scroll-loop-icon" aria-hidden>
                    {step.icon}
                  </span>
                  <span className="lola-scroll-loop-label">{step.label}</span>
                  {i < SERVICE_LOOP_STEPS.length - 1 ? (
                    <span className="lola-scroll-loop-arrow" aria-hidden>
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div ref={ctaRef} className="lola-scroll-exit-cta" style={{ opacity: 0 }}>
            <a href={CTA.exploreFlowsHref} className="lola-scroll-exit-cta-primary">
              {CTA.exploreFlows} ↓
            </a>
            <a
              href={WHATSAPP_LIVE.waMe}
              target="_blank"
              rel="noopener noreferrer"
              className="lola-scroll-exit-cta-secondary"
            >
              {CTA.messageWhatsApp}
            </a>
          </div>

          <div className="lola-scroll-copy">
            <div className="lola-scroll-copy-inner">
              {LOLA_SCROLL_ACTS.map((act, i) => (
                <div
                  key={act.id}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="lola-scroll-panel"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <p className="lola-scroll-kicker">
                    {i === 0 ? (
                      <>
                        {PROJECT.tag} · {PROJECT.status}
                      </>
                    ) : (
                      act.kicker
                    )}
                  </p>
                  {i === 0 ? (
                    <h1 className="lola-scroll-title">{act.title}</h1>
                  ) : (
                    <h2 className="lola-scroll-title">{act.title}</h2>
                  )}
                  <p className="lola-scroll-subtitle">{act.subtitle}</p>
                  {act.body ? <p className="lola-scroll-body">{act.body}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
