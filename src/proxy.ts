import { NextRequest, NextResponse } from "next/server";
import { negotiateLanguage } from "@/lib/i18n/negotiate";
export function proxy(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL(
      "/" + negotiateLanguage(request.headers.get("accept-language")),
      request.url,
    ),
  );
  response.headers.set("Vary", "Accept-Language");
  return response;
}
export const config = { matcher: ["/"] };
