"use client";

import { useMutation, useLazyQuery } from "@apollo/client/react";
import {
    AddAgencyMemberMutation,
    AddAgencyMemberDocument,
    GetAgencyBySlugQuery,
    GetAgencyBySlugDocument,
} from "@/graphql/generated/graphql";
import { useForm, FormProvider } from "react-hook-form";
import FormTextInput from "@/components/forms/FormTextInput";
import FormSelect from "@/components/forms/FormSelect";
import Button from "@/components/base/Button";


type ConnectAgencyFormValues = {
    agencySlug: string;
    role: "AGENCY_ADMIN" | "TEAM_MEMBER";
};

type Props = {
    userId: string;
};

export default function ConnectAgencyForm({ userId }: Props) {
    const methods = useForm<ConnectAgencyFormValues>({
        defaultValues: {
            agencySlug: "",
            role: "TEAM_MEMBER",
        },
    });

    const { handleSubmit, reset, register } = methods;

    const [getAgencyBySlug, { loading: fetchingAgency }] =
        useLazyQuery<GetAgencyBySlugQuery>(GetAgencyBySlugDocument);

    const [addAgencyMember, { loading: adding }] =
        useMutation<AddAgencyMemberMutation>(AddAgencyMemberDocument);

    const onSubmit = async (formData: ConnectAgencyFormValues) => {
        try {
            // 1️⃣ Fetch agency by slug
            const { data } = await getAgencyBySlug({
                variables: { slug: formData.agencySlug.trim() },
                // fetchPolicy: "no-cache", // prevent refetch-induced aborts
            });

            const agency = data?.agency ?? data?.agency;
            if (!agency) {
                alert("No agency found with that slug.");
                return;
            }

            const agencyId = agency.id;

            // 2️⃣ Connect user
            await addAgencyMember({
                variables: {
                    data: {
                        agencyId,
                        userId,
                        role: formData.role,
                    },
                },
                fetchPolicy: "no-cache",
            });

            alert(`✅ You’ve successfully joined ${agency.name || "this agency"}`);
            reset();
        } catch (err: any) {
            // 👇 ignore harmless Apollo aborts
            if (err?.name === "AbortError" || err?.message?.includes("aborted")) return;

            console.error("Error connecting to agency:", err);
            alert("❌ Failed to connect to agency. Please try again.");
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="max-w-md">
                <h2 className="text-lg font-semibold mb-4">Connect to an Agency</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormTextInput
                        name="agencySlug"
                        label="Agency Slug"
                        placeholder="Enter agency slug (e.g. atlora-travel)"
                        required
                        register={register}
                    />

                    <FormSelect
                        name="role"
                        label="Agency Role"
                        required
                        options={[
                            { value: "TEAM_MEMBER", label: "Team Member" },
                            { value: "AGENCY_ADMIN", label: "Agency Admin" },
                        ]}
                        register={register}
                    />

                    <Button
                        type="submit"
                        color="accent_3"
                        size="md"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        {fetchingAgency || adding ? "Connecting..." : "Connect Agency"}
                    </Button>
                </form>
            </div>
        </FormProvider>
    );
}