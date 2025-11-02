"use client";

import { Controller, useForm } from "react-hook-form";
import {
    GetUserByIdQuery,
    GetUserByIdDocument,
    UpdateUserDocument,
    UpdateUserMutation,
} from "@/graphql/generated/graphql";

import { useQuery, useMutation } from "@apollo/client/react";
import Button from "@/components/base/Button";
import FormTextInput from "@/components/forms/FormTextInput";
import MediaPicker from "@/components/forms/MediaPicker";
import { useEffect } from "react";

type UserEditFormValues = {
    email: string;
    name: string;
    image?: string | null;
};

type Props = {
    userId: string;
};

export default function UserEditForm({ userId }: Props) {
    const { data, loading: userLoading } = useQuery<GetUserByIdQuery>(
        GetUserByIdDocument,
        {
            variables: { id: userId },
            skip: !userId,
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
        defaultValues: { email: "", name: "", image: "" },
    });

    // Reset form values when data loads
    useEffect(() => {
        if (data?.user) {
            reset({
                email: data.user.email ?? "",
                name: data.user.name ?? "",
                image: data.user.image ?? "",
            });
        }
    }, [data, reset]);

    const onSubmit = async (formData: UserEditFormValues) => {
        try {
            await updateUser({
                variables: {
                    id: userId,
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

    if (userLoading) return <p>Loading user details...</p>;

    return (
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
                        type="profile"
                        userId={userId}
                    />
                )}
            />

            <div className="flex justify-end">
                <Button color="primary" size="md" type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}