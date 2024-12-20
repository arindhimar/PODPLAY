import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRedo, FaRandom } from 'react-icons/fa';

const HorizontalMusicPlayer = ({
  currentTrack,
  onNext,
  onPrevious,
  isRepeat,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
  queue,
  audio_url,
  imageUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Automatically play new track when audio_url or currentTrack changes
  useEffect(() => {
    if (audio_url && audioRef.current) {
      audioRef.current.play(); // Auto play the new track
      setIsPlaying(true); // Set the state to playing
    }
  }, [audio_url, currentTrack]);

  // Update current time and total duration when the audio is playing
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Set up event listener for time updates
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
    }

    // Clean up the event listener
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  // Toggle play/pause functionality
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Seek to a specific time in the audio when clicking the progress bar
  const handleSeek = (e) => {
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Function to get the best image URL
  const getBestImage = (images) => {
    if (!imageUrl || imageUrl.length === 0) {
      return 'https://via.placeholder.com/48'; 
    }

    for (let i = imageUrl.length - 1; i >= 0; i--) {
      if (imageUrl[i]?.url) {
        return imageUrl[i].url; 
      }
    }

    return 'https://via.placeholder.com/48'; 
  };

  return (
    <motion.div
      className="w-full bg-gray-800 bg-opacity-75 p-4 rounded-xl backdrop-filter backdrop-blur-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        {/* Track Image */}
        <motion.div
          className="w-16 h-16 md:w-18 md:h-18 lg:w-24 lg:h-24 bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img
            src={getBestImage(currentTrack?.imageUrl)}
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

      {/* Audio Player */}
      {audio_url && (
        <audio ref={audioRef}  src={audio_url} loop={isRepeat}>
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Progress Bar */}
      <motion.div
        className="bg-gray-700 h-2 rounded-full overflow-hidden cursor-pointer"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={handleSeek} // Handle click to seek to a new position
      >
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </motion.div>

      {/* Current Time and Total Duration */}
      <div className="flex justify-between text-gray-300 text-sm mt-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </motion.div>
  );
};

// Helper function to format time as minutes:seconds
const formatTime = (time) => {
  if (isNaN(time)) return '00:00'; // Handle NaN (initial state)
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default HorizontalMusicPlayer;
