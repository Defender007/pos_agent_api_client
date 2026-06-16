"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createStaff } from "@/lib/api/rbac-client";

export default function NewStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-black text-slate-900">Create Staff</h1>
      <p className="mt-2 text-sm text-slate-500">
        Register a new admin staff user with profile details
      </p>

      <form
        className="mt-8 grid gap-6 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const formData = new FormData(e.currentTarget);

          try {
            await createStaff({
              email: String(formData.get("email")),
              password: String(formData.get("password")),
              role: String(formData.get("role")),
              profile: {
                first_name: String(formData.get("first_name")),
                last_name: String(formData.get("last_name")),
                middle_name: String(formData.get("middle_name")),
                designation: String(formData.get("designation")),
                organisation: String(formData.get("organisation")),
                staff_id: String(formData.get("staff_id")),
                phone: String(formData.get("phone")),
              },
            });

            router.push("/staff");
          } catch (error) {
            console.error(error);
            alert("Failed to create staff");
          } finally {
            setLoading(false);
          }
        }}
      >
        {[
          ["email", "Email"],
          ["password", "Password"],
          ["role", "Role"],
          ["first_name", "First Name"],
          ["last_name", "Last Name"],
          ["middle_name", "Middle Name"],
          ["designation", "Designation"],
          ["organisation", "Organisation"],
          ["staff_id", "Staff ID"],
          ["phone", "Phone"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {label}
            </label>
            <input
              name={name}
              type={name === "password" ? "password" : "text"}
              required={[
                "email",
                "password",
                "role",
                "first_name",
                "last_name",
              ].includes(name)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            disabled={loading}
            className="rounded-xl bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Staff"}
          </button>
        </div>
      </form>
    </div>
  );
}
