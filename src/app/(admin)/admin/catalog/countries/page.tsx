'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import GenericTable, { Column } from "@/components/base/GenericTable";
import {Country} from "@prisma/client";
import Modal from "@/components/base/Modal";
import CountryForm from "@/components/forms/CountryForm";
export default function CountryCatalogPage() {
    const [countries, setCountries] = useState<Country[]>([])
    const [selected, setSelected] = useState<Country | null>(null)
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    async function fetchCountries() {
        setLoading(true);
        try {
            const res = await axios.get("/api/countries");
            setCountries(res.data.data ?? res.data);
        } catch (e) {
            console.error("Failed to fetch countries:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCountries().then(r => console.log("fetched countries"));
    }, []);

    const columns:Column<Country>[] = [
        {key:"name", label:"Name"},
        {key:"iso2", label:"ISO2"},
        {key:"iso3", label:"ISO3"},
        {key:"flag", label:"Flag",
            render: (_value, row: Country, ) =>
                <img src={
                    row.flag ? row.flag : `https://flagcdn.com/${row.iso2.toLowerCase()}.svg`}
                     className="w-18"/>
        },
        {key: "emoji", label: "Emoji",
        render: (_value, row: Country) => <p className="text-3xl">{row.emoji ? row.emoji : `-`}</p>}
    ]

    async function submitNewCountry(formValues: any) {
        try {
            await axios.post("/api/countries", formValues, {
                headers: { "Content-Type": "application/json" },
            });
            await fetchCountries();   // <--- re-fetch after create
            setCreating(false);
        } catch (e) {
            console.error("Create failed:", e);
        }
    }

    async function updateCountry(formValues: any) {
        if (!selected) return;
        try {
            await axios.put(
                `/api/countries?id=${encodeURIComponent(selected.id)}`,
                formValues,
                { headers: { "Content-Type": "application/json" } }
            );
            await fetchCountries();   // <--- re-fetch after update
            setSelected(null);
        } catch (e) {
            console.error("Update failed:", e);
        }
    }

    return (
        <div className="w-full p-5 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-3/4">
                <h1 className="text-2xl">Countries</h1>
                <button
                    className="bg-brand-accent-2 hover:bg-brand-accent-2-hover p-2 rounded"
                    onClick={() => setCreating((v) => !v)}
                >
                    {creating ? "Cancel" : "Create New Country"}
                </button>
            </div>
            <div className="p-2 w-7/8">
                {creating &&
                    <div className="p-5 border rounded mb-4">
                        <CountryForm onSubmitAction={submitNewCountry}
                                     submitLabel="Create Country"/>
                    </div>

                }
                <GenericTable columns={columns} data={countries} onEditAction={setSelected} />
            </div>

            {
                selected &&
                <Modal onCloseAction={() =>setSelected(null)} title={`Edit ${selected.name}`}>
                    <CountryForm onSubmitAction={updateCountry}
                                 submitLabel="Edit Country"
                                 initialValues={selected}
                    />
                </Modal>
            }
        </div>
    )
}