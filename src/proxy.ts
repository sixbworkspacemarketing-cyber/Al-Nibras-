import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabaseMiddleware'

export async function proxy(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request)

  const signinUrl = new URL('/login', request.url)
  const homeUrl = new URL('/', request.url)
  const adminUrl = new URL('/admin', request.url)

  // 1. If user is NOT logged in and trying to access protected routes
  if (!user && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/privacy') &&
      request.nextUrl.pathname !== '/'
  ) {
    return response // updateSession handles session refresh
  }

  // 2. Fetch profile role if user exists
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'user'

    // Redirect admin to /admin if they land on /
    if (role === 'admin' && request.nextUrl.pathname === '/') {
      return Response.redirect(adminUrl)
    }

    // Redirect regular users to / if they try to access /admin
    if (role === 'user' && request.nextUrl.pathname.startsWith('/admin')) {
      return Response.redirect(homeUrl)
    }
    
    // Redirect logged in users away from /login
    if (request.nextUrl.pathname.startsWith('/login')) {
      return Response.redirect(role === 'admin' ? adminUrl : homeUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
