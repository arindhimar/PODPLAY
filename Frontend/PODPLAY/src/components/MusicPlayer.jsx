import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const currentTrack = {
    title: "Neon Lights",
    artist: "The Midnight",
    duration: 237, // 3:57 in seconds
    cover: "/placeholder.svg?height=300&width=300"
  };

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

  const handleVolumeChange = (newVolume) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player gradient-background">
      <div className="glass-effect">
        <div className="w-full max-w-md mx-auto p-6 rounded-xl shadow-lg" style={{
          background: 'linear-gradient(135deg, #4A0E4E, #170B1B)',
        }}>
          <div className="mb-4">
            <img src={currentTrack.cover} alt={`${currentTrack.title} cover`} className="w-full h-64 object-cover rounded-lg shadow-md" />
          </div>
          <div className="text-white mb-4">
            <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
            <p className="text-sm opacity-75">{currentTrack.artist}</p>
          </div>
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={currentTrack.duration}
              step={1}
              className="w-full"
              onValueChange={(value) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = value[0];
                }
              }}
            />
            <div className="flex justify-between text-xs text-white opacity-75 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Button variant="ghost" size="icon" className="text-white hover:text-orange-400 transition-colors">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button onClick={togglePlay} size="icon" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-orange-400 transition-colors">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:text-orange-400 transition-colors">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              className="w-full"
              onValueChange={handleVolumeChange}
            />
          </div>
          <audio
            ref={audioRef}
            src="/path-to-your-audio-file.mp3"
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

