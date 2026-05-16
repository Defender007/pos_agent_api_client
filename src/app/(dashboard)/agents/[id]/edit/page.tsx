import TextInput from "@/components/forms/text-input";
import SelectInput from "@/components/forms/select-input";
import SectionCard from "@/components/ui/custom/section-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import AgentForm from "@/components/agents/agent-form";

type EditAgentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <PageTitle title="Edit Agent" description="Update agent information" />
      <SectionCard>
        <AgentForm mode="edit" />
      </SectionCard>
    </PageContainer>
  );
}
