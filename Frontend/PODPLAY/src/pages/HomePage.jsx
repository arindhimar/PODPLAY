import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import RecommendationsBar from '../components/RecommendationsBar';
import AnimatedSearch from "../components/AnimatedSearch";
import SearchResults from "../components/SearchResults";
import HorizontalMusicPlayer from '../components/HorizontalMusicPlayer';
import '../components/HorizontalMusicPlayer.css';
import './HomePage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const searchRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const cards = [
    { color: "#ff0000", title: "Card 1", description: "This is card 1 description" },
    { color: "#00ff00", title: "Card 2", description: "This is card 2 description" },
    { color: "#0000ff", title: "Card 3", description: "This is card 3 description" },
    { color: "#ff00ff", title: "Card 4", description: "This is card 4 description" },
    { color: "#ff0000", title: "Card 5", description: "This is card 5 description" },
    { color: "#00ff00", title: "Card 6", description: "This is card 6 description" },
    { color: "#0000ff", title: "Card 7", description: "This is card 7 description" },
    { color: "#ff00ff", title: "Card 8", description: "This is card 8 description" },
  ];

  const handleSearchResults = (fetchedCards) => {
    setSearchResults(fetchedCards);
    setIsSearchOpen(true);
  };

  const handleCardClick = (card) => {
    if (currentTrack && currentTrack.id === card.id) {
      // If the same track is clicked, toggle play/pause
      // This will be handled in the HorizontalMusicPlayer component
    } else {
      console.log(card);
      setCurrentTrack(card);
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
            Random Animations (Future implementation)
          </div>
        </div>

        <div className="player-container">
          <div className="music-player">
            <HorizontalMusicPlayer currentTrack={currentTrack} />
          </div>
        </div>
      </main>

      <aside className="recommendations">
        <div className="recommendations-content">
          <RecommendationsBar cards={cards} />
        </div>
      </aside>
    </div>
  );
}

