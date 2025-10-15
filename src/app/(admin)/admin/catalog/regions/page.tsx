'use client'
import {useState, useEffect} from "react";
import {Region} from "@prisma/client";
import axios from "axios";

export default function RegionCatalogPage() {
    const [regions, setRegions] = useState<Region[]>([]);

    useEffect(() => {
        axios.get("/api/regions")
            .then(res => setRegions(res.data))
    }, []);
    return (
        <div className="w-full p-5">
            <h1 className="text-2xl">Regions</h1>
            <div className="w-3/4 p-2">
                <table className="w-full border-collapse text-left">

                    <thead>
                    <tr className="text-xl">
                        <th className="p-2">Name</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Region</th>
                    </tr>
                    </thead>
                    <tbody>
                    {regions.map((region) => (
                        <tr key={region.id} className="text-lg">
                            <td className="p-2">{region.name}</td>
                            <td className="p-2">{region.type}</td>
                            <td className="p-2">{region.parent?.name ?? "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}