'use client'
import React, { useEffect, useMemo, useRef, useState } from "react";

type EmojiPickerProps = {
    value?: string | null;
    onChangeAction: (val: string | null) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    suggestions?: string[];
};

const DEFAULT_SUGGESTIONS = [
    "🌍","🌎","🌏","🗺️","✈️","🧳","🏝️","🏔️","🏙️","🏖️",
    "🌅","🌄","🌃","🌌","🕌","⛩️","🛕","🏯","🗽","🗼",
    "🐘","🦁","🦒","🐪","🐳","🐬","🦩","🌺","🌿","🍹"
];

export default function EmojiPicker({
                                        value,
                                        onChangeAction,
                                        label = "Emoji",
                                        placeholder = "Pick or paste an emoji…",
                                        className,
                                        disabled,
                                        suggestions,
                                    }: EmojiPickerProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const options = useMemo(
        () => (suggestions?.length ? suggestions : DEFAULT_SUGGESTIONS),
        [suggestions]
    );

    // Close on outside click
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!open) return;
            const target = e.target as Node;
            if (containerRef.current && !containerRef.current.contains(target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [open]);

    return (
        <div ref={containerRef} className={className} style={{ position: "relative" }}>
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border rounded px-2 py-1 w-full">
                    <span className="text-xl">{value || "—"}</span>
                    <input
                        type="text"
                        className="flex-1 outline-none"
                        placeholder={placeholder}
                        value={value ?? ""}
                        onChange={(e) => onChangeAction(e.target.value || null)}
                        disabled={disabled}
                    />
                    {value && (
                        <button
                            type="button"
                            className="text-sm px-2 py-1 rounded hover:bg-black/5"
                            onClick={() => onChangeAction(null)}
                            disabled={disabled}
                            aria-label="Clear emoji"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="px-2 py-1 rounded border hover:bg-black/5"
                    disabled={disabled}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                >
                    Browse
                </button>
            </div>

            {open && (
                <div
                    role="dialog"
                    aria-label="Emoji picker"
                    className="absolute z-50 mt-2 w-64 rounded-xl border bg-white shadow-xl p-2"
                >
                    <div className="grid grid-cols-8 gap-1 max-h-56 overflow-y-auto p-1">
                        {options.map((em, i) => (
                            <button
                                type="button"
                                key={`${em}-${i}`}
                                className="text-xl rounded hover:bg-black/5 p-1"
                                // use mousedown so selection applies even if popover closes immediately
                                onMouseDown={(e) => {
                                    e.preventDefault(); // prevent input blur stealing focus
                                    onChangeAction(em);
                                    setOpen(false);
                                }}
                            >
                                {em}
                            </button>
                        ))}
                    </div>
                    <div className="text-[11px] text-gray-500 px-1 pt-2">
                        Tip: you can also paste any emoji into the input.
                    </div>
                </div>
            )}
        </div>
    );
}