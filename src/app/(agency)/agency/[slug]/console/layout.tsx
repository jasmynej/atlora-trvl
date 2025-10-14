import React from "react";
import AgencyProvider from "@/app/(agency)/agency/[slug]/AgencyProvider";
import {getAgencyBySlug} from "@/repo/agency";
import {Agency} from "@prisma/client";
import {notFound} from "next/navigation";
import {ThemeJson, themeToStyleVars} from "@/lib/themeUtils";
import NavBarLink from "@/schemas";
import AgencySideBarNav from "@/components/agency/AgencySideBar";
export default async function AgencyConsoleLayout({children,params,}: {
    children: React.ReactNode,
    params: Promise<{ slug: string }>
}){
    const { slug } = await params;
    const agency: Agency  = await getAgencyBySlug(slug);
    if (!agency) notFound();
    const theme = agency.theme
    const styleVars = themeToStyleVars(theme as ThemeJson)
    // @ts-ignore
    const heading= theme.fonts?.heading || { family: "Bodoni Moda", weights: [400,700], ital: true };
    // @ts-ignore
    const body= theme.fonts?.body || { family: "Open Sans", weights: [400,500], ital: false };
    const dashLinks: NavBarLink[] = [
        {
            title:"Dashboard",
            url:""
        },

        {
            title: "Theme",
            url: "/theme",
        },
        {
            title:"Members",
            url: "/members"
        }
    ]
    const basePath = `/agency/${slug}/console`
    return (
        <AgencyProvider value={agency}>
            <div className="w-screen h-screen flex" style={{
                ...styleVars,
                ["--font-heading" as any]: `"${heading.family}", serif`,
                ["--font-body" as any]: `"${body.family}", sans-serif`,
            }}>
                <div className="w-1/4 bg-brand-bg shadow">
                    <AgencySideBarNav basePath={basePath} links={dashLinks}/>
                </div>


                <div className="w-3/4 scroll-auto p-2">{children}</div>
            </div>
        </AgencyProvider>

    )
}