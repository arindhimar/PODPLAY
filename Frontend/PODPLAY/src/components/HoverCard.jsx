import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./HoverCard.css";

const HoverCard = ({
  title,
  description,
  artist,
  audioUrl,
  image,
  url,
  onClick,
}) => {
  const [color, setColor] = useState("#ff0000");
  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const [titleOverflow, setTitleOverflow] = useState(false);
  const [artistOverflow, setArtistOverflow] = useState(false);

  useEffect(() => {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    setColor(randomColor);

    // Check if the title or artist overflows
    const checkOverflow = (ref) => {
      if (ref.current) {
        return ref.current.scrollWidth > ref.current.clientWidth;
      }
      return false;
    };

    setTitleOverflow(checkOverflow(titleRef));
    setArtistOverflow(checkOverflow(artistRef));
  }, [title, artist]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--x", "0px");
    card.style.setProperty("--y", "0px");
  };

  return (
    <div
      className="hover-card"
      style={{ "--color": color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <img
        src={image}
        alt="Main logo"
        className="hover-card-image"
        onError={(e) => {
          e.target.onerror = null; // Prevents infinite loop if fallback also fails
          e.target.src = "https://i.ibb.co/RpLLk4t/Pod-Play-Main.jpg"; // Fallback image
        }}
      />

      <div className="hover-card-details">
        <h3
          ref={titleRef}
          className={`hover-card-title ${titleOverflow ? "marquee" : ""}`}
        >
          {title}
        </h3>
        {artist && (
          <p
            ref={artistRef}
            className={`hover-card-artist ${artistOverflow ? "marquee" : ""}`}
          >
            {artist}
          </p>
        )}
      </div>
    </div>
  );
};

HoverCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  artist: PropTypes.string,
  audioUrl: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default HoverCard;
