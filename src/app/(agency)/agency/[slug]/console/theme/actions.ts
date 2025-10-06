"use server"
import { revalidatePath } from "next/cache";
import {ThemeUpdateSchema} from "@/schemas";
import {updateAgencyThemeBySlug} from "@/repo/agency";

export async function saveThemeAction(slug: string, formData: FormData) {
    // await requireAgencyAdmin(slug); // ensure user belongs to this agency
    const colorsEntries = Array.from(formData.entries())
        .filter(([k]) => k.startsWith("brand-"))
        .map(([k, v]) => [k, String(v)] as const);

    const colors = Object.fromEntries(colorsEntries);

    const payload = {
        colors,
        fonts: {
            heading: {
                family: formData.get("heading-family") as string | null ?? undefined,
            },
            body: {
                family: formData.get("body-family") as string | null ?? undefined,
            },
        },
    };

    console.log(payload)
    const parsed = ThemeUpdateSchema.safeParse(payload);
    if (!parsed.success) {
        throw new Error(parsed.error.issues.map(i => i.message).join(", "));
    }

    const updated = await updateAgencyThemeBySlug(slug, parsed.data);
    // Optional: revalidate the agency segment so the theme applies immediately
    // import { revalidatePath } from "next/cache";
    revalidatePath(`/agency/${slug}`);
    revalidatePath(`/agency/${slug}/console/theme`);

    return updated;
}