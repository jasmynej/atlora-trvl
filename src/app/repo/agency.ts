import {Prisma, PrismaClient, AgencyRole} from '@prisma/client'
import {agencyCreateSchema} from "@/app/schemas";

const prisma = new PrismaClient()

async function createAgency(payload: Prisma.AgencyCreateInput){
    const data = agencyCreateSchema.parse(payload)
    return prisma.agency.create({data})
}

async function getAgencyById(id: string){
    return prisma.agency.findUnique({
        where:{
            id: id
        }
    })
}
async function getAgencyBySlug(slug: string){
    return prisma.agency.findUnique({
        where:{
            slug
        }
    })
}

async function getAllAgencies(){
    return prisma.agency.findMany()
}

async function addAgencyMember(agencyId: string, userId: string, role: AgencyRole){
    return prisma.agencyMember.create({
        data: {
            agencyId,
            userId,
            role
        }
    })
}
export {createAgency, getAgencyById, getAgencyBySlug, getAllAgencies, addAgencyMember}