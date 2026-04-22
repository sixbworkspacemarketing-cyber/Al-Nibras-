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

  // Simple Admin check by email only (Faster)
  const isSuperAdmin = user.email === 'alnibras.kids@gmail.com'
  
  const homeUrl = new URL('/', request.url)
  const adminUrl = new URL('/admin', request.url)

  // If they are on admin page but not super admin email, kick them out
  if (pathname.startsWith('/admin') && !isSuperAdmin) {
    return NextResponse.redirect(homeUrl)
  }

  // If they are admin and on root, send to admin dash
  if (isSuperAdmin && pathname === '/') {
    return NextResponse.redirect(adminUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
