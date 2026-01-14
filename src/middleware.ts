import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = req.nextUrl;

    // Redirect authenticated users away from auth pages
    if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect unauthenticated users to login for protected routes  
    if (!token && pathname.startsWith('/profile')) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    // Optional: access token data
    // token.email, token.sub (user id), etc.

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile', '/auth']
};