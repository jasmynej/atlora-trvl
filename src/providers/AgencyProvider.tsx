"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import {loadAgencyFonts, FontConfig} from "@/lib/theme";
import {
    GetAgencyBySlugDocument,
    GetAgencyBySlugQuery,
} from "@/graphql/generated/graphql";

type AgencyContextType = {
    agency: GetAgencyBySlugQuery["agency"] | null;
    theme: Record<string, any> | null;
    loading: boolean;
    error?: any;
};

const AgencyContext = createContext<AgencyContextType>({
    agency: null,
    theme: null,
    loading: true,
});

export function AgencyProvider({
                                   slug,
                                   children,
                               }: {
    slug: string;
    children: React.ReactNode;
}) {
    const { data, loading, error } = useQuery<GetAgencyBySlugQuery>(
        GetAgencyBySlugDocument,
        {
            variables: { slug },
            skip: !slug,
            fetchPolicy: "cache-first",
        }
    );

    const agency = data?.agency ?? null;
    const rawTheme = agency?.theme;
    const theme =
        typeof rawTheme === "string" ? JSON.parse(rawTheme) : rawTheme ?? null;

    // Inject CSS variables for colors & fonts

    useEffect(() => {
        if (!theme) return;

        const root = document.documentElement;

        // 🎨 Inject colors
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value as string);
            });
        }

        // 🪄 Inject and preload fonts
        if (theme.fonts) {
            loadAgencyFonts(theme.fonts, slug);

            const fonts = theme.fonts as Record<string, FontConfig>;

            Object.entries(fonts).forEach(([key, font]) => {
                if (font.family) {
                    root.style.setProperty(
                        `--${key}`,
                        `'${font.family}', ${key.includes("heading") ? "serif" : "sans-serif"}`
                    );
                }
            });
        }

        document.body.setAttribute("data-agency-theme", slug);
    }, [theme, slug]);

    return (
        <AgencyContext.Provider value={{ agency, theme, loading, error }}>
            {children}
        </AgencyContext.Provider>
    );
}

export function useAgency() {
    return useContext(AgencyContext);
}