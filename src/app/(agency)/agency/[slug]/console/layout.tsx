"use client"
import { AgencyProvider } from "@/providers/AgencyProvider";
import {NavMenu} from "@/lib/miscTypes";
import { useParams } from "next/navigation";
import SideBarNav from "@/components/layout/SideBarNav";


export default function AgencyLayout({ children }: { children: React.ReactNode }) {
    const { slug } = useParams() as { slug: string };

    const agencyConsoleNavMenu: NavMenu = [
        {label: "Dashboard", href: `/agency/${slug}/console`},
        {label: "Trips", href: `/agency/${slug}/console/trips`},
        {label: "Customers", href: `/agency/${slug}/console/customers`},
        {label: "Team", href: `/agency/${slug}/console/team`},
        {label: "Site", href: `/agency/${slug}/console/site`},
    ]
    return (
        <AgencyProvider slug={slug}>
            <div className="flex min-h-screen">
                <SideBarNav links={agencyConsoleNavMenu}/>
                {/* you can add a sidebar here if needed */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </AgencyProvider>
    );
}