import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { it, expect } from "vitest";
import { site } from "@/config/site";
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)],
  );
}
it("CTA ownership, preview mode and public copy guards", () => {
  for (const file of files("src").filter((f) => /\.(tsx?|css)$/.test(f))) {
    const text = readFileSync(file, "utf8");
    if (file.endsWith(".tsx")) {
      if (!file.includes("/cta/"))
        expect(text).not.toMatch(
          /className=["\x27][^"\x27]*\bcta\b|className=\{`[^`]*\bcta\b/,
        );
      expect(text).not.toMatch(/href=["']#["']/);
    }
    if (file.startsWith("src/content/")) {
      expect(text).not.toContain("%");
      expect(text).not.toMatch(/수수료율|commission rate|referral rate/);
    }
    expect(text).not.toMatch(
      /\b(best|guarantee|guaranteed|No\.1|half the cost|before and after|cheapest)\b/i,
    );
    expect(text).not.toMatch(/최고|보장|줄기세포|전후|保証|最高|stem cell/);
    expect(text).not.toMatch(/40,000|40000|1,650|1,000만|CPL|4만 원/);
  }
  expect(readFileSync("README.md", "utf8")).not.toMatch(
    /40,000|40000|1,650|1,000만|CPL|4만 원/,
  );
  expect(site.launchState).toBe("preview");
});
