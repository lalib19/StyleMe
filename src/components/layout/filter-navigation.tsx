"use client"

import { useAppSelector } from '@/src/store/hooks'
import NavLink from '../ui/NavLink'
import { useParams } from 'next/navigation'

export default function FilterNavigation() {
    const gender = useAppSelector((state) => state.filters.gender)
    const params = useParams()


    return (
        <>
            {gender && params.gender && (
                <header className="flex h-10 items-center px-50 bg-custom-bg-nav shadow-md border-t-black border-solid border-t space-x-4">
                    <>
                        <NavLink href={`/${gender}/jeans`}>Jeans</NavLink>
                        <NavLink href={`/${gender}/shoes`}>Shoes</NavLink>
                        <NavLink href={`/${gender}/accessories`}>Accessories</NavLink>
                    </>
                </header>
            )}
        </>
    )
}


// routing a ajuster selon le path et enlever filter slice pour params ?
