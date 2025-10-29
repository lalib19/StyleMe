import Link from "next/link";

export default async function ClothingItem({ items, gender }: { items: any[], gender: string }) {

    return (
        items.map((item) => {
            const newName = item.name.replace(" ", '-')
            const linkPath = `/clothes/${gender}/${newName}`
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
                        <p className="w-full py-4 px-2">{item.name}</p>
                    </Link>
                </li>
            )
        })
    )
}
