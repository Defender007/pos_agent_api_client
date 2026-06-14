"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const wasBankStaff = Boolean(cookieStore.get("bank_access_token")?.value);

  cookieStore.delete("access_token");
  cookieStore.delete("bank_access_token");

  redirect(wasBankStaff ? "/backoffice/login" : "/login");
}
