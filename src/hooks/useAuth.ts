"use client"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
export type AuthUser = {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
};

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            if (axios.isAxiosError(err)) {
                // 401 = not logged in (not an actual error)
                if (err.response?.status === 401) {
                    setUser(null);
                    setError(null);
                } else {
                    setError(err.message);
                }
            } else {
                setError("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser().then(r => console.log(r));
    }, [fetchUser]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            if (res.status !== 200) {
                throw new Error("Login failed");
            }

            const data = res.data;
            setUser(data.user);
            return data.user;

        }
        catch (err: any) {
            setError(err.message);
        }
    }, [])

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    }, []);

    return {
        user,
        loading,
        error,
        login,
        logout,
        refresh: fetchUser,
        isAuthenticated: !!user,
    };

}