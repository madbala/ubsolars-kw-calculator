import { CalculatorProvider } from "@/context/CalculatorContext";
import TabContainer from "@/components/TabContainer";

export default function Home() {
  return (
    <CalculatorProvider>
      <div className="min-h-[100dvh] bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">
          <div
            className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:max-w-4xl sm:px-6 sm:py-4 lg:max-w-5xl"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <span className="text-2xl sm:text-3xl" aria-hidden>☀️</span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                UB Solars KW Calculator
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">TNEB bimonthly sizing</p>
            </div>
          </div>
        </header>

        <main
          className="mx-auto max-w-3xl px-4 py-4 sm:max-w-4xl sm:px-6 sm:py-8 lg:max-w-5xl"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <TabContainer />
          </div>
        </main>
      </div>
    </CalculatorProvider>
  );
}
