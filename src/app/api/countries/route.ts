import {NextRequest, NextResponse} from "next/server";
import {getAllCountries, createCountry, updateCountry} from "@/repo/catalog";

export async function GET(req: NextRequest) {
    const countries = await getAllCountries();
    return NextResponse.json({status: 200, data: countries});
}

export async function POST(req: NextRequest){
    try {
        const body = await req.json()
        const created =  await createCountry(body)
        return NextResponse.json(created, { status: 201 });
    }
    catch (e: any){
        console.log(e)
        return NextResponse.json(
            { error: 'Failed to create country', detail: e?.message ?? String(e) },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest){
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ?id=" }, { status: 400 });
        }

        const body = await req.json();
        const updated = updateCountry(id, body)
        return NextResponse.json(updated);
    }
    catch (e: any){
        console.log(e)
    }
}