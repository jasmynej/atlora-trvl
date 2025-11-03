import { useAuthContext } from "@/providers/AuthProvider";
import { useAgency } from "@/providers/AgencyProvider";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import Button from "@/components/base/Button";

export default function AdminTopNav() {
    const { user, logout } = useAuthContext();

    // Safely call useAgency() — catch the error if not within provider
    let agency: ReturnType<typeof useAgency>["agency"] | null = null;
    try {
        agency = useAgency()?.agency ?? null;
    } catch {
        agency = null; // Not inside an AgencyProvider
    }

    const atloraLogo = "/AL-Logo_Pic.png";
    const agencyName = agency?.name || "Atlora Travel";

    return (
        <div className="flex w-full border-b border-brand-accent-2 justify-between p-5 items-center bg-white sticky top-0 z-10">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <img
                    src={agency?.logo ?? atloraLogo}
                    alt={`${agencyName} Logo`}
                    className="w-12 h-12 object-contain"
                />
                <h2 className="text-xl font-semibold text-brand-text">{agencyName}</h2>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img
                        src={user?.image ?? atloraLogo}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full bg-brand-accent-2 object-cover"
                    />
                    <span className="text-sm font-medium text-brand-text">{user?.name}</span>
                </div>

                <Bell className="w-5 h-5 text-brand-text hover:text-brand-primary cursor-pointer transition" />
                <Link href="/settings" className="hover:text-brand-primary transition">
                    <Settings className="w-5 h-5 text-brand-text" />
                </Link>

                <Button onClick={logout} color="accent_1" size="sm">
                    Logout
                </Button>
            </div>
        </div>
    );
}