import { useState } from 'react';
import Sidebar from './components/Sidebar'; // Import Sidebar component
import Meteors from './components/Meteors';  // Import Meteors component (default import)
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [count, setCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility state

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle the sidebar visibility
  };

  return (
    <>
      {/* Sidebar */}
      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}

      {/* Meteors */}
      <Meteors number={30} /> Example usage of Meteors component
    </>
  );
}

export default App;
