import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // theme: {
    //     extend: {
    //         colors: {
    //             // Add your custom colors here
    //             'brand-primary': '#1a2b3c',
    //             'brand-secondary': '#4a5b6c',
    //             'custom-bg': '#e1d2d2',
    //             'custom-bg-nav': '#e7b6b6',
    //             'accent': {
    //                 light: '#ffc107',
    //                 DEFAULT: '#ff9800',
    //                 dark: '#f57c00',
    //             },
    //         },
    //     },
    // },
    plugins: [],
};

export default config;
