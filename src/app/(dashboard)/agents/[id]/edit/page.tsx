import SectionCard from "@/components/ui/custom/section-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import AgentForm from "@/components/agents/agent-form";
import { getAgentById } from "@/lib/api/agents";

type EditAgentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { id } = await params;
  const agent = await getAgentById(id);

  return (
    <PageContainer>
      <PageTitle title="Edit Agent" description="Update agent information" />
      <SectionCard>
        <AgentForm mode="edit" agentId={id} agent={agent} />
      </SectionCard>
    </PageContainer>
  );
}
