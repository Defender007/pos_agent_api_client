import { redirect } from "next/navigation";

import { ApiError } from "@/lib/api/api-error";
import type { SectionErrorCardProps } from "@/components/common/section-error-card";

type ServerPageErrorOptions = {
  sessionExpiredRedirect: string;
};

function isUnavailableError(error: unknown) {
  if (error instanceof ApiError) {
    return error.status === 408 || error.status >= 500;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    return (
      message.includes("fetch failed") ||
      message.includes("timeout") ||
      message.includes("timed out") ||
      message.includes("econnrefused") ||
      message.includes("network")
    );
  }

  return false;
}

export function getServerPageError(
  error: unknown,
  { sessionExpiredRedirect }: ServerPageErrorOptions,
): SectionErrorCardProps {
  if (error instanceof Error && error.message === "SESSION_EXPIRED") {
    redirect(sessionExpiredRedirect);
  }

  if (error instanceof ApiError && error.status === 403) {
    return {
      title: "Access denied",
      message: "You do not have permission to view this section.",
    };
  }

  if (isUnavailableError(error)) {
    return {
      title: "Service unavailable",
      message:
        "We could not reach the service right now. Please try again shortly.",
    };
  }

  if (error instanceof ApiError) {
    return {
      title: "Unable to load this section",
      message:
        error.message ||
        "The requested information could not be loaded. Please try again.",
    };
  }

  return {
    title: "Unable to load this section",
    message: "The requested information could not be loaded. Please try again.",
  };
}
