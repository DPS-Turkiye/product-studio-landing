import { submissionFieldErrors } from "@/lib/api";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

function axiosError(status: number, data: unknown) {
  const headers = new AxiosHeaders();
  return new AxiosError("fail", String(status), { headers }, null, {
    status,
    statusText: "error",
    headers,
    config: { headers },
    data,
  });
}

describe("submissionFieldErrors", () => {
  it("ignores errors that are not a 422 from axios", () => {
    expect(submissionFieldErrors(new Error("nope"))).toBeNull();
    expect(submissionFieldErrors(axiosError(500, { fields: [] }))).toBeNull();
    expect(submissionFieldErrors(axiosError(422, {}))).toBeNull();
    expect(
      submissionFieldErrors(axiosError(422, { fields: "email" })),
    ).toBeNull();
  });

  it("returns the field list from a 422", () => {
    const fields = [{ field: "email", code: "invalid_email" }];
    expect(submissionFieldErrors(axiosError(422, { fields }))).toEqual(fields);
  });

  it("treats axios errors via the axios helper", () => {
    expect(axios.isAxiosError(axiosError(422, { fields: [] }))).toBe(true);
  });
});
