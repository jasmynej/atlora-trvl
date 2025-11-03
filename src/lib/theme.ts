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
    { value: "Mulish", label: "Mulish" },
    { value: "Cormorant Garamond", label: "Cormorant Garamond" },
    { value: "Nunito Sans", label: "Nunito Sans" },
    { value: "Bodoni Moda", label: "Bodoni Moda" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Poppins", label: "Poppins" },
    { value: "Lora", label: "Lora" },
];