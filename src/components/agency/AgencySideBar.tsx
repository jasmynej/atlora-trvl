"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkItem = { title: string; url: string };

export default function SidebarNav({
                                       basePath,
                                       links,
                                   }: {
    basePath: string;
    links: LinkItem[];
}) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col items-end w-full">
            {links.map((l) => {
                const href = `${basePath}${l.url}`; // e.g. /agency/slug/console/theme
                const isActive =
                    pathname === href || pathname.startsWith(href + "/");

                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={`block w-full text-right p-4 transition-colors drop-shadow-xl ${
                            isActive
                                ? "bg-brand-accent-1 font-medium drop-shadow-xl"
                                : "hover:bg-brand-accent-1"
                        }`}
                    >
                        {l.title}
                    </Link>
                );
            })}
        </nav>
    );
}