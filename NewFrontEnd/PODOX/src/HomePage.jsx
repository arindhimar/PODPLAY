import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import RecommendationsBar from './components/RecommendationsBar';
import AnimatedSearch from "./components/AnimatedSearch";
import SearchResults from "./components/SearchResults";
import HorizontalMusicPlayer from './components/HorizontalMusicPlayer';
import ListenWithFriends from './components/ListenWithFriends';
import { FaMusic } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playHistory, setPlayHistory] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isPlayingSuggestions, setIsPlayingSuggestions] = useState(false);
  const searchRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearchResults = (fetchedCards) => {
    setSearchResults(fetchedCards);
    setIsSearchOpen(true);
  };

  const handleCardClick = async (card) => {
    if (currentTrack && currentTrack.id === card.id) return;
    console.log("Playing:", card);
    setCurrentTrack(card);
    setPlayHistory([card, ...playHistory]);
    setQueue([card, ...queue]);
    await fetchSuggestions(card);
  };

  const playNext = () => {
    if (queue.length > 1) {
      const [_, ...newQueue] = queue;
      setQueue(newQueue);
      setCurrentTrack(newQueue[0]);
    } else if (suggestions.length > 0) {
      const nextTrack = isShuffle ?
        suggestions[Math.floor(Math.random() * suggestions.length)] :
        suggestions[0];
      handleCardClick(nextTrack);
    }
  };

  const playPrevious = () => {
    if (playHistory.length > 1) {
      const [prevTrack, currentTrack, ...restHistory] = playHistory;
      setCurrentTrack(prevTrack);
      setPlayHistory([prevTrack, currentTrack, ...restHistory]);
      setQueue([prevTrack, currentTrack, ...queue.slice(1)]);
    }
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      setQueue(([currentTrack, ...rest]) => [currentTrack, ...rest.sort(() => Math.random() - 0.5)]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (card) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/songs/suggestions?song_id=${card.id}`);
      const data = await response.json();
      const filteredSuggestions = data.filter(suggestion => suggestion.id !== card.id);
      setSuggestions(filteredSuggestions);
      setQueue(prevQueue => [...prevQueue, ...filteredSuggestions]);

      // Start playing suggestions one by one
      setIsPlayingSuggestions(true);
      playAllSuggestions(filteredSuggestions);

    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  const playAllSuggestions = (suggestionsList) => {
    let currentIndex = 0;
    const playNextSuggestion = () => {
      if (currentIndex < suggestionsList.length) {
        const nextTrack = suggestionsList[currentIndex];
        handleCardClick(nextTrack); // Play this suggestion
        currentIndex++;
      } else {
        // After all suggestions have been played, fetch new ones
        setIsPlayingSuggestions(false);
        fetchNewSuggestions();
      }
    };

    // Set up a listener to call playNextSuggestion once a song ends
    const audioElement = document.getElementById('audioPlayer');
    if (audioElement) {
      audioElement.onended = () => {
        playNextSuggestion();
      };
    }
  };

  const fetchNewSuggestions = async () => {
    // Fetch new suggestions after all previous ones have been played
    const currentTrackId = currentTrack?.id;
    if (currentTrackId) {
      await fetchSuggestions({ id: currentTrackId });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <motion.div
        className="flex flex-col flex-1 h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-1 h-full overflow-hidden">
          <main className="flex-1 h-full overflow-y-auto p-6">
            <motion.div
              ref={searchRef}
              className="mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <AnimatedSearch onSearch={handleSearchResults} />
              <AnimatePresence>
                {isSearchOpen && (
                  <SearchResults results={searchResults} onCardClick={handleCardClick} />
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-6 shadow-lg backdrop-filter backdrop-blur-lg z-11"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ListenWithFriends
                currentTrack={currentTrack}
                isPlaying={false}
                onTrackChange={setCurrentTrack}
                onPlayPause={(isPlaying) => console.log("Playback toggled:", isPlaying)}
                onSeek={(time) => console.log("Seeked to:", time)}
              />
            </motion.div>
            <RecommendationsBar
                suggestions={suggestions}
                onTrackSelect={handleCardClick}
                currentTrack={currentTrack}
              />

            <motion.div
              className=" bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg backdrop-filter backdrop-blur-lg mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <HorizontalMusicPlayer
                currentTrack={currentTrack}
                onNext={playNext}
                onPrevious={playPrevious}
                isRepeat={isRepeat}
                isShuffle={isShuffle}
                onToggleRepeat={toggleRepeat}
                onToggleShuffle={toggleShuffle}
                queue={queue}
                audio_url={currentTrack?.audio_url}
                imageUrl={currentTrack?.image}
              />
            </motion.div>
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
