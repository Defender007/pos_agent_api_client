import TextInput from "@/components/forms/text-input";
import SelectInput from "@/components/forms/select-input";
import SectionCard from "@/components/ui/custom/section-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import AgentForm from "@/components/agents/agent-form";

export default function NewAgentPage() {
  return (
    <PageContainer>
      <PageTitle title="Add Agent" description="Create a new SoftPOS agent" />

      <SectionCard>
        <AgentForm mode="create" />
      </SectionCard>
    </PageContainer>
  );
}
