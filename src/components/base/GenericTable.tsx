'use client'
import React, { useState } from "react";
import { Eye, SquarePen } from "lucide-react";

export type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
};

type GenericTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    onEditAction?: (row: T) => void;
    onViewAction?: (row: T) => void;
};

export default function GenericTable<T extends { id: string }>({
                                                                   columns,
                                                                   data,
                                                                   onEditAction,
                                                                   onViewAction,
                                                               }: GenericTableProps<T>) {
    const [selected, setSelected] = useState<T | null>(null);

    function handleEdit(row: T) {
        setSelected(row);
        onEditAction?.(row);
    }

    return (
        <div className="w-full p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-y-auto max-h-[500px]">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-brand-accent-3 sticky top-0 z-10">
                    <tr className="border-b text-sm text-brand-bg uppercase tracking-wide">
                        {columns.map((col) => (
                            <th key={String(col.key)} className="p-3 font-semibold">
                                {col.label}
                            </th>
                        ))}
                        {(onEditAction || onViewAction) && <th className="p-3">Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className="even:bg-brand-accent-2/20 odd:bg-white hover:bg-gray-50 transition text-base"
                        >
                            {columns.map((col) => (
                                <td key={String(col.key)} className="p-3">
                                    {col.render
                                        ? col.render(row[col.key], row)
                                        : String(row[col.key] ?? "")}
                                </td>
                            ))}
                            {(onEditAction || onViewAction) && (
                                <td className="p-3 flex items-center gap-2">
                                    {onEditAction && (
                                        <button
                                            onClick={() => handleEdit(row)}
                                            className="bg-brand-primary hover:bg-brand-primary-hover p-2 text-brand-bg rounded"
                                        >
                                            <SquarePen size={16} />
                                        </button>
                                    )}
                                    {onViewAction && (
                                        <button
                                            onClick={() => onViewAction(row)}
                                            className="bg-brand-accent-1 hover:bg-brand-accent-1-hover p-2 text-brand-bg rounded"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}