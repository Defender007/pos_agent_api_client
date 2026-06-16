"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
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
            const email = String(formData.get("email") || "").trim();
            const firstName = String(formData.get("first_name") || "").trim();
            const lastName = String(formData.get("last_name") || "").trim();

            if (!email || !firstName || !lastName) {
              toast.error("Please complete all required staff details.");
              return;
            }

            await createOrganizationStaff(organizationId, {
              email,
              role: "admin",
              profile: {
                first_name: firstName,
                last_name: lastName,
                middle_name: String(formData.get("middle_name") || ""),
                designation: "Admin",
                staff_id: String(formData.get("staff_id") || ""),
                phone: String(formData.get("phone") || ""),
              },
            });

            toast.success(
              "Merchant staff created. Default password is Pass123$* and must be changed at first login.",
            );

            setTimeout(() => {
              router.push(`/organizations/${organizationId}`);
            }, 800);
          } catch (error) {
            console.error(error);
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to create merchant staff.",
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Role
          </label>

          <input type="hidden" name="role" value="admin" />

          <select
            value="admin"
            disabled
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
          >
            <option value="admin">admin</option>
          </select>
        </div>

        {[
          ["email", "Email"],
          ["first_name", "First Name"],
          ["last_name", "Last Name"],
          ["middle_name", "Middle Name"],
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

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Designation
          </label>

          <input type="hidden" name="designation" value="Admin" />

          <select
            value="Admin"
            disabled
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
          >
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="md:col-span-2 rounded-xl border border-[#F9C80E]/40 bg-[#FFF7D6] p-4 text-sm text-[#7A5A00]">
          Default password: <strong>Pass123$*</strong>. User must change it at
          first login.
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Merchant Staff"}
          </button>
        </div>
      </form>

      <Toaster richColors />
    </div>
  );
}
