import React from "react";

type SectionProps = {
    variant?: "small" | "med" | "large" | "hero";
    children: React.ReactNode;
    bkColor?: string;        // Tailwind background color (e.g., "bg-brand-accent-1")
    bkImage?: string;        // Image path or URL
    overlay?: boolean;       // Optional dark overlay
    overlayColor?: string;   // Optional overlay color class, defaults to black/40
};

export default function Section({
                                    variant = "med",
                                    children,
                                    bkColor,
                                    bkImage,
                                    overlay = false,
                                    overlayColor = "bg-black/40",
                                }: SectionProps) {
    // Define sizing variants
    const variants: Record<NonNullable<SectionProps["variant"]>, string> = {
        small: "py-8 md:py-12",
        med: "py-16 md:py-24",
        large: "py-24 md:py-32",
        hero: "py-32 md:py-48 min-h-[80vh] flex items-center justify-center",
    };

    // Inline style for dynamic background image
    const backgroundStyle = bkImage
        ? {
            backgroundImage: `url(${bkImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }
        : undefined;

    return (
        <section
            className={`relative w-full overflow-hidden ${variants[variant]} ${
                bkColor || ""
            } ${bkImage ? "text-white" : ""}`}
            style={backgroundStyle}
        >
            {/* Overlay layer */}
            {bkImage && overlay && (
                <div className={`absolute inset-0 ${overlayColor} z-0`} />
            )}

            {/* Content container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}