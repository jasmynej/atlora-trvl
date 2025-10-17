'use client'
import { useForm, Controller } from 'react-hook-form';

import EmojiPicker from "@/components/forms/EmojiPicker";
import {Country} from "@prisma/client";

import {useEffect} from "react";
import RegionParentPicker from "@/components/forms/RegionParentPicker";


type FormProps = {
    initialValues?: Partial<Country>;
    onSubmitAction: (data: Country) => void | Promise<void>;
    submitLabel: string;
};

export default function CountryForm({ initialValues, onSubmitAction, submitLabel }: FormProps){
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Country>({
        defaultValues: {
            name: '',
            slug: '',
            summary: '',
            ...(initialValues ?? {}),
        } as any
    })

    useEffect(() => {
        if (initialValues) reset({ ...initialValues } as any);
    }, [initialValues, reset]);


    return (
        <form onSubmit={handleSubmit(onSubmitAction)} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex items-center gap-2">
                <label className="w-28 text-sm font-medium">Name</label>
                <input
                    {...register('name' as const, { required: 'Name is required' })}
                    className="border p-2 rounded w-full"
                />
            </div>
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

            {/* Slug */}
            <div className="flex items-center gap-2">
                <label className="w-28 text-sm font-medium">Slug</label>
                <input
                    {...register('slug' as const, { required: 'Slug is required' })}
                    className="border p-2 rounded w-full"
                />
            </div>
            {errors.slug && <p className="text-red-600 text-sm">{errors.slug.message}</p>}

            <div className="flex gap-2">
                <div>
                    <label>ISO2</label>
                    <input {...register('iso2')} className="border p-2 rounded w-full"/>
                </div>
                <div>
                    <label>ISO3</label>
                    <input {...register('iso3')} className="border p-2 rounded w-full"/>
                </div>
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Summary</label>
                <textarea
                    {...register('summary' as const)}
                    rows={4}
                    className="border p-2 rounded w-full"
                />
            </div>

            {/* Hero Image */}

            <div className="flex flex-col gap-2">
                <Controller
                    control={control}
                    name={'emoji' as any}
                    render={({ field }) => (
                        <EmojiPicker
                            value={field.value as string | null}
                            onChangeAction={field.onChange}
                        />
                    )}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-accent-2 hover:bg-brand-accent-2-hover p-2 rounded disabled:opacity-60"
            >
                {isSubmitting ? 'Saving…' : submitLabel}
            </button>
        </form>
    )
}