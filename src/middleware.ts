import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabaseMiddleware'

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request)

  const signinUrl = new URL('/login', request.url)
  const homeUrl = new URL('/', request.url)
  const adminUrl = new URL('/admin', request.url)

  if (!user && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/privacy') &&
      request.nextUrl.pathname !== '/'
  ) {
    return response
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'user'

    if (role === 'admin' && request.nextUrl.pathname === '/') {
      return Response.redirect(adminUrl)
    }

    if (role === 'user' && request.nextUrl.pathname.startsWith('/admin')) {
      return Response.redirect(homeUrl)
    }
    
    if (request.nextUrl.pathname.startsWith('/login')) {
      return Response.redirect(role === 'admin' ? adminUrl : homeUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}