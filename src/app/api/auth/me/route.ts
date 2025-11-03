import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "atlora_session";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(SESSION_COOKIE)?.value;
        if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

        const session = await prisma.session.findUnique({
            where: { token },
            include: {
                user: {
                    include: {
                        agencyProfiles: true,
                        travelerProfile: true,
                    }
                }
            },
        });

        if (!session || session.expiresAt < new Date()) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const { password, ...safeUser } = session.user;
        return NextResponse.json({ authenticated: true, user: safeUser });
    } catch (err) {
        console.error("Auth check error:", err);
        return NextResponse.json(
            { authenticated: false, error: "Unexpected error" },
            { status: 500 }
        );
    }
}