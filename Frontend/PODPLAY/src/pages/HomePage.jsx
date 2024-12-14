import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import RecommendationsBar from '../components/RecommendationsBar';
import AnimatedSearch from "../components/AnimatedSearch";
import SearchResults from "../components/SearchResults";
import HorizontalMusicPlayer from '../components/HorizontalMusicPlayer';
import ListenWithFriends from '../components/ListenWithFriends';
import '../components/HorizontalMusicPlayer.css';
import './HomePage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [playHistory, setPlayHistory] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const searchRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const audioRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearchResults = (fetchedCards) => {
    setSearchResults(fetchedCards);
    setIsSearchOpen(true);
  };

  const handleCardClick = async (card) => {
    try {
      if (currentTrack && currentTrack.id === card.id) {
        return;
      }
  
      setCurrentTrack(card);
      setPlayHistory(prevHistory => [card, ...prevHistory]);
      setQueue(prevQueue => [card, ...prevQueue]);
  
      await fetchSuggestions(card);
    } catch (error) {
      console.error("Error handling card click:", error.message);
    }
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

  const toggleRepeat = () => {
    setIsRepeat(prev => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
    if (!isShuffle) {
      setQueue(prevQueue => {
        const [currentTrack, ...rest] = prevQueue;
        return [currentTrack, ...rest.sort(() => Math.random() - 0.5)];
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (card) => {
    try {
      console.log("Fetching suggestions...");
  
      const response = await axios.get("http://127.0.0.1:5000/songs/suggestions", {
        params: {
          song_id: card.id,
        },
      });
  
      const filteredSuggestions = response.data.filter(
        (suggestion) => suggestion.id !== card.id
      );
  
      setSuggestions(filteredSuggestions);
      setQueue(prevQueue => [...prevQueue, ...filteredSuggestions]);
      console.log("Suggestions updated:", filteredSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  const handlePlayPause = (playing) => {
    setIsPlaying(playing);
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleSeek = (currentTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  };

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="sidebar-content">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      </aside>

      <main className="main-content">
        <div className="search-container" ref={searchRef}>
          <div className="search-bar">
            <AnimatedSearch onSearch={handleSearchResults} />
            {isSearchOpen && (
              <SearchResults results={searchResults} onCardClick={handleCardClick} />
            )}
          </div>
        </div>

        <div className="animation-container">
          <div className="animation-content">
            <ListenWithFriends 
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
            />
          </div>
        </div>

        <div className="player-container">
          <div className="music-player">
            <HorizontalMusicPlayer 
              currentTrack={currentTrack}
              onNext={playNext}
              onPrevious={playPrevious}
              isRepeat={isRepeat}
              isShuffle={isShuffle}
              onToggleRepeat={toggleRepeat}
              onToggleShuffle={toggleShuffle}
              queue={queue}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              audioRef={audioRef}
            />
          </div>
        </div>
      </main>

      <aside className="recommendations">
        <div className="recommendations-content">
          <RecommendationsBar
            suggestions={suggestions}
            onTrackSelect={handleCardClick}
          />
        </div>
      </aside>
    </div>
  );
}

