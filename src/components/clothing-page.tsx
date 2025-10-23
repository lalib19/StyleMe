export default function ClothingPage({ items }: { items: any[] }) {
    return (
        <div>
            {items && items.length > 0 ? (
                <ul>
                    {items.map((item) => (<li key={item.id}>{item.name}</li>))}
                </ul>
            ) : (
                <p>No items found.</p>
            )}
        </div>
    )
}
