"use client";

import { AdminFab, AdminUnlockModal } from "@/unlock";

type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col">
      <header
        className="hero-panel relative overflow-hidden"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl sm:h-56 sm:w-56"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-teal-300/20 blur-3xl sm:h-48 sm:w-48"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-3xl px-4 pb-8 pt-2 sm:max-w-4xl sm:px-6 sm:pb-10 sm:pt-4 lg:max-w-5xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm sm:h-14 sm:w-14 sm:text-3xl"
              aria-hidden
            >
              ☀️
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="hero-brand text-3xl font-extrabold leading-none tracking-tight sm:text-4xl lg:text-5xl">
                UB Solars
              </h1>
              <p className="hero-title mt-2 text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                Size smarter. Save brighter.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-teal-50/90 sm:text-base">
                Turn your TNEB bill into the right rooftop kW — see savings and
                post-solar costs in seconds. Free, no login.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main
        className="relative z-[1] mx-auto w-full max-w-3xl flex-1 px-4 sm:max-w-4xl sm:px-6 lg:max-w-5xl"
        style={{
          marginTop: "-1.25rem",
          paddingBottom: "max(5rem, calc(1.25rem + env(safe-area-inset-bottom)))",
        }}
      >
        <div className="app-card rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:p-8">
          {children}
        </div>

        <footer className="mx-auto mt-4 max-w-md px-2 pb-2 text-center sm:mt-6">
          <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
            Built for Tamil Nadu homes · TNEB bimonthly slabs · Estimates only
          </p>
          <p className="mt-2 text-xs text-ink-subtle sm:text-sm">
            © {new Date().getFullYear()} UB Solars. All rights reserved.
          </p>
        </footer>
      </main>

      <AdminFab />
      <AdminUnlockModal />
    </div>
  );
}
