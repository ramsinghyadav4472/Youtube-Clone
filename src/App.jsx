import { useState, useEffect, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

function SkeletonCard({ dark }) {
  const bg = dark ? 'bg-gray-700' : 'bg-gray-200'
  return (
    <div className="flex flex-col gap-3">
      <div className={`w-full aspect-video ${bg} rounded-xl animate-pulse`} />
      <div className="flex flex-col gap-2 px-1">
        <div className={`h-3.5 ${bg} rounded animate-pulse w-full`} />
        <div className={`h-3.5 ${bg} rounded animate-pulse w-2/3`} />
        <div className={`h-3 ${bg} rounded animate-pulse w-1/3`} />
      </div>
    </div>
  )
}

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-black rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="p-4 text-white">
          <h2 className="text-base font-semibold leading-snug">{video.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{video.channel}</p>
        </div>
        <button
          className="absolute top-3 right-3 text-white bg-black/60 hover:bg-black rounded-full w-9 h-9 flex items-center justify-center text-lg"
          onClick={onClose}
        >✕</button>
      </div>
    </div>
  )
}

export default function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [dark, setDark] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let url
      if (searchQuery.trim()) {
        // Search API
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=12&key=${API_KEY}`
        )
        const searchData = await searchRes.json()
        if (!searchData.items) throw new Error(searchData.error?.message || 'No results found')
        setVideos(searchData.items.map(v => ({
          id: v.id.videoId,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          thumbnail: v.snippet.thumbnails.high.url,
        })))
      } else {
        // Trending API
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=12&key=${API_KEY}`
        )
        const data = await res.json()
        if (!data.items) throw new Error(data.error?.message || 'No videos returned')
        setVideos(data.items.map(v => ({
          id: v.id,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          thumbnail: v.snippet.thumbnails.high.url,
        })))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => { fetchVideos() }, [fetchVideos])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput.trim())
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchQuery('')
  }

  // dark mode classes
  const bg = dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  const headerBg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
  const inputBg = dark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>

      {/* Header */}
      <header className={`sticky top-0 z-10 border-b ${headerBg} px-6 py-3 flex items-center gap-4`}>
        {/* Logo */}
        <button onClick={clearSearch} className="text-red-600 font-bold text-xl tracking-tight shrink-0">
          ▶ YouTube
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-auto gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search videos..."
            className={`flex-1 px-4 py-2 rounded-full border text-sm outline-none focus:ring-2 focus:ring-red-400 ${inputBg}`}
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(d => !d)}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          title="Toggle dark mode"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">
          {searchQuery ? `Results for "${searchQuery}"` : '🔥 Trending Videos'}
        </h1>

        {error && (
          <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            ❌ {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} dark={dark} />)
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
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full w-12 h-12 flex items-center justify-center text-xl">▶</div>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2">{video.title}</h3>
                  <p className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{video.channel}</p>
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