import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabaseMiddleware'

const publicPaths = ['/login', '/privacy']

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const { supabase, response, user } = await updateSession(request)

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'user'
  const homeUrl = new URL('/', request.url)
  const adminUrl = new URL('/admin', request.url)

  if (role === 'admin' && pathname === '/') {
    return Response.redirect(adminUrl)
  }

  if (role === 'user' && pathname.startsWith('/admin')) {
    return Response.redirect(homeUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}