"use client";

import ImageGeneration from "@/src/components/ai/image-generation";
import Image from "next/image";
import Link from "next/link";
import ApiFunctions from "../api-functions";
import { useAppDispatch } from "@/src/store/hooks";
import { selectGender } from "@/src/store/filter-slice";
import { useFavoriteActions } from "@/src/hooks/useFavoriteActions";

export default function Hero() {
    const dispatch = useAppDispatch();
    const { clearFavorites } = useFavoriteActions();
    const modelUrl = "https://img.freepik.com/premium-photo/happiness-people-concept-smiling-man-with-crossed-arms_380164-55094.jpg?semt=ais_hybrid&w=740&q=80";
    const garmentUrl = "https://media.istockphoto.com/id/483960103/photo/blank-black-t-shirt-front-with-clipping-path.jpg?s=612x612&w=0&k=20&c=d8qlXILMYhugXGw6zX7Jer2SLPrLPORfsDsfRDWc-50=";

    return (
        <main className="flex flex-col items-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to StyleMe</h1>
            <p className="mt-4">Begin browsing clothing items and favorite them to add to your cart</p>
            <p className="mt-4">Then from your favorites select which ones you would like to try on you !</p>

            {/* <ImageGeneration model={modelUrl} garment={garmentUrl} /> */}
            {/* <ApiFunctions /> */}
            {/* <button className="bg-amber-300 px-4 py-2 rounded hover:bg-amber-400 transition-colors" onClick={() => clearFavorites()}>Clear favorites</button> */}

            <div className="flex gap-8 items-center justify-center mt-10">
                <Link href="/men" className="group" onClick={() => dispatch(selectGender("men"))} >
                    <Image
                        src="/images/mannequin-homme.jpg"
                        alt="Men"
                        width={400}
                        height={300}
                        style={{ width: "auto", height: "auto" }}
                        className="rounded-lg shadow-lg transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>

                <Link href="/women" className="group" onClick={() => dispatch(selectGender("women"))} >
                    <Image
                        src="/images/mannequin-femme.jpg"
                        alt="Women"
                        width={400}
                        height={300}
                        style={{ width: "auto", height: "auto" }}
                        className="rounded-lg shadow-lg transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>
            </div>
        </main >
    );
}
