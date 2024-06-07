import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

//protect dashboard, user cant see the dashboard unless user is signed-in
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
   '/forum(.*)',
   '/expenses/[id](.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};