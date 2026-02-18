import { useParams, useNavigate } from "react-router-dom";

export default function WatchPage() {
    const { videoId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-1"
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
            </div>
        </div>
    );
}
