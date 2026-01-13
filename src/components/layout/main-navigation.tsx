"use client"

import Link from "next/link"
import Logo from "./logo"
import { useAppSelector } from "@/src/store/hooks"
import { useSession, signOut } from "next-auth/react"
import NavLink from "../ui/NavLink"

export default function MainNavigation() {
    const items = useAppSelector((state) => state.cart.items);
    const { data: session } = useSession();

    function handleSignOut() {
        signOut({ callbackUrl: "/" });
    }

    return (
        <header className="flex h-16 items-center justify-between px-8 bg-custom-bg-nav shadow-md">
            <Link href={"/"}>
                <Logo />
            </Link>
            <nav>
                <ul className="flex space-x-4">
                    <li><NavLink href="/clothes/men">Men</NavLink></li>
                    <li><NavLink href="/clothes/women">Women</NavLink></li>
                    {session ? (
                        <>
                            <li><button className="text-lg hover:underline hover:cursor-pointer" onClick={handleSignOut} >Logout</button></li>
                        </>
                    ) : (
                        <li><NavLink href="/auth">Log In</NavLink></li>
                    )}
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