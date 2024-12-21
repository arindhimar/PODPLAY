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
    const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // CORS Anywhere proxy
    const songUrl = proxyUrl + url; // Prepend the proxy URL to the song URL
  
    try {
      const response = await axios.get(songUrl, {
        responseType: "blob", // Ensures we get the file as a blob
      });
  
      console.log("Response Headers:", response.headers); // For debugging
      console.log("Response Data:", response.data); // For debugging
  
      // Create a Blob from the response data and download it
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set the file name for download
      link.click();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation(); // Stop event propagation to prevent triggering onCardClick
    setMenuOpen(menuOpen === id ? null : id); // Toggle the menu open/close
  };

  const handleMouseLeave = () => {
    setMenuOpen(null); // Close the menu when the mouse leaves
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

                  {/* Three-Dot Menu for actions */}
                  <div className="relative">
                    <FaEllipsisV
                      size={22}
                      className="text-gray-300 hover:text-blue-400 cursor-pointer"
                      onClick={(e) => toggleMenu(result.id, e)} // Pass event here to stop propagation
                    />

                    <AnimatePresence>
                      {menuOpen === result.id && (
                        <motion.div
                          className="absolute right-0 top-0 bg-gray-800 rounded-lg mt-2 p-3 shadow-lg opacity-0 hover:opacity-100 transition-all duration-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onMouseLeave={handleMouseLeave} // Close menu when mouse leaves
                        >
                          <button className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors">
                            <FaPlus size={18} />
                            <span>Add to Playlist</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors">
                            <FaHeart size={18} />
                            <span>Like</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Download Button */}
                  <FaDownload
                    size={20}
                    className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onCardClick
                      handleDownload(
                        result.audio_url, // Song URL
                        `${result.title}.mp3` // File name with song title (in MP3 format)
                      );
                    }}
                  />
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
