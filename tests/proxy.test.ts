import { it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "@/proxy";
it.each([
  ["ko-KR", "/ko"],
  [null, "/en"],
])("root redirect %s", (header, path) => {
  const r = proxy(
    new NextRequest("http://localhost/", {
      headers: header ? { "accept-language": header } : {},
    }),
  );
  expect(r.status).toBe(307);
  expect(r.headers.get("location")).toBe("http://localhost" + path);
  expect(r.headers.get("vary")).toContain("Accept-Language");
  expect(config.matcher).toEqual(["/"]);
});
