import React from "react";
import NavBarLink from "@/schemas";
import SidebarNav from "@/components/base/SideBarNav";
const dashLinks: NavBarLink[] = [
    {
        title:"Dashboard",
        url:""
    },

    {
        title: "Catalog",
        url: "/catalog",
        subLinks: [
            {
                title: "Regions",
                url: "/catalog/regions",
            },
            {
                title: "Countries",
                url: "/catalog/countries",
            },
            {
                title: "Destinations",
                url: "/catalog/destinations",
            }
        ]
    },
    {
        title:"Agencies",
        url: "/agencies"
    }
]
const basePath = '/admin'
export default function AtloraAdminLayout({children,}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <div className="h-screen w-screen flex">
            <div className="w-1/4 bg-brand-bg shadow">
                <SidebarNav basePath={basePath} links={dashLinks}/>
            </div>
            <div className="w-3/4 scroll-auto p-2">{children}</div>
        </div>
    )

}