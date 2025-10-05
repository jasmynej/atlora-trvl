import {Prisma, PrismaClient, GlobalRole} from '@prisma/client'
import {userCreateSchema} from "@/schemas";

const prisma = new PrismaClient()

async function createUser(payload: Prisma.UserCreateInput){
    const data = userCreateSchema.parse(payload)
    return prisma.user.create({data});
}

async function getUserById(id: string){
    return prisma.user.findUnique({
        where: {
            id: id
        }
    });
}

async function getUsersByRole(role: GlobalRole){
    return prisma.user.findMany({
        where:{
            globalRole: role
        }
    })
}

async function getAllUsers(){
    return prisma.user.findMany()
}
export {createUser, getUserById, getUsersByRole, getAllUsers}