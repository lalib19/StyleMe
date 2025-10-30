import Link from "next/link";

export default async function ClothingItem({ items, gender }: { items: any[], gender: string }) {

    return (
        items.map((item) => {
            const formattedName = item.name.replace(" ", '-')
            const linkPath = `/clothes/${gender}/${formattedName}`
            const imageUrlPath = `https://${item.imageUrl}`

            return (
                <li key={item.id} className="shadow-lg h-auto max-w-80"
                >
                    <Link href={linkPath} className="block">
                        {/* img instead of NextJS Image because the API images do not work with it */}
                        <img
                            src={imageUrlPath}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-auto object-cover"
                        />
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
