const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
  };
};

export async function loginStaff(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/staff/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}
