'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import GenericTable, { Column } from "@/components/base/GenericTable";
import Modal from "@/components/base/Modal";
import RegionForm from "@/components/forms/RegionForm";
import type { RegionWithParent } from "@/repo/dto";

export default function RegionCatalogPage() {
    const [regions, setRegions] = useState<RegionWithParent[]>([]);
    const [selected, setSelected] = useState<RegionWithParent | null>(null);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    const columns: Column<RegionWithParent>[] = [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        {
            key: "parent",
            label: "Parent",
            render: (_value, row) => row.parent?.name ?? "—",
        },
    ];

    async function fetchRegions() {
        setLoading(true);
        try {
            const { data } = await axios.get<RegionWithParent[]>("/api/regions");
            setRegions(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRegions();
    }, []);

    async function handleRegionUpdate(formData: any) {
        if (!selected) return;
        // whitelist fields expected by API/updateRegion
        const { slug, name, type, summary, heroImg, emoji, parentId } = formData;
        const payload = { slug, name, type, summary, heroImg, emoji, parentId };

        try {
            const { data: updated } = await axios.put(
                `/api/regions?id=${encodeURIComponent(selected.id)}`,
                payload
            );
            setRegions((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelected(null); // close modal
        } catch (e) {
            console.error("Update failed:", e);
        }
    }

    async function handleRegionCreate(formData: any) {
        const { slug, name, type, summary, heroImg, emoji, parentId } = formData;
        const payload = { slug, name, type, summary, heroImg, emoji, parentId };

        try {
            const { data: created } = await axios.post<RegionWithParent>("/api/regions", payload);
            // EITHER push locally…
            setRegions((prev) => [created, ...prev]);
            // …or call fetchRegions(); if you prefer server as source of truth
            setCreating(false); // hide create form
        } catch (e) {
            console.error("Create failed:", e);
        }
    }

    return (
        <div className="w-full p-5 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-3/4">
                <h1 className="text-2xl">Regions</h1>
                <button
                    className="bg-brand-accent-2 hover:bg-brand-accent-2-hover p-2 rounded"
                    onClick={() => setCreating((v) => !v)}
                >
                    {creating ? "Cancel" : "Create New Region"}
                </button>
            </div>

            <div className="w-7/8 p-2">
                {creating && (
                    <div className="p-5 border rounded mb-4">
                        <RegionForm
                            onSubmitAction={handleRegionCreate}
                            submitLabel="Create Region"
                        />
                    </div>
                )}

                {loading ? (
                    <p className="text-sm text-gray-500">Loading…</p>
                ) : (
                    <GenericTable columns={columns} data={regions} onEditAction={setSelected} />
                )}

                {selected && (
                    <Modal onCloseAction={() => setSelected(null)} title={`Edit ${selected.name}`}>
                        <div className="w-full p-2">
                            <RegionForm
                                initialValues={selected}
                                onSubmitAction={handleRegionUpdate}
                                submitLabel="Update Region"
                            />
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}