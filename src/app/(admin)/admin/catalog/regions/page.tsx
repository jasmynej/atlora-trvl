"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import {GetAllRegionsQuery, GetAllRegionsDocument} from "@/graphql/generated/graphql";
import {useQuery} from "@apollo/client/react";
import GenericTable, {Column} from "@/components/base/GenericTable";


type RegionType = GetAllRegionsQuery["regions"][number];

export default function AdminRegionsPage() {
    const router = useRouter();
    const {data, loading, error} = useQuery<GetAllRegionsQuery>(GetAllRegionsDocument);
    const [selected, setSelected] = useState<RegionType | null>(null);

    const columns: Column<RegionType>[] = [
        {key: "name", label:"Name"},
        {key: "type", label:"Type"},
        {
            key: "parent",
            label:"Parent",
            render: (_value, region) => region.parent?.name,
        },
        {
            key: "children",
            label: "Children",
            render: (_value, region) => region.children?.length,
        }
    ]

    function handleView(region: { slug: string }) {
        router.push(`/admin/catalog/regions/${region.slug}`);
    }

    return (
        <div>
            <h1>Regions</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
                <GenericTable
                    columns={columns}
                    data={data?.regions || []}
                    onEditAction={setSelected}
                    onViewAction={handleView}
                />
            )}

        </div>
    )
}