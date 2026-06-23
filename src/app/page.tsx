import { CalculatorProvider } from "@/context/CalculatorContext";
import TabContainer from "@/components/TabContainer";
import PageShell from "@/components/PageShell";
import { AdminGateProvider } from "@/unlock";

export default function Home() {
  return (
    <CalculatorProvider>
      <AdminGateProvider>
        <PageShell>
          <TabContainer />
        </PageShell>
      </AdminGateProvider>
    </CalculatorProvider>
  );
}
