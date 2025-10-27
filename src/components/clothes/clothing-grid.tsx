import ClothingItem from "./clothing-item";

export default function ClothingGrid({ items }: { items: any[] }) {
    return (
        <ul className="grid grid-cols-3">
            {items && items.length > 0 ? (
                <ClothingItem items={items} />
            ) : (
                <p>No items found.</p>
            )}
        </ul>
    )
}
