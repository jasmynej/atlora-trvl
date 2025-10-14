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
        <div>
            <h1>Regions</h1>
        </div>
    )
}