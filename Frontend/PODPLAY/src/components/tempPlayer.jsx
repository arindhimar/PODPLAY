import React, { useState, useEffect, useRef } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({ card }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [trackDuration, setTrackDuration] = useState("0:00");

  const audioRef = useRef(new Audio(card?.src || ""));
  
  useEffect(() => {
    if (card) {
      const audio = audioRef.current;

      const updateTime = () => {
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        setCurrentTime(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
      };

      const setDuration = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        setTrackDuration(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", setDuration);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", setDuration);
      };
    }
  }, [card]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (direction) => {
    const nextTrack =
      (currentTrack + direction + tracks.length) % tracks.length;
    setCurrentTrack(nextTrack);
    const audio = audioRef.current;
    audio.src = tracks[nextTrack].src;
    audio.play();
    setIsPlaying(true);
  };

  return (
    <div className="music-container">
      <div id="volume">
        <button id="muteBtn">
          <i className="fas fa-volume-up"></i>
        </button>
        <div id="volume-bar">
          <input
            type="range"
            id="volumeSlider"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onChange={(e) =>
              (audioRef.current.volume = parseFloat(e.target.value))
            }
          />
        </div>
      </div>
      <img id="albumArt" src={card?.albumArt || ""} alt="Album Art" />
      <div id="fade"></div>
      <div id="uiWrap">
        <div className="audio-info">
          <div className="track-info">
            <div id="trackTitle">{card?.trackTitle || "Track Title"}</div>
            <div id="bandName">{card?.bandName || "Band Name"}</div>
            <button id="likeBtn">
              <i className="far fa-heart"></i>
            </button>
          </div>
          <div className="seek-bar">
            <input
              type="range"
              id="seekSlider"
              min="0"
              step="1"
              value={audioRef.current.currentTime}
              max={audioRef.current.duration || 0}
              onChange={(e) =>
                (audioRef.current.currentTime = parseFloat(e.target.value))
              }
            />
            <div id="currentTime">{currentTime}</div>
            <div id="trackTime">{trackDuration}</div>
          </div>
        </div>
        <div className="audio-controls">
          <div className="playSkip">
            <button id="prevBtn" onClick={() => changeTrack(-1)}>
              <i className="fas fa-step-backward"></i>
            </button>
            <button id="playPauseBtn" onClick={togglePlayPause}>
              <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
            </button>
            <button id="nextBtn" onClick={() => changeTrack(1)}>
              <i className="fas fa-step-forward"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
