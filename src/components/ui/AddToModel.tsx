import { useAppSelector } from "@/src/store/hooks"

export default function AddToModel({ item, category }: { item: any, category: string }) {
    const model = useAppSelector((state) => state.model.model);
    const iconPath = {}

    const categoryMap: { [key: string]: string } = {}

    function handleAddModel(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        console.log(category);
    }

    return (
        <button onClick={(e) => handleAddModel(e)}
            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-blue/90 transition-colors" >
            <img src="/icons/icons8-plus-50.png" alt="add" width={30} height={30} />
        </button >
    )
}