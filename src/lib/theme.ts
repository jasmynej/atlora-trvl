import Color from "color";

export type FontConfig = {
    family: string;
    weights?: number[];
    ital?: boolean;
};

export type Theme = {
    colors: Record<string, string>;
    fonts: Record<string, FontConfig>;
};

const loadedFonts = new Set<string>(); // prevent duplicate loads

export function loadAgencyFonts(
    fonts: Record<string, FontConfig>,
    slug: string
) {
    const fontFamilies: string[] = [];

    Object.entries(fonts).forEach(([key, font]) => {
        if (font.family) {
            // Construct Google Fonts URL-safe string
            const base = font.family.replace(/ /g, "+");
            const weights = font.weights?.join(";") || "400";
            const ital = font.ital ? "ital,wght@0,400;1,400" : `wght@${weights}`;
            fontFamilies.push(`family=${base}:${ital}`);
        }
    });

    if (fontFamilies.length === 0) return;

    const fontUrl = `https://fonts.googleapis.com/css2?${fontFamilies.join("&")}&display=swap`;

    // ✅ Prevent reloading if same agency fonts are already loaded
    if (loadedFonts.has(fontUrl)) return;
    loadedFonts.add(fontUrl);

    // 1️⃣ Preload for early fetch
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "style";
    preloadLink.href = fontUrl;
    preloadLink.setAttribute("data-font-preload", slug);
    document.head.appendChild(preloadLink);

    // 2️⃣ Actually apply font stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    link.setAttribute("data-agency-fonts", slug);
    document.head.appendChild(link);
}

export function generateHoverColor(baseHex: string): string {
    try {
        const c = Color(baseHex);
        const lightness = c.hsl().lightness();

        // Adjust strategy based on brightness
        if (lightness > 50) {
            return c.darken(0.1).hex(); // darken for light colors
        } else {
            return c.lighten(0.1).hex(); // lighten for dark colors
        }
    } catch {
        return baseHex; // fallback if invalid hex
    }
}

export const GOOGLE_FONT_OPTIONS = [
    // --- Sans Serif ---
    { value: "Mulish", label: "Mulish" },
    { value: "Nunito Sans", label: "Nunito Sans" },
    { value: "Poppins", label: "Poppins" },
    { value: "Inter", label: "Inter" },
    { value: "Rubik", label: "Rubik" },
    { value: "Work Sans", label: "Work Sans" },
    { value: "Manrope", label: "Manrope" },
    { value: "Quicksand", label: "Quicksand" },
    { value: "Source Sans 3", label: "Source Sans 3" },

    // --- Serif ---
    { value: "Lora", label: "Lora" },
    { value: "Merriweather", label: "Merriweather" },
    { value: "Cormorant Garamond", label: "Cormorant Garamond" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Libre Baskerville", label: "Libre Baskerville" },
    { value: "Bodoni Moda", label: "Bodoni Moda" },
    { value: "Crimson Text", label: "Crimson Text" },
    { value: "DM Serif Display", label: "DM Serif Display" },

    // --- Display / Artistic ---
    { value: "Abril Fatface", label: "Abril Fatface" },
    { value: "Cinzel", label: "Cinzel" },
    { value: "Josefin Sans", label: "Josefin Sans" },
    { value: "Playfair Display SC", label: "Playfair Display SC" },
    { value: "Bebas Neue", label: "Bebas Neue" },
    { value: "Prata", label: "Prata" },
    { value: "Great Vibes", label: "Great Vibes" },
    { value: "Caveat", label: "Caveat" },
    { value: "Dancing Script", label: "Dancing Script" },
    { value: "Pacifico", label: "Pacifico" },
];