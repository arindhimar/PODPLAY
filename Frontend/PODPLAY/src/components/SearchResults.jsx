import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, Heart, Share, PlusCircle } from 'lucide-react';
import './SearchResults.css';

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
    <div className="search-results-container">
      <div className="search-results-header">
        <Search className="search-icon" />
        <h2>Search Results</h2>
      </div>
      <div className="search-results">
        <AnimatePresence>
          {results.length > 0 ? (
            results.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="search-result-item"
              >
                <img 
                  src={card.image.toString().replaceAll("50", "150")} 
                  alt={`${card.title} by ${card.artist}`}
                  className="search-result-image"
                  onClick={() => onCardClick(card)}
                />
                <div className="search-result-info" onClick={() => onCardClick(card)}>
                  <h3>{card.title}</h3>
                  <p>{card.artist}</p>
                </div>
                <div className="search-result-actions">
                  <button onClick={() => handleAddToPlaylist(card)} className="action-button">
                    <PlusCircle size={20} />
                  </button>
                  <button onClick={() => handleLikeSong(card)} className="action-button ">
                    <Heart size={20} />
                  </button>
                  <button onClick={() => handleShareSong(card)} className="action-button">
                    <Share size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-results"
            >
              No results found
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchResults;

