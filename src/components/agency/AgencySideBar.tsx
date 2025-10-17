"use client";

import { usePathname } from "next/navigation";
import SidebarNav from "@/components/base/SideBarNav";
import NavBarLink from "@/schemas";

export default function AgencySidebarNav({
                                       basePath,
                                       links,
                                   }: {
    basePath: string;
    links: NavBarLink[];
}) {

    return (
        <SidebarNav basePath={basePath} links={links}></SidebarNav>
    );
}