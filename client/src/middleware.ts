// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const IGNORE_PATHS = ['/api', '/_next', '/favicon.ico']
const PUBLIC_FILE = /\.(.*)$/
const PUBLIC_ROUTES = ['/', '/forget-password', '/signup', '/reset-password', '/new_password']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('accessToken')

  if (pathname === '/' && token) {
    const homeUrl = req.nextUrl.clone()
    homeUrl.pathname = '/home'
    return NextResponse.redirect(homeUrl)
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  if (
    IGNORE_PATHS.some(p => pathname.startsWith(p)) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  if (!token) {
    const signInUrl = req.nextUrl.clone()
    signInUrl.pathname = '/'
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
