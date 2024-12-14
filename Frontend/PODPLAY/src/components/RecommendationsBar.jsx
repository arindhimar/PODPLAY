import React from "react";
import HoverCard from "./HoverCard";
import PropTypes from "prop-types";
import "./RecommendationsBar.css";

const RecommendationsBar = ({ suggestions, onTrackSelect }) => {
  return (
    <div id="recommendations-bar">
      <div id="recommendations-content">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <HoverCard
              key={suggestion.id}
              title={suggestion.title}
              artist={suggestion.artist}
              audioUrl={suggestion.audio_url}
              image={suggestion.image[1].url}
              url={suggestion.url}
              onClick={() => onTrackSelect(suggestion)}
            />
          ))
        ) : (
          <HoverCard
            key="0"
            title="No Suggestions Found!!"
            artist="No Suggestions Found!!"
            audioUrl="No Suggestions Found!!"
            image="No Suggestions Found!!"
            url="No Suggestions Found!!"
            onClick={() => onTrackSelect(suggestion)}
          />
        )}
      </div>
    </div>
  );
};

RecommendationsBar.propTypes = {
  suggestions: PropTypes.array.isRequired,
  onTrackSelect: PropTypes.func.isRequired,
};

export default RecommendationsBar;
