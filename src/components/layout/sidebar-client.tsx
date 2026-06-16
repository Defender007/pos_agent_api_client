"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  UserCog,
  KeyRound,
  Building2,
  LockKeyhole,
} from "lucide-react";

type SidebarClientProps = {
  hasBankToken: boolean;
};

export default function SidebarClient({ hasBankToken }: SidebarClientProps) {
  const pathname = usePathname();

  const itemClass = (path: string) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      pathname.startsWith(path)
        ? "bg-[#007A3D] text-white shadow-lg"
        : "text-slate-600 hover:bg-[#E6F4EC] hover:text-[#005C2E]"
    }`;

  return (
    <nav className="mt-10 flex flex-col gap-2">
      <Link
        href={hasBankToken ? "/backoffice/dashboard" : "/dashboard"}
        className={itemClass(
          hasBankToken ? "/backoffice/dashboard" : "/dashboard",
        )}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      {hasBankToken && (
        <Link href="/organizations" className={itemClass("/organizations")}>
          <Building2 size={18} />
          Organizations
        </Link>
      )}

      <Link
        href={hasBankToken ? "/agents/approvals" : "/agents"}
        className={itemClass("/agents")}
      >
        <Users size={18} />
        Agents
      </Link>

      {hasBankToken && (
        <>
          <Link href="/staff" className={itemClass("/staff")}>
            <UserCog size={18} />
            Staff
          </Link>

          <Link href="/roles" className={itemClass("/roles")}>
            <ShieldCheck size={18} />
            Roles
          </Link>

          <Link href="/permissions" className={itemClass("/permissions")}>
            <KeyRound size={18} />
            Permissions
          </Link>
        </>
      )}

      <Link
        href={hasBankToken ? "/backoffice/change-password" : "/change-password"}
        className={itemClass(
          hasBankToken ? "/backoffice/change-password" : "/change-password",
        )}
      >
        <LockKeyhole size={18} />
        Change Password
      </Link>
    </nav>
  );
}
