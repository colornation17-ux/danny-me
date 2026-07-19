/** Lola Motion — feature clips + hero reel (from Calude motion package) */
export const LOLA_MOTION = {
  reel: {
    src: "/motion/Lola-Reel.mp4",
    title: "Lola in motion",
    caption: "Guest WhatsApp + Lola Connect — one pickup loop",
  },
  clips: {
    intro: { src: "/motion/Lola-00-Intro.mp4", title: "Intro", caption: "Meet Lola on the weekly flyer thread." },
    hook: {
      src: "/motion/Lola-00a-Hook.mp4",
      title: "Hook",
      caption: "The weekly ask, before the loop opens.",
    },
    home: {
      src: "/motion/Lola-01-Home.mp4",
      title: "Home · shifts",
      caption: "On-shift staff get order alerts — routing lives on Home.",
    },
    voiceGreeting: {
      src: "/motion/Lola-01a-VoiceGreeting.mp4",
      title: "Voice greeting",
      caption: "Tap Play to hear Lola — same store knowledge as text.",
    },
    guestThread: {
      src: "/motion/Lola-02-GuestThread.mp4",
      title: "Guest WhatsApp thread",
      caption: "Tap-first asks, orders, and reminders in the flyer thread.",
    },
    staffInbox: {
      src: "/motion/Lola-03-StaffInbox.mp4",
      title: "Staff Inbox",
      caption: "Thread + Ready-for-pickup bar — mark ready when bagged.",
    },
    orders: {
      src: "/motion/Lola-04-Orders.mp4",
      title: "Orders board",
      caption: "Shopping lists as ops work — quote, confirm, ready.",
    },
    voiceNotes: {
      src: "/motion/Lola-05-VoiceNotes.mp4",
      title: "Voice notes",
      caption: "Spoken asks land on the same grounded path as typed ones.",
    },
    staffAlert: {
      src: "/motion/Lola-06-StaffAlert.mp4",
      title: "Staff alert",
      caption: "Confirmed lists buzz the counter before walk-in.",
    },
    tickets: {
      src: "/motion/Lola-07-Tickets.mp4",
      title: "Tickets",
      caption: "When Lola is unsure, staff get a clear escalation queue.",
    },
    outro: { src: "/motion/Lola-08-Outro.mp4", title: "Outro", caption: "Same loop — guest thread to staff close." },
  },
} as const;

/** Madhurima-style key flows — three beats (guest → order → staff close) */
export const KEY_FLOW_CLIPS = [
  {
    ...LOLA_MOTION.clips.guestThread,
    kicker: "Guest",
    headline: "Ask on the flyer thread",
    body: "Tap-first orders and reminders — same weekly thread guests already open.",
  },
  {
    ...LOLA_MOTION.clips.orders,
    kicker: "Orders",
    headline: "Lists become ops work",
    body: "Quote, confirm, ready — shopping lists on a board, not buried in chats.",
  },
  {
    ...LOLA_MOTION.clips.staffAlert,
    kicker: "Staff",
    headline: "Counter gets the ping",
    body: "Confirmed lists buzz the floor before walk-in — one loop, closed.",
  },
] as const;
