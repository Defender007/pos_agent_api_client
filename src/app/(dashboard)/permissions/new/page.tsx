"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createBankadminPermission } from "@/lib/api/bankadmin-rbac-client";

export default function NewPermissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">Create Permission</h1>

      <p className="mt-2 text-sm text-slate-500">
        Add a new permission for RBAC access control
      </p>

      <form
        className="mt-8 space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const formData = new FormData(e.currentTarget);

          try {
            await createBankadminPermission({
              name: String(formData.get("name")),
              description: String(formData.get("description")),
            });

            router.push("/permissions");
          } catch (error) {
            console.error(error);
            alert("Failed to create permission");
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          name="name"
          required
          placeholder="e.g reports.export"
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <textarea
          name="description"
          rows={4}
          placeholder="Describe this permission..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <button
          disabled={loading}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Permission"}
        </button>
      </form>
    </div>
  );
}
