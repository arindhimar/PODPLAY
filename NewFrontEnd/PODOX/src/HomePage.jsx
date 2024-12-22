import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import RecommendationsBar from './components/RecommendationsBar';
import AnimatedSearch from "./components/AnimatedSearch";
import SearchResults from "./components/SearchResults";
import HorizontalMusicPlayer from './components/HorizontalMusicPlayer';
import ListenWithFriends from './components/ListenWithFriends';
import { ref, onValue, set, serverTimestamp, off } from 'firebase/database';
import { database } from './firebase';
import useRoomSync from './hooks/useRoomSync';

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
  const [roomCode, setRoomCode] = useState(null);
  const audioRef = useRef(null);
  const [controls, setControls] = useState({
    isPlaying: false,
    currentTime: 0,
    isRepeat: false,
    isShuffle: false,
    volume: 1
  });
  const [userCount, setUserCount] = useState(0);

  const { updateRoom, syncWithRoom } = useRoomSync(roomCode, audioRef);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  const handleSearchResults = useCallback((fetchedCards) => {
    setSearchResults(fetchedCards);
    setIsSearchOpen(true);
  }, []);

  const fetchSuggestions = useCallback(async (card) => {
    try {
      const response = await fetch(`http://localhost:5000/songs/suggestions?song_id=${card.id}`);
      const data = await response.json();
      const filteredSuggestions = data.filter(suggestion => suggestion.id !== card.id);
      setSuggestions(filteredSuggestions);
      setQueue(prevQueue => [...prevQueue, ...filteredSuggestions]);
      return filteredSuggestions;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      return [];
    }
  }, []);

  const handleCardClick = useCallback((card) => {
    if (currentTrack && currentTrack.id === card.id) return;
    console.log("Playing:", card);
    setCurrentTrack(card);
    setPlayHistory(prev => [card, ...prev]);
    setQueue(prev => [card, ...prev]);
    fetchSuggestions(card).then(newSuggestions => {
      updateRoom(card, true, 0);
      if (newSuggestions.length > 0) {
        setIsPlayingSuggestions(true);
      }
    });
  }, [currentTrack, fetchSuggestions, updateRoom]);

  const playNext = useCallback(() => {
    if (queue.length > 1) {
      const [_, ...newQueue] = queue;
      setQueue(newQueue);
      updateRoom(newQueue[0], true, 0);
    } else if (suggestions.length > 0) {
      const nextTrack = isShuffle ?
        suggestions[Math.floor(Math.random() * suggestions.length)] :
        suggestions[0];
      handleCardClick(nextTrack);
    }
  }, [queue, suggestions, isShuffle, handleCardClick, updateRoom]);

  const playPrevious = useCallback(() => {
    if (playHistory.length > 1) {
      const [prevTrack, currentTrack, ...restHistory] = playHistory;
      setPlayHistory([prevTrack, currentTrack, ...restHistory]);
      setQueue(prev => [prevTrack, currentTrack, ...prev.slice(1)]);
      updateRoom(prevTrack, true, 0);
    }
  }, [playHistory, updateRoom]);

  const toggleRepeat = useCallback(() => {
    setControls(prev => {
      const newIsRepeat = !prev.isRepeat;
      updateRoom(null, null, null, { isRepeat: newIsRepeat });
      return { ...prev, isRepeat: newIsRepeat };
    });
  }, [updateRoom]);

  const toggleShuffle = useCallback(() => {
    setControls(prev => {
      const newIsShuffle = !prev.isShuffle;
      if (newIsShuffle) {
        setQueue(([currentTrack, ...rest]) => [currentTrack, ...rest.sort(() => Math.random() - 0.5)]);
      }
      updateRoom(null, null, null, { isShuffle: newIsShuffle });
      return { ...prev, isShuffle: newIsShuffle };
    });
  }, [updateRoom]);

  const handleSeek = useCallback(async (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setControls(prevControls => ({ ...prevControls, currentTime: time }));
    updateRoom(null, null, time);
  }, [updateRoom]);

  const handlePlayPause = useCallback(() => {
    setControls(prev => {
      const newIsPlaying = !prev.isPlaying;
      updateRoom(null, newIsPlaying);
      return { ...prev, isPlaying: newIsPlaying };
    });
  }, [updateRoom]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (roomCode) {
      const unsubscribe = syncWithRoom((data) => {
        if (data.currentTrack) setCurrentTrack(data.currentTrack);
        if (data.controls) setControls(prevControls => ({ ...prevControls, ...data.controls }));
        if (data.users) setUserCount(data.users);
      });
      return unsubscribe;
    }
  }, [roomCode, syncWithRoom]);

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
                isPlaying={controls.isPlaying}
                onTrackChange={setCurrentTrack}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                roomCode={roomCode}
                setRoomCode={setRoomCode}
                audioRef={audioRef}
                userCount={userCount}
              />
            </motion.div>
            <RecommendationsBar
              suggestions={suggestions}
              onTrackSelect={handleCardClick}
              currentTrack={currentTrack}
            />

            <motion.div
              className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg backdrop-filter backdrop-blur-lg mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <HorizontalMusicPlayer
                currentTrack={currentTrack}
                onNext={playNext}
                onPrevious={playPrevious}
                isRepeat={controls.isRepeat}
                isShuffle={controls.isShuffle}
                onToggleRepeat={toggleRepeat}
                onToggleShuffle={toggleShuffle}
                queue={queue}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                roomCode={roomCode}
                controls={controls}
                audioRef={audioRef}
              />
            </motion.div>
          </main>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;

