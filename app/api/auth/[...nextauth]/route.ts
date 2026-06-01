import { handlers, isAuthJsEnabled } from "@/auth";
import { NextResponse } from "next/server";

export const { GET, POST } = handlers;

/** Auth routes return 503 when Auth.js is disabled (AUTH_MODE=mock). */
export async function OPTIONS() {
  if (!isAuthJsEnabled) {
    return NextResponse.json({ error: "Auth.js disabled (AUTH_MODE=mock)" }, { status: 503 });
  }
  return new NextResponse(null, { status: 204 });
}
