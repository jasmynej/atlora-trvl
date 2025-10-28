'use client';
import { useParams } from 'next/navigation';
import {GetRegionBySlugQuery, GetRegionBySlugDocument} from "@/graphql/generated/graphql";
import {useQuery} from "@apollo/client/react";

type RegionType = GetRegionBySlugQuery["regionBySlug"];
export default function AdminRegionViewPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;
    const {loading, data, error} = useQuery<GetRegionBySlugQuery>(GetRegionBySlugDocument, {variables: {slug}, skip: !slug})
    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <h1>{data?.regionBySlug?.name}</h1>
        </div>
    )
}