import React from "react";
import AnimatedSearch from "./AnimatedSearch";
import HoverCard from "./HoverCard";
import PropTypes from "prop-types";
import "./RecommendationsBar.css";

const RecommendationsBar = ({ cards = [] }) => {
  return (
    <div id="recommendations-bar">
      <div className="search-container">
        <AnimatedSearch />
      </div>
      <div id="recommendations-content">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <HoverCard
              key={index}
              color={card.color}
              title={card.title}
              description={card.description}
            />
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
};

RecommendationsBar.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default RecommendationsBar;

