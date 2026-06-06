import { getAgentById } from "@/lib/api/agents";
import AgentForm from "@/components/agents/agent-form";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import SectionCard from "@/components/ui/custom/section-card";

type AgentStatusPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentStatusPage({
  params,
}: AgentStatusPageProps) {
  const { id } = await params;
  const agent = await getAgentById(id);

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
