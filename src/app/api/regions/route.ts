import {NextRequest, NextResponse} from "next/server";
import {getAllRegions} from "@/repo/catalog";

export async function GET(req:NextRequest){
    const regions = await getAllRegions();
    return NextResponse.json(regions);
}