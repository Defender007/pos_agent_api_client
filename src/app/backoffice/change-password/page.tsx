import ChangePasswordForm from "@/components/auth/change-password-form";
import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";

export default function BackofficeChangePasswordPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        <TopHeader />

        <div className="space-y-6 p-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Change Password
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update your Bank Staff backoffice account password
            </p>
          </div>

          <div className="max-w-2xl">
            <ChangePasswordForm accountType="bank" />
          </div>
        </div>
      </main>
    </div>
  );
}
