"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AdminUser } from "@/lib/api/rbac";
import { updateStaff } from "@/lib/api/rbac-client";

type Props = {
  staff: AdminUser;
};

export default function EditStaffForm({ staff }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const profile = staff.profile;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">Edit Staff Profile</h1>

      <p className="mt-2 text-sm text-slate-500">
        Update staff account and profile information
      </p>

      <form
        className="mt-8 grid gap-6 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          const formData = new FormData(e.currentTarget);

          try {
            await updateStaff(staff.id, {
              email: String(formData.get("email") || ""),

              password: String(formData.get("password") || ""),

              profile: {
                first_name: String(formData.get("first_name") || ""),

                last_name: String(formData.get("last_name") || ""),

                middle_name: String(formData.get("middle_name") || ""),

                designation: String(formData.get("designation") || ""),

                organisation: String(formData.get("organisation") || ""),

                staff_id: String(formData.get("staff_id") || ""),

                phone: String(formData.get("phone") || ""),
              },
            });

            router.push("/staff");
          } catch (error) {
            console.error(error);
            alert("Failed to update staff");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>

          <input
            name="email"
            defaultValue={staff.email}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Leave blank to keep current password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        {[
          ["first_name", "First Name", profile?.first_name],
          ["last_name", "Last Name", profile?.last_name],
          ["middle_name", "Middle Name", profile?.middle_name],
          ["designation", "Designation", profile?.designation],
          ["organisation", "Organisation", profile?.organisation],
          ["staff_id", "Staff ID", profile?.staff_id],
          ["phone", "Phone", profile?.phone],
        ].map(([name, label, value]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {label}
            </label>

            <input
              name={name}
              defaultValue={String(value || "")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Staff"}
          </button>
        </div>
      </form>
    </div>
  );
}
