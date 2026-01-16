"use client"

import { useAppSelector } from '@/src/store/hooks'
import NavLink from '../ui/NavLink'

export default function FilterNavigation() {
    const gender = useAppSelector((state) => state.filters.gender)
    return (
        <header className="flex h-10 items-center px-50 bg-custom-bg-nav shadow-md border-t-black border-solid border-t space-x-4">

            {gender ? (
                <>
                    <NavLink href={`/${gender}/jeans`}>Jeans</NavLink>
                    <NavLink href={`/${gender}/shoes`}>Shoes</NavLink>
                    <NavLink href={`/${gender}/accessories`}>Accessories</NavLink>
                </>
            ) : (
                <>
                    <NavLink href="/jeans">Jeans</NavLink>
                    <NavLink href="/shoes">Shoes</NavLink>
                    <NavLink href="/accessories">Accessories</NavLink>
                </>
            )}
        </header>
    )
}
