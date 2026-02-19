import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "🎬", label: "Shorts", path: "/shorts" },
    { icon: "📜", label: "History", path: "/history" },
    { icon: "🔥", label: "Trending", path: "/trending" },
    { icon: "🎵", label: "Music", path: "/music" },
    { icon: "🎮", label: "Gaming", path: "/gaming" },
    { icon: "📰", label: "News", path: "/news" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);

    const handleClick = (path) => {
        setActive(path);
        navigate(path);
    };

    return (
        <aside className="w-20 md:w-56 shrink-0 bg-gray-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto pt-4">
            <ul className="flex flex-col gap-1 px-2">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <button
                            onClick={() => handleClick(item.path)}
                            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${active === item.path
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="hidden md:block">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>


        </aside>
    );
}
