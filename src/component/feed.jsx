import { useState, useEffect, useRef, useCallback } from "react";
import VideoCard from "./videocard";
import Shimmer from "./shimmer";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function Feed() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const isFetching = useRef(false); // prevent double-fetch

    const fetchVideos = useCallback(async (pageToken = "") => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12${tokenParam}&key=${API_KEY}`
            );
            const data = await res.json();
            if (!data.items) throw new Error(data.error?.message || "No videos returned");

            setVideos((prev) => [
                ...prev,
                ...data.items.map((v) => ({
                    id: v.id,
                    title: v.snippet.title,
                    channel: v.snippet.channelTitle,
                    thumbnail: v.snippet.thumbnails.high.url,
                })),
            ]);
            setNextPageToken(data.nextPageToken || null);
            setHasMore(!!data.nextPageToken);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    // Watch sentinel div — load more when it enters viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching.current && nextPageToken) {
                    fetchVideos(nextPageToken);
                }
            },
            { threshold: 0.1 }
        );
        const el = loaderRef.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [hasMore, nextPageToken, fetchVideos]);

    return (
        <div className="p-4">
            {error && (
                <p className="text-red-400 bg-red-900/20 border border-red-700 rounded-lg px-4 py-3 mb-4">
                    ❌ {error}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((v) => <VideoCard key={v.id} video={v} />)}
                {loading && Array(4).fill(0).map((_, i) => <Shimmer key={`shimmer-${i}`} />)}
            </div>

            {/* Sentinel — triggers next fetch when scrolled into view */}
            <div ref={loaderRef} className="h-10 mt-4" />

            {!hasMore && !loading && videos.length > 0 && (
                <p className="text-center text-gray-500 text-sm py-6">You've reached the end</p>
            )}
        </div>
    );
}
