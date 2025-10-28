type ButtonColor = "primary" | "accent_1" | "accent_2" | "accent_3";

type ButtonProps = {
    color: ButtonColor;
    children: React.ReactNode;
};

export default function Button({ color, children }: ButtonProps) {
    const variants: Record<ButtonColor, string> = {
        primary: "bg-brand-primary hover:bg-brand-primary-hover",
        accent_1: "bg-brand-accent-1 hover:bg-brand-accent-1-hover",
        accent_2: "bg-brand-accent-2 hover:bg-brand-accent-2-hover",
        accent_3: "bg-brand-accent-3 hover:bg-brand-accent-3-hover",
    };

    return (
        <button className={`px-4 py-2 rounded-xl shadow-sm text-white transition-colors ${variants[color]}`}>
            {children}
        </button>
    );
}