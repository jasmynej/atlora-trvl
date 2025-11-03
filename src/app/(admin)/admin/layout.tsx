"use client"
import React from "react";
import {NavMenu} from "@/lib/miscTypes";
import SideBarNav from "@/components/layout/SideBarNav";
import { useAuthContext } from "@/providers/AuthProvider";
import UnauthorizedPage from "@/components/base/UnauthorizedPage";
import AdminTopNav from "@/components/layout/AdminTopNav";
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
    const { isAuthenticated, loading, user } = useAuthContext();

    const isAdmin = user?.globalRole === "ATLORA_ADMIN";

    if (loading) return <p>Loading...</p>;
    console.log("AdminLayout user:", user);
    if (!isAuthenticated || !isAdmin) {
        return <UnauthorizedPage />;
    }
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <SideBarNav links={adminNavMenu} />

            {/* Main Section */}
            <main className="flex-1 flex flex-col">
                {/* Fixed Top Nav */}
                <div className="flex-shrink-0">
                    <AdminTopNav />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-brand-bg">
                    {children}
                </div>
            </main>
        </div>
    );
}