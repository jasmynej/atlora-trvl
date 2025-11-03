"use client";

import { useAgency } from "@/providers/AgencyProvider";
export default function AgencyConsoleHome() {
    const { agency } = useAgency();
    if (!agency) return null;

    return (
        <div>
            <img src={agency.logo ?? ""} alt="agency logo" className="w-24"/>

            <h1>{agency.name}</h1>
        </div>
    )
}