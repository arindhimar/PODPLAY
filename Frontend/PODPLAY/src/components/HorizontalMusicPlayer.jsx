import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, List } from 'lucide-react';
import './HorizontalMusicPlayer.css'

const HorizontalMusicPlayer = ({ 
  currentTrack, 
  onNext, 
  onPrevious, 
  isRepeat, 
  isShuffle, 
  onToggleRepeat, 
  onToggleShuffle,
  queue
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (currentTrack) {
      setIsPlaying(true);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.play();
      }
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
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
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

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      onNext();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleQueueVisibility = () => {
    setIsQueueVisible(!isQueueVisible);
  };

  if (!currentTrack) {
    return <div className="horizontal-music-player">No track selected</div>;
  }

  return (
    <div className="horizontal-music-player">
      <div className="player-content">
        <img src={currentTrack.image[1].url} alt={`${currentTrack.title} cover`} className="cover-art" />
        <div className="track-info">
          <h2 className="track-title">{currentTrack.title}</h2>
          <p className="track-artist">{currentTrack.artist}</p>
        </div>
        <div className="player-controls">
          <div className="main-controls">
            <Button variant="ghost" size="icon" className="control-btn" onClick={onPrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button onClick={togglePlay} size="icon" className="control-btn play-pause">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" className="control-btn" onClick={onNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="secondary-controls">
            <Button variant="ghost" size="icon" className={`control-btn ${isRepeat ? 'active' : ''}`} onClick={onToggleRepeat}>
              <Repeat className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className={`control-btn ${isShuffle ? 'active' : ''}`} onClick={onToggleShuffle}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className={`control-btn ${isQueueVisible ? 'active' : ''}`} onClick={toggleQueueVisibility}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="progress-container">
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={1}
            onValueChange={handleProgressChange}
            className="progress-slider"
          />
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="volume-control">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="volume-btn">
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            className="volume-slider"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
      {isQueueVisible && (
        <div className="queue-display">
          <h3>Queue</h3>
          <ul>
            {queue.map((track, index) => (
              <li key={track.id} className={index === 0 ? 'current-track' : ''}>
                {track.title} - {track.artist}
              </li>
            ))}
          </ul>
        </div>
      )}
      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
};

export default HorizontalMusicPlayer;

