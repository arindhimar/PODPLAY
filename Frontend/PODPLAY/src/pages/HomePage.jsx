import { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Sidebar component
import RecommendationsBar from '../components/RecommendationsBar'; // RecommendationsBar component
import MusicPlayer from '../components/MusicPlayer'; // MusicPlayer component

import './HomePage.css'; // CSS file for styling
import '@fortawesome/fontawesome-free/css/all.min.css';

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle the sidebar visibility
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

  return (
    <div className="home-page">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="content-container">
        {/* Music Player */}
        <div className="music-player">
          <MusicPlayer />
        </div>

        {/* Recommendations Bar */}
        <RecommendationsBar cards={cards} />
      </div>
    </div>
  );
}

export default HomePage;
