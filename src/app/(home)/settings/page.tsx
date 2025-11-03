"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useAuthContext } from "@/providers/AuthProvider";
import UnauthorizedPage from "@/components/base/UnauthorizedPage";
import Button from "@/components/base/Button";
import UserEditForm from "@/components/forms/UserEditForm";
import ConnectAgencyForm from "@/components/forms/ConnectAgencyForm";
import {
    GetUserByIdQuery,
    GetUserByIdDocument,
} from "@/graphql/generated/graphql";
import Link from "next/link";

export default function UserSettingsPage() {
    const { isAuthenticated, loading: authLoading, user, logout } = useAuthContext();
    const [showConnectForm, setShowConnectForm] = useState(false);

    const { data, loading } = useQuery<GetUserByIdQuery>(
        GetUserByIdDocument,
        {
            variables: { id: user?.id },
            skip: !user?.id,
            fetchPolicy: "no-cache",
        }
    );

    if (!isAuthenticated) return <UnauthorizedPage />;
    if (authLoading || loading || !data?.user)
        return <p className="text-center mt-10">Loading user settings...</p>;

    const firstName = data.user.name?.split(" ")[0] ?? "Traveler";
    const agencies = data.user.agencyProfiles || [];

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">
                    Welcome back, <span className="text-brand-accent-1">{firstName}</span> 👋
                </h1>
                <Button color="accent_2" size="sm" onClick={logout}>
                    Log Out
                </Button>
            </div>

            {/* Agencies Section */}
            <section className="border rounded-md p-5 bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Your Agencies</h2>

                {agencies.length > 0 ? (
                    <div className="space-y-4">
                        {agencies.map((profile) => {
                            const agency = profile?.agency;
                            if (!agency) return null;
                            const role = profile?.role || "TEAM_MEMBER"; // assuming your AgencyProfile model has role
                            const consoleLink = `/agency/${agency?.slug}/console`

                            return (
                                <div
                                    key={agency?.id}
                                    className="flex gap-10 items-center border-b last:border-none pb-2"
                                >
                                    <div>
                                        <img src={agency.logo ?? ""} alt={agency.name} className="w-12 h-12 rounded-full border"/>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{agency?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Role: {role.replace("_", " ").toLowerCase()}
                                        </p>
                                    </div>

                                    <Link href={consoleLink}>
                                        <Button color="primary" size="sm">
                                            Go to Console
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-600">
                        <p>You’re not connected to any agencies yet.</p>
                    </div>
                )}

                <div className="mt-4">
                    <Button
                        color="accent_3"
                        size="sm"
                        onClick={() => setShowConnectForm((prev) => !prev)}
                    >
                        {showConnectForm ? "Hide Connect Form" : "Connect New Agency"}
                    </Button>
                    {(showConnectForm && user)  && (
                        <div className="mt-5 border-t pt-5">
                            <ConnectAgencyForm userId={user.id} />
                        </div>
                    )}
                </div>
            </section>

            {/* Profile Section */}
            <section className="border rounded-md p-5 bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Profile Information</h2>
                {user &&
                    <UserEditForm userId={user.id} />
                }

            </section>
        </div>
    );
}