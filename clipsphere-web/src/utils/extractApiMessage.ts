import { AxiosError } from "axios";

/**
 * Parse an API error response into a human-readable message.
 * Pages/components call this in their catch blocks for contextual display.
 */
export function extractApiMessage(error: unknown): string {
  if (!(error instanceof Error)) return "Something went wrong";

  const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
  const status = axiosErr.response?.status;
  const body = axiosErr.response?.data;

  if (body?.message) return body.message;
  if (body?.error) return body.error;

  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This action has already been performed.";
    case 500:
      return "Something went wrong on our end. Please try again.";
    default:
      return axiosErr.message || "Something went wrong";
  }
}
