import React from 'react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/scrollbar';

const RecommendationsBar = ({ suggestions, onTrackSelect, currentTrack }) => {
  // Function to get the best image URL
  const getBestImage = (images) => {
    if (!images || images.length === 0) {
      return 'https://via.placeholder.com/48';
    }

    for (let i = images.length - 1; i >= 0; i--) {
      if (images[i]?.url) {
        return images[i].url;
      }
    }

    return 'https://via.placeholder.com/48';
  };

  return (
    <motion.div 
      className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg h-[600px] w-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-6 text-blue-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Recommendations
      </motion.h2>
      <div className="overflow-y-auto h-[calc(100%-3rem)] pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {suggestions.map((suggestion) => (
            <motion.div 
              key={suggestion.id}
              className={`bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-opacity-75 transition-all duration-200 ${currentTrack?.id === suggestion.id ? 'bg-blue-600' : ''}`}  
              onClick={() => onTrackSelect(suggestion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
                <img 
                  src={getBestImage(suggestion.image)}
                  alt={suggestion.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-semibold text-lg truncate">{suggestion.title}</h3>
              <p className="text-sm text-gray-300 truncate">{suggestion.artist}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationsBar;

