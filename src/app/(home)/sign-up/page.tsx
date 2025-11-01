"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormTextInput from "@/components/forms/FormTextInput";
import Button from "@/components/base/Button";

type SignUpFormValues = {
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignUpFormValues>();

    const onSubmit = async (data: SignUpFormValues) => {
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    role: "USER",
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to sign up");
            }

            // redirect after signup
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
            >
                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Create an Account
                </h1>

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
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    required
                    register={register}
                    errors={errors}
                />

                <FormTextInput
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    type="password"
                    required
                    register={register}
                    errors={errors}
                />

                {error && (
                    <p className="text-sm text-red-500 text-center font-medium">{error}</p>
                )}

                <Button
                    type="submit"
                    color="primary"
                    size="md"
                    disabled={loading}
                    className="w-full font-medium"
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-brand-primary hover:underline">
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
}