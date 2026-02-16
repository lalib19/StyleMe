import { useAppDispatch, useAppSelector } from "@/src/store/hooks"
import { setBottom, setTop, setShoes, setHat, addAccessory } from "@/src/store/model-slice";

export default function AddToModel({ item, category }: { item: any, category: string }) {
    const dispatch = useAppDispatch()
    const model = useAppSelector((state => state.model.model))
    const iconPath = item.id === model.top.id || item.id === model.bottom.id || item.id === model.shoes.id || item.id === model.hat.id || model.accessories.some((acc) => acc.id === item.id) ? "/icons/icons8-plus-50-filled.png" : "/icons/icons8-plus-50.png"

    function handleAddModel(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        const lowerCategory = category.toLowerCase();

        if (lowerCategory === "hat") {
            dispatch(setHat({ id: item.id, image: item.imageUrl }));
        } else if (lowerCategory === "top") {
            dispatch(setTop({ id: item.id, image: item.imageUrl }));
        } else if (lowerCategory === "jeans" || lowerCategory.includes("jeans")) {
            dispatch(setBottom({ id: item.id, image: item.imageUrl }));
        } else if (lowerCategory.includes("shoes") || lowerCategory.includes("boots") || lowerCategory.includes("sneakers")) {
            dispatch(setShoes({ id: item.id, image: item.imageUrl }));
        } else if (lowerCategory === "accessory") {
            dispatch(addAccessory({ id: item.id, image: item.imageUrl }));
        }

        console.log(item);
    }

    return (
        <button onClick={(e) => handleAddModel(e)}
            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-blue/90 transition-colors" >
            <img src={iconPath} alt="add" width={30} height={30} />
        </button >
    )
}