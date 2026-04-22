import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabaseMiddleware'

// Only these raw paths are fully public and require zero auth
const publicPrefixes = ['/login', '/privacy']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (publicPrefixes.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const { supabase, response, user } = await updateSession(request)

  // If user is missing completely, instantly lock down and boot them to Login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Look up their strict role profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'child'
  const homeUrl = new URL('/', request.url)
  const adminUrl = new URL('/admin', request.url)

  if (role === 'admin' && pathname === '/') {
    return Response.redirect(adminUrl)
  }

  if (role !== 'admin' && pathname.startsWith('/admin')) {
    return Response.redirect(homeUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
