// middleware.ts (debug)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { normalizeRole, isChildRole } from "./lib/roles"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  console.log(">>> middleware running, pathname:", pathname)
  console.log(">>> token:", token)

  if (!token) return NextResponse.next()

  const role = normalizeRole((token as any).role)
  if (isChildRole(role)) {
    const childId = (token as any).childId || (token as any).id || (token as any).child?.id
    console.log(">>> detected child role, childId:", childId)

    if (!childId) return NextResponse.next()

    if (
      !pathname.startsWith(`/aac/${childId}`) &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api") &&
      !pathname.includes(".")
    ) {
      console.log(">>> redirecting to /aac/" + childId)
      return NextResponse.redirect(new URL(`/aac/${childId}`, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*"]
}