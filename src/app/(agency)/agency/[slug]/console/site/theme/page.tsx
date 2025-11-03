"use client"
import ThemeEditForm from "@/components/forms/ThemeEditForm";
import {useAgency} from "@/providers/AgencyProvider";
export default function AgencyTheme() {
    const {agency} = useAgency();
    if (!agency) return <div>Agency not found</div>;
    return (
        <div>
            <ThemeEditForm
                agencyId={agency.id}
                initialTheme={agency.theme}
                logo={agency.logo}/>

        </div>
    )
}