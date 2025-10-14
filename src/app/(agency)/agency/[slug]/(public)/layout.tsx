import React from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {getAgencyBySlug} from "@/repo/agency";
import { notFound } from "next/navigation";
import {Agency} from "@prisma/client";
import AgencyProvider from "../AgencyProvider";
import {ThemeJson, themeToStyleVars, buildGoogleFontsHref} from "@/lib/themeUtils";
import AgencyNavBar from "@/components/agency/AgencyNavBar";
import NavBarLink from "@/schemas";


export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const a = await getAgencyBySlug(params.slug);
    return {
        title: `${a.name} | AtloraTrvl`,
        description: `Plan your next trip with ${a.name}.`,
    };
}

const links: NavBarLink[] = [
    {
        title: 'Destinations',
        url: '/destinations'
    },
    {
        title: 'Trips',
        url: '/trips'
    }
]

const buttons: NavBarLink[] = [
    {
        title: 'Inquire',
        url: '/inquire',
        class: 'inquire'
    }
]

export default async function AgencyLayout({children,params,}: {
    children: React.ReactNode,
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const agency: Agency  = await getAgencyBySlug(slug);
    if (!agency) notFound();
    const theme = agency.theme
    const styleVars = themeToStyleVars(agency.theme as ThemeJson)
    // @ts-ignore
    const heading= theme.fonts?.heading || { family: "Bodoni Moda", weights: [400,700], ital: true };
    // @ts-ignore
    const body= theme.fonts?.body || { family: "Open Sans", weights: [400,500], ital: false };

    return (
        <AgencyProvider value={agency}>
            <section
                data-agency
                style={{
                    ...styleVars,
                    ["--font-heading" as any]: `"${heading.family}", serif`,
                    ["--font-body" as any]: `"${body.family}", sans-serif`,
                }}
                className="min-h-screen"
            >
                <AgencyNavBar
                    logo={agency.logo ?? ""}
                    links={links}
                    buttons={buttons}
                    title={agency.name}
                />
                <main>
                    {children}</main>
            </section>
        </AgencyProvider>
    )
}