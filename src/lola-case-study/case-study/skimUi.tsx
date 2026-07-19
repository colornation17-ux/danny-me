import React from "react";

/** Paragraph with bold micro-hook at start */
export function BoldLead({
  hook,
  children,
  className = "cs-hero-summary mb-3 max-w-none last:mb-0",
}: {
  hook: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={className}>
      <strong className="font-semibold text-[var(--cs-ink)]">{hook}</strong> {children}
    </p>
  );
}

export type SkimTableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export function SkimTable<T extends Record<string, unknown>>({
  columns,
  rows,
  caption,
}: {
  columns: SkimTableColumn<T>[];
  rows: readonly T[];
  caption?: string;
}) {
  return (
    <div className="cs-skim-table-wrap overflow-x-auto mb-6">
      <table className="cs-skim-table w-full text-left border-collapse">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} scope="col" className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={String(col.key)} className={col.className}>
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function QuoteCallout({
  quote,
  who,
  role,
  footer,
}: {
  quote: string;
  who: string;
  role: string;
  footer?: React.ReactNode;
}) {
  return (
    <blockquote className="cs-quote-callout mb-6">
      <p className="cs-quote-callout-label">
        <strong>{who}</strong>
        {role ? <span className="text-[var(--cs-muted)] font-normal"> · {role}</span> : null}
      </p>
      <p className="cs-quote-callout-text">&ldquo;{quote}&rdquo;</p>
      {footer ? <footer className="cs-quote-callout-footer">{footer}</footer> : null}
    </blockquote>
  );
}
