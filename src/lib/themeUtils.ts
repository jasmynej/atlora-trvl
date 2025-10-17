export type ThemeJson = {
    colors?: Record<string, string>; // e.g. "brand-primary": "#b09578"
    fonts?: {
        heading?: { family: string; fallback?: string };
        body?: { family: string; fallback?: string };
    };
};

export function themeToStyleVars(theme?: ThemeJson) {
    const style: Record<string, string> = {};

    // Colors → --color-*
    const c = theme?.colors ?? {};
    for (const [token, value] of Object.entries(c)) {
        style[`--color-${token}`] = value;
    }

    // Fonts → --font-heading / --font-body
    const heading = theme?.fonts?.heading;
    const body = theme?.fonts?.body;

    if (heading?.family) {
        style["--font-heading"] = `"${heading.family}"${heading.fallback ? `, ${heading.fallback}` : ""}`;
    }
    if (body?.family) {
        style["--font-body"] = `"${body.family}"${body.fallback ? `, ${body.fallback}` : ""}`;
    }

    return style;
}

function encodeFamily(family: string) {
    // "Nunito Sans" -> "Nunito+Sans"
    return family.trim().replace(/\s+/g, "+");
}

function familySpec({
                        family,
                        weights,
                        ital,
                    }: {
    family: string;
    weights: number[];
    ital: boolean;
}) {
    // Examples:
    //  - no ital: "wght@400;500;700"
    //  - ital:    "ital,wght@0,400;0,700;1,400;1,700"
    const unique = Array.from(new Set(weights)).sort((a, b) => a - b);

    if (!ital) {
        const w = unique.join(";");
        return `family=${encodeFamily(family)}:wght@${w}`;
    }

    const combos = [
        ...unique.map((w) => `0,${w}`), // normal
        ...unique.map((w) => `1,${w}`), // italic
    ].join(";");
    return `family=${encodeFamily(family)}:ital,wght@${combos}`;
}

export function buildGoogleFontsHref(fonts: Array<{ family: string; weights?: number[]; ital?: boolean }>) {
    const specs = fonts
        .filter((f) => f.family)
        .map((f) =>
            familySpec({
                family: f.family,
                weights: f.weights?.length ? f.weights : [400],
                ital: !!f.ital,
            })
        )
        .join("&");

    console.log(specs)

    // Add display=swap for better UX; you can add &subset=latin-ext if needed
    return `https://fonts.googleapis.com/css2?${specs}&display=swap`;
}