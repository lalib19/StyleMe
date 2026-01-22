"use client"

import { useEffect, useState } from "react";

export default function useBrowserLanguage() {
    const [browserLanguage, setBrowserLanguage] = useState<string | null>(null);
    useEffect(() => {
        const language = navigator.language.split("-")[0]
        setBrowserLanguage(language)
    }, [])
    return browserLanguage
}

