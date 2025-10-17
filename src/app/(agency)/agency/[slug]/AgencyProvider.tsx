"use client";
import React, { createContext, useContext } from "react";
import {Agency} from "@prisma/client";

const AgencyContext = createContext<Agency | null>(null)

export const useAgency = () => {
    const ctx = useContext(AgencyContext);
    if (!ctx) throw new Error("useAgency must be used within <AgencyProvider>");
    return ctx;
}

export default function AgencyProvider({
    value,
    children}: {value: Agency, children: React.ReactNode}){
    return <AgencyContext.Provider value={value}>{children}</AgencyContext.Provider>;
}