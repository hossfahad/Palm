import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(ico|png|jpg|jpeg|svg|css|js|json)$).*)',
    // Force matching for auth API routes
    '/api/auth/(.*)',
  ],
}; 