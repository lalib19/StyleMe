import { CartState } from "@/src/store/cart-slice"

export default function ModelClothingDetail({ garments }: { garments: CartState }) {
    return (
        <div className="flex items-center justify-between w-130 sm:w-140 lg:w-160 xl:w-170 rounded-lg ml-5 mb-30">
            <div className="self-stretch w-4/16 rounded">
                {garments.map((garment, index) => (
                    <img key={index} src={garment.imageUrl} alt={garment.name || `Garment ${index + 1}`} className="rounded mb-1 lg:mb-2 " />
                ))}
            </div>
        </div>
    )
}
