'use client'
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type ParentOption = { id: string; name: string };

type RegionParentPickerProps = {
    value?: string | null;               // parentId
    onChangeAction: (val: string | null) => void;
    label?: string;
    allowNone?: boolean;
    excludeId?: string;                  // exclude current region id when editing
    fetchUrl?: string;                   // defaults to /api/regions/parents
    disabled?: boolean;
    className?: string;
};

export default function RegionParentPicker({
                                               value,
                                               onChangeAction,
                                               label = "Parent Region",
                                               allowNone = true,
                                               excludeId,
                                               fetchUrl = "/api/regions",
                                               disabled,
                                               className,
                                           }: RegionParentPickerProps) {
    const [options, setOptions] = useState<ParentOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const { data } = await axios.get<ParentOption[]>(fetchUrl);
                if (!mounted) return;
                setOptions(data || []);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [fetchUrl]);

    const filtered = useMemo(() => {
        return excludeId ? options.filter(o => o.id !== excludeId) : options;
    }, [options, excludeId]);

    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <select
                className="border p-2 rounded w-full"
                value={value ?? ""}
                onChange={(e) => {
                    const v = e.target.value;
                    onChangeAction(v === "" ? null : v);
                }}
                disabled={disabled || loading}
            >
                {allowNone && <option value="">{loading ? "Loading..." : "— None —"}</option>}
                {filtered.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    );
}