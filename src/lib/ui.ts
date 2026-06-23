export const errorText = "mt-1.5 text-sm text-red-600";

export const inputErrorClass =
  "w-full min-h-11 rounded-xl border border-red-400 bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100";

export const labelClass = "block text-sm font-semibold text-ink";

export const inputClass =
  "w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light";

export const btnPrimary =
  "w-full min-h-12 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95 touch-manipulation";

export const btnSecondary =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-muted active:bg-surface-muted touch-manipulation";

export const btnIcon =
  "flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-lg text-ink-muted touch-manipulation active:bg-surface-muted";

export const linkBtn =
  "inline-flex min-h-11 items-center px-2 text-sm font-semibold touch-manipulation";

export const linkBtnAccent = `${linkBtn} text-brand hover:text-brand-dark`;
export const linkBtnMuted = `${linkBtn} text-ink-muted hover:text-ink`;

export const tabBar =
  "grid gap-1 rounded-xl border border-border bg-surface-muted p-1 sm:flex";

export const tabBtnBase =
  "min-h-11 rounded-lg px-1.5 py-2.5 text-center text-[11px] font-semibold transition touch-manipulation min-[360px]:px-2 sm:flex-1 sm:px-3 sm:text-sm";

export const tabBtnActive =
  "bg-surface text-ink shadow-sm ring-1 ring-border";
export const tabBtnInactive =
  "text-ink-muted active:bg-surface/60 hover:text-ink";

export const resultsBox =
  "space-y-4 rounded-xl border border-brand-light bg-gradient-to-br from-brand-light/60 to-accent-light/40 p-3 sm:p-5";

export const statGrid =
  "grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-3";

export const statCard =
  "rounded-xl border border-border/60 bg-surface p-3 shadow-sm sm:p-4";

export const statLabel = "text-xs font-medium text-ink-muted sm:text-sm";

export const statValue = "text-xl font-bold tracking-tight text-ink sm:text-2xl";

export const accentValue = "text-accent-dark";

export const highlightCard = "ring-2 ring-accent/60";

export const sectionCard =
  "space-y-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5";

export const sectionCardCompact =
  "space-y-3 rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5";

export const sectionTitle = "font-semibold text-ink";

export const mutedText = "text-xs text-ink-muted sm:text-sm";

export const tableWrap =
  "-mx-1 overflow-x-auto rounded-xl border border-border bg-surface [-webkit-overflow-scrolling:touch]";

export const tableClass =
  "w-full min-w-[280px] text-left text-xs sm:min-w-[480px] sm:text-sm";

export const thClass =
  "px-3 py-2.5 font-semibold text-ink-muted first:pl-4 last:pr-4 sm:px-4";

export const tdClass =
  "px-3 py-2.5 whitespace-nowrap first:pl-4 last:pr-4 sm:px-4";

export const theadClass = "bg-surface-muted";
export const rowDivider = "border-t border-border";

export const actionHeader =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

export const actionBtns = "flex flex-wrap items-center gap-2 sm:gap-3";

export const panelBox =
  "mb-4 rounded-xl border border-accent/30 bg-gradient-to-br from-accent-light/80 to-brand-light/50 p-4 sm:mb-6";

export const chipBtn =
  "rounded-lg px-3 py-1.5 text-sm font-semibold touch-manipulation transition";

export const chipBtnActive = "bg-accent text-white shadow-sm";
export const chipBtnInactive =
  "bg-surface text-ink ring-1 ring-border hover:bg-surface-muted";

export function tabBtnClass(active: boolean) {
  return `${tabBtnBase} ${active ? tabBtnActive : tabBtnInactive}`;
}

export function chipBtnClass(active: boolean) {
  return `${chipBtn} ${active ? chipBtnActive : chipBtnInactive}`;
}
