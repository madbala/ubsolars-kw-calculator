/** Server-rendered copy for crawlers (visible, below the calculator). */
export default function SeoContent() {
  return (
    <section className="mt-6 space-y-4 border-t border-border pt-6 text-ink sm:mt-8 sm:pt-8">
      <h2 className="text-lg font-semibold sm:text-xl">
        Free TNEB solar calculator for Tamil Nadu homes
      </h2>
      <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
        UB Solars helps you size a rooftop solar system from your bimonthly TNEB bill or units.
        Get an instant kW recommendation, PM Surya Ghar subsidy estimate, EMI comparison, and
        post-solar bill savings — built for Tamil Nadu LT domestic tariffs. No signup required.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-ink-muted sm:text-base">
        <li>Convert bill amount or units into recommended solar kW and panel count</li>
        <li>Estimate subsidy, net investment, loan EMI, and monthly cashflow</li>
        <li>Compare before vs after solar bill using current TNEB slab rates</li>
      </ul>
    </section>
  );
}
