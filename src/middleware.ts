import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Allow access to auth-related routes
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return response
  }

  // Redirect to login if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Get user role and profile from Supabase
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const role = profile?.role || 'client'

  // Extract user ID from URL for role-specific routes
  const advisorMatch = request.nextUrl.pathname.match(/^\/advisor\/([^/]+)/)
  const clientMatch = request.nextUrl.pathname.match(/^\/client\/([^/]+)/)

  // Handle advisor routes
  if (advisorMatch) {
    const requestedAdvisorId = advisorMatch[1]
    
    if (role !== 'advisor') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Verify the advisor is accessing their own dashboard
    if (profile?.id !== requestedAdvisorId) {
      return NextResponse.redirect(new URL(`/advisor/${profile?.id}/dashboard`, request.url))
    }
  }

  // Handle client routes
  if (clientMatch) {
    const requestedClientId = clientMatch[1]
    
    if (role !== 'client') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Verify the client is accessing their own dashboard
    if (profile?.id !== requestedClientId) {
      return NextResponse.redirect(new URL(`/client/${profile?.id}/dashboard`, request.url))
    }
  }

  // Add role and user ID to request headers for use in components
  request.headers.set('x-user-role', role)
  request.headers.set('x-user-id', profile?.id || '')
  
  return response
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