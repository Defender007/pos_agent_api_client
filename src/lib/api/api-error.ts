export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function parseApiError(response: Response) {
  let payload: unknown = null;
  let message = "Request failed";

  try {
    payload = await response.json();

    if (payload && typeof payload === "object" && "message" in payload) {
      message = String(payload.message);
    }
  } catch {
    message = response.statusText || message;
  }

  if (response.status === 401) {
    return new ApiError("SESSION_EXPIRED", 401, payload);
  }

  if (response.status === 403) {
    return new ApiError(
      message || "You do not have permission to perform this action.",
      403,
      payload,
    );
  }

  return new ApiError(message, response.status, payload);
}
