import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt, jwtVerify } from "jose";

const ADMIN_PATHS = /^\/admin(\/|$)/;

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  let payload: { id?: string; role?: string };
  try {
    const secret = process.env.JWT_SECRET;

    if (secret) {
      const { payload: jwtPayload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );
      payload = jwtPayload as { id?: string; role?: string };
    } else {
      payload = decodeJwt(token) as { id?: string; role?: string };
    }
  } catch {
    return redirectToLogin(request);
  }

  if (ADMIN_PATHS.test(request.nextUrl.pathname) && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload", "/settings", "/admin/:path*"],
};
