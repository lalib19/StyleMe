import Link from "next/link"
import Logo from "./logo"

export default function MainNavigation() {
    return (
        <header className="flex h-16 items-center justify-between px-8 bg-custom-bg-nav shadow-md">
            <Link href={"/"}>
                <Logo />
            </Link>
            <nav>
                <ul className="flex space-x-4">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/men">Men</Link></li>
                    <li><Link href="/women">Women</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    )
}