'use client'
import React, { useState } from "react";

export type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
};

type GenericTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    onEditAction?: (row: T) => void;
};

export default function GenericTable<T extends { id: string }>({
                                                                   columns,
                                                                   data,
                                                                   onEditAction,
                                                               }: GenericTableProps<T>) {
    const [selected, setSelected] = useState<T | null>(null);

    function handleEdit(row: T) {
        setSelected(row);
        onEditAction?.(row);
    }

    return (
        <div className="w-full p-4">
            <table className="w-full border-collapse text-left">
                <thead>
                <tr className="border-b text-lg">
                    {columns.map((col) => (
                        <th key={String(col.key)} className="p-2 font-semibold">
                            {col.label}
                        </th>
                    ))}
                    {onEditAction && <th className="p-2">Actions</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.id} className="even:bg-brand-accent-2/20 text-base">
                        {columns.map((col) => (
                            <td key={String(col.key)} className="p-2">
                                {col.render
                                    ? col.render(row[col.key], row)
                                    : String(row[col.key] ?? "")}
                            </td>
                        ))}
                        {onEditAction && (
                            <td className="p-2">
                                <button
                                    onClick={() => handleEdit(row)}
                                    className="bg-brand-primary hover:bg-brand-primary-hover p-2 text-brand-bg"
                                >
                                    Edit
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}