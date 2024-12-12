import React from 'react';
import HoverCard from './HoverCard';
import './SearchResults.css';

const SearchResults = ({ results, onCardClick }) => {
  return (
    <div className="search-results">
      {results.length > 0 ? (
        results.map((card) => (
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
        <p className="no-results">No results found</p>
      )}
    </div>
  );
};

export default SearchResults;

