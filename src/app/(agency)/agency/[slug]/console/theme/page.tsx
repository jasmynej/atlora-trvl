'use client'
import { saveThemeAction } from "./actions";
import {useAgency} from "@/app/(agency)/agency/[slug]/AgencyProvider";
import {Agency} from "@prisma/client";
import {ThemeJson} from "@/lib/themeUtils";

export default function AgencyTheme(){
    const agency: Agency = useAgency()
    const theme: ThemeJson = agency.theme as ThemeJson
    const colors = theme?.colors ?? {};
    const fonts = theme.fonts ?? {};

    async function onAction(formData: FormData) {
        await saveThemeAction(agency.slug, formData);
    }
    const colorFields = [
        {
            title:"Primary",
            key:"brand-primary"
        },
        {
            title:"Primary Hover",
            key:"brand-primary-hover"
        },
        {
            title:"Background",
            key:"brand-bg"
        },
        {
            title:"Text",
            key:"brand-text"
        },
        {
            title:"Accent 1",
            key:"brand-accent-1"
        },
        {
            title:"Accent 1 Hover",
            key:"brand-accent-1-hover"
        },
        {
            title:"Accent 2",
            key:"brand-accent-2"
        },
        {
            title:"Accent 2 Hover",
            key:"brand-accent-2-hover"
        },
        {
            title:"Accent 3",
            key:"brand-accent-3"
        },
        {
            title:"Accent 3 Hover",
            key:"brand-accent-3-hover"
        }
    ]
    return (
        <div>
            <p>Change your theme</p>
            <form action={onAction} className="max-w-xl space-y-6 p-6 bg-brand-bg rounded-lg">
                <h1 className="font-heading text-2xl mb-2">Theme</h1>

                {/* Colors */}
                <fieldset className="grid grid-flow-col grid-rows-4 gap-4">
                    {colorFields.map((field)=> (
                        <label className="block" key={field.key}>
                            <span className="block text-sm mb-1">{field.title}</span>
                            <input name={field.key} key={field.key} type="color" defaultValue={colors[field.key] ?? "#0091AB"} className="h-10 w-16 p-0 border-white-2" />
                        </label>
                    ))}
                   
                </fieldset>

                {/* Fonts */}
                <fieldset className="space-y-3">
                    <label className="block">
                        <span className="block text-sm mb-1">Heading Font (Google)</span>
                        <select name="heading-family" defaultValue={fonts.heading?.family ?? "Playfair Display"} className="border p-2 rounded w-full">
                            <option>Playfair Display</option>
                            <option>Bodoni Moda</option>
                            <option>Libra Bodoni</option>
                            <option>DM Serif Display</option>
                            <option>Cormorant Garamond</option>
                            <option>Montserrat</option>
                            <option>Nunito Sans</option>
                            <option>Inter</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="block text-sm mb-1">Body Font (Google)</span>
                        <select name="body-family" defaultValue={fonts.body?.family ?? "Nunito Sans"} className="border p-2 rounded w-full">
                            <option>Nunito Sans</option>
                            <option>Inter</option>
                            <option>Work Sans</option>
                            <option>Plus Jakarta Sans</option>
                            <option>Mulish</option>
                            <option>Montserrat</option>
                        </select>
                    </label>
                </fieldset>

                <button type="submit" className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-primary-hover text-brand-bg">
                    Save
                </button>
            </form>
        </div>
    )
}