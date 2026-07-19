import React from "react";
import { PILOT_SHOPPER_FULL } from "./constants";

/** CSS-only miniature of wacrm Pickup orders — blurred behind the alert modal. */
export function WacrmDashboardBackdrop() {
  const nav = ["Home", "Inbox", "Orders", "Tickets", "Reminders"];
  const rows = [
    { name: "Ana Ruiz", ref: "LB-20250622-0038", items: "rice, beans, cilantro", status: "Ready", badge: "success" },
    { name: PILOT_SHOPPER_FULL, ref: "LB-20250622-0042", items: "chicken, tortillas, eggs…", status: "Quote sent", badge: "primary", highlight: true },
    { name: "James T.", ref: "LB-20250622-0035", items: "ground beef, onions", status: "New list", badge: "ghost" },
    { name: "Carmen L.", ref: "LB-20250621-0091", items: "plantains, oil, soda", status: "Picked up", badge: "ghost" },
  ];

  return (
    <div
      className="absolute inset-0 select-none overflow-hidden bg-[#f4f6f9] text-[#1e293b]"
      aria-hidden
      style={{ fontFamily: "var(--cs-font)" }}
    >
      <div className="flex h-full min-h-full">
        {/* Sidebar */}
        <aside className="w-[168px] flex-shrink-0 border-r border-[#e2e8f0] bg-white px-2 py-4 hidden sm:block">
          <div className="flex items-center gap-2 px-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#290545] flex items-center justify-center text-white text-[11px] font-bold">
              L
            </div>
            <span className="text-[12px] font-semibold text-[#0f172a]">Lola Connect</span>
          </div>
          <nav className="space-y-0.5">
            {nav.map((label) => {
              const active = label === "Orders";
              return (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] ${
                    active ? "bg-[#ececec] text-[#111212] font-semibold" : "text-[#64748b]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#290545]" : "bg-[#cbd5e1]"}`} />
                  {label}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#ececec] flex items-center justify-center text-[#111212] text-sm">
                  🛍
                </div>
                <p className="text-[15px] font-bold text-[#0f172a]">Orders</p>
              </div>
              <p className="text-[10px] text-[#64748b] leading-snug max-w-[280px]">
                Today — 3 pending · 12 completed · 1 cancelled
              </p>
              <p className="text-[9px] text-[#94a3b8] leading-snug max-w-[280px] mt-0.5">
                Illustrative sample — not live pilot volume
              </p>
            </div>
            <div className="rounded-md border border-[#e2e8f0] bg-white px-2.5 py-1.5 text-[10px] text-[#475569]">
              Refresh
            </div>
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white p-3 mb-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {["Today", "All dates"].map((c, i) => (
                <span
                  key={c}
                  className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
                    i === 0 ? "bg-[#290545] text-white" : "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Pending (3)", "Completed (12)", "Cancelled (1)", "All"].map((c, i) => (
                <span
                  key={c}
                  className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
                    i === 0 ? "bg-[#ececec] text-[#111212] ring-1 ring-[#111212]/25" : "bg-[#f8fafc] text-[#64748b]"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-[#111212]/15 bg-[#f1f5f9] px-3 py-2 text-[10px] text-[#334155] mb-3">
            3 orders need a quote or next step today.
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-white overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] gap-2 px-3 py-2 border-b border-[#f1f5f9] text-[9px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              <span>Customer</span>
              <span>Status</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.ref}
                className={`grid grid-cols-[1fr_auto] gap-2 items-center px-3 py-2.5 border-b border-[#f8fafc] last:border-0 ${
                  row.highlight ? "wacrm-row-pulse relative" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-[#0f172a]">{row.name}</span>
                    <span className="font-mono text-[9px] text-[#290545]">{row.ref}</span>
                  </div>
                  <p className="text-[10px] text-[#64748b] truncate mt-0.5">{row.items}</p>
                </div>
                <span
                  className={`text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    row.badge === "success"
                      ? "bg-[#dcfce7] text-[#166534]"
                      : row.badge === "primary"
                        ? "bg-[#dbeafe] text-[#1d4ed8]"
                        : "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
