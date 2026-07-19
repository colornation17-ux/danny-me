import React from "react";
import { LolaMark } from "./ui";
import { WHATSAPP_MAX_REPLY_BUTTONS } from "./constants";

const waFont = { fontFamily: "var(--cs-font)" } as const;
const waMono = { fontFamily: "var(--cs-mono)" } as const;

/** One mobile-sized frame — ~360px cap, fluid inside padded sections when `device` is set. */
export function PhoneFrame({
  children,
  contact = "Lola · La Bodega",
  inbox = false,
  device = false,
  lang,
  className = "",
}: {
  children: React.ReactNode;
  contact?: string;
  /** Staff CRM view — header shows the customer thread, not Lola */
  inbox?: boolean;
  /** Full device proportions for interactive flow explorer */
  device?: boolean;
  /** BCP 47 lang for demo thread copy (e.g. es) */
  lang?: string;
  className?: string;
}) {
  const isLolaContact = contact.startsWith("Lola");
  const avatarLetter = inbox ? "…" : isLolaContact ? "L" : contact.charAt(0).toUpperCase();
  const avatarClass = isLolaContact && !inbox
    ? "cs-wa-avatar cs-wa-avatar--lola"
    : inbox
      ? "cs-wa-avatar cs-wa-avatar--inbox"
      : "cs-wa-avatar cs-wa-avatar--store";

  return (
    <div
      className={`cs-wa-phone-wrap${device ? " cs-wa-phone-wrap--device" : ""} ${className}`.trim()}
    >
      <div
        className={`cs-wa-phone${device ? " cs-wa-phone--device" : ""}`}
        aria-label="WhatsApp conversation mockup"
      >
        <div className="cs-wa-screen">
          <div className="cs-wa-header">
          <div className={avatarClass}>
            {isLolaContact && !inbox ? (
              <span className="cs-lola cs-lola--avatar" aria-hidden>
                L
              </span>
            ) : (
              <span className="cs-wa-avatar-letter" style={waFont}>
                {avatarLetter}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="cs-wa-contact" style={waFont}>
              {contact.startsWith("Lola") ? (
                <>
                  <LolaMark variant="phone" />
                  <span className="truncate"> · {contact.replace(/^Lola\s*·\s*/, "")}</span>
                </>
              ) : (
                <span className="truncate">{contact}</span>
              )}
            </div>
            <div className="cs-wa-status" style={waFont}>
              online
            </div>
          </div>
          </div>
          <div className="cs-wa-chat" lang={lang}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WaBubble({
  from,
  children,
  time = "10:23",
  perspective = "customer",
  dense = false,
  media = false,
}: {
  from: "lola" | "customer" | "staff";
  children: React.ReactNode;
  time?: string;
  perspective?: "customer" | "store";
  dense?: boolean;
  /** Template header image flush to bubble top — like WhatsApp business messages */
  media?: boolean;
}) {
  const isStore = from === "lola" || from === "staff";
  const storeOnRight = perspective === "store";
  const alignEnd = storeOnRight ? isStore : !isStore;
  const bubbleGreen = storeOnRight ? isStore : !isStore;

  return (
    <div className={`flex ${alignEnd ? "justify-end" : "justify-start"}`}>
      <div
        className={`cs-wa-bubble ${bubbleGreen ? "cs-wa-bubble--out" : "cs-wa-bubble--in"} ${dense ? "cs-wa-bubble--dense" : ""} ${media ? "cs-wa-bubble--media" : ""}`}
        style={waFont}
      >
        {children}
        <div className="cs-wa-bubble-time">{time}</div>
      </div>
    </div>
  );
}

/** Meta template header image — pre-Lola broadcasts used store or seasonal art */
export function WaBroadcastHeader({
  src = "/broadcast-header-store.png",
  alt = "La Bodega store interior — Lola welcomes shoppers in the weekly broadcast",
  compact = false,
  inChat = false,
}: {
  src?: string;
  alt?: string;
  compact?: boolean;
  /** Constrain height inside a message bubble — not full-bleed in the thread */
  inChat?: boolean;
}) {
  const classes = [
    "cs-wa-broadcast-header",
    compact ? "cs-wa-broadcast-header--compact" : "",
    inChat ? "cs-wa-broadcast-header--in-chat" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

export function WaThreadNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="cs-wa-thread-note" style={waFont}>
      {children}
    </p>
  );
}

export function WaFlyer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`cs-wa-flyer ${compact ? "cs-wa-flyer--compact" : ""}`}>
      <div className="cs-wa-flyer-head">
        <div className="cs-wa-flyer-brand" style={waMono}>
          La Bodega
        </div>
        <div className="cs-wa-flyer-title" style={waFont}>
          Weekend Specials
        </div>
      </div>
      <div className="cs-wa-flyer-body">
        {["🥩 Chicken 69¢/lb", "🥚 Eggs $2.49"].map((item) => (
          <div key={item} className="cs-wa-flyer-item" style={waFont}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WaButtons({
  options,
  onSelect,
  compact = false,
}: {
  options: string[];
  onSelect?: (label: string) => void;
  compact?: boolean;
}) {
  const shown = options.slice(0, WHATSAPP_MAX_REPLY_BUTTONS);
  return (
    <div className={`cs-wa-buttons ${compact ? "cs-wa-buttons--compact" : ""}`}>
      {shown.map((opt) => (
        <button key={opt} type="button" onClick={() => onSelect?.(opt)} className="cs-wa-button" style={waFont}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export function WaButtonPreview({ options }: { options: string[] }) {
  const shown = options.slice(0, WHATSAPP_MAX_REPLY_BUTTONS);
  return (
    <div className="rounded-md overflow-hidden border border-[var(--cs-border)] bg-white">
      {shown.map((opt, i) => (
        <div
          key={opt}
          className={`min-h-[40px] flex items-center justify-center px-4 py-2 text-[12px] font-medium text-center text-[var(--cs-teal)] ${
            i < shown.length - 1 ? "border-b border-[var(--cs-border-subtle)]" : ""
          }`}
          style={waFont}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

export function WaVoiceNote({ duration = "0:14" }: { duration?: string }) {
  return (
    <div className="flex items-center gap-2.5 py-0.5 min-w-[140px]">
      <span className="w-7 h-7 rounded-full bg-[var(--cs-teal)] flex items-center justify-center text-white text-[10px]" aria-hidden>
        ▶
      </span>
      <div className="flex-1 flex items-center gap-0.5 h-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-[var(--cs-teal)]/55"
            style={{ height: `${6 + (i % 5) * 3}px` }}
          />
        ))}
      </div>
      <span className="text-[11px] text-[var(--cs-ink)]/60 tabular-nums" style={waMono}>
        {duration}
      </span>
    </div>
  );
}

export function AnimatedChat({
  children,
  scrollKey,
}: {
  children: React.ReactNode;
  scrollKey?: string | number;
}) {
  const threadRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const chat = threadRef.current?.closest(".cs-wa-chat") as HTMLElement | null;
    if (!chat) return;

    const scrollToEnd = () => {
      chat.scrollTop = chat.scrollHeight;
    };

    scrollToEnd();
    requestAnimationFrame(scrollToEnd);

    const delayed = window.setTimeout(scrollToEnd, 150);

    const imgs = chat.querySelectorAll("img");
    const onImgLoad = () => scrollToEnd();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImgLoad, { once: true });
      else scrollToEnd();
    });

    return () => {
      window.clearTimeout(delayed);
      imgs.forEach((img) => img.removeEventListener("load", onImgLoad));
    };
  }, [children, scrollKey]);

  return (
    <div ref={threadRef} className="cs-wa-chat-thread">
      {children}
    </div>
  );
}
