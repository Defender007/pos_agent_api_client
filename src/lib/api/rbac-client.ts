const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createRole(payload: {
  name: string;
  description: string;
}) {
  const response = await fetch(`${API_BASE_URL}/rbac/roles`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
}

export async function createPermission(payload: {
  name: string;
  description: string;
}) {
  const response = await fetch(`${API_BASE_URL}/rbac/permissions`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create permission");
  }

  return response.json();
}
