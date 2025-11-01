import {prisma} from "@/lib/prisma";

export const userResolvers = {
    Query: {
        user: async(_: any, { id }: { id: string }) => {
            return prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    agencyProfiles: {
                        include: {
                            agency: true
                        }
                    },
                }
            })
        }
    },
    Mutation: {
        updateUser: async(_: any, { id, data }: { id: string, data: any }) => {
            return prisma.user.update({
                where: {id},
                data: data
            })
        }
    }
}