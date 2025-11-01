import {prisma} from "@/lib/prisma";

export const countryResolvers = {
    Query: {
        countries: async()=>  {
            return prisma.country.findMany({
                orderBy: {name: "asc"},
                include: {regions: {include: {region: true}}}
            })
        },
        countryById: async (_: any, { id }: { id: string }) => {
            return prisma.country.findUnique({
                where: { id },
                include: {regions: true}
            })
        },
        countryBySlug: async (_: any, { slug }: { slug: string }) => {
            return prisma.country.findUnique({
                where: { slug },
                include: {regions: {include: {region: true}}}
            })
        }
    },
    Mutation: {
        createCountry: async (_: any, { data }: { data: any }) => {
            try {
                const { slug, name, iso2, iso3, emoji, summary } = data;
                const flag = `https://flagcdn.com/${iso2.toLowerCase()}.svg`
                const created = await prisma.country.create({
                    data: {
                        slug,
                        name,
                        iso2,
                        flag,
                        iso3,
                        emoji: emoji ?? null,
                        summary: summary ?? null,
                    },
                })
                return created;
            }
            catch (err: any) {
                console.error("Error creating country:", err);
                throw new Error(err.message || "Failed to create country");
            }
        },
        updateCountry: async (_: any, { id, data }: { id: string, data: any }) => {
            try {
                const updated = await prisma.country.update({
                    where: { id },
                    data: data,
                })
                return updated;
            }
            catch (err: any) {
                console.error("Error updating country:", err);
                throw new Error(err.message || "Failed to update country");
            }
        },
        createRegionCountry: async (_: any, { data }: { data: any }) => {
            try {
                const { regionId, countryId, isFeatured, isPrimary } = data;
                const created = await prisma.regionCountry.create({
                    data: {
                        regionId,
                        countryId,
                        isFeatured,
                        isPrimary,
                    },
                })
                return created;
            }
            catch (err: any) {
                console.error("Error creating region country:", err);
                throw new Error(err.message || "Failed to create region country");
            }
        }
    }
};
