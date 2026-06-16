"use client";

import { usePathname } from "next/navigation";

function getTitle(pathname: string) {
  if (pathname.startsWith("/backoffice/change-password")) {
    return "Change Password";
  }
  if (pathname.startsWith("/change-password")) return "Change Password";
  if (pathname.startsWith("/agents")) return "Agent Management";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/staff")) return "Staff Administration";
  if (pathname.startsWith("/roles")) return "Roles & Permissions";
  return "SoftPOS Portal";
}

export default function TopHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-8 py-5 backdrop-blur">
      <h2 className="text-xl font-bold text-[#005C2E]">{getTitle(pathname)}</h2>

      <p className="mt-1 text-sm text-slate-600">
        Secure SoftPOS agent operations and compliance workspace
      </p>
    </header>
  );
}
