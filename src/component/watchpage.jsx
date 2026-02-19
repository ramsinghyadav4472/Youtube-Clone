import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function WatchPage() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const video = location.state; // passed from VideoCard via navigate state

    // Save to localStorage history when video is opened
    useEffect(() => {
        if (!videoId) return;
        const entry = {
            id: videoId,
            title: video?.title || "Unknown Title",
            channel: video?.channel || "",
            thumbnail: video?.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            watchedAt: new Date().toISOString(),
        };
        const history = JSON.parse(localStorage.getItem("yt_history") || "[]");
        // Remove duplicate if already in history
        const filtered = history.filter((v) => v.id !== videoId);
        localStorage.setItem("yt_history", JSON.stringify([entry, ...filtered].slice(0, 50)));
    }, [videoId]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
                ← Back
            </button>
            <div className="max-w-5xl mx-auto">
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="YouTube Video Player"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                    />
                </div>
                {video && (
                    <div className="mt-4">
                        <h1 className="text-lg font-bold">{video.title}</h1>
                        <p className="text-gray-400 text-sm mt-1">{video.channel}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
