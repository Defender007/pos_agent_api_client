import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import { getCurrentAdminProfile } from "@/lib/api/rbac";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email = "";
  let roles: string[] = [];

  try {
    const profile = await getCurrentAdminProfile();
    email = profile.email;
    roles = profile.roles;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1">
        <TopHeader />

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
