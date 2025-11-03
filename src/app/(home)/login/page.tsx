"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormTextInput from "@/components/forms/FormTextInput";
import Button from "@/components/base/Button";
import { useState } from "react";

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to login");
            }

            const result = await res.json();

            // 👇 example shape: { user: { id, email, globalRole: "ATLORA_ADMIN" | "ATLORA_USER" }, token }
            const userRole = result.user?.globalRole;

            if (userRole === "ATLORA_ADMIN") {
                router.push("/admin");
            } else {
                router.push("/settings");
            }
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
                <img src="/AL-Logo_Pic.png" className="w-24 h-24 mx-auto mb-4" alt="Logo" />
                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Sign in to Atlora
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
                    {loading ? "Signing in..." : "Login"}
                </Button>
            </form>
        </div>
    );
}