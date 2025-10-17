import {Prisma, RegionType} from "@prisma/client";

export const regionParentSelect = Prisma.validator<Prisma.RegionSelect>()({
    id: true,
    name: true,
    slug: true,
});

export const regionBaseSelect = Prisma.validator<Prisma.RegionSelect>()({
    id: true,
    slug: true,
    name: true,
    type: true,
    parentId: true,
    heroImg: true,
    emoji: true,
    summary: true,
});

export type RegionBase = Prisma.RegionGetPayload<{ select: typeof regionBaseSelect }>;

export const regionWithParentInclude = Prisma.validator<Prisma.RegionInclude>()({
    parent: { select: regionParentSelect },
});

export type RegionWithParent = Prisma.RegionGetPayload<{
    select: typeof regionBaseSelect;
    include: typeof regionWithParentInclude;
}>;


export type RegionUpdateInput = {
    name?: string;
    slug?: string;
    type?: RegionType;
    summary?: string | null;
    heroImg?: string | null;
    parentId?: string | null; // include if you plan to edit parent in this form
};


export type RegionBaseInput = {
    slug: string;
    name: string;
    type: RegionType;
    summary?: string | null;
    heroImg?: string | null;
    emoji?: string | null;
    parentId?: string | null;
};

export type CountryBaseInput = {
    slug: string;
    name: string;
    iso2: string;
    iso3: string;
    emoji?: string;
    summary?: string;
}

