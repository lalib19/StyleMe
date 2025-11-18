"use client"

import Link from "next/link"
import Logo from "./logo"
import { useAppSelector } from "@/src/store/hooks"

export default function MainNavigation() {
    const items = useAppSelector((state: any) => state.cart.items);
    return (
        <header className="flex h-16 items-center justify-between px-8 bg-custom-bg-nav shadow-md">
            <Link href={"/"}>
                <Logo />
            </Link>
            <nav>
                <ul className="flex space-x-4">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/clothes/men">Men</Link></li>
                    <li><Link href="/clothes/women">Women</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li className="relative"><Link href="/favorites">
                        <img src="/icons/icons8-heart-48-filled.png" alt="heart" height={24} width={24} />
                        {items.length > 0 && (
                            <div className="w-3 h-3 bg-green-200 rounded-full flex items-center justify-center absolute -top-1 -right-2">
                                <p className="text-black text-xs ">{items.length}</p>
                            </div>
                        )}
                    </Link></li>
                </ul>
            </nav>
        </header>
    )
}