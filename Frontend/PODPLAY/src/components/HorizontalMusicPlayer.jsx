import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, Heart, Repeat, Shuffle } from 'lucide-react';
import axios from "axios";

const TrackInfo = ({ track }) => (
  <div className="track-info-container">
    <img src={track.image.replace("50x50","250x250")} alt={`${track.title} cover`} className="cover-art" />
    <div className="track-info">
      <h2 className="track-title">{track.title}</h2>
      <p className="track-artist">{track.artist}</p>
    </div>
  </div>
);

const PlaybackControls = ({ isPlaying, onTogglePlay, onSkipBack, onSkipForward }) => (
  <div className="controls">
    <Button variant="ghost" size="icon" className="control-btn" onClick={onSkipBack}>
      <SkipBack className="h-4 w-4" />
    </Button>
    <Button onClick={onTogglePlay} size="icon" className="control-btn play-pause">
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
    <Button variant="ghost" size="icon" className="control-btn" onClick={onSkipForward}>
      <SkipForward className="h-4 w-4" />
    </Button>
  </div>
);

const ProgressBar = ({ currentTime, duration, onProgressChange }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="progress-container">
      <Slider
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={(value) => onProgressChange(value[0])}
        className="progress-slider"
      />
      <div className="time-display">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }) => (
  <div className="volume-control">
    <Button variant="ghost" size="icon" onClick={onToggleMute} className="volume-btn">
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
    <Slider
      value={[volume]}
      max={1}
      step={0.01}
      className="volume-slider"
      onValueChange={(value) => onVolumeChange(value[0])}
    />
  </div>
);

const ExtraControls = ({ onShuffle }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    onShuffle(!isShuffled);
  };

  return (
    <div className="extra-controls">
      <Button variant="ghost" size="icon" onClick={toggleLike} className="control-btn">
        <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleRepeat} className="control-btn">
        <Repeat className={`h-4 w-4 ${isRepeat ? 'text-blue-500' : 'text-gray-500'}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleShuffle} className="control-btn">
        <Shuffle className={`h-4 w-4 ${isShuffled ? 'text-green-500' : 'text-gray-500'}`} />
      </Button>
    </div>
  );
};

const HorizontalMusicPlayer = ({ currentTrack, onSkipBack, onSkipForward, onShuffle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // State for checking if the music is loaded
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentTrack) {
      setIsPlaying(true);
      setCurrentTime(0);
      setIsLoaded(false); // Reset isLoaded when a new track is selected
      audioRef.current?.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressChange = (newTime) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleCanPlay = async () => {
    setIsLoaded(true); 
    console.log("Herhkahdjh");
    try {
      const response = await axios.get("http://127.0.0.1:5000/songs/suggestions", {
        params: { 
          song_id: currentTrack.id, 
        },
      });
      console.log(response.data);
  
      // if (onSearch) {
      //   // onSearch(response.data);
      // }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  

  if (!currentTrack) {
    return <div className="horizontal-music-player">No track selected</div>;
  }

  return (
    <div className="horizontal-music-player">
      <div className="player-content">
        <TrackInfo track={currentTrack} />
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onSkipBack={onSkipBack}
          onSkipForward={onSkipForward}
        />
        <ProgressBar
          currentTime={currentTime}
          duration={currentTrack.duration}
          onProgressChange={handleProgressChange}
        />
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
        />
        <ExtraControls onShuffle={onShuffle} />
      </div>
      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay} // Event to know when the music is ready
      />
      {!isLoaded && <div>Loading...</div>} {/* Show a loading message until music is loaded */}
    </div>
  );
};

export default HorizontalMusicPlayer;
