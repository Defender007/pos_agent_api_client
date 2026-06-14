"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { createOrganizationStaff } from "@/lib/api/organizations";

export default function NewOrganizationStaffPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const organizationId = String(params.id);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">
        Create Merchant Staff
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Add a staff user to this merchant organization. A default password will
        be assigned and the user must change it at first login.
      </p>

      <form
        className="mt-8 grid gap-6 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const formData = new FormData(e.currentTarget);

          try {
            await createOrganizationStaff(organizationId, {
              email: String(formData.get("email")),
              role: String(formData.get("role")),
              profile: {
                first_name: String(formData.get("first_name")),
                last_name: String(formData.get("last_name")),
                middle_name: String(formData.get("middle_name") || ""),
                designation: String(formData.get("designation") || ""),
                staff_id: String(formData.get("staff_id") || ""),
                phone: String(formData.get("phone") || ""),
              },
            });

            alert(
              "Merchant Staff created successfully. Default password is Pass123$* and must be changed at first login.",
            );

            router.push(`/organizations/${organizationId}`);
          } catch (error) {
            console.error(error);
            alert("Failed to create merchant staff");
          } finally {
            setLoading(false);
          }
        }}
      >
        {[
          ["email", "Email"],
          ["role", "Role"],
          ["first_name", "First Name"],
          ["last_name", "Last Name"],
          ["middle_name", "Middle Name"],
          ["designation", "Designation"],
          ["staff_id", "Staff ID"],
          ["phone", "Phone"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {label}
            </label>

            <input
              name={name}
              type="text"
              required={["email", "role", "first_name", "last_name"].includes(
                name,
              )}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>
        ))}

        <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Default password: <strong>Pass123$*</strong>. User must change it at
          first login.
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Merchant Staff"}
          </button>
        </div>
      </form>
    </div>
  );
}
