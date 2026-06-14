import { redirect } from "next/navigation";

import SectionCard from "@/components/ui/custom/section-card";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";
import AgentForm from "@/components/agents/agent-form";
import { getCurrentAdminProfile } from "@/lib/api/rbac";

export default async function NewAgentPage() {
  let businessName: string | null = null;

  try {
    const profile = await getCurrentAdminProfile();
    businessName = profile.profile?.organisation?.trim() || null;
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/login?session=expired");
    }

    throw error;
  }

  return (
    <PageContainer>
      <PageTitle title="Add Agent" description="Create a new SoftPOS agent" />

      <SectionCard>
        <AgentForm mode="create" businessName={businessName} />
      </SectionCard>
    </PageContainer>
  );
}
