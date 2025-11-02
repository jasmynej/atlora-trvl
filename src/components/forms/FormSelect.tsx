import { useFormContext, FieldErrors, UseFormRegister } from "react-hook-form";

type Option = { value: string; label: string };

type FormSelectProps = {
    name: string;
    label?: string;
    options: Option[];
    required?: boolean;
    className?: string;
    // Optional for standalone usage
    register?: UseFormRegister<any>;
    errors?: FieldErrors<any>;
};

export default function FormSelect({
                                       name,
                                       label,
                                       options,
                                       required,
                                       className = "",
                                       register,
                                       errors,
                                   }: FormSelectProps) {
    const context = useFormContext();
    const formRegister = register ?? context?.register;
    const formErrors = errors ?? context?.formState?.errors ?? {};
    const error = formErrors[name]?.message as string | undefined;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                {...(formRegister ? formRegister(name, { required }) : {})}
                className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition
                    ${error ? "border-red-500" : "border-gray-300"}`}
            >
                <option value="">Select...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}