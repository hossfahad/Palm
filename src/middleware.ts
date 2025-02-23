import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and api routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Allow access to auth-related routes
    if (request.nextUrl.pathname.startsWith('/auth')) {
      // If user is authenticated and trying to access auth pages, redirect to dashboard
      if (user && !request.nextUrl.pathname.startsWith('/auth/callback')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return response;
    }

    // Redirect to login if not authenticated
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Get user role and profile from Supabase
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const role = profile?.role || 'client';

    // Handle role-specific routes
    if (request.nextUrl.pathname.startsWith('/advisor') && role !== 'advisor') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/client') && role !== 'client') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add role and user ID to request headers for use in components
    request.headers.set('x-user-role', role);
    request.headers.set('x-user-id', profile?.id || '');

    return response;
  } catch (error) {
    // If there's an error (like invalid session), redirect to login
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 