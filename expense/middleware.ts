import { clerkMiddleware } from "@clerk/nextjs/server";

const clerkMiddlewareInstance = clerkMiddleware();

export default function middleware(req, res, next) {
  const publicPaths = ["/sign-in", "/sign-up"];
  const { pathname } = req.nextUrl;

  if (publicPaths.includes(pathname)) {
    // Allow public routes to proceed without authentication
    return next();
  } else {
    // Use Clerk's middleware for other routes
    return clerkMiddlewareInstance(req, res);
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
