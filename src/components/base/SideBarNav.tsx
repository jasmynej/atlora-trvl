"use client";

import { usePathname } from "next/navigation";
import NavBarLinkContainer from "@/components/base/NavBarLinkContainer";
import NavBarLink from "@/schemas";

function normalizePath(p: string) {
    if (!p) return "/";
    return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

function joinHref(basePath: string, url: string) {
    const base = normalizePath(basePath);
    if (!url || url === "/") return base; // dashboard root
    const right = url.startsWith("/") ? url : `/${url}`;
    return normalizePath(base + right);
}

// exact for empty url (dashboard), prefix for others
function isActive(pathname: string, href: string, urlForRule: string) {
    const a = normalizePath(pathname);
    const b = normalizePath(href);
    if (!urlForRule || urlForRule === "/") {
        // Dashboard: ONLY exact
        return a === b;
    }
    // Sections: exact OR subpath (with boundary)
    return a === b || a.startsWith(b + "/");
}

function branchActive(pathname: string, basePath: string, node: NavBarLink): boolean {
    const href = joinHref(basePath, node.url);
    const self = isActive(pathname, href, node.url);
    const kids = (node.subLinks ?? []).some((c) => branchActive(pathname, basePath, c));
    return self || kids;
}


export default function SidebarNav({
                                       basePath,
                                       links,
                                   }: {
    basePath: string;
    links: NavBarLink[];
}) {
    const pathname = usePathname();
    console.log(pathname);

    return (
        <nav className="flex flex-col items-end w-full">
            {links.map((l) => {
                const isBranchActive = branchActive(pathname, basePath, l);
                return (
                    <NavBarLinkContainer
                        key={`${l.title}-${l.url}`}
                        link={l}
                        basePath={basePath}
                        isBranchActive={isBranchActive}
                    />
                );
            })}
        </nav>
    );
}