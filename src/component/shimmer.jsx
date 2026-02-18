export default function Shimmer() {
    return (
        <div className="flex flex-col gap-3">
            <div className="w-full aspect-video bg-gray-700 rounded-xl animate-pulse" />
            <div className="flex flex-col gap-2 px-1">
                <div className="h-3.5 bg-gray-700 rounded animate-pulse w-full" />
                <div className="h-3.5 bg-gray-700 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-gray-700 rounded animate-pulse w-1/3" />
            </div>
        </div>
    )
}
