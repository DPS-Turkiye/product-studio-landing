import axios from "axios";

export const api = axios.create();

export function submissionFieldErrors(error: unknown) {
  if (!axios.isAxiosError(error) || error.response?.status !== 422) return null;
  const fields = (
    error.response.data as { fields?: { field: string; code: string }[] }
  ).fields;
  return Array.isArray(fields) ? fields : null;
}
