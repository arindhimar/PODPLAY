import React from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button"

const SearchResults = ({ results, onCardClick }) => {
  const handleAddToPlaylist = (card) => {
    console.log('Add to playlist:', card);
    // Implement add to playlist functionality
  };

  const handleLikeSong = (card) => {
    console.log('Like song:', card);
    // Implement like song functionality
  };

  const handleShareSong = (card) => {
    console.log('Share song:', card);
    // Implement share song functionality
  };

  return (
    <div className="bg-blue dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
 
      <div className="p-4">
        {results.length > 0 ? (
          results.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => onCardClick(card)}
            >
              <img 
                src={card.image[1].url} 
                alt={`${card.title} by ${card.artist}`}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.artist}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleAddToPlaylist(card); }}>
                  <PlusCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleLikeSong(card); }}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleShareSong(card); }}>
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400 py-8"
          >
            No results found
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

