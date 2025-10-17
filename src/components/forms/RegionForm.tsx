'use client'
import { useForm, Controller } from 'react-hook-form';
import { RegionType } from '@prisma/client';
import type { RegionBase } from '@/repo/dto';
import { useEffect } from 'react';
import MediaPicker from '@/components/forms/MediaPicker';
import EmojiPicker from "@/components/forms/EmojiPicker";
import RegionParentPicker from "@/components/forms/RegionParentPicker";

type FormProps = {
    initialValues?: Partial<RegionBase>;
    onSubmitAction: (data: RegionBase) => void | Promise<void>;
    submitLabel: string;
};

const REGION_TYPES: RegionType[] = [
    'CONTINENT',
    'SUBREGION',
    'MARKET_GROUP',
    'THEME',
];

export default function RegionForm({ initialValues, onSubmitAction, submitLabel }: FormProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegionBase>({
        defaultValues: {
            name: '',
            slug: '',
            type: 'THEME',
            summary: '',
            heroImg: null,
            ...(initialValues ?? {}),
        } as any, // DTO may differ slightly from Prisma type for nullables
    });

    // keep form in sync when modal opens with a different row
    useEffect(() => {
        if (initialValues) reset({ ...initialValues } as any);
    }, [initialValues, reset]);

    // tiny helper: if slug empty, generate from name on blur
    function maybeFillSlug(e: React.FocusEvent<HTMLInputElement>) {
        const name = e.currentTarget.value?.trim();
        if (!name) return;
        const currentSlug = (document.querySelector('input[name="slug"]') as HTMLInputElement)?.value;
        if (!currentSlug) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setValue('slug' as any, slug);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmitAction)} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex items-center gap-2">
                <label className="w-28 text-sm font-medium">Name</label>
                <input
                    {...register('name' as const, { required: 'Name is required' })}
                    onBlur={maybeFillSlug}
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

            {/* Type */}
            <div className="flex items-center gap-2">
                <label className="w-28 text-sm font-medium">Type</label>
                <select
                    {...register('type' as const, { required: true })}
                    className="border p-2 rounded w-full"
                >
                    {REGION_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
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
                <label className="text-sm font-medium">Hero Image</label>
                {
                    initialValues?.heroImg &&
                    <img src={initialValues.heroImg} className="w-45"/>
                }
                <Controller
                    control={control}
                    name={'heroImg' as any}
                    render={({ field }) => (
                        <MediaPicker
                            value={field.value as any}          // ← pass current value
                            onChangeAction={field.onChange}     // ← updates form with uploaded URL
                            agency="global"
                        />
                    )}
                />
            </div>
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
            <div className="flex flex-col gap-2">
                <Controller
                    control={control}
                    name={'parentId' as any}
                    render={({ field }) => (
                        <RegionParentPicker
                            value={field.value as string | null}
                            onChangeAction={field.onChange}
                            // If editing an existing region, pass excludeId to avoid self-parenting:
                            // excludeId={initialValues?.id}
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
    );
}