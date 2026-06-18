import SolopreneurAgentForm from "@/components/agents/solopreneur-agent-form";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";

export default function NewSolopreneurAgentPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <TopHeader />

        <div className="p-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <p className="text-sm font-semibold text-[#007A3D]">
                Bank Staff Onboarding
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">
                Create Solopreneur Agent
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Register an independent agent for bank review and approval.
              </p>
            </div>

            <SolopreneurAgentForm />
          </div>
        </div>
      </main>
    </div>
  );
}
