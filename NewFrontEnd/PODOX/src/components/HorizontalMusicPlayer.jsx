import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRedo, FaRandom, FaVolumeUp, FaVolumeMute, FaHeart, FaEllipsisH, FaDownload } from 'react-icons/fa';
import { ref, set } from 'firebase/database';
import { database, serverTimestamp } from '../firebase';

const HorizontalMusicPlayer = ({
  currentTrack,
  onNext,
  onPrevious,
  isRepeat,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
  queue,
  onPlayPause,
  onSeek,
  roomCode,
  controls,
  userCount
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (currentTrack?.audio_url) {
      audioRef.current.src = currentTrack.audio_url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Playback failed", error));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, []);

  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleTrackEnd = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      onNext();
    }
  };

  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    if (newIsPlaying) {
      audioRef.current.play().catch(error => console.error("Playback failed", error));
    } else {
      audioRef.current.pause();
    }
    onPlayPause(newIsPlaying);

    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`);
      set(roomRef, {
        currentTrack,
        controls: {
          ...controls,
          isPlaying: newIsPlaying,
          currentTime: audioRef.current.currentTime,
          lastUpdated: serverTimestamp()
        },
        users: userCount
      });
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onSeek(newTime);
    
    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}`);
      set(roomRef, {
        currentTrack,
        controls: {
          ...controls,
          currentTime: newTime,
          lastUpdated: serverTimestamp()
        },
        users: userCount
      });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);

    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}/controls`);
      set(roomRef, { ...controls, volume: newVolume });
    }
  };

  const toggleMute = () => {
    const newIsMuted = !isMuted;
    setIsMuted(newIsMuted);
    audioRef.current.volume = newIsMuted ? 0 : volume;

    if (roomCode) {
      const roomRef = ref(database, `rooms/${roomCode}/controls`);
      set(roomRef, { ...controls, volume: newIsMuted ? 0 : volume });
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDownload = () => {
    // Implement download functionality here
    console.log('Downloading track...');
  };

  const getBestImage = (images) => {
    if (!currentTrack?.image || currentTrack.image.length === 0) {
      return 'https://via.placeholder.com/48'; 
    }

    for (let i = currentTrack.image.length - 1; i >= 0; i--) {
      if (currentTrack.image[i]?.url) {
        return currentTrack.image[i].url; 
      }
    }

    return 'https://via.placeholder.com/48'; 
  };

  useEffect(() => {
    if (controls) {
      setIsPlaying(controls.isPlaying);
      setCurrentTime(controls.currentTime);
      setVolume(controls.volume);
      setIsMuted(controls.volume === 0);
      
      if (audioRef.current) {
        audioRef.current.currentTime = controls.currentTime;
        audioRef.current.volume = controls.volume;
        if (controls.isPlaying) {
          audioRef.current.play().catch(error => console.error("Playback failed", error));
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [controls]);

  return (
    <motion.div
      className="w-full bg-gray-800 bg-opacity-75 p-4 rounded-xl backdrop-filter backdrop-blur-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <motion.div
          className="w-16 h-16 md:w-18 md:h-18 lg:w-24 lg:h-24 bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img
            src={getBestImage(currentTrack?.image)}
            alt="Track Image"
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.div
          className="text-center md:text-left mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-blue-300">{currentTrack?.title || 'No track selected'}</h2>
          <p className="text-sm md:text-base text-gray-300">{currentTrack?.artist || 'Unknown artist'}</p>
        </motion.div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleRepeat}
            className={`text-white hover:text-blue-400 transition-colors ${isRepeat ? 'opacity-100' : 'opacity-50'}`}
          >
            <FaRedo size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrevious}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <FaStepBackward size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayPause}
            className="text-white bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <FaStepForward size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleShuffle}
            className={`text-white hover:text-blue-400 transition-colors ${isShuffle ? 'opacity-100' : 'opacity-50'}`}
          >
            <FaRandom size={20} />
          </motion.button>
        </div>
      </div>

      <motion.div
        className="bg-gray-700 h-2 rounded-full overflow-hidden cursor-pointer"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={handleSeek}
      >
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </motion.div>

      <div className="flex justify-between text-gray-300 text-sm mt-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </motion.button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 accent-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleLike}
            className={`text-white hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}
          >
            <FaHeart size={20} />
          </motion.button>
          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <FaEllipsisH size={20} />
            </motion.button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10"
                >
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-500 hover:text-white"
                    onClick={handleDownload}
                  >
                    <FaDownload className="inline mr-2" /> Download
                  </motion.button>
                  {/* Add more menu items here */}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const formatTime = (time) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default HorizontalMusicPlayer;

