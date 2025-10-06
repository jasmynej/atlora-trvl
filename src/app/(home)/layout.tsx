import NavBar from "@/components/base/NavBar";
import {NavBarLink} from "@/schemas";
import React from "react";

const links: NavBarLink[] = [
    {
        title: 'About',
        url: '/about'
    }
]

const buttons: NavBarLink[] = [
    {
        title: 'Join Us',
        url: '/sign-up',
        class: 'join'
    },
    {
        title: 'Log In',
        url: '/login',
        class: 'login'
    }
]
export default function AltoraLandingLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="altora-pages">
            <NavBar logo="/AL-Logo_Pic.png" links={links} title="AltoraTrvl" buttons={buttons}/>
            {children}
        </div>
    );
}