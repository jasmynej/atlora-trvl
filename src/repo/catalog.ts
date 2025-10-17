import {Prisma, Region, PrismaClient, Country, Destination} from "@prisma/client";
import {RegionWithParent,
    regionWithParentInclude,
     RegionBaseInput,
    CountryBaseInput} from "@/repo/dto";

const prisma = new PrismaClient()

async function getAllRegions(): Promise<RegionWithParent[]> {
    return prisma.region.findMany({
        include: regionWithParentInclude,
        orderBy: { name: "asc" },
    });
}

async function getAllCountries(): Promise<Country[]>{
    return prisma.country.findMany({
       orderBy: {name: "asc"}
    })
}

async function getAllDestinations(): Promise<Destination[]>{
    return prisma.destination.findMany()
}

async function createRegion(input: RegionBaseInput) {
    const { slug, name, type, summary, heroImg, emoji, parentId } = input;

    const data: any = {
        slug,
        name,
        type,
        summary: summary ?? null,
        heroImg: heroImg ?? null,
        emoji: emoji ?? null,
    };

    if (parentId) {
        data.parent = { connect: { id: parentId } };
    }

    return prisma.region.create({
        data,
        select: {
            id: true,
            slug: true,
            name: true,
            type: true,
            parentId: true,
            heroImg: true,
            emoji: true,
            summary: true,
            parent: { select: { id: true, name: true, slug: true } },
        },
    });
}

async function updateRegion(id: string, input: Partial<RegionBaseInput>) {
    const { name, slug, type, summary, heroImg, emoji, parentId } = input;

    const scalarData: any = {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(type && { type }),
        summary: summary ?? null,
        heroImg: heroImg ?? null,
        emoji: emoji ?? null,
    };

    const relationOps: any = {};
    if (input.hasOwnProperty('parentId')) {
        relationOps.parent = parentId
            ? { connect: { id: parentId } }
            : { disconnect: true };
    }

    return prisma.region.update({
        where: { id },
        data: { ...scalarData, ...relationOps },
        select: {
            id: true,
            slug: true,
            name: true,
            type: true,
            parentId: true,
            heroImg: true,
            emoji: true,
            summary: true,
            parent: { select: { id: true, name: true, slug: true } },
        },
    });
}


async function createCountry(input: CountryBaseInput ){
    const { name, slug,iso2, iso3, summary, emoji} = input;
    const flag = `https://flagcdn.com/${iso2.toLowerCase()}.svg`

    return prisma.country.create({
        data: {
            name,slug, iso2, iso3, summary, emoji, flag
        },
        select: {
            id: true
        }
    })
}

async function updateCountry(id: string, input: CountryBaseInput){
    const { name, slug,iso2, iso3, summary, emoji} = input;
    return prisma.country.update({
        where: {id},
        data: {
            name, slug, iso2, iso3, summary, emoji
        }
    })
}
export {
    getAllRegions,
    getAllCountries,
    getAllDestinations,
    updateRegion,
    createRegion,
    createCountry,
    updateCountry
}