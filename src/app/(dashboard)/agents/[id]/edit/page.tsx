import SectionCard from "@/components/ui/custom/section-card";
import SectionErrorCard, {
  type SectionErrorCardProps,
} from "@/components/common/section-error-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import AgentForm from "@/components/agents/agent-form";
import { getAgentById } from "@/lib/api/agents";
import { getServerPageError } from "@/lib/api/server-page-error";
import type { Agent } from "@/types/agent";

type EditAgentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAgentPage({ params }: EditAgentPageProps) {
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
        <PageTitle title="Edit Agent" description="Update agent information" />
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
      <PageTitle title="Edit Agent" description="Update agent information" />
      <SectionCard>
        <AgentForm mode="edit" agentId={id} agent={agent} />
      </SectionCard>
    </PageContainer>
  );
}
