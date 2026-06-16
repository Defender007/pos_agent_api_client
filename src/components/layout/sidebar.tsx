import { cookies } from "next/headers";

import { logout } from "@/app/logout/actions";
import { getCurrentAdminProfile } from "@/lib/api/rbac";
import SidebarClient from "@/components/layout/sidebar-client";

export default async function Sidebar() {
  const cookieStore = await cookies();

  const hasBankToken = Boolean(cookieStore.get("bank_access_token")?.value);

  let email = hasBankToken ? "Bank Staff" : "Admin User";
  let roles: string[] = hasBankToken ? ["Backoffice"] : [];

  if (!hasBankToken) {
    try {
      const profile = await getCurrentAdminProfile();
      email = profile.email;
      roles = profile.roles;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#005C2E]">
          SoftPOS
        </h1>

        <p className="mt-2 text-sm font-semibold text-[#7A5A00]">
          Fidelity Operations Portal
        </p>

        <div className="mt-5 rounded-2xl border border-[#D6EBDD] bg-[#E6F4EC] p-4">
          <p className="truncate text-sm font-semibold text-[#005C2E]">
            {email}
          </p>

          {roles.length > 0 && (
            <p className="mt-1 truncate text-xs font-medium text-slate-600">
              {roles.join(", ")}
            </p>
          )}
        </div>
      </div>

      <SidebarClient hasBankToken={hasBankToken} />

      <form
        action={async () => {
          "use server";

          await logout();
        }}
        className="mt-auto"
      >
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
