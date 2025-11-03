"use client";
import { useFormContext } from "react-hook-form";

type FormColorInputProps = {
    name: string;
    label?: string;
    required?: boolean;
    className?: string;
};

export default function FormColorInput({
                                           name,
                                           label,
                                           required,
                                           className = "",
                                       }: FormColorInputProps) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    const value = watch(name);
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-gray-700 flex justify-between items-center"
                >
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>

                    {/* Color preview circle */}
                    <span
                        className="inline-block w-5 h-5 rounded border border-gray-300 shadow-sm"
                        style={{ backgroundColor: value || "transparent" }}
                    />
                </label>
            )}

            <input
                type="color"
                id={name}
                {...register(name, { required })}
                className="h-10 w-20 cursor-pointer rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}