"use client";

import { useAuthContext } from "@/providers/AuthProvider";
import {
    GetUserByIdQuery,
    GetUserByIdDocument,
    UpdateUserDocument,
    UpdateUserMutation,
} from "@/graphql/generated/graphql";
import UnauthorizedPage from "@/components/base/UnauthorizedPage";
import { useQuery, useMutation } from "@apollo/client/react";
import Button from "@/components/base/Button";
import { Controller, useForm } from "react-hook-form";
import FormTextInput from "@/components/forms/FormTextInput";
import MediaPicker from "@/components/forms/MediaPicker";

type UserEditFormValues = {
    email: string;
    name: string;
    image?: string | null;
};

export default function UserSettingsPage() {
    const { isAuthenticated, loading: authLoading, user, logout } = useAuthContext();

    const { data, loading: userLoading, error } = useQuery<GetUserByIdQuery>(
        GetUserByIdDocument,
        {
            variables: { id: user?.id },
            skip: !user?.id,
        }
    );

    const [updateUser, { loading: saving }] = useMutation<UpdateUserMutation>(
        UpdateUserDocument
    );

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserEditFormValues>({
        defaultValues: {
            email: data?.user?.email ?? "",
            name: data?.user?.name ?? "",
            image: data?.user?.image ?? "",
        },
    });

    if (!isAuthenticated) return <UnauthorizedPage />;
    if (authLoading || userLoading) return <p>Loading user settings...</p>;

    const onSubmit = async (formData: UserEditFormValues) => {
        try {
            await updateUser({
                variables: {
                    id: user!.id,
                    data: {
                        email: formData.email,
                        name: formData.name,
                        image: formData.image ?? null,
                    },
                },
            });

            alert("Profile updated successfully!");
        } catch (err: any) {
            console.error("Update failed:", err);
            alert("Failed to update user profile");
        }
    };

    return (
        <div className="max-w-lg mx-auto py-10 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">User Settings</h1>
                <Button color="accent_2" size="sm" onClick={logout}>
                    Log Out
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormTextInput
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    required
                    register={register}
                    errors={errors}
                />

                <FormTextInput
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    required
                    register={register}
                    errors={errors}
                />

                <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                        <MediaPicker
                            value={field.value ?? ""}
                            onChangeAction={field.onChange}
                            agency="global"
                        />
                    )}
                />

                <div className="flex justify-end">
                    <Button
                        color="primary"
                        size="md"
                        type="submit"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}