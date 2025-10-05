import {getAgencyBySlug} from "@/repo/agency";
import {ThemeJson, themeToStyleVars, buildGoogleFontsHref} from "@/lib/themeUtils";

export default async function Head({ params }: { params: { slug: string } }) {
    const agency = await getAgencyBySlug(params.slug);
    if (!agency) return null;

    const theme = agency.theme as ThemeJson;
    const heading = theme.fonts?.heading ?? { family: "Bodoni Moda", weights: [400, 700], ital: true };
    const body    = theme.fonts?.body    ?? { family: "Nunito Sans", weights: [400, 500], ital: false };

    const href = buildGoogleFontsHref([heading, body]);

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={href} />
    </>
);
}