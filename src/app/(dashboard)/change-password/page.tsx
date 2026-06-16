import ChangePasswordForm from "@/components/auth/change-password-form";
import PageContainer from "@/components/layout/page-container";
import PageTitle from "@/components/layout/page-title";

export default function ChangePasswordPage() {
  return (
    <PageContainer>
      <PageTitle
        title="Change Password"
        description="Update your Merchant Staff account password"
      />

      <div className="max-w-2xl">
        <ChangePasswordForm accountType="merchant" />
      </div>
    </PageContainer>
  );
}
