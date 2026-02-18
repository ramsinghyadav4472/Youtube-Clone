export default function Pagination({ onPrev, onNext, hasPrev, hasNext, loading }) {
    return (
        <div className="flex justify-center items-center gap-4 py-8">
            <button
                onClick={onPrev}
                disabled={!hasPrev || loading}
                className="px-6 py-2 rounded-full bg-gray-700 text-white font-medium text-sm
          hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                ← Previous
            </button>
            <button
                onClick={onNext}
                disabled={!hasNext || loading}
                className="px-6 py-2 rounded-full bg-red-600 text-white font-medium text-sm
          hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                Next →
            </button>
        </div>
    )
}
