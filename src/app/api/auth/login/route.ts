import {NextRequest, NextResponse} from "next/server";
import {logIn} from "@/lib/auth";

const SESSION_COOKIE = "atlora_session";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("atlora_session")?.value;
    console.log("Token:", token);
    // do something with it
    return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest){
    try {
        const body = await req.json()
        const user = await logIn(body.email, body.password)

        const res = NextResponse.json({
            user: user.user,
            success: true,
        });
        res.cookies.set(SESSION_COOKIE, user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return res;
    }
    catch (err: any){
        return NextResponse.json(
            { error: "Unexpected error", detail: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}