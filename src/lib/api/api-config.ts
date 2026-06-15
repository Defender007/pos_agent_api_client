export function getServerApiBaseUrl() {
  const baseUrl =
    process.env.API_INTERNAL_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "API base URL is not configured. Set API_INTERNAL_BASE_URL or NEXT_PUBLIC_API_BASE_URL.",
    );
  }

  return baseUrl;
}

export function getClientApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "Public API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.",
    );
  }

  return baseUrl;
}
