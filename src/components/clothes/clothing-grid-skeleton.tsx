"use client"

import { useParams } from "next/navigation"

export default function ClothingGridSkeleton() {
    const params = useParams()
    return (
        <>
            <p className="text-5xl font-bold m-4 ml-5 text-center md:text-start md:ml-50 capitalize text-background">{params.garmentType}</p>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-x-4 gap-y-2 p-5 mx-auto justify-center">
                {[...Array(12)].map((_, i) => (

                    <li key={i} className="animate-pulse">
                        <div className="bg-gray-200 aspect-3/4 rounded-lg mb-2"></div>
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                    </li>
                ))}
            </ul>
        </>
    )
}
