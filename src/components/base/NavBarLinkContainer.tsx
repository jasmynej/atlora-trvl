"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import NavBarLink from "@/schemas";

function joinHref(basePath: string, url: string) {
    const right = url.startsWith("/") ? url : `/${url}`;
    return `${basePath}${right}`;
}

export default function NavBarLinkContainer({
                                                link,
                                                basePath,
                                                isBranchActive,
                                                level = 0,
                                            }: {
    link: NavBarLink;
    basePath: string;
    /** true if this item or any of its children is active */
    isBranchActive: boolean;
    level?: number;
}) {
    const hasChildren = !!link.subLinks?.length;
    const [open, setOpen] = useState<boolean>(isBranchActive);
    const href = useMemo(() => joinHref(basePath, link.url), [basePath, link.url]);

    const base =
        "block w-full text-right p-3 transition-colors rounded";
    const active =
        "bg-[var(--color-brand-accent-1)] font-medium";
    const hover =
        "hover:bg-[var(--color-brand-accent-1)]";
    const text = "text-[var(--color-brand-text)]";

    // indent nested items subtly
    const padRight = level * 10; // px
    const style = { paddingRight: `${12 + padRight}px` };

    // optional icon (left of title)
    const Icon = link.icon ? (
        <span className="inline-block w-4 h-4 mr-2 align-middle" aria-hidden>
      {/* you can swap to an <img src={link.icon} /> or lucide icon here */}
            {link.icon}
    </span>
    ) : null;

    if (hasChildren) {
        return (
            <div className="w-full">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls={`nav-group-${href}`}
                    className={`${base} ${isBranchActive ? active : hover} ${text}`}
                    style={style}
                >
          <span className="inline-flex items-center gap-2 justify-end w-full">
            <span className="select-none">{link.title}</span>
            <span
                aria-hidden
                className={`transition-transform ${open ? "rotate-90" : ""}`}
            >
              ▸
            </span>
          </span>
                </button>

                {open && (
                    <ul id={`nav-group-${href}`} className="mt-1 flex flex-col">
                        {link.subLinks!.map((child) => (
                            <li key={`${child.title}-${child.url}`}>
                                {/* Child active is computed in SidebarNav and passed down */}
                                <NavBarLinkContainer
                                    link={child}
                                    basePath={basePath}
                                    isBranchActive={false}
                                    level={level + 1}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <Link
            href={href}
            aria-current={isBranchActive ? "page" : undefined}
            className={`${base} ${isBranchActive ? active : hover} ${text} ${link.class ?? ""}`}
            style={style}
        >
            {Icon}
            {link.title}
        </Link>
    );
}