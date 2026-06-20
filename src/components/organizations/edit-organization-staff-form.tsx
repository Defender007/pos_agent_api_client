"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateOrganizationStaff } from "@/lib/api/organizations";

type Props = {
  organizationId: string;
  staff: {
    id: string;
    email: string;
    role: string;
    status: string;
    profile?: {
      first_name?: string | null;
      last_name?: string | null;
      middle_name?: string | null;
      designation?: string | null;
      staff_id?: string | null;
      phone?: string | null;
    };
  };
};

export default function EditOrganizationStaffForm({
  organizationId,
  staff,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const profile = staff.profile;
  const profileFields: {
    name: string;
    label: string;
    value?: string | null;
  }[] = [
    { name: "first_name", label: "First Name", value: profile?.first_name },
    { name: "last_name", label: "Last Name", value: profile?.last_name },
    { name: "middle_name", label: "Middle Name", value: profile?.middle_name },
    { name: "designation", label: "Designation", value: profile?.designation },
    { name: "staff_id", label: "Staff ID", value: profile?.staff_id },
    { name: "phone", label: "Phone", value: profile?.phone },
  ];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">
        Edit Merchant Staff
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Update merchant staff account and profile details
      </p>

      <form
        className="mt-8 grid gap-6 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const formData = new FormData(e.currentTarget);

          try {
            await updateOrganizationStaff(organizationId, staff.id, {
              email: String(formData.get("email") || ""),
              status: String(formData.get("status") || ""),
              profile: {
                first_name: String(formData.get("first_name") || ""),
                last_name: String(formData.get("last_name") || ""),
                middle_name: String(formData.get("middle_name") || ""),
                designation: String(formData.get("designation") || ""),
                staff_id: String(formData.get("staff_id") || ""),
                phone: String(formData.get("phone") || ""),
              },
            });

            router.push(`/organizations/${organizationId}`);
          } catch (error) {
            console.error(error);
            alert("Failed to update merchant staff");
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
            Status
          </label>
          <select
            name="status"
            defaultValue={staff.status}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="deactivated">deactivated</option>
          </select>
        </div>

        {profileFields.map(({ name, label, value }) => (
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
            className="rounded-xl bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Merchant Staff"}
          </button>
        </div>
      </form>
    </div>
  );
}
