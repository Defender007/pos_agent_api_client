import Link from "next/link";
import { logout } from "@/app/logout/actions";
import { getCurrentAdminProfile } from "@/lib/api/rbac";

export default async function Sidebar() {
  let permissions: string[] = [];
  let email = "";

  try {
    const profile = await getCurrentAdminProfile();

    permissions = profile.permissions;
    email = profile.email;
  } catch (error) {
    console.error(error);
  }

  const canManageAgents = permissions.includes("agents.manage");

  const canManageStaff = permissions.includes("staff.manage");

  const canViewAnalytics = permissions.includes("analytics.view");

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">SoftPOS Portal</h1>

        {email && <p className="mt-1 text-sm text-gray-500">{email}</p>}
      </div>

      <nav className="flex flex-col gap-2">
        {canViewAnalytics && (
          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        )}

        {canManageAgents && (
          <Link
            href="/agents"
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Agents
          </Link>
        )}

        {canManageStaff && (
          <Link
            href="/staff"
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Staff
          </Link>
        )}

        {canManageStaff && (
          <Link
            href="/roles"
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Roles
          </Link>
        )}
      </nav>
      <form
        action={async () => {
          "use server";

          await logout();
        }}
        className="mt-auto"
      >
        <button
          type="submit"
          className="w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
