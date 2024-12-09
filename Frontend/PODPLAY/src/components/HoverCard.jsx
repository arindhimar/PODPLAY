import React from "react";
import "./HoverCard.css"; // CSS for styling

const HoverCard = ({ color = "#ff0000", children, title, description }) => {
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
    >
      {title && <h3 className="hover-card-title">{title}</h3>}
      {description && <p className="hover-card-description">{description}</p>}
      {children && <div className="hover-card-content">{children}</div>}
    </div>
  );
};

export default HoverCard;
