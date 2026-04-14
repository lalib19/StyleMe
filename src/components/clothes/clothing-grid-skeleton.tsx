export default function ClothingGridSkeleton() {
    return (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-x-4 gap-y-2 p-5 mx-auto justify-center">
            {[...Array(12)].map((_, i) => (
                <li key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-3/4 rounded-lg mb-2"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </li>
            ))}
        </ul>
    )
}
