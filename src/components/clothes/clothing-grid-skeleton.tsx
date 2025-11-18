export default function ClothingGridSkeleton() {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 max-w-[1400px] p-5 mx-auto">
            {[...Array(9)].map((_, i) => (
                <li key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-3/4 rounded-lg mb-2"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </li>
            ))}
        </ul>
    )
}
