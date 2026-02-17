import { NextResponse, NextRequest } from 'next/server';
import { getTenantFromHost } from './lib/tenant';

export const config = {
  matcher: ['/((?!_next/|favicon.ico).*)'],
};

export default function middleware(req) {
  const host = req.headers.get('host') || '';
  const tenant = getTenantFromHost(host);
  if (!tenant) return NextResponse.next();

  const url = req.nextUrl;
  if (url.pathname.startsWith(`/t/${tenant}`)) return NextResponse.next();

  url.pathname = `/t/${tenant}${url.pathname === '/' ? '/dashboard' : url.pathname}`;
  return NextResponse.rewrite(url);
}