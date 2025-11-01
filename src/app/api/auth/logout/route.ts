import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "atlora_session";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get(SESSION_COOKIE)?.value;
        if (token) {
            await prisma.session.deleteMany({ where: { token } });
        }

        const res = NextResponse.json({ success: true });
        res.cookies.delete(SESSION_COOKIE);
        return res;
    } catch (err) {
        console.error("Logout error:", err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}