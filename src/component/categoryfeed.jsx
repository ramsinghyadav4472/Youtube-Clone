import { useState, useEffect, useRef, useCallback } from "react";
import VideoCard from "./videocard";
import Shimmer from "./shimmer";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const CATEGORY_IDS = {
    music: "10",
    gaming: "20",
    news: "25",
    trending: "",
    shorts: "",
};

export default function CategoryFeed({ category }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const isFetching = useRef(false);

    const fetchVideos = useCallback(async (pageToken = "") => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
            let url;

            if (category === "shorts") {

                url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=shorts&type=video&videoDuration=short&maxResults=12${tokenParam}&key=${API_KEY}`;
            } else {
                const categoryParam = CATEGORY_IDS[category] ? `&videoCategoryId=${CATEGORY_IDS[category]}` : "";
                url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12${categoryParam}${tokenParam}&key=${API_KEY}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            if (!data.items) throw new Error(data.error?.message || "No videos returned");

            const mapped = data.items.map((v) => ({
                id: category === "shorts" ? v.id.videoId : v.id,
                title: v.snippet.title,
                channel: v.snippet.channelTitle,
                thumbnail: v.snippet.thumbnails.high.url,
            }));

            setVideos((prev) => [...prev, ...mapped]);
            setNextPageToken(data.nextPageToken || null);
            setHasMore(!!data.nextPageToken);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [category]);

    useEffect(() => {
        setVideos([]);
        setNextPageToken(null);
        setHasMore(true);
        isFetching.current = false;
        fetchVideos();
    }, [category]);


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

    const categoryTitles = {
        trending: "🔥 Trending",
        music: "🎵 Music",
        gaming: "🎮 Gaming",
        news: "📰 News",
        shorts: "🎬 Shorts",
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{categoryTitles[category] || category}</h2>

            {error && (
                <p className="text-red-400 bg-red-900/20 border border-red-700 rounded-lg px-4 py-3 mb-4">
                    ❌ {error}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((v) => <VideoCard key={v.id} video={v} />)}
                {loading && Array(4).fill(0).map((_, i) => <Shimmer key={`shimmer-${i}`} />)}
            </div>

            <div ref={loaderRef} className="h-10 mt-4" />

            {!hasMore && !loading && videos.length > 0 && (
                <p className="text-center text-gray-500 text-sm py-6">You've reached the end</p>
            )}
        </div>
    );
}
