import {Prisma, PrismaClient, AgencyRole, Agency} from '@prisma/client'
import {agencyCreateSchema, ThemeUpdateSchema, ThemeUpdateInput} from "@/schemas";
import {AltoraTheme} from "@/schemas/defaults";

const prisma = new PrismaClient()
function deepMerge<T>(base: T, patch: Partial<T>): T {
    const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
    for (const [k, v] of Object.entries(patch)) {
        if (v && typeof v === "object" && !Array.isArray(v)) {
            out[k] = deepMerge((out[k] ?? {}), v as any);
        } else if (v !== undefined) {
            out[k] = v;
        }
    }
    return out;
}

async function createAgency(payload: Prisma.AgencyCreateInput){
    payload.theme = AltoraTheme
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

 async function updateAgencyThemeBySlug(slug: string, data: ThemeUpdateInput) {
    // fetch current theme
    const agency = await prisma.agency.findUnique({ where: { slug }, select: { id: true, theme: true } });
    if (!agency) throw new Error("Agency not found");

    const merged = deepMerge(agency.theme ?? {}, data);

    return prisma.agency.update({
        where: { id: agency.id },
        data: { theme: merged },
        select: { id: true, slug: true, theme: true },
    });
}
export {
    createAgency,
    getAgencyById,
    getAgencyBySlug,
    getAllAgencies,
    addAgencyMember,
    updateAgencyThemeBySlug
}