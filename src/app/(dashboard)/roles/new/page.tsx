"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createBankadminRole } from "@/lib/api/bankadmin-rbac-client";

export default function NewRolePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Create Role</h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a new RBAC role for administrative access control
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          const formData = new FormData(e.currentTarget);

          try {
            await createBankadminRole({
              name: String(formData.get("name")),
              description: String(formData.get("description")),
            });

            router.push("/roles");
          } catch (error) {
            console.error(error);
            alert("Failed to create role");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Role Name
          </label>

          <input
            name="name"
            required
            placeholder="e.g operations"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            rows={4}
            placeholder="Describe this role..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Role"}
        </button>
      </form>
    </div>
  );
}
