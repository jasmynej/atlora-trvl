import {getAllAgencies, createAgency} from "@/repo/agency";
import {NextRequest, NextResponse} from "next/server";
import {Agency} from "@prisma/client";

export async function GET(req: NextRequest){
    const agencies = await getAllAgencies()
    return NextResponse.json(agencies)
}

export async function POST(req: NextRequest){
    const payload = await req.json()
    const agency: Agency = await createAgency(payload)
    return NextResponse.json(agency)
}