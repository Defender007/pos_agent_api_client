"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/api-error";
import {
  changeBankPassword,
  changeMerchantPassword,
} from "@/lib/api/change-password";
import { Toaster } from "@/components/ui/sonner";

type ChangePasswordFormProps = {
  accountType: "merchant" | "bank";
};

type FieldName = "currentPassword" | "newPassword" | "confirmPassword";

export default function ChangePasswordForm({
  accountType,
}: ChangePasswordFormProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>(
    {},
  );

  const passwordInputType = showPasswords ? "text" : "password";

  function validate() {
    const errors: Partial<Record<FieldName, string>> = {};

    if (!currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long.";
    } else if (newPassword === currentPassword) {
      errors.newPassword =
        "New password must be different from current password.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "New password and confirm password do not match.";
    }

    setFieldErrors(errors);

    const firstError = Object.values(errors)[0];

    if (firstError) {
      toast.error(firstError);
      return false;
    }

    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      if (accountType === "bank") {
        await changeBankPassword(payload);
      } else {
        await changeMerchantPassword(payload);
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.message === "SESSION_EXPIRED"
      ) {
        router.push(
          accountType === "bank"
            ? "/backoffice/login?session=expired"
            : "/login?session=expired",
        );
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to change password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          error={fieldErrors.currentPassword}
          inputType={passwordInputType}
          autoComplete="current-password"
          onChange={setCurrentPassword}
        />

        <PasswordField
          label="New Password"
          value={newPassword}
          error={fieldErrors.newPassword}
          inputType={passwordInputType}
          autoComplete="new-password"
          onChange={setNewPassword}
        />

        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          error={fieldErrors.confirmPassword}
          inputType={passwordInputType}
          autoComplete="new-password"
          onChange={setConfirmPassword}
        />

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowPasswords((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#BFDCCB] px-4 py-3 text-sm font-semibold text-[#005C2E] transition hover:bg-[#E6F4EC]"
          >
            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPasswords ? "Hide Passwords" : "Show Passwords"}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#007A3D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#005C2E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </div>
      </form>

      <Toaster richColors />
    </div>
  );
}

function PasswordField({
  label,
  value,
  error,
  inputType,
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  inputType: "password" | "text";
  autoComplete: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#007A3D] focus:ring-2 focus:ring-[#007A3D]/20"
        autoComplete={autoComplete}
      />

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
