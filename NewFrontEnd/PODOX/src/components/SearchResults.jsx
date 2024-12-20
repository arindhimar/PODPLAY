import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = ({ results, onCardClick }) => {
  const [searchText, setSearchText] = useState('');



  const filteredResults = results.filter((result) =>
    result.title.toLowerCase().includes(searchText.toLowerCase()) ||
    result.artist.toLowerCase().includes(searchText.toLowerCase())
  );

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
    <div className="relative">
      {/* Search Results */}
      <motion.div 
        className="absolute top-0 left-0 w-full bg-gray-800 bg-opacity-75 rounded-xl mt-4 p-6 max-h-96 overflow-y-auto backdrop-filter backdrop-blur-lg z-10 scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar-track"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          <ul className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <motion.li
                  key={result.id}
                  className="bg-gray-700 bg-opacity-50 rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:bg-opacity-75 transition-all duration-200"
                  onClick={() => onCardClick(result)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={getBestImage(result.image)} // Uses helper function to get the best image
                    alt={`${result.title} cover`}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    <p className="text-sm text-gray-300">{result.artist}</p>
                  </div>
                </motion.li>
              ))
            ) : (
              <motion.li
                className="bg-gray-700 bg-opacity-50 rounded-lg p-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No results found.
              </motion.li>
            )}
          </ul>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchResults;
