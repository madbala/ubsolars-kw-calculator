import { CalculatorProvider } from "@/context/CalculatorContext";
import TabContainer from "@/components/TabContainer";
import PageShell from "@/components/PageShell";
import { AdminGateProvider } from "@/unlock";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <>
    <SpeedInsights />
    <CalculatorProvider>
      <AdminGateProvider>
        <PageShell>
          <TabContainer />
        </PageShell>
      </AdminGateProvider>
    </CalculatorProvider>
    </>
    
  );
}
