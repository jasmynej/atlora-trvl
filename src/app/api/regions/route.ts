import {NextRequest, NextResponse} from "next/server";
import {getAllRegions, updateRegion, createRegion} from "@/repo/catalog";

export async function GET(req:NextRequest){
    const regions = await getAllRegions();
    return NextResponse.json(regions);
}

export async function PUT(req: Request) {
    try {
        // Get ?id= query param
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ?id=" }, { status: 400 });
        }

        const body = await req.json();

        const updated = await updateRegion(id, body);

        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json(
            {
                error: "Failed to update region",
                detail: err?.message ?? String(err),
            },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Whitelist fields; normalize empty strings -> null for optional fields
        const payload = {
            slug: String(body.slug ?? '').trim(),
            name: String(body.name ?? '').trim(),
            type: body.type, // expect one of: "CONTINENT" | "SUBREGION" | "MARKET_GROUP" | "THEME"
            summary: body.summary === '' ? null : body.summary ?? null,
            heroImg: body.heroImg === '' ? null : body.heroImg ?? null,
            emoji: body.emoji === '' ? null : body.emoji ?? null,
            parentId:
                body.parentId === '' || body.parentId === undefined
                    ? undefined
                    : body.parentId, // undefined -> don’t touch; string -> connect
        };

        if (!payload.slug || !payload.name || !payload.type) {
            return NextResponse.json(
                { error: 'slug, name, and type are required' },
                { status: 400 }
            );
        }

        const created = await createRegion(payload);
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        // Unique constraint or other Prisma errors will land here
        return NextResponse.json(
            { error: 'Failed to create region', detail: err?.message ?? String(err) },
            { status: 500 }
        );
    }
}