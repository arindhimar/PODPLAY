import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import './RecommendationsBar.css'; // Import the CSS file
import HoverCard from './HoverCard'; // Assuming HoverCard is another component

const RecommendationsBar = ({ cards = [] }) => { // Default value as empty array
  return (
    <div id="recommendations-bar">
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
          <p>No recommendations available</p> // Optional: display a message if no cards are available
        )}
      </div>
    </div>
  );
};

// PropTypes for validation
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
