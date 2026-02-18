import { Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar";
import Feed from "./component/feed";
import SearchFeed from "./component/serachfeed";
import WatchPage from "./component/watchpage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/search/:searchTerm" element={<SearchFeed />} />
        <Route path="/watch/:videoId" element={<WatchPage />} />
      </Routes>
    </div>
  );
}