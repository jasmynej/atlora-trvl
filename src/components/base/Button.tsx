import React, { useMemo } from "react";

// Define your button color keys
type ButtonColor = "primary" | "accent_1" | "accent_2" | "accent_3";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: ButtonColor;
    size?: ButtonSize;
};

// Helper to get CSS variable value
function getComputedColor(varName: string): string {
    if (typeof window === "undefined") return "#000000";
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName);
    return val.trim() || "#000000";
}

// Helper to calculate brightness
function isColorLight(hex: string): boolean {
    // Remove # and parse
    const c = hex.replace("#", "");
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    // Perceived brightness formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 170;
}

export default function Button({
                                   color = "primary",
                                   size = "sm",
                                   children,
                                   className = "",
                                   ...props
                               }: ButtonProps) {
    const colors: Record<ButtonColor, string> = {
        primary: "bg-brand-primary hover:bg-brand-primary-hover",
        accent_1: "bg-brand-accent-1 hover:bg-brand-accent-1-hover",
        accent_2: "bg-brand-accent-2 hover:bg-brand-accent-2-hover",
        accent_3: "bg-brand-accent-3 hover:bg-brand-accent-3-hover",
    };

    const sizes: Record<ButtonSize, string> = {
        xs: "px-2 py-[2px] text-xs rounded-sm",
        sm: "px-3 py-[5px] text-sm rounded",
        md: "px-3.5 py-[6px] text-sm rounded-md",
        lg: "px-4 py-[7px] text-base rounded-md",
        xl: "px-5 py-[8px] text-base rounded-lg",
        "2xl": "px-6 py-[10px] text-lg rounded-lg tracking-wide",
    };

    // Dynamically decide text color based on bg brightness
    const textColor = useMemo(() => {
        const varName = `--color-brand-${color.replace("_", "-")}`;
        const bg = getComputedColor(varName);
        return isColorLight(bg) ? "text-brand-text" : "text-white";
    }, [color]);

    return (
        <button
            className={`shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colors[color]} ${sizes[size]} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}