import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoCard from "./videocard";
import Shimmer from "./shimmer";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function SearchFeed() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm } = useParams();

    useEffect(() => {
        async function fetchSearchResults() {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&maxResults=20&type=video&key=${API_KEY}`
                );
                const data = await res.json();
                if (!data.items) throw new Error(data.error?.message || "No results");
                setVideos(
                    data.items.map((item) => ({
                        id: item.id.videoId,
                        title: item.snippet.title,
                        channel: item.snippet.channelTitle,
                        thumbnail: item.snippet.thumbnails.high.url,
                    }))
                );
            } catch (error) {
                console.error("Search API Error:", error);
            } finally {
                setLoading(false);
            }
        }

        if (searchTerm) fetchSearchResults();
    }, [searchTerm]);

    return (
        <div className="p-4">
            <h2 className="text-white text-xl font-bold mb-4">Results for "{searchTerm}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {loading
                    ? Array(12).fill(0).map((_, i) => <Shimmer key={i} />)
                    : videos.map((v) => <VideoCard key={v.id} video={v} />)
                }
            </div>
        </div>
    );
}
