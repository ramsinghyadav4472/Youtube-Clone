import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col gap-2 cursor-pointer group"
            onClick={() => navigate(`/watch/${video.id}`)}
        >
            <div className="overflow-hidden rounded-xl relative">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full w-12 h-12 flex items-center justify-center text-xl">▶</div>
                </div>
            </div>
            <div className="px-1">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-white">{video.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
            </div>
        </div>
    );
}
