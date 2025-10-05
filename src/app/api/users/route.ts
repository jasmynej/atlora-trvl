import {createUser, getAllUsers, getUsersByRole} from "@/app/repo/users";
import {NextRequest, NextResponse} from "next/server";
import {GlobalRole} from "@prisma/client";

export async function GET(req: NextRequest){
    const queryParams = req.nextUrl.searchParams
    if(queryParams.has("role")){
        const roleParam = queryParams.get("role");
        const role =
            roleParam && Object.values(GlobalRole).includes(roleParam as GlobalRole)
                ? (roleParam as GlobalRole)
                : GlobalRole.USER;

        const users = await getUsersByRole(role)
        return NextResponse.json(users)
    } else {
        const users = await getAllUsers()
        return NextResponse.json(users)
    }

}

export async function POST(req: NextRequest){
    const body = await req.json()
    const user = await createUser(body)

    return NextResponse.json(user)
}

