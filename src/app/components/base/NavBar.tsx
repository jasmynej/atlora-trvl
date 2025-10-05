import {NavBarLink} from "@/app/schemas";
import "../../styles/buttons.css";
interface NavBarProps {
    logo: string
    links: NavBarLink[]
    title: string
    buttons: NavBarLink[]
}

export default function NavBar({logo, links, title, buttons}: NavBarProps){
    return (
        <div className="w-screen px-4 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-1">
                <img src={logo} alt="page logo" className="w-24"/>
                <h3 className="text-2xl">{title}</h3>
            </div>
            <div>
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
                        <button key={button.url} className="p-2 rounded-full uppercase text-lg transition ease-in-out duration-200 font-semibold" id={button.class}>{button.title}</button>

                    ))
                }
            </div>
        </div>
    )
}