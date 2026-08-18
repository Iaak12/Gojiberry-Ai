import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

const PUBLIC_API_PREFIXES = [
  '/api/auth',
  '/api/analyze-website',
  '/api/user',
  '/api/inngest',
  '/api/webhooks',
];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname === '/login';
  const isSignupRoute = pathname === '/signup';
  const isApiRoute = pathname.startsWith('/api');

  // If already logged in and navigating to login/signup, redirect to dashboard
  if ((isLoginRoute || isSignupRoute) && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Dashboard requires login
  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // Check API route protection
  if (isApiRoute && !isLoggedIn) {
    const isPublicApi = PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix));
    if (!isPublicApi) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return;
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
