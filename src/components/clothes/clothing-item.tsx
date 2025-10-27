import Link from "next/link";
import Image from "next/image";

export default function ClothingItem({ items }: { items: any[] }) {
    return (
        items.map((item) => {
            const linkPath: string = `/clothes/${item.name}`
            const imageUrlPath = `https://${item.imageUrl}`
            return (
                <li key={item.id}>
                    <Link href={linkPath}>
                        {/* img instead of NextJS Image because the API images do not work with it */}
                        <img src={imageUrlPath} alt={item.name} width={150} height={300} loading="lazy" />
                        <p >{item.name}</p>
                    </Link>
                </li>
            )
        })
    )
}