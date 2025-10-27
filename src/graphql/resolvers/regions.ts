import {prisma} from "@/lib/prisma";
import {Region} from "@/generated/prisma";
export const regionResolvers = {
    Query: {
        regions: async () => {
            return prisma.region.findMany({
                orderBy: { name: "asc" },
                include: {parent: true, children: true},
            });
        },
        regionById: async (_parent: any, { id }: { id: string }) => {
            return prisma.region.findUnique({
                where: { id },
                include: {parent: true, children: true},
            });
        },
        regionBySlug: async (_parent: any, { slug }: { slug: string }) => {
            return prisma.region.findUnique({
                where: { slug },
                include: {
                    parent: true,
                    children: true,
                    countries: {
                        include: {country: true}
                    }},
            })
        },
    },
    Mutation: {
        createRegion: async (_parent: any, { data }: { data: any }) => {
            try {
                const { slug, name, type, summary, heroImg, emoji, parentId } = data;

                const created = await prisma.region.create({
                    data: {
                        slug,
                        name,
                        type,
                        summary: summary ?? null,
                        heroImg: heroImg ?? null,
                        emoji: emoji ?? null,
                        parentId: parentId ?? null,
                    },
                    include: {
                        parent: true,
                        children: true,
                    },
                });

                return created;
            } catch (err: any) {
                console.error("Error creating region:", err);
                throw new Error(err.message || "Failed to create region");
            }
        },
        updateRegion: async (_parent: any, { id, data }: { id: string, data: any }) => {
            try {
                const updated = await prisma.region.update({
                    where: { id },
                    data: data,
                    include: {
                        parent: true,
                        children: true,
                    },
                });

                return updated;
            }
            catch (err: any) {
                console.error("Error updating region:", err);
                throw new Error(err.message || "Failed to update region");
            }
        }
    }
};