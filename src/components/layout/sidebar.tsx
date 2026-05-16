"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Agents",
    href: "/agents",
  },
  {
    label: "Users",
    href: "/users",
  },
  {
    label: "Roles",
    href: "/roles",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SoftPOS</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-2 ${
              pathname === item.href
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
