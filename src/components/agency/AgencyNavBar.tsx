import {NavBarLink} from "@/schemas";
import {publicUrl} from "@/lib/media";
import React from "react";
interface NavBarProps {
    logo: string
    links: NavBarLink[]
    buttons: NavBarLink[]
    title: string
}

export default function AgencyNavBar({logo, links, buttons, title}: NavBarProps){
    return (
        <header className="bg-brand-bg w-screen px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
                <div className=" w-24 bg-cover bg-center h-24"
                     style={{ backgroundImage: `url(${publicUrl(logo || "")})` }}>
                </div>
                <h1 className="text-4xl text-brand-primary font-bold uppercase">{title}</h1>
            </div>

            <div className="flex gap-3">
                {links.map((link)=> {
                    return (
                        <div key={link.title} className="text-lg uppercase">
                            {link.title}
                        </div>
                    )
                })}
            </div>
            <div className="gap-5 flex">
                {
                    buttons.map((button)=> (
                        <button key={button.url} className="p-2 rounded-full uppercase text-md transition ease-in-out duration-200 font-semibold bg-brand-accent-1 hover:bg-brand-accent-1-hover" id={button.class}>{button.title}</button>

                    ))
                }
            </div>
        </header>
    )
}
