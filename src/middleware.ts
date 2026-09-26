import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/sign-in(.*)", "/sign-up(.*)", "/sign-out(.*)"],
};
