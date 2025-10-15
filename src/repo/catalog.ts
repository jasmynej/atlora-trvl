import {Prisma, Region, PrismaClient, Country, Destination} from "@prisma/client";

const prisma = new PrismaClient()

async function getAllRegions(): Promise<Region[]> {
    return prisma.region.findMany({
        include: {
            parent: true
        }
    })
}

async function getAllCountries(): Promise<Country[]>{
    return prisma.country.findMany()
}

async function getAllDestinations(): Promise<Destination[]>{
    return prisma.destination.findMany()
}


export {
    getAllRegions,
    getAllCountries,
    getAllDestinations,
}