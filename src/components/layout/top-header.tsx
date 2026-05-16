"use client";

import { usePathname } from "next/navigation";

export default function TopHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h2 className="text-xl font-semibold capitalize">
        {pathname.split("/")[1]?.replace("-", " ") || "Dashboard"}
      </h2>

      <div className="flex items-center gap-4">
        <button className="rounded-lg border px-4 py-2 text-sm">
          Notifications
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          TA
        </div>
      </div>
    </header>
  );
}
