import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 🔐 Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/doctors(.*)",
  "/onboarding(.*)",
  "/doctor(.*)",
  "/admin(.*)",
  "/video-call(.*)",
  "/appointments(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // ✅ Allow public access to /sign-in and /sign-up
  const publicRoutes = ["/sign-in(.*)", "/sign-up(.*)"];
  const isPublic = publicRoutes.some(pattern => new RegExp(`^${pattern}$`).test(req.nextUrl.pathname));

  if (!userId && isProtectedRoute(req) && !isPublic) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

// 🧭 Middleware config
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
