"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export type AuthUser = {
    id: string;
    email: string;
    name?: string | null;
    globalRole?: string | null;
    image?: string | null;
    agencyProfiles?: any[];
};

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/auth/me", { withCredentials: true });

            if (res.status === 200 && res.data.authenticated) {
                setUser(res.data.user);
                setError(null);
            } else {
                setUser(null);
            }
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setUser(null);
                setError(null);
            } else {
                setError("Unexpected error");
            }
        } finally {
            setLoading(false);
            setReady(true);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = useCallback(
        async (email: string, password: string) => {
            try {
                const res = await axios.post("/api/auth/login", { email, password });
                if (res.status !== 200) throw new Error("Login failed");

                const data = res.data;
                setUser(data.user);
                setError(null);
                await fetchUser(); // refresh cookie-backed state

                if (data.user.globalRole === "ATLORA_ADMIN") router.push("/admin");
                else router.push("/");

                return data.user;
            } catch (err: any) {
                setError(err.message);
            }
        },
        [fetchUser, router]
    );

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
        router.push("/login");
    }, [router]);

    return {
        user,
        loading: !ready || loading,
        error,
        login,
        logout,
        refresh: fetchUser,
        isAuthenticated: !!user,
    };
}