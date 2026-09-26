import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sign-out(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }

  await auth.protect();
});

export const config = {
  matcher: ["/", "/sign-in(.*)", "/sign-up(.*)", "/sign-out(.*)"],
};
