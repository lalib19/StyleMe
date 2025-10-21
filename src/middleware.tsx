import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    // token will be null if no session exists
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Optional: access token data
    // token.email, token.sub (user id), etc.

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile']
};