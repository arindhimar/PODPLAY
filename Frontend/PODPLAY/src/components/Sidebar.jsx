import React from 'react';
import './Sidebar.css'; // Import the CSS file
import Logo from './Logo'; // Import the PNG logo
// import Meteors from "@/components/magicui/meteors"; // Import Meteors component

const Sidebar = () => {
  return (
    <div id="nav-bar">
      <input id="nav-toggle" type="checkbox" />
      <div id="nav-header" className="relative flex items-center justify-center">
        {/* Meteor Background */}
        {/* <Meteors number={30} /> */}

        {/* Logo and Title */}
        <a id="nav-title" href="#" rel="noopener noreferrer" className="relative z-10">
          <Logo className="nav-logo" /> 
          <span>PODPLAY</span>
        </a>
        
        <label htmlFor="nav-toggle"><span id="nav-toggle-burger"></span></label>
        <hr />
      </div>
      <div id="nav-content">
        <div className="nav-button"><i className="fas fa-home"></i><span>Home</span></div>
        <div className="nav-button"><i className="fas fa-music"></i><span>Playlist</span></div>
        <div className="nav-button"><i className="fas fa-heart"></i><span>Liked Songs</span></div>
        <div className="nav-button"><i className="fas fa-user-friends"></i><span>Authors</span></div>
        <div className="nav-button"><i className="fas fa-headphones-alt"></i><span>Discover</span></div>
        <div className="nav-button"><i className="fas fa-chart-line"></i><span>Top Charts</span></div>
        <div className="nav-button"><i className="fas fa-record-vinyl"></i><span>Albums</span></div>
        <hr />
        <div className="nav-button"><i className="fas fa-cog"></i><span>Settings</span></div>
        <div id="nav-content-highlight"></div>
      </div>
      <input id="nav-footer-toggle" type="checkbox" />
      <div id="nav-footer">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547" alt="Avatar" />
          </div>
          <div id="nav-footer-titlebox">
            <a id="nav-footer-title" href="https://codepen.io/uahnbu/pens/public" target="_blank" rel="noopener noreferrer">
              ArinDhimar
            </a>
            <span id="nav-footer-subtitle">Account</span>
          </div>
          <label htmlFor="nav-footer-toggle"><i className="fas fa-caret-up"></i></label>
        </div>
        <div id="nav-footer-content">
          <p>Arin Dhimar</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
