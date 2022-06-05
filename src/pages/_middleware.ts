import { NextRequest, NextResponse } from "next/server";

export async function middleware(
  request: NextRequest
): Promise<Response | undefined> {
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/")
  )
    return;

  const slug = request.nextUrl.pathname.substring(1); // Removes the starting '/'
  const result = await fetch(`${request.nextUrl.origin}/api/getLink/${slug}`);

  if (result.status === 200) {
    const data = await result.json();
    if (data.fullLink) return NextResponse.redirect(data.fullLink);
  }

  return NextResponse.redirect(request.nextUrl.origin);
}
