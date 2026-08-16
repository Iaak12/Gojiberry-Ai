import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isLoginRoute = req.nextUrl.pathname === '/login';

  if (isApiAuthRoute) {
    return;
  }

  if (isLoginRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', req.nextUrl));
    }
    return;
  }

  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
  
  if (isApiRoute && !isLoggedIn && !req.nextUrl.pathname.startsWith('/api/inngest')) {
    // Return unauthorized for protected API routes (allowing public routes like inngest callback)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return;
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
