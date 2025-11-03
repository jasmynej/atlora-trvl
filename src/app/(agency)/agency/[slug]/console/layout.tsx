"use client";
import { AgencyProvider } from "@/providers/AgencyProvider";
import { NavMenu } from "@/lib/miscTypes";
import { useParams } from "next/navigation";
import SideBarNav from "@/components/layout/SideBarNav";
import AdminTopNav from "@/components/layout/AdminTopNav";
import { useAuthContext } from "@/providers/AuthProvider";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
    const { slug } = useParams() as { slug: string };
    const { user } = useAuthContext();

    const agencyConsoleNavMenu: NavMenu = [
        { label: "Dashboard", href: `/agency/${slug}/console` },
        {
            label: "Site",
            href: `/agency/${slug}/console/site`,
            subLinks: [{ label: "Theme", href: `/agency/${slug}/console/site/theme` }],
        },
        { label: "Team", href: `/agency/${slug}/console/team` },
        { label: "Customers", href: `/agency/${slug}/console/customers` },
        { label: "Trips", href: `/agency/${slug}/console/trips` },
    ];

    return (
        <AgencyProvider slug={slug}>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
                    <div className="h-full overflow-y-auto">
                        <SideBarNav links={agencyConsoleNavMenu} />
                    </div>
                </aside>

                {/* Main content area */}
                <div className="flex-1 flex flex-col">
                    {/* Fixed Top Nav */}
                    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                        <AdminTopNav />
                    </header>

                    {/* Scrollable content */}
                    <main className="flex-1 overflow-y-auto p-6 bg-brand-bg">
                        {children}
                    </main>
                </div>
            </div>
        </AgencyProvider>
    );
}