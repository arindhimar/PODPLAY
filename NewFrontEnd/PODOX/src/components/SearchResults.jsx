import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaHeart, FaPlus, FaEllipsisV } from "react-icons/fa";
import axios from "axios";

const SearchResults = ({ results, onCardClick }) => {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  const filteredResults = results.filter((result) =>
    result.title.toLowerCase().includes(searchText.toLowerCase()) ||
    result.artist.toLowerCase().includes(searchText.toLowerCase())
  );

  const getBestImage = (images) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/48";
    }

    for (let i = images.length - 1; i >= 0; i--) {
      if (images[i]?.url) {
        return images[i].url;
      }
    }

    return "https://via.placeholder.com/48";
  };

  const handleDownload = async (url, fileName) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const songUrl = proxyUrl + url;
  
    try {
      const response = await axios.get(songUrl, {
        responseType: "blob",
      });
  
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleMouseLeave = () => {
    setMenuOpen(null);
  };

  return (
    <div className="relative">
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
                    src={getBestImage(result.image)}
                    alt={`${result.title} cover`}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    <p className="text-sm text-gray-300">{result.artist}</p>
                  </div>

                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEllipsisV
                        size={22}
                        className="text-gray-300 hover:text-blue-400 cursor-pointer"
                        onClick={(e) => toggleMenu(result.id, e)}
                      />
                    </motion.div>

                    <AnimatePresence>
                      {menuOpen === result.id && (
                        <motion.div
                          className="absolute right-0 top-0 bg-gray-800 rounded-lg mt-2 p-3 shadow-lg"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onMouseLeave={handleMouseLeave}
                        >
                          <motion.button
                            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors w-full text-left mb-2"
                            whileHover={{ x: 5 }}
                          >
                            <FaPlus size={18} />
                            <span>Add to Playlist</span>
                          </motion.button>
                          <motion.button
                            className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors w-full text-left"
                            whileHover={{ x: 5 }}
                          >
                            <FaHeart size={18} />
                            <span>Like</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaDownload
                      size={20}
                      className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(
                          result.audio_url,
                          `${result.title}.mp3`
                        );
                      }}
                    />
                  </motion.div>
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

