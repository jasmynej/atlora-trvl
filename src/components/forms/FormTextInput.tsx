type FormTextInputProps = {
    name: string;
    label?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    className?: string;
    register: any;
    errors?: Record<string, any>;
};

export default function FormTextInput({
                                          name,
                                          label,
                                          placeholder,
                                          type = "text",
                                          required,
                                          className = "",
                                          register,
                                          errors = {},
                                      }: FormTextInputProps) {
    const error = errors[name]?.message as string | undefined;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name, { required })}
                className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition
          ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}