import {NextRequest, NextResponse} from "next/server";
import {signUp} from "@/lib/auth";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const newAccount = await signUp(body);
        return NextResponse.json(newAccount);
    }
    catch (err: any){
        return NextResponse.json(
            { error: "Unexpected error", detail: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}