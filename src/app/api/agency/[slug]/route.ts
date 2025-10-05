import {getAgencyBySlug} from "@/app/repo/agency";
import {NextResponse, NextRequest} from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }){
    const params = await props.params;
    const agency = await getAgencyBySlug(params.slug);
    return NextResponse.json(agency)
}