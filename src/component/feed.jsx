import { useState, useEffect, useCallback } from "react";
import VideoCard from "./videocard";
import Shimmer from "./shimmer";
import Pagination from "./pagination";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function Feed() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [pageHistory, setPageHistory] = useState([]); // stack of previous page tokens

    const fetchVideos = useCallback(async (pageToken = "") => {
        setLoading(true);
        setError(null);
        try {
            const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12${tokenParam}&key=${API_KEY}`
            );
            const data = await res.json();
            if (!data.items) throw new Error(data.error?.message || "No videos returned");

            setVideos(
                data.items.map((v) => ({
                    id: v.id,
                    title: v.snippet.title,
                    channel: v.snippet.channelTitle,
                    thumbnail: v.snippet.thumbnails.high.url,
                }))
            );
            setNextPageToken(data.nextPageToken || null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            // Scroll to top on page change
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleNext = () => {
        if (!nextPageToken) return;
        // Save current page token to history for going back
        setPageHistory((prev) => [...prev, pageHistory.length === 0 ? "" : nextPageToken]);
        fetchVideos(nextPageToken);
    };

    const handlePrev = () => {
        if (pageHistory.length === 0) return;
        const newHistory = [...pageHistory];
        const prevToken = newHistory.pop();
        setPageHistory(newHistory);
        fetchVideos(prevToken);
    };

    if (error) return (
        <p className="text-red-400 bg-red-900/20 border border-red-700 rounded-lg px-4 py-3 m-4">
            ❌ {error}
        </p>
    );

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {loading
                    ? Array(12).fill(0).map((_, i) => <Shimmer key={i} />)
                    : videos.map((v) => <VideoCard key={v.id} video={v} />)
                }
            </div>

            <Pagination
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={!!nextPageToken}
                hasPrev={pageHistory.length > 0}
                loading={loading}
            />
        </div>
    );
}
