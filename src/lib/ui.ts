export const labelClass = "block text-sm font-medium text-slate-700";

export const inputClass =
  "w-full min-h-11 rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200";

export const btnPrimary =
  "w-full min-h-12 rounded-xl bg-amber-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-amber-600 active:bg-amber-700 touch-manipulation";

export const btnIcon =
  "flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-lg text-slate-500 touch-manipulation active:bg-slate-100";

export const linkBtn =
  "inline-flex min-h-11 items-center px-2 text-sm font-medium touch-manipulation";

export const tabBar =
  "grid gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 sm:flex";

export const tabBtnBase =
  "min-h-11 rounded-lg px-2 py-2.5 text-center text-xs font-medium transition touch-manipulation sm:flex-1 sm:px-3 sm:text-sm";

export const tabBtnActive = "bg-white text-slate-900 shadow-sm";
export const tabBtnInactive =
  "text-slate-600 active:bg-white/60 hover:text-slate-900";

export const resultsBox =
  "space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-5";

export const statGrid =
  "grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-3";

export const statCard = "rounded-xl bg-white p-3 shadow-sm sm:p-4";

export const statLabel = "text-xs text-slate-500 sm:text-sm";

export const statValue = "text-xl font-bold tracking-tight sm:text-2xl";

export const tableWrap =
  "-mx-1 overflow-x-auto rounded-xl border border-slate-200 bg-white [-webkit-overflow-scrolling:touch]";

export const tableClass = "w-full min-w-[320px] text-left text-xs sm:min-w-[480px] sm:text-sm";

export const thClass =
  "px-3 py-2.5 font-medium text-slate-600 first:pl-4 last:pr-4 sm:px-4";

export const tdClass =
  "px-3 py-2.5 whitespace-nowrap first:pl-4 last:pr-4 sm:px-4";

export const actionHeader =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

export const actionBtns = "flex flex-wrap items-center gap-2 sm:gap-3";

export function tabBtnClass(active: boolean) {
  return `${tabBtnBase} ${active ? tabBtnActive : tabBtnInactive}`;
}
