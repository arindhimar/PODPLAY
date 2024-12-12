import { useState,useRef,useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Sidebar component
import RecommendationsBar from '../components/RecommendationsBar'; // RecommendationsBar component
import MusicPlayer from '../components/MusicPlayer'; // MusicPlayer component
import AnimatedSearch from "../components/AnimatedSearch"; // AnimatedSearch component\import SearchResults from "../components/SearchResults";
import SearchResults from "../components/SearchResults";


import './HomePage.css';


import '@fortawesome/fontawesome-free/css/all.min.css';


export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  const cards = [
    { color: "#ff0000", title: "Card 1", description: "This is card 1 description" },
    { color: "#00ff00", title: "Card 2", description: "This is card 2 description" },
    { color: "#0000ff", title: "Card 3", description: "This is card 3 description" },
    { color: "#ff00ff", title: "Card 4", description: "This is card 4 description" },
    { color: "#ff0000", title: "Card 1", description: "This is card 1 description" },
    { color: "#00ff00", title: "Card 2", description: "This is card 2 description" },
    { color: "#0000ff", title: "Card 3", description: "This is card 3 description" },
    { color: "#ff00ff", title: "Card 4", description: "This is card 4 description" },

  ];

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const handleSearchResults = (fetchedCards) => {
    setSearchResults(fetchedCards);
    setIsSearchOpen(true);
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
        <div className="search-container">
          <div className="search-bar">
            <AnimatedSearch onSearch={handleSearchResults} />
            {isSearchOpen && (
              <SearchResults results={searchResults} onCardClick={handleCardClick} />
            )}
          </div>
        </div>
        <div className="player-container">
          <div className="music-player">
            <MusicPlayer/>
          </div>
        </div>
        <div className="animation-container">
          <div className="animation-content">
            Random Animations (Future implementation)
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

