import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./component/navbar";
import Sidebar from "./component/sidebar";
import Feed from "./component/feed";
import SearchFeed from "./component/serachfeed";
import WatchPage from "./component/watchpage";
import CategoryFeed from "./component/categoryfeed";
import HistoryFeed from "./component/historyfeed";

export default function App() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith("/watch");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex">
        {!isWatchPage && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/search/:searchTerm" element={<SearchFeed />} />
            <Route path="/watch/:videoId" element={<WatchPage />} />
            <Route path="/trending" element={<CategoryFeed category="trending" />} />
            <Route path="/music" element={<CategoryFeed category="music" />} />
            <Route path="/gaming" element={<CategoryFeed category="gaming" />} />
            <Route path="/news" element={<CategoryFeed category="news" />} />
            <Route path="/shorts" element={<CategoryFeed category="shorts" />} />
            <Route path="/history" element={<HistoryFeed />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}