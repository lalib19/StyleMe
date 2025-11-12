"use client"

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "@/src/store/cart-slice";

export default function ClothingItem({ items }: { items: any[] }) {
    const dispatch = useDispatch();
    const cart = useSelector((state: any) => state.cart.items);

    const handleSelectItem = (id: number) => {
        dispatch(selectItem(id));
        console.log(cart);
    }

    return (
        items.map((item) => {
            const formattedName = item.name.replace(/\s+/g, '-').toLowerCase()
            const imageUrlPath = `https://${item.imageUrl}`
            const iconPath = `${cart.includes(item.id) ? "/icons/icons8-heart-48-filled.png" : "/icons/icons8-heart-48.png"}`

            return (
                <li key={item.id} className="shadow-lg h-auto max-w-80"
                >
                    <Link
                        href={{
                            pathname: `/clothes/item/${formattedName}`,
                            query: {
                                name: item.name,
                                price: item.price.current.text,
                                imageUrl: item.imageUrl
                            }
                        }}
                        className="block"
                    >
                        {/* Image container with relative positioning for the heart */}
                        <div className="relative">
                            <img
                                src={imageUrlPath}
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-auto object-cover"
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSelectItem(item.id);
                                }}
                                className="absolute bottom-2 right-2 p-1 bg-white/80 rounded-full hover:bg-blue/90 transition-colors"
                            >
                                <img src={iconPath} alt="heart" height={30} width={30} />
                            </button>
                        </div>
                        <div className="flex p-4 text-sm items-center">
                            <p className="w-2/3" >{item.name}</p>
                            <p className="w-1/3 text-right">{item.price.current.text}</p>
                        </div>
                    </Link>
                </li>
            )
        })
    )
}
