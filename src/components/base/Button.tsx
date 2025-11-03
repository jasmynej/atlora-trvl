"use client"
import React, { useEffect, useState } from "react";

type ButtonColor = "primary" | "accent_1" | "accent_2" | "accent_3";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export default function Button({
                                   color = "primary",
                                   size = "sm",
                                   children,
                                   className = "",
                                   ...props
                               }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: ButtonColor;
    size?: ButtonSize;
}) {
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

    // Default color for SSR (always consistent)
    const [textColor, setTextColor] = useState("text-white");

    useEffect(() => {
        const varName = `--color-brand-${color.replace("_", "-")}`;
        const val = getComputedStyle(document.documentElement).getPropertyValue(varName);
        if (val) {
            const hex = val.trim().replace("#", "");
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            setTextColor(brightness > 170 ? "text-brand-text" : "text-white");
        }
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