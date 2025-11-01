type NavLink = {
    label: string;
    href: string;
    icon?: string;
    subLinks?: NavLink[];
}

type NavMenu = NavLink[];

export type {NavLink, NavMenu}