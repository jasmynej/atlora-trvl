"use client"

import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavLink } from "@/lib/miscTypes";

export default function SideBarNav({ links }: { links: NavLink[] }) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (href: string) => {
        setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
    };

    const isActive = (href: string, subLinks?: NavLink[]) => {
        if (pathname === href) return true;
        if (subLinks?.some((sub) => pathname.startsWith(sub.href))) return true;
        return false;
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen py-6 px-3">
            <nav className="space-y-2">
                {links.map((link) => {
                    const active = isActive(link.href, link.subLinks);
                    const isOpen = openMenus[link.href] || active;
                    const hasSubLinks = !!link.subLinks?.length;

                    const baseClasses =
                        "flex items-center justify-between w-full px-3 py-2 rounded-md transition cursor-pointer";
                    const activeClasses = active
                        ? "bg-brand-primary text-white"
                        : "text-gray-700 hover:bg-gray-100";

                    return (
                        <div key={link.href}>
                            {hasSubLinks ? (
                                // 🔽 Parent with dropdown
                                <button
                                    onClick={() => toggleMenu(link.href)}
                                    className={`${baseClasses} ${activeClasses}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {link.icon && (
                                            <span className="text-gray-500">{link.icon}</span>
                                        )}
                                        <span className="font-medium">{link.label}</span>
                                    </div>
                                    <span className="text-gray-500">
                    {isOpen ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                  </span>
                                </button>
                            ) : (
                                // 🔗 Regular link — full box clickable
                                <Link
                                    href={link.href}
                                    className={`${baseClasses} ${activeClasses} block`}
                                >
                                    <div className="flex items-center gap-2">
                                        {link.icon && (
                                            <span className="text-gray-500">{link.icon}</span>
                                        )}
                                        <span className="font-medium">{link.label}</span>
                                    </div>
                                </Link>
                            )}

                            {/* 🔽 Sub-links */}
                            {hasSubLinks && isOpen && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {link.subLinks!.map((sub) => {
                                        const subActive = pathname.startsWith(sub.href);
                                        return (
                                            <Link
                                                key={sub.href}
                                                href={sub.href}
                                                className={`block px-3 py-1.5 rounded-md text-sm transition ${
                                                    subActive
                                                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                {sub.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}