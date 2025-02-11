import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes - make sure to include both variations
const isPublicRoute = createRouteMatcher([
  "/auth/login",
  "/auth/login/(.*)",
  "/auth/register",
  "/auth/register/(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
    // Allow public routes to bypass authentication
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    // Protect all other routes
    await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};