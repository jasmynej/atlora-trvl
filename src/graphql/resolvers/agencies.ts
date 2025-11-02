import {prisma} from "@/lib/prisma";

export const agencyResolvers = {
    Query: {
        agencies: async() => {
            return prisma.agency.findMany({
                orderBy: {name: "asc"}
            })
        },
        agency: async(_: any, { slug }: { slug: string }) => {
            return prisma.agency.findUnique({
                where: {
                    slug,
                },
                include: {
                    members: true
                }
            })
        },
        agencyById: async(_: any, { id }: { id: string }) => {
            return prisma.agency.findUnique({
                where: {
                    id: id,
                }
            })
        },
    },
    Mutation: {
        addAgency: async(_:any, { data }: {data: any}) => {
            return prisma.agency.create({
                data: data
            })
        },
        updateAgency: async(_: any, { id, data }: {id: string, data: any}) => {
            return prisma.agency.update({
                where: {id},
                data: data
            })
        },
        addAgencyMember: async(_: any, { data }: { data: any }) => {
            return prisma.agencyMember.create({
                data,
                include: {
                    agency: true,
                }
            })
        }
    }
}