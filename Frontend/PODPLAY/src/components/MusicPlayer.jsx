import React, { useState, useEffect, useRef } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({ card }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [trackDuration, setTrackDuration] = useState("0:00");
  const [repeatMode, setRepeatMode] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (card && audioRef.current) {
      const newSrc = card.audio_url.replace(/_12(?=\.\w+$)/, "_320");
      if (audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [card]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (repeatMode) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    setRepeatMode(!repeatMode);
    audioRef.current.loop = !repeatMode;
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
            onChange={(e) => (audioRef.current.volume = parseFloat(e.target.value))}
          />
          <div id="volumeIndicator" className="volume-indicator"></div>
        </div>
      </div>
      {card && (
        <>
          <div className="music-info">
            <img id="albumArt" src={card.image.replace("50x50","500x500")} alt="Album Art" />
            <div className="track-details">
              <div id="trackTitle">{card.title}</div>
              <div id="bandName">{card.artist}</div>
            </div>
          </div>
          <div className="music-controls">
            <div className="seek-bar">
              <input
                type="range"
                id="seekSlider"
                min="0"
                step="1"
                value={audioRef.current ? audioRef.current.currentTime : 0}
                max={audioRef.current ? audioRef.current.duration || 0 : 0}
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = parseFloat(e.target.value);
                  }
                }}
              />
              <div id="bufferingIndicator" className="buffering-indicator"></div>
              <div id="seekIndicator" className="seek-indicator"></div>
              <div id="currentTime">{currentTime}</div>
              <div id="trackTime">{trackDuration}</div>
            </div>
            <div className="playback-controls">
              <button id="loopBtn" onClick={toggleRepeat}>
                <i className={`fas fa-redo ${repeatMode ? 'active' : ''}`}></i>
              </button>
              <button id="prevBtn" disabled>
                <i className="fas fa-step-backward"></i>
              </button>
              <button id="playPauseBtn" onClick={togglePlayPause}>
                <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
              </button>
              <button id="nextBtn" disabled>
                <i className="fas fa-step-forward"></i>
              </button>
              <button id="shuffleBtn">
                <i className="fas fa-random"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

};

export default MusicPlayer;

