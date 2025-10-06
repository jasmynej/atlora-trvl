'use client'
import { useAgency } from "@/app/(agency)/agency/[slug]/AgencyProvider";
export default function AgencyConsoleHome(){
    const agency = useAgency()
    return (
        <div>
            <p>{agency.name}</p>
        </div>
    )
}