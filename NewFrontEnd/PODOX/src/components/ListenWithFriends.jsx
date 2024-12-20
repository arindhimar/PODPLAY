import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';

const ListenWithFriends = ({
  currentTrack,
  isPlaying,
  onTrackChange,
  onPlayPause,
  onSeek,
}) => {
  return (
    <motion.div 
      className="w-full bg-gray-800 bg-opacity-75 p-4 rounded-xl backdrop-filter backdrop-blur-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <motion.h2 
          className="text-xl md:text-2xl font-bold text-blue-300 mb-2 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Listen with Friends
        </motion.h2>
        <motion.button 
          className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUsers className="mr-2" />
          Invite Friends
        </motion.button>
      </div>
      <motion.div 
        className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center">
          <FaUsers size={32} className="text-blue-300" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg md:text-xl">{currentTrack?.title || 'No track playing'}</h3>
          <p className="text-sm text-gray-300">{currentTrack?.artist || 'Unknown artist'}</p>
        </div>
      </motion.div>
      <motion.div 
        className="mt-4 bg-gray-700 h-2 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div 
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '50%' }}
          transition={{ delay: 1, duration: 1 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ListenWithFriends;

