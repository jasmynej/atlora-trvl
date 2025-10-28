import React from "react";
import {NavMenu} from "@/lib/miscTypes";
import SideBarNav from "@/components/layout/SideBarNav";

const adminNavMenu: NavMenu = [
    {label: "Dashboard", href: "/admin"},
    {label: "UI Components", href: "/admin/ui"},
    {
        label: "Catalog",
        href:"/admin/catalog",
        subLinks: [
            {label: "Countries", href: "/admin/catalog/countries"},
            {label: "Regions", href: "/admin/catalog/regions"},
        ]
    }
];

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <SideBarNav links={adminNavMenu}/>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}