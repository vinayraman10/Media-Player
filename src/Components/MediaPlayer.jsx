import { useState, useRef } from "react";
import YouTube from "react-youtube";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

/* --- 10‑song playlist (replace videoId values with your own YouTube IDs) --- */
const songs = [
{
  title: "Heeriye",
  artist: "Jasleen Royal ft. Arijit Singh",
  videoId: "ObiCEWmYH5Y",
  thumb: "https://i.ytimg.com/vi/ObiCEWmYH5Y/hqdefault.jpg"
},

  {
    title: "Kesariya",
    artist: "Arijit Singh",
    videoId: "BddP6PYo2gs",
    thumb: "https://i.ytimg.com/vi/BddP6PYo2gs/hqdefault.jpg",
  },
{
  title: "Apna Bana Le",
  artist: "Arijit Singh",
  videoId: "u2NAuswnTKs",
  thumb: "https://i.ytimg.com/vi/u2NAuswnTKs/hqdefault.jpg"
},

  {
  title: "Tera Ban Jaunga",
  artist: "Akhil Sachdeva & Tulsi Kumar",
  videoId: "gExKe-6Nt8U",
  thumb: "https://i.ytimg.com/vi/gExKe-6Nt8U/hqdefault.jpg"
},

  {
    title: "Raatan Lambiyan",
    artist: "Jubin Nautiyal & Asees Kaur",
    videoId: "gvyUuxdRdR4",
    thumb: "https://i.ytimg.com/vi/gvyUuxdRdR4/hqdefault.jpg",
  },
  {
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    videoId: "Umqb9KENgmk",
    thumb: "https://i.ytimg.com/vi/Umqb9KENgmk/hqdefault.jpg",
  },
{
  title: "Bekhayali",
  artist: "Sachet Tandon",
  videoId: "HTQ2pSM49dc",
  thumb: "https://i.ytimg.com/vi/HTQ2pSM49dc/hqdefault.jpg"
}

];

export default function MediaPlayer() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);

  const ytPlayer = useRef(null);
  const timer = useRef(null);

  /* -------------- helpers -------------- */
  const fmt = (sec) =>
    isNaN(sec) ? "0:00" : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  const loadSong = (i) => {
    clearInterval(timer.current);
    setIndex(i);
    setIsBuffering(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const next = () => loadSong((index + 1) % songs.length);
  const prev = () => loadSong((index - 1 + songs.length) % songs.length);

  /* -------------- YouTube callbacks -------------- */
  const onReady = (e) => {
    ytPlayer.current = e.target;
    ytPlayer.current.setVolume(volume);
  };

  const onStateChange = (e) => {
    const YT = window.YT?.PlayerState;
    if (!YT) return;
    switch (e.data) {
      case YT.PLAYING:
        setIsBuffering(false);
        setIsPlaying(true);
        setDuration(ytPlayer.current.getDuration());
        /* start timer to update progress every second */
        clearInterval(timer.current);
        timer.current = setInterval(() => {
          setCurrentTime(ytPlayer.current.getCurrentTime());
        }, 1000);
        break;
      case YT.PAUSED:
        setIsPlaying(false);
        clearInterval(timer.current);
        break;
      case YT.ENDED:
        next();
        break;
      default:
        break;
    }
  };

  const togglePlay = () => {
    if (isPlaying) ytPlayer.current.pauseVideo();
    else {
      setIsBuffering(true);
      ytPlayer.current.playVideo();
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    ytPlayer.current.seekTo(percent * duration, true);
    setCurrentTime(percent * duration);
  };

  const handleVolume = (v) => {
    setVolume(v);
    ytPlayer.current?.setVolume(v);
  };

  /* -------------- render -------------- */
  const song = songs[index];
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 text-white rounded-2xl p-6 shadow-xl">
      {/* hidden YouTube player */}
      <YouTube
        videoId={song.videoId}
        opts={{ playerVars: { autoplay: 0, controls: 0 } }}
        onReady={onReady}
        onStateChange={onStateChange}
        className="hidden"
      />

      {/* Song info */}
      <div className="flex items-center gap-4">
        <img src={song.thumb} alt={song.title} className="w-20 h-20 rounded-xl object-cover" />
        <div>
          <h3 className="text-lg font-semibold">{song.title}</h3>
          <p className="text-sm text-gray-400">{song.artist}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 select-none">
        <div
          className="w-full h-2 bg-gray-600 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <FaBackward
          className="text-xl hover:text-orange-400 cursor-pointer"
          onClick={prev}
        />

        <button
          onClick={togglePlay}
          className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600"
        >
          {isBuffering ? (
            <ImSpinner2 className="text-2xl animate-spin" />
          ) : isPlaying ? (
            <FaPause className="text-2xl" />
          ) : (
            <FaPlay className="text-2xl pl-1" />
          )}
        </button>

        <FaForward
          className="text-xl hover:text-orange-400 cursor-pointer"
          onClick={next}
        />
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mt-6">
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          className="w-full accent-orange-500"
          onChange={(e) => handleVolume(e.target.value)}
        />
      </div>
    </div>
  );
}
