import { useAppDispatch, useAppSelector } from "@/src/store/hooks"
import { setBottom, setTop, setShoes, setAccessory, ModelState, initialCartItemTypeState } from "@/src/store/model-slice";
import { CartItemType } from "@/src/store/cart-slice";
import Image from "next/image";

export default function AddToModel({ item, customCategoryName }: { item: CartItemType, customCategoryName: string }) {
    const dispatch = useAppDispatch()
    const model = useAppSelector((state) => state.model)
    const iconPath = Object.values(model as Omit<ModelState, 'userImage'>).some(i => i.id === item.id) ? "/icons/icons8-green.png" : "/icons/icons8-plus-50.png"
    const isSelected = Object.values(model as Omit<ModelState, 'userImage'>).some(i => i.id === item.id);

    function handleAddModel(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const lowerCategory = customCategoryName?.toLowerCase();
        if (lowerCategory === "top") {
            model.top.id === item.id ? dispatch(setTop({ ...initialCartItemTypeState })) :
                dispatch(setTop({ id: item.id, name: item.name, url: item.url, imageUrl: `https://${item.imageUrl}`, price: item.price, categoryName: item.categoryName, customCategoryName: item.customCategoryName }));
        } else if (lowerCategory?.includes("pants")) {
            model.bottom.id === item.id ? dispatch(setBottom({ ...initialCartItemTypeState })) :
                dispatch(setBottom({ id: item.id, name: item.name, url: item.url, imageUrl: `https://${item.imageUrl}`, price: item.price, categoryName: item.categoryName, customCategoryName: item.customCategoryName }));
        } else if (lowerCategory?.includes("shoes") || lowerCategory?.includes("boots") || lowerCategory?.includes("sneakers")) {
            model.shoes.id === item.id ? dispatch(setShoes({ ...initialCartItemTypeState })) :
                dispatch(setShoes({ id: item.id, name: item.name, url: item.url, imageUrl: `https://${item.imageUrl}`, price: item.price, categoryName: item.categoryName, customCategoryName: item.customCategoryName }));
        } else if (lowerCategory === "accessory") {
            model.accessory.id === item.id ? dispatch(setAccessory({ ...initialCartItemTypeState })) :
                dispatch(setAccessory({ id: item.id, name: item.name, url: item.url, imageUrl: `https://${item.imageUrl}`, price: item.price, categoryName: item.categoryName, customCategoryName: item.customCategoryName }));
        }
    }

    return (
        <button onClick={(e) => handleAddModel(e)}
            className="absolute shadow-lg top-2 right-2 p-1 bg-white/80 rounded-full " >
            <Image
                src={iconPath}
                alt="add"
                width={30}
                height={30}
                className={`transition-all  duration-500 hover:scale-110 ${isSelected ? 'rotate-45' : 'rotate-0'}`}
            />
        </button >
    )
}