import Link from "next/link";
import { redirect } from "next/navigation";

import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import { getAgents } from "@/lib/api/agents";
import { getServerPageError } from "@/lib/api/server-page-error";

import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

import AgentsTable from "@/components/agents/agents-table";
import type { Agent } from "@/types/agent";

export default async function AgentsPage() {
  let agents: Agent[] = [];
  let loadError: SectionErrorCardProps | null = null;

  try {
    agents = await getAgents();
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/login?session=expired");
    }

    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/login?session=expired",
    });
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle title="Agents" description="Manage all onboarded agents" />

        <Link
          href="/agents/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Agent
        </Link>
      </div>

      {loadError ? (
        <SectionErrorCard {...loadError} />
      ) : (
        <AgentsTable agents={agents} />
      )}
    </PageContainer>
  );
}
