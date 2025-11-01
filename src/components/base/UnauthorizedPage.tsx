"use client"
import Button from "@/components/base/Button";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-brand-bg flex-col">
            <div className="w-3/4 border-brand-accent-2 border-2 flex flex-col items-center gap-5 bg-white p-10">
                <img src="/AL-Logo_Pic.png" alt="atlora logo" className="w-48 m-2"/>
                <h1 className="text-4xl text-brand-text">You are not authorized to view this page</h1>
                <Link href="/login">
                    <Button color="primary" size="xl">Login</Button>
                </Link>
            </div>
        </div>
    )
}
