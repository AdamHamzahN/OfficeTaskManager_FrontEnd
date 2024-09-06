import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // const isLogin = false;
    // if (!isLogin) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    const cookie = request.cookies.get("is_user_login");

    if (!cookie) {
        return NextResponse.rewrite(new URL("/login, request.url"));
    }
}

export const config = {
    matcher: ['/super-admin/:path*','team-lead/:path*', '/karyawan/:path*'],
}