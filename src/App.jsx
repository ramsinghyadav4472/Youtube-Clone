import { useState, useEffect } from 'react'

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse" />
      <div className="flex flex-col gap-2 px-1">
        <div className="h-3.5 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-3.5 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
      </div>
    </div>
  )
}

function VideoModal({ video, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-black rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Video Player */}
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
        {/* Info */}
        <div className="p-4 text-white">
          <h2 className="text-base font-semibold leading-snug">{video.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{video.channel}</p>
        </div>
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black rounded-full w-9 h-9 flex items-center justify-center text-lg"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
        )
        const data = await response.json()
        if (!data.items) throw new Error(data.error?.message || 'No videos returned')
        setVideos(data.items.map(video => ({
          id: video.id,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.high.url,
        })))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <span className="text-red-600 font-bold text-xl tracking-tight">YouTube</span>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">🔥 Trending Videos</h1>

        {error && (
          <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : videos.map(video => (
              <div
                key={video.id}
                className="flex flex-col gap-2 cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="overflow-hidden rounded-xl relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full w-12 h-12 flex items-center justify-center text-xl">
                      ▶
                    </div>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{video.channel}</p>
                </div>
              </div>
            ))
          }
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  )
}