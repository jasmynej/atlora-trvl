"use client"
import React from "react";
type ModalProps = {
    onCloseAction: () => void,
    children: React.ReactNode,
    title: string
}

export default function Modal({ onCloseAction, children, title }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
            {/* modal wrapper */}
            <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-xl flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between px-4 py-2 bg-brand-accent-3/50 border-b border-black/10">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onCloseAction}
                        className="px-2 py-1 rounded hover:bg-black/5 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* scrollable body */}
                <div className="p-4 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}