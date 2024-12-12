import React from "react";
import HoverCard from "./HoverCard";
import PropTypes from "prop-types";
import "./RecommendationsBar.css";

const RecommendationsBar = ({ onCardClick }) => {
  // You might want to fetch recommendations from an API or use static data
  const recommendations = [
    // Add some sample recommendation data here
    {
      id: 1,
      title: "Song 1",
      artist: "Artist 1",
      audio_url: "audio_url_1",
      image: "image_url_1",
      url: "url_1",
    },
    {
      id: 2,
      title: "Song 2",
      artist: "Artist 2",
      audio_url: "audio_url_2",
      image: "image_url_2",
      url: "url_2",
    },


  ];

  return (
    <div id="recommendations-bar">
      <h2>Recommendations</h2>
      <div id="recommendations-content">
        {recommendations.length > 0 ? (
          recommendations.map((card) => (
            <HoverCard
              key={card.id}
              title={card.title}
              artist={card.artist}
              audioUrl={card.audio_url}
              image={card.image.toString().replaceAll("50", "150")}
              url={card.url}
              onClick={() => onCardClick(card)}
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
  onCardClick: PropTypes.func.isRequired,
};

export default RecommendationsBar;

