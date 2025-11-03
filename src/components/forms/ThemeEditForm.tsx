"use client";

import {useParams} from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
    UpdateAgencyDocument,
    UpdateAgencyMutation,
} from "@/graphql/generated/graphql";
import Button from "@/components/base/Button";
import MediaPicker from "@/components/forms/MediaPicker";
import FormColorInput from "@/components/forms/FormColorInput";
import FormSelect from "@/components/forms/FormSelect";
import { GOOGLE_FONT_OPTIONS, generateHoverColor, Theme } from "@/lib/theme";

type ThemeEditFormValues = {
    "color-brand-primary": string;
    "color-brand-accent-1": string;
    "color-brand-accent-2": string;
    "color-brand-accent-3": string;
    "color-brand-bg": string;
    "color-brand-text": string;
    "font-heading": string;
    "font-body": string;
    "logo": string | null;
};

type Props = {
    agencyId: string;
    logo?: string | null;
    initialTheme?: Theme; // parsed JSON theme
};

export default function ThemeEditForm({ agencyId, initialTheme, logo }: Props) {
    const { slug } = useParams() as { slug: string };
    const methods = useForm<ThemeEditFormValues>({
        defaultValues: {
            "color-brand-primary": initialTheme?.colors?.["color-brand-primary"] ?? "#0091AB",
            "color-brand-accent-1": initialTheme?.colors?.["color-brand-accent-1"] ?? "#F7AAC1",
            "color-brand-accent-2": initialTheme?.colors?.["color-brand-accent-2"] ?? "#E7B06F",
            "color-brand-accent-3": initialTheme?.colors?.["color-brand-accent-3"] ?? "#B9B1C9",
            "color-brand-bg": initialTheme?.colors?.["color-brand-bg"] ?? "#FFFFFF",
            "color-brand-text": initialTheme?.colors?.["color-brand-text"] ?? "#343432",
            "font-heading": initialTheme?.fonts?.["font-heading"]?.family ?? "Bodoni Moda",
            "font-body": initialTheme?.fonts?.["font-body"]?.family ?? "Nunito Sans",
            "logo": logo ?? ""
        },
    });

    const { handleSubmit, register, control } = methods;
    const [updateAgency, { loading }] = useMutation<UpdateAgencyMutation>(
        UpdateAgencyDocument
    );

    const onSubmit = async (formData: ThemeEditFormValues) => {
        try {
            const updatedTheme = {
                colors: {
                    "color-brand-primary": formData["color-brand-primary"],
                    "color-brand-primary-hover": generateHoverColor(formData["color-brand-primary"]),

                    "color-brand-accent-1": formData["color-brand-accent-1"],
                    "color-brand-accent-1-hover": generateHoverColor(formData["color-brand-accent-1"]),

                    "color-brand-accent-2": formData["color-brand-accent-2"],
                    "color-brand-accent-2-hover": generateHoverColor(formData["color-brand-accent-2"]),

                    "color-brand-accent-3": formData["color-brand-accent-3"],
                    "color-brand-accent-3-hover": generateHoverColor(formData["color-brand-accent-3"]),
                    "color-brand-bg": formData["color-brand-bg"] ?? "#FFFFFF",
                    "color-brand-text": formData["color-brand-text"] ?? "#343432",
                },
                fonts: {
                    "font-heading": {family: formData["font-heading"], ital: true, weights: [400, 500, 600]},
                    "font-body": {family: formData["font-body"], ital: false, weights: [300, 400, 500]},
                },

            };
            await updateAgency({
                variables: {
                    id: agencyId,
                    data: { theme: updatedTheme, logo: formData["logo"] },
                },
            });
            alert("Theme updated successfully!");
        } catch (err: any) {
            console.error("Error updating theme:", err);
            alert("Failed to update theme.");
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-2xl flex flex-col gap-6 bg-white p-6 rounded-lg border border-brand-accent-1 shadow-md"
            >
                <h2 className="text-2xl font-semibold text-brand-text">Edit Agency Theme</h2>

                {/* 🎨 Color Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <FormColorInput
                        name="color-brand-primary"
                        label="Primary Color"
                        required
                    />

                    <FormColorInput
                        name="color-brand-accent-1"
                        label="Accent 1"
                    />

                    <FormColorInput
                        name="color-brand-accent-2"
                        label="Accent 2"
                        required
                    />
                    <FormColorInput
                        name="color-brand-accent-3"
                        label="Accent 3"
                        required
                    />
                    <FormColorInput
                        name="color-brand-bg"
                        label="Background"
                        required
                    />
                    <FormColorInput
                        name="color-brand-text"
                        label="Body Text"
                        required
                    />
                </div>

                {/* 🅰 Font Selects */}
                <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                        name="font-heading"
                        label="Heading Font"
                        options={GOOGLE_FONT_OPTIONS}
                        required
                    />
                    <FormSelect
                        name="font-body"
                        label="Body Font"
                        options={GOOGLE_FONT_OPTIONS}
                        required
                    />
                </div>
                {/* Agency Logo Upload */}
                <div className="col-span-full mt-6">
                    <h3 className="text-lg font-semibold mb-2">Logo</h3>
                    <img src={logo ?? ""} alt="Agency Logo" className="w-24 h-24 mb-4" />
                    <Controller
                        control={control}
                        name="logo"
                        render={({ field }) => (
                            <MediaPicker
                                value={field.value ?? ""}
                                onChangeAction={field.onChange}
                                agency={slug}  // or "global" if you want shared logos
                            />
                        )}
                    />
                </div>
                <div className="flex justify-end">
                    <Button color="primary" size="md" type="submit">
                        {loading ? "Saving..." : "Save Theme"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

