"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { loadFavorites } from "../store/cart-slice";

export function useFavorites() {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        async function fetchFavorites() {
            if (status === "authenticated" && session?.user?.email && !hasLoadedRef.current) {
                console.log("Fetching favorites for:", session.user.email);
                try {
                    const response = await fetch("/api/favorites", {
                        method: "GET"
                    });
                    console.log("Fetch response status:", response.status, response.ok);

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Fetched favorites from DB:", data);
                        dispatch(loadFavorites(data.favorites || []));
                        hasLoadedRef.current = true;
                    } else {
                        console.error("API response not ok:", response.status);
                    }
                } catch (error) {
                    console.error("Failed to fetch favorites:", error);
                    dispatch(loadFavorites([]));
                }
            } else if (status === "unauthenticated") {
                console.log("User unauthenticated, clearing favorites");
                hasLoadedRef.current = false;
                dispatch(loadFavorites([]));
            }
        }

        fetchFavorites();
    }, [status, session?.user?.email, dispatch]);
}