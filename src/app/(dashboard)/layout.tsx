import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import TopHeader from "@/components/layout/top-header";
import { getCurrentAdminProfile } from "@/lib/api/rbac";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const hasBankToken = Boolean(cookieStore.get("bank_access_token")?.value);

  try {
    if (!hasBankToken) {
      await getCurrentAdminProfile();
    }
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      redirect("/login?session=expired");
    }

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
