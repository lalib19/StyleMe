"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { loadFavorites } from "../store/cart-slice";
import { setUserImage } from "../store/model-slice";
import { loadGenerations } from "../store/generations-slice";

export function useFavorites() {
    const [generatedData, setGeneratedData] = useState(null);
    const [generationCount, setGenerationCount] = useState(0);
    const { data: session, status } = useSession();
    const hasLoadedRef = useRef(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function fetchFavorites() {
            if (status === "authenticated" && session?.user?.email && !hasLoadedRef.current) {
                try {
                    const response = await fetch("/api/favorites", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        dispatch(loadFavorites(data.favorites || []));
                        dispatch(setUserImage(data.userImage || { imageUrl: null }));
                        dispatch(loadGenerations(data.generations || []));
                        // const generations = data.generations || [];
                        // const count = data.generationCount ?? generations.length;
                        // setGeneratedData(generations);
                        // setGenerationCount(count);
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
                // setGeneratedData(null);
                // setGenerationCount(0);
            }
        }

        fetchFavorites();
    }, [status, session?.user?.email, dispatch]);

    return {
        // generations: generatedData,
        // count: generationCount
    };
}