import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const AnimatedSearch = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Debounced search function
  const handleSearch = useCallback(async () => {
    if (searchTerm.length >= 2) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/songs/search', {
          params: { query: searchTerm },
        });

        if (onSearch) {
          console.log(response.data);
          onSearch(response.data);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    }
  }, [searchTerm, onSearch]);

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear the previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer
    const timer = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms debounce delay
    setDebounceTimer(timer);
  };

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center bg-gray-700 rounded-full transition-all duration-300 overflow-hidden"
        animate={{ width: isExpanded ? '100%' : '50px' }}
      >
        <motion.button
          className="p-3 text-white hover:text-blue-400 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaSearch size={20} />
        </motion.button>
        <AnimatePresence>
          {isExpanded && (
            <motion.input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white w-full p-3 focus:outline-none"
              value={searchTerm}
              onChange={handleInputChange}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedSearch;
