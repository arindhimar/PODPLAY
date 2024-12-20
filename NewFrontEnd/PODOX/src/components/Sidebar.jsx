import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { FaHome, FaSearch, FaMusic, FaPlusSquare, FaHeart, FaCog, FaBars, FaTimes } from 'react-icons/fa';

const MenuItem = ({ icon: Icon, text, isOpen }) => {
  const props = useSpring({
    width: isOpen ? '100%' : '50px',
    opacity: isOpen ? 1 : 0.52, // Fade effect
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.li style={props} className="mb-4">
      <a
        href="#"
        className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 ease-in-out"
      >
        {/* Icon container */}
        <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg">
          <Icon size={24} />
        </div>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="ml-4 text-lg"
          >
            {text}
          </motion.span>
        )}
      </a>
    </animated.li>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarAnimation = useSpring({
    width: isOpen ? '250px' : '80px', // When closed, set a small width
    opacity: isOpen ? 1 : 0.8, // Keep it slightly visible when closed
    transform: isOpen ? 'translateX(0)' : 'translateX(0)', // Keep it within view when closed
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.aside
      style={sidebarAnimation}
      className="bg-gray-900 h-full overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="mb-8 text-white hover:text-blue-400 transition-colors w-full text-left flex items-center justify-center"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
        <nav>
          <ul className="flex flex-col items-center">
            <MenuItem icon={FaHome} text="Home" isOpen={isOpen} />
            <MenuItem icon={FaSearch} text="Search" isOpen={isOpen} />
            <MenuItem icon={FaMusic} text="Your Library" isOpen={isOpen} />
            <MenuItem icon={FaPlusSquare} text="Create Playlist" isOpen={isOpen} />
            <MenuItem icon={FaHeart} text="Liked Songs" isOpen={isOpen} />
          </ul>
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <MenuItem icon={FaCog} text="Settings" isOpen={isOpen} />
      </div>
    </animated.aside>
  );
};

export default Sidebar;
