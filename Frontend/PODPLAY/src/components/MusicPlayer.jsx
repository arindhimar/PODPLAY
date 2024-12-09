import React, { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css"; // Ensure your styles are in App.css

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio());
  const [trackInfo, setTrackInfo] = useState({
    trackTitle: "Track 1",
    bandName: "Band 1",
    duration: "3:09",
    albumArt: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
  });

  const tracks = [
    {
      src: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3",
      albumArt: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
      trackTitle: "Track 1",
      bandName: "Band 1",
      duration: "3:09",
    },
    {
      src: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3",
      albumArt: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
      trackTitle: "Track 2",
      bandName: "Band 2",
      duration: "5:29",
    },
    {
      src: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/3.mp3",
      albumArt: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg",
      trackTitle: "Track 3",
      bandName: "Band 3",
      duration: "4:10",
    },
  ];

  useEffect(() => {
    // Set the current track info when the track changes
    const currentTrack = tracks[currentTrackIndex];
    setTrackInfo(currentTrack);
    audioRef.current.src = currentTrack.src;
  }, [currentTrackIndex]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  const handleSeekChange = (e) => {
    setSeekPosition(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  useEffect(() => {
    // Sync the current time with the seek position
    const interval = setInterval(() => {
      setSeekPosition(audioRef.current.currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="music-controller">
      <div id="volume">
        <button id="muteBtn" onClick={toggleMute}>
          <i className={isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
        </button>
        <div id="volume-bar">
          <input
            type="range"
            id="volumeSlider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
          <div id="volumeIndicator" className="volume-indicator"></div>
        </div>
      </div>
      <div id="fade"></div>
      <div id="uiWrap">
        <div className="audio-info">
          <div className="track-info">
            <div id="trackTitle">{trackInfo.trackTitle}</div>
            <div id="bandName">{trackInfo.bandName}</div>
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
              value={seekPosition}
              onChange={handleSeekChange}
            />
            <div id="bufferingIndicator" className="buffering-indicator"></div>
            <div id="seekIndicator" className="seek-indicator"></div>
            <div id="currentTime">{Math.floor(seekPosition / 60)}:{Math.floor(seekPosition % 60)}</div>
            <div id="trackTime">{trackInfo.duration}</div>
          </div>
        </div>
        <div className="audio-controls">
          <div className="playSkip">
            <button id="loopBtn">
              <i className="fas fa-redo"></i>
            </button>
            <button id="prevBtn" onClick={handlePrevTrack}>
              <i className="fas fa-step-backward"></i>
            </button>
            <button id="playPauseBtn" onClick={togglePlayPause}>
              <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
            </button>
            <button id="nextBtn" onClick={handleNextTrack}>
              <i className="fas fa-step-forward"></i>
            </button>
            <button id="shuffleBtn">
              <i className="fas fa-random"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
