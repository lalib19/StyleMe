import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <main className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">Bienvenue sur StyleMe</h1>
            <p className="mt-4">Begin browsing clothing items to see what you like!</p>
            <div className="flex gap-8 items-center justify-center h-screen">
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
