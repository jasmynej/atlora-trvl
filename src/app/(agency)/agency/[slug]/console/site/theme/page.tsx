"use client"
import ThemeEditForm from "@/components/forms/ThemeEditForm";
import {useAgency} from "@/providers/AgencyProvider";
import Button from "@/components/base/Button";
export default function AgencyTheme() {
    const {agency} = useAgency();
    if (!agency) return <div>Agency not found</div>;
    return (
        <div className="flex">
            <div className="w-2/4">
                <ThemeEditForm
                    agencyId={agency.id}
                    initialTheme={agency.theme}
                    logo={agency.logo}
                />
            </div>
           <div className="w-2/4 p-2">
               <h3 className="text-2xl font-semibold">Sample UI Theme Components</h3>
               <div className="flex gap-5 p-2">
                   <Button color="primary" size="lg">Primary</Button>
                   <Button color="accent_1" size="lg">Accent 1</Button>
                   <Button color="accent_2" size="lg">Accent 2</Button>
                   <Button color="accent_3" size="lg">Accent 3</Button>

               </div>
               <div className="p-2">
                   <h1 className="text-3xl font-extrabold">Hero Heading</h1>
                   <p className="text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
               </div>

           </div>

        </div>
    )
}