"use client";

import ImageGeneration from "@/src/components/ai/image-generation";
import { checkAllCategoryProducts, testRateLimit } from "@/src/lib/api-checker";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    const modelUrl = "https://img.freepik.com/premium-photo/happiness-people-concept-smiling-man-with-crossed-arms_380164-55094.jpg?semt=ais_hybrid&w=740&q=80";
    const garmentUrl = "https://media.istockphoto.com/id/483960103/photo/blank-black-t-shirt-front-with-clipping-path.jpg?s=612x612&w=0&k=20&c=d8qlXILMYhugXGw6zX7Jer2SLPrLPORfsDsfRDWc-50=";

    const handleTestRateLimit = async () => {
        const result = await testRateLimit();
        console.log('Rate limit test result:', result);
    };

    return (
        <main className="flex flex-col items-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to StyleMe</h1>
            <p className="mt-4">Begin browsing clothing items and favorite them to add to your cart</p>
            <p className="mt-4">Then from your favorites select which ones you would like to try on you !</p>

            <ImageGeneration model={modelUrl} garment={garmentUrl} />
            <button
                className={"rounded px-4 py-2 outline my-4 bg-red-400 hover:cursor-pointer hover:bg-amber-400"}

                onClick={() => checkAllCategoryProducts()}>Check API </button>

            <div className="flex gap-8 items-center justify-center h-screen my-4">
                <Link href="/clothes/men" className="group" >
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

                <Link href="/clothes/women" className="group" >
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
