const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type BankLoginPayload = {
  email: string;
  password: string;
};

type BankLoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
  };
};

export async function loginBankStaff(
  payload: BankLoginPayload,
): Promise<BankLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/bankadmin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Invalid bank staff email or password");
  }

  return response.json();
}
