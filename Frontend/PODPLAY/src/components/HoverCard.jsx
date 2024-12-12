import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    setColor(randomColor);
  }, []);

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
        alt={`${title} cover`}
        className="hover-card-image"
      />
      <div className="hover-card-details">
        <h3 className="hover-card-title">{title}</h3>
        {artist && <p className="hover-card-artist">{artist}</p>}
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

