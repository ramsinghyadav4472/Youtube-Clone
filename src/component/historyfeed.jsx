import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryFeed() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("yt_history") || "[]");
        setHistory(saved);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("yt_history");
        setHistory([]);
    };

    if (history.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-5xl mb-4">📜</p>
                <p className="text-lg">No watch history yet</p>
                <p className="text-sm mt-1">Videos you watch will appear here</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">📜 Watch History</h2>
                <button
                    onClick={clearHistory}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                    Clear History
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {history.map((v) => (
                    <div
                        key={v.id + v.watchedAt}
                        className="flex flex-col gap-2 cursor-pointer group"
                        onClick={() => navigate(`/watch/${v.id}`)}
                    >
                        <div className="overflow-hidden rounded-xl relative">
                            <img
                                src={v.thumbnail}
                                alt={v.title}
                                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/90 rounded-full w-12 h-12 flex items-center justify-center text-xl">▶</div>
                            </div>
                        </div>
                        <div className="px-1">
                            <h3 className="text-sm font-semibold leading-snug line-clamp-2">{v.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">{v.channel}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{new Date(v.watchedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
