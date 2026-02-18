# 📺 YouTube Clone

A responsive YouTube clone built with **React**, **Vite**, and **Tailwind CSS** that fetches and displays trending videos using the **YouTube Data API v3**.

![YouTube Clone](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-cyan?logo=tailwindcss)

---

## ✨ Features

- 🔥 **Trending Videos** — Fetches top trending videos from YouTube Data API v3
- ▶️ **In-app Playback** — Click any video to watch it in a modal player (autoplay)
- 💀 **Skeleton Loading** — Animated placeholder cards while videos load
- 📱 **Responsive Grid** — 1 to 4 columns depending on screen size
- 🎯 **Hover Effects** — Play button overlay appears on card hover
- ⌨️ **Keyboard Support** — Press `Escape` to close the video modal

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI components & state management |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| YouTube Data API v3 | Fetching trending video data |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ramsinghyadav4472/Youtube-Clone.git
cd Youtube-Clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Create a `.env` file in the root of the project:

```env
VITE_YOUTUBE_API_KEY=your_google_api_key_here
```

> **How to get a Google API key:**
>
> 1. Go to [Google Cloud Console](https://console.cloud.google.com)
> 2. Create a new project
> 3. Go to **APIs & Services** → **Enable APIs** → search **YouTube Data API v3** → Enable
> 4. Go to **Credentials** → **Create Credentials** → **API Key**
> 5. Copy the key into your `.env` file

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
Youtube-clone/
├── public/
├── src/
│   ├── App.jsx        # Main component (video grid + modal player)
│   ├── App.css        # Additional styles
│   ├── index.css      # Tailwind CSS import
│   └── main.jsx       # React entry point
├── .env               # API key (not committed)
├── .gitignore
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚠️ Notes

- The `.env` file is **not committed** to Git (it's in `.gitignore`) — never share your API key publicly
- The YouTube Data API v3 has a **daily quota limit** of 10,000 units on the free tier
- If you see a `403` error, make sure the **YouTube Data API v3** is enabled in your Google Cloud project

---

## 📄 License

MIT
