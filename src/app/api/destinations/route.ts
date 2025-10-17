import {NextRequest, NextResponse} from "next/server";
import {getAllDestinations} from "@/repo/catalog";

export async function GET(req: NextRequest){
    const destinations = await getAllDestinations();
    return NextResponse.json({status: 200, data: destinations});
}