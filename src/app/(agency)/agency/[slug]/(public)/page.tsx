'use client'
import { useAgency } from "../AgencyProvider";


export default function AgencyHome(){
    const agency = useAgency()

    if(agency.id === ""){
        return <div><p>Loading</p></div>
    }

    return (
        <div>
            <h1 className="text-4xl text-brand-primary">{agency.name}</h1>
        </div>
    )
}