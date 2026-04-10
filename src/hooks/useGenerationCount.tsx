"use client"

import { useAppSelector } from "@/src/store/hooks";
import { useSession } from "next-auth/react";

export function useGenerationCount() {
    const { data: session } = useSession();
    const generations = useAppSelector((state) => state.generations.generations);

    const maxGenerations = 3;
    const currentCount = generations.length;
    const remaining = Math.max(0, maxGenerations - currentCount);
    const isAtLimit = currentCount >= maxGenerations;
    const isWarning = remaining <= 1; // Warning when 1 or 0 left

    return {
        maxGenerations,
        currentCount,
        remaining,
        isAtLimit,
        isWarning,
        isAuthenticated: !!session?.user?.email
    };
}