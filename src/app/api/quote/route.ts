import { validateQuote } from "@/lib/quote/schema";
export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 10_000)
    return Response.json(
      { ok: false, errors: [{ field: "_body", code: "too_long" }] },
      { status: 422 },
    );
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json(
      { ok: false, errors: [{ field: "_body", code: "invalid" }] },
      { status: 422 },
    );
  }
  const r = validateQuote(body);
  return r.ok
    ? Response.json({ ok: true })
    : Response.json({ ok: false, errors: r.errors }, { status: 422 });
}
