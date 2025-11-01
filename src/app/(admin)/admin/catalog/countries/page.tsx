"use client"
import {useState, useEffect} from "react";
import {AllCountriesQuery, AllCountriesDocument} from "@/graphql/generated/graphql";
import {useQuery} from "@apollo/client/react";
import GenericTable, {Column} from "@/components/base/GenericTable";

type CountryType = AllCountriesQuery["countries"][number];
export default function AdminCountries() {
    const {data, loading, error} = useQuery<AllCountriesQuery>(AllCountriesDocument);
    const [selected, setSelected] = useState<CountryType | null>(null);
    const columns: Column<CountryType>[] = [
        {key: "name", label:"Name"},
        {key: "iso2", label:"ISO2"},
        {key: "iso3", label:"ISO3"},
        {key:"flag", label:"Flag",
            render: (_value, row: CountryType, ) =>
                <img src={
                    row.flag ? row.flag : `https://flagcdn.com/${row.iso2.toLowerCase()}.svg`}
                     className="w-18"/>
        },
        {
            key: "emoji",
            label: "Emoji",
            render: (_value, row: CountryType) => <p className="text-3xl">{row.emoji ? row.emoji : `-`}</p>
        },
        {
            key: "regions",
            label:"Regions",
            render: (_value, country) => country.regions?.length,
        },
    ]
    return (
        <div>
            <h1>Countries</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
                <GenericTable
                    columns={columns}
                    data={data?.countries || []}
                    onEditAction={setSelected}
                    onViewAction={setSelected}
                />
            )}
        </div>
    )
}