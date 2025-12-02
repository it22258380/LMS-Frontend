import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that anyone can access (no authentication required)
const publicRoutes = [
  '/',           // Home page will handle redirect
  '/login',
  '/register',
];

// Routes that only librarians can access
const librarianOnlyRoutes = [
  '/dashboard',
  '/books',
  '/categories',
  '/users',
];

// Routes that only authenticated users (non-librarians) can access
const userOnlyRoutes = [
  '/browse',
  '/reservations',
  '/profile',
];

// Helper function to check if a path matches any route pattern
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });
}

// Helper function to decode JWT (simple base64 decode, no verification)
function decodeJWT(token: string): { role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get token from cookies (more secure for SSR)
  const token = request.cookies.get('auth_token')?.value;
  
  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const isLibrarianRoute = matchesRoute(pathname, librarianOnlyRoutes);
  const isUserRoute = matchesRoute(pathname, userOnlyRoutes);

  // Allow access to public routes
  if (isPublicRoute) {
    // If user is already authenticated and tries to access login/register,
    // redirect them to appropriate dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      const decoded = decodeJWT(token);
      const redirectUrl = decoded?.role === 'LIBRARIAN' 
        ? '/dashboard' 
        : '/browse';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    // Save the intended destination for redirect after login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode token to check user role
  const decoded = decodeJWT(token);
  const userRole = decoded?.role;

  // Protect librarian-only routes
  if (isLibrarianRoute) {
    if (userRole !== 'LIBRARIAN') {
      // Non-librarian trying to access librarian routes
      return NextResponse.redirect(new URL('/browse', request.url));
    }
    return NextResponse.next();
  }

  // Protect user routes
  if (isUserRoute) {
    if (userRole === 'LIBRARIAN') {
      // Librarian trying to access user-only routes
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Allow all other authenticated routes
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
  
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)',
  ],
};