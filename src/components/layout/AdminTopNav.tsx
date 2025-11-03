import {useAuthContext} from "@/providers/AuthProvider";
import {useAgency} from "@/providers/AgencyProvider";
import {Bell, Settings} from "lucide-react";
import Link from "next/link";
import Button from "@/components/base/Button";

export default function AdminTopNav() {
    const {user, logout} = useAuthContext();
    const {agency} = useAgency();
    const atlora_logo = "/AL-Logo_Pic.png";
    return (

        <div className="flex w-full border-b border-brand-accent-2 justify-between p-5">
            <div className="flex items-center gap-5">
                <img src={agency?.logo ?? atlora_logo} className="w-15 h-15 p-2"/>
                <h2 className="text-2xl">{agency?.name}</h2>

            </div>
            <div className="flex items-center gap-5">
                <img src={user?.image ?? atlora_logo} className="w-15 h-15 rounded-full bg-brand-accent-2 p-2" />
                <p>{user?.name}</p>
                <Bell className="w-5 h-5"/>
                <Link href="/settings">
                    <Settings className="w-5 h-5"/>
                </Link>
                <Button onClick={logout} color="accent_1" size="sm">Logout</Button>
            </div>


        </div>
    )
}