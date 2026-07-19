import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { FlowId, Lang } from "./constants";
import {
  BROADCAST_LEGACY,
  BROADCAST_LOLA_INTRO,
  CTA,
  FLOW_EXPLORER_AFTER,
  FLOW_EXPLORER_BEFORE,
  FLOW_ID_FROM_SLUG,
  FLOW_SLUG_FROM_ID,
  FLOW_TABS,
  PILOT_SHOPPER,
} from "./constants";
import { SlidingTabs, TabPanel } from "./SlidingTabs";
import { useHashLocation } from "./useHashRoute";
import {
  AnimatedChat,
  PhoneFrame,
  WaBroadcastHeader,
  WaBubble,
  WaButtons,
  WaVoiceNote,
} from "./whatsapp";

type Step = { key: string; label: string; node: React.ReactNode; contact?: string };

type BroadcastPhase = "before" | "after";

function nl(s: string) {
  return s.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

function copy(lang: Lang) {
  const legacy = lang === "es" ? BROADCAST_LEGACY.joinMenu : BROADCAST_LEGACY.updateMenu;
  const lola = BROADCAST_LOLA_INTRO;
  const en = {
    greet: `Hi, ${PILOT_SHOPPER}! I'm Lola from La Bodega. Tap below or ask about rewards, SNAP, or the buffet.`,
    greetBtns: ["✨ Weekly deals", "🕐 Store hours", "🛒 Place order"],
    legacyMenu: legacy.menuText,
    legacyDigit: legacy.replyDigit,
    legacySpecials: legacy.specialsBody,
    legacyAltDigit: legacy.replyAltDigit ?? "2",
    legacyAltReply: legacy.replyAltBody ?? "",
    broadcast: lola.en,
    broadcastBtns: [...lola.buttons.en],
    specials: "🛒 This weekend!\n🥩 Chicken 69¢/lb · 🥚 Eggs $2.49\n⭐ Tue & Wed: 2X Rewards",
    afterSpecials: "Order from these deals, get a reminder, or skip?",
    afterBtns: ["🛒 Place order", "🔔 Remind me", "No thanks"],
    offerRemindAsk: "Want a shopping reminder? Tell me what to buy and when — e.g. Saturday 10am milk and eggs.",
    orderAsk: "What do you need? List items — voice or text works. Pickup 10am–8pm, pay in store.",
    orderThanks: "Thanks — we got your list! Someone will send a total shortly. (No order # until you confirm.)",
    orderQuote: "Your total is $24.87 — tap Confirm or reply YES. Change list or CANCEL to exit.",
    orderQuoteBtns: ["✅ Confirm", "✏️ Change list", "Cancel"],
    orderYes: "YES",
    orderConfirm: "Order #LB-20250622-0042 confirmed! What time for pickup?",
    orderTime: "Friday 5pm",
    orderReady: "Ready for pickup! See you at La Bodega.",
    remindCustomerTime: "Saturday 10am",
    remindSaved:
      "Saved your shopping reminder:\n• milk\n• eggs\n• tortillas\nSaturday 10am\n\nNot an order yet — I'll nudge you then.",
    remindNudge:
      "Good morning! Your list: milk, eggs, tortillas.\n\nReady for pickup? Tap below or text #order with your list.",
    remindNudgeBtns: ["🛒 Place order", "Not today"],
    remindTextStart: "remind me Saturday — milk, eggs, tortillas",
    coach: "I can help with a pickup list or a shopping list reminder. Coach replies are text — voice notes work for items.",
    coachBtns: ["📦 Pickup order", "🔔 List reminder", "Cancel"],
    coachList: "List your items — voice or text.",
    coachDone: "Got it! Sending your list to the store now.",
    customerHi: "hi",
    customerQ: "?",
    staffHelpQ: "Do you have fresh guava leaves today?",
    staffHelpWait: "I'm not sure — I asked our store team. I'll reply here shortly. 🙏",
    staffHelpAnswer: "From our store team:\nYes — we have them in produce near the plantains. Limited today!",
    voiceTranscript: `🎤 "#order two pounds chicken, tortillas, eggs, and milk"`,
  };
  const es = {
    ...en,
    greet: `¡Hola, ${PILOT_SHOPPER}! Soy Lola de La Bodega. Toca un botón o pregúntame por recompensas, SNAP o el buffet.`,
    greetBtns: ["✨ Ofertas semana", "🕐 Horario", "🛒 Hacer pedido"],
    legacyMenu: BROADCAST_LEGACY.updateMenu.menuText,
    legacyDigit: BROADCAST_LEGACY.updateMenu.replyDigit,
    legacySpecials: BROADCAST_LEGACY.updateMenu.specialsBody,
    broadcast: lola.es,
    broadcastBtns: [...lola.buttons.es],
    specials: "🛒 ¡Este fin de semana!\n🥩 Pollo 69¢/lb · 🥚 Huevos $2.49",
    afterSpecials: "¿Pedir, recordatorio, o omitir?",
    afterBtns: ["🛒 Hacer pedido", "🔔 Recordarme", "No gracias"],
    orderAsk: "¿Qué necesitas? Lista por voz o texto. Recoger en tienda 10am–8pm.",
    orderThanks: "¡Gracias — recibimos tu lista! Te mandamos el total pronto.",
    customerHi: "hola",
    staffHelpQ: "¿Tienen hojas de guayaba frescas hoy?",
    staffHelpWait: "No estoy segura — le pregunté al equipo de la tienda. Te respondo aquí en un momento. 🙏",
    staffHelpAnswer: "Del equipo de La Bodega:\nSí — están en produce cerca de los plátanos. ¡Pocas hoy!",
    remindSaved:
      "Guardé tu recordatorio:\n• leche\n• huevos\n• tortillas\nSábado 10am\n\nAún no es pedido — te escribo entonces.",
    remindNudge:
      "¡Buenos días! Tu lista: leche, huevos, tortillas.\n\n¿Lista para recoger? Toca abajo o escribe #order con tu lista.",
    remindNudgeBtns: ["🛒 Hacer pedido", "Hoy no"],
    remindTextStart: "recuérdame el sábado — leche, huevos, tortillas",
    coach: "Puedo ayudarte con un pedido para recoger o un recordatorio con lista.",
  };
  return lang === "es" ? es : en;
}

function buildBroadcastBeforeSteps(lang: Lang): Step[] {
  const t = copy(lang);
  const contact = "La Bodega Calhoun";
  return [
    {
      key: "template-menu",
      label: "Template image + numbered menu (CRM automation)",
      contact,
      node: (
        <WaBubble from="staff" time="Fri 2:05" dense media>
          <WaBroadcastHeader compact inChat />
          <div className="cs-wa-bubble-body">{nl(t.legacyMenu)}</div>
        </WaBubble>
      ),
    },
    {
      key: "digit-1",
      label: `Guest types ${BROADCAST_LEGACY.updateMenu.replyDigit} → weekly update`,
      contact,
      node: (
        <WaBubble from="customer" time="2:05">
          {t.legacyDigit}
        </WaBubble>
      ),
    },
    {
      key: "auto-1",
      label: "Automated specials wall (reply 1)",
      contact,
      node: (
        <WaBubble from="staff" time="2:05" dense>
          {nl(t.legacySpecials)}
        </WaBubble>
      ),
    },
    {
      key: "digit-2",
      label: `Guest types ${BROADCAST_LEGACY.updateMenu.replyAltDigit} → delivery list`,
      contact,
      node: (
        <WaBubble from="customer" time="2:06">
          {t.legacyAltDigit}
        </WaBubble>
      ),
    },
    {
      key: "auto-2",
      label: "Automated delivery-list reply (reply 2)",
      contact,
      node: (
        <WaBubble from="staff" time="2:06" dense>
          {nl(t.legacyAltReply)}
        </WaBubble>
      ),
    },
  ];
}

function buildBroadcastAfterSteps(lang: Lang, advance: () => void): Step[] {
  const t = copy(lang);
  const contact = "Lola · La Bodega";
  return [
    {
      key: "lola-intro",
      label: "Template image + Lola tap buttons",
      contact,
      node: (
        <>
          <WaBubble from="staff" time="Fri 9:00" media>
            <WaBroadcastHeader compact inChat />
          </WaBubble>
          <WaBubble from="lola" time="Fri 9:01">
            {nl(t.broadcast)}
            <WaButtons options={t.broadcastBtns} onSelect={advance} />
          </WaBubble>
        </>
      ),
    },
    {
      key: "tap-specials",
      label: "Guest taps See specials",
      contact,
      node: <WaBubble from="customer" time="9:02">{t.broadcastBtns[0]}</WaBubble>,
    },
    {
      key: "specials",
      label: "Grounded weekend specials",
      contact,
      node: (
        <WaBubble from="lola" time="9:02" dense>
          {nl(t.specials)}
        </WaBubble>
      ),
    },
    {
      key: "next-actions",
      label: "Place order / remind / skip",
      contact,
      node: (
        <WaBubble from="lola" time="9:03">
          {t.afterSpecials}
          <WaButtons options={t.afterBtns} onSelect={advance} />
        </WaBubble>
      ),
    },
    {
      key: "remind-offer",
      label: "List reminder path",
      contact,
      node: <WaBubble from="lola" time="9:03">{t.offerRemindAsk}</WaBubble>,
    },
  ];
}

function buildSteps(flow: FlowId, lang: Lang, broadcastPhase: BroadcastPhase, advance: () => void): Step[] {
  const t = copy(lang);

  switch (flow) {
    case "broadcast":
      return broadcastPhase === "before"
        ? buildBroadcastBeforeSteps(lang)
        : buildBroadcastAfterSteps(lang, advance);
    case "greeting":
      return [
        { key: "c1", label: "Guest texts hi", node: <WaBubble from="customer" time="9:02">{t.customerHi}</WaBubble> },
        {
          key: "g1",
          label: "Lola greeting + menu",
          node: (
            <WaBubble from="lola" time="9:02">
              {t.greet}
              <WaButtons options={t.greetBtns} onSelect={advance} />
            </WaBubble>
          ),
        },
        { key: "c2", label: "Tap weekly deals", node: <WaBubble from="customer" time="9:03">{t.greetBtns[0]}</WaBubble> },
        { key: "g2", label: "Weekend specials", node: <WaBubble from="lola" time="9:03">{nl(t.specials)}</WaBubble> },
      ];
    case "order":
      return [
        { key: "c1", label: "Tap Place order", node: <WaBubble from="customer" time="9:04">{t.greetBtns[2]}</WaBubble> },
        { key: "g1", label: "Ask for list", node: <WaBubble from="lola" time="9:04">{t.orderAsk}</WaBubble> },
        {
          key: "c2",
          label: "Voice note list",
          node: (
            <WaBubble from="customer" time="9:05">
              <WaVoiceNote duration="0:11" />
            </WaBubble>
          ),
        },
        { key: "g1b", label: "STT transcript", node: <WaBubble from="lola" time="9:05">{t.voiceTranscript}</WaBubble> },
        { key: "g2", label: "Draft received", node: <WaBubble from="lola" time="9:06">{t.orderThanks}</WaBubble> },
        {
          key: "g3",
          label: "Staff quote + confirm buttons",
          node: (
            <WaBubble from="lola" time="9:08">
              {t.orderQuote}
              <WaButtons options={t.orderQuoteBtns} onSelect={advance} />
            </WaBubble>
          ),
        },
        { key: "c3", label: "Guest confirms YES", node: <WaBubble from="customer" time="9:09">{t.orderYes}</WaBubble> },
        { key: "g4", label: "Order # issued", node: <WaBubble from="lola" time="9:09">{t.orderConfirm}</WaBubble> },
        { key: "c4", label: "Pickup time", node: <WaBubble from="customer" time="9:10">{t.orderTime}</WaBubble> },
        { key: "g5", label: "Ready message", node: <WaBubble from="lola" time="9:10">{t.orderReady}</WaBubble> },
      ];
    case "reminder":
      return [
        { key: "c0", label: "Guest texts remind intent", node: <WaBubble from="customer" time="9:04">{t.remindTextStart}</WaBubble> },
        { key: "g1", label: "Ask day & time", node: <WaBubble from="lola" time="9:04">What day and time? Example: Saturday 10am.</WaBubble> },
        { key: "c1", label: "Guest picks time", node: <WaBubble from="customer" time="9:05">{t.remindCustomerTime}</WaBubble> },
        { key: "g2", label: "Saved — not an order", node: <WaBubble from="lola" time="9:05">{nl(t.remindSaved)}</WaBubble> },
        {
          key: "g3",
          label: "Timed nudge",
          node: (
            <WaBubble from="lola" time="Sat 10:00">
              {nl(t.remindNudge)}
              <WaButtons options={t.remindNudgeBtns} onSelect={advance} />
            </WaBubble>
          ),
        },
        { key: "c2", label: "Guest texts #order", node: <WaBubble from="customer" time="Sat 10:02">#order milk, eggs, tortillas</WaBubble> },
      ];
    case "stuck":
      return [
        { key: "c1", label: "Guest sends ?", node: <WaBubble from="customer" time="3:14">{t.customerQ}</WaBubble> },
        {
          key: "g1",
          label: "Coach menu",
          node: (
            <WaBubble from="lola" time="3:14">
              {t.coach}
              <WaButtons options={t.coachBtns} onSelect={advance} />
            </WaBubble>
          ),
        },
        { key: "c2", label: "Tap pickup order", node: <WaBubble from="customer" time="3:15">{t.coachBtns[0]}</WaBubble> },
        { key: "g2", label: "Ask for items", node: <WaBubble from="lola" time="3:15">{t.coachList}</WaBubble> },
        {
          key: "c3",
          label: "Voice items",
          node: (
            <WaBubble from="customer" time="3:16">
              <WaVoiceNote duration="0:08" />
            </WaBubble>
          ),
        },
        { key: "g3", label: "List sent to store", node: <WaBubble from="lola" time="3:16">{t.coachDone}</WaBubble> },
      ];
    case "staffhelp":
      return [
        { key: "c1", label: "Off-list product ask", node: <WaBubble from="customer" time="2:41">{t.staffHelpQ}</WaBubble> },
        { key: "g1", label: "Staff wait state", node: <WaBubble from="lola" time="2:41">{t.staffHelpWait}</WaBubble> },
        { key: "g2", label: "Staff relay", node: <WaBubble from="lola" time="2:48">{nl(t.staffHelpAnswer)}</WaBubble> },
      ];
    default:
      return [];
  }
}

const BROADCAST_ERA_LABEL = {
  before: "Before · numbered CRM menu",
  after: "After · Lola tap buttons",
} as const;

const BROADCAST_INITIAL_STEP: Record<BroadcastPhase, number> = {
  before: 1,
  after: 1,
};

const BROADCAST_PHASE_TABS = [
  { id: "before" as const, label: "Before Lola" },
  { id: "after" as const, label: "After Lola" },
];

const FLOW_PANEL_ID = "flow-explorer-panel";
const FLOW_TAB_PREFIX = "flow-explorer-flow";

export function FlowExplorer() {
  const [flow, setFlow] = useState<FlowId>("broadcast");
  const [lang, setLang] = useState<Lang>("en");
  const [broadcastPhase, setBroadcastPhase] = useState<BroadcastPhase>("after");
  const [step, setStep] = useState(BROADCAST_INITIAL_STEP.after);
  const phoneStageRef = useRef<HTMLDivElement>(null);
  const { section, segments, setHash } = useHashLocation();

  useEffect(() => {
    if (section !== "develop") return;
    if (segments[0] !== "flows") return;
    const slug = segments[1];
    if (!slug) return;
    const nextFlow = FLOW_ID_FROM_SLUG[slug];
    if (nextFlow) {
      setFlow(nextFlow);
      setStep(nextFlow === "broadcast" ? BROADCAST_INITIAL_STEP[broadcastPhase] : 1);
    }
  }, [section, segments, broadcastPhase]);

  const advance = () => setStep((s) => s + 1);

  const allSteps = useMemo(
    () => buildSteps(flow, lang, broadcastPhase, advance),
    [flow, lang, broadcastPhase],
  );
  const visible = allSteps.slice(0, Math.min(step, allSteps.length));
  const currentStep = visible[visible.length - 1];
  const phoneContact =
    flow === "broadcast" && broadcastPhase === "before"
      ? currentStep?.contact ?? "La Bodega Calhoun"
      : "Lola · La Bodega";

  const progressPct = allSteps.length ? (visible.length / allSteps.length) * 100 : 0;
  const atEnd = step >= allSteps.length;

  const reset = (id: FlowId) => {
    setFlow(id);
    setBroadcastPhase("after");
    setStep(id === "broadcast" ? BROADCAST_INITIAL_STEP.after : 1);
    setHash("develop", "flows", FLOW_SLUG_FROM_ID[id]);
  };

  const setPhase = (phase: BroadcastPhase) => {
    setBroadcastPhase(phase);
    setStep(BROADCAST_INITIAL_STEP[phase]);
    requestAnimationFrame(() => {
      phoneStageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const flowStartStep = () => (flow === "broadcast" ? BROADCAST_INITIAL_STEP[broadcastPhase] : 1);

  const phonePreview = (
    <TabPanel
      id={FLOW_PANEL_ID}
      labelledBy={`${FLOW_TAB_PREFIX}-tab-${flow}`}
      className="cs-flow-explorer__phone"
    >
      <div
        ref={phoneStageRef}
        className={`cs-flow-phone-stage${flow === "broadcast" ? ` cs-flow-phone-stage--${broadcastPhase}` : ""}`}
      >
        {flow === "broadcast" ? (
          <p className="cs-flow-era-badge" aria-live="polite">
            {BROADCAST_ERA_LABEL[broadcastPhase]}
          </p>
        ) : null}
        <motion.div
          key={`${flow}-${lang}-${broadcastPhase}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <PhoneFrame
            contact={phoneContact}
            device
            lang={lang === "es" ? "es" : undefined}
          >
            <AnimatedChat scrollKey={`${flow}-${broadcastPhase}-${step}-${lang}`}>
              {visible.map((s) => (
                <React.Fragment key={s.key}>{s.node}</React.Fragment>
              ))}
            </AnimatedChat>
          </PhoneFrame>
        </motion.div>
      </div>
    </TabPanel>
  );

  const toolbar = (
    <SlidingTabs
      tabs={FLOW_TABS.map((t) => ({ id: t.id, label: t.label }))}
      value={flow}
      onChange={reset}
      ariaLabel="Conversation flows"
      layoutId="flow-explorer-pill"
      variant="pill"
      panelId={FLOW_PANEL_ID}
      tabIdPrefix={FLOW_TAB_PREFIX}
      className="cs-flow-picker-tabs"
    />
  );

  const flowBlurb = FLOW_TABS.find((t) => t.id === flow)?.blurb ?? "";

  return (
    <div className="cs-flow-explorer cs-flow-explorer--split">
      <div className="cs-flow-explorer__body">
        <div className="cs-flow-explorer__pickers">
          <p className="cs-phase-cue">Pick a flow — watch the thread change.</p>

          <div className="cs-flow-explorer__control-group">
            <p className="cs-control-label" id="flow-picker-label">
              Conversation flow
            </p>
            <div className="cs-flow-explorer__toolbar" aria-labelledby="flow-picker-label">
              {toolbar}
            </div>
          </div>

          {flow === "broadcast" ? (
            <div className="cs-flow-explorer__control-group cs-flow-explorer__control-group--compare">
              <p className="cs-control-label" id="broadcast-era-label">
                Compare eras
              </p>
              <div
                className="cs-segment cs-segment--comparison"
                role="group"
                aria-labelledby="broadcast-era-label"
              >
                {BROADCAST_PHASE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    data-era={tab.id}
                    aria-pressed={broadcastPhase === tab.id}
                    onClick={() => setPhase(tab.id)}
                    className={broadcastPhase === tab.id ? "is-active" : ""}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {phonePreview}

        <div className="cs-flow-explorer__play">
          <p className="cs-flow-explorer__blurb">{flowBlurb}</p>

          {flow === "broadcast" ? (
            <div className="cs-flow-explorer__compare cs-flow-explorer__compare--era">
              <p
                className={`cs-flow-explorer__compare-line${broadcastPhase === "before" ? " is-active-era" : ""}`}
              >
                <strong>Before Lola</strong> — {FLOW_EXPLORER_BEFORE}
              </p>
              <p
                className={`cs-flow-explorer__compare-line${broadcastPhase === "after" ? " is-active-era" : ""}`}
              >
                <strong>After Lola</strong> — {FLOW_EXPLORER_AFTER}
              </p>
            </div>
          ) : null}

          <div className="cs-flow-explorer__transport">
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(s + 1, allSteps.length))}
              disabled={atEnd}
              aria-disabled={atEnd}
              className="cs-btn-primary"
            >
              {CTA.showNextTurn}
            </button>
            <button type="button" onClick={() => setStep(flowStartStep())} className="cs-btn-secondary">
              Restart
            </button>
            <span className="cs-flow-explorer__step-count" aria-live="polite">
              Turn {visible.length} of {allSteps.length}
            </span>
          </div>

          <div
            className="cs-flow-progress cs-flow-explorer__progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={allSteps.length}
            aria-valuenow={visible.length}
            aria-valuetext={`Turn ${visible.length} of ${allSteps.length}${currentStep ? `: ${currentStep.label}` : ""}`}
          >
            <div className="cs-flow-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          {currentStep ? (
            <p className="cs-flow-explorer__turn">
              <span className="sr-only">Current turn: </span>
              {currentStep.label}
            </p>
          ) : null}

          <div className="cs-flow-explorer__lang">
            <p className="cs-control-label" id="flow-lang-label">
              Demo language
            </p>
            <div className="cs-segment cs-segment--mini" role="group" aria-labelledby="flow-lang-label">
              {(["en", "es"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => {
                    setLang(l);
                    setStep(flowStartStep());
                  }}
                  className={lang === l ? "is-active" : ""}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {atEnd ? (
            <div className="cs-flow-explorer__complete">
              <p className="text-[14px] font-medium text-[var(--cs-ink)] mb-2">Flow complete</p>
              <div className="flex flex-wrap gap-2">
                <a href="#develop-staff-ops" className="cs-btn-secondary text-[12px] min-h-[44px]">
                  Staff alerts →
                </a>
                {flow !== "order" ? (
                  <a href="#develop/flows/pickup" className="cs-btn-secondary text-[12px] min-h-[44px]">
                    Try pickup flow →
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
