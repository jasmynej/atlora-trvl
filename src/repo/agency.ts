import {Prisma, PrismaClient, AgencyRole, Agency} from '@prisma/client'
import {agencyCreateSchema} from "@/schemas";

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
async function getAgencyBySlug(slug: string): Promise<Agency>{
    const agency = await prisma.agency.findUnique({ where: { slug } });
    if (!agency) throw new Error("Agency not found");
    return agency
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