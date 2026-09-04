import { NextResponse } from "next/server";
import { contactSchema, toFieldErrors } from "@/lib/validation";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    clientKey(request.headers),
  );
  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Too many enquiries from this connection. Please try again shortly, or email us directly.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please correct the highlighted fields and try again.",
        errors: toFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  // Honeypot: a filled hidden field means a bot. Answer 200 so it learns nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    // Log server-side; never leak transport details to the browser.
    console.error(`[contact] ${result.reason}: ${result.detail}`);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not send your message. Please try again, or email us directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
