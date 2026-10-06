import { it, expect, vi } from "vitest";
import { POST } from "@/app/api/quote/route";
const valid = {
  lang: "ja",
  interest: "dental",
  timing: "not-sure",
  name: "Test",
  contactMethod: "email",
  contact: "t@example.com",
  consent: true,
};
it("valid, invalid, malformed and oversized requests never log or transmit body", async () => {
  const spies = ["log", "info", "warn", "error", "debug"].map((k) =>
    vi.spyOn(console, k as "log"),
  );
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  try {
    for (const [body, status] of [
      [JSON.stringify(valid), 200],
      ['{"lang":"ja"}', 422],
      ["broken", 422],
      ["a".repeat(10001), 422],
    ] as const) {
      const r = await POST(
        new Request("http://localhost/api/quote", { method: "POST", body }),
      );
      expect(r.status).toBe(status);
      const result = await r.json();
      if (status === 200) expect(result).toEqual({ ok: true });
      else expect(result.errors.length).toBeGreaterThan(0);
    }
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  } finally {
    vi.restoreAllMocks();
  }
});
