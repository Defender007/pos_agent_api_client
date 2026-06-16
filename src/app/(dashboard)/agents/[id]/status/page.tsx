import { getAgentById } from "@/lib/api/agents";
import AgentForm from "@/components/agents/agent-form";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import SectionCard from "@/components/ui/custom/section-card";
import { getServerPageError } from "@/lib/api/server-page-error";
import type { Agent } from "@/types/agent";

type AgentStatusPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentStatusPage({
  params,
}: AgentStatusPageProps) {
  const { id } = await params;
  let agent: Agent | null = null;
  let loadError: SectionErrorCardProps | null = null;

  try {
    agent = await getAgentById(id);
  } catch (error) {
    loadError = getServerPageError(error, {
      sessionExpiredRedirect: "/login?session=expired",
    });
  }

  if (loadError || !agent) {
    return (
      <PageContainer>
        <PageTitle
          title="Update Agent Status"
          description="Change agent operational status"
        />
        <SectionErrorCard
          {...(loadError || {
            title: "Unable to load this section",
            message: "The agent details could not be loaded. Please try again.",
          })}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle
        title="Update Agent Status"
        description="Change agent operational status"
      />

      <SectionCard>
        <AgentForm mode="edit" agentId={id} agent={agent} statusOnly />
      </SectionCard>
    </PageContainer>
  );
}
