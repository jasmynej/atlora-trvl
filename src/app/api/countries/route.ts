import {NextRequest, NextResponse} from "next/server";
import {getAllCountries} from "@/repo/catalog";

export async function GET(req: NextRequest) {
    const countries = await getAllCountries();
    return NextResponse.json({status: 200, data: countries});
}