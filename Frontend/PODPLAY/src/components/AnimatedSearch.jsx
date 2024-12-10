import React, { useState, useEffect, useRef } from 'react';

const bubbleColors = ['#4C83F0', '#D1333B', '#EEB80B', '#4C83F0', '#1CAF60', '#D1333B'];
const letters = ['S', 'E', 'A', 'R', 'C', 'H'];

const AnimatedSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', inputValue);
    setInputValue('');
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const searchWrapperStyle = {
    width: '100%',
    height: '50px',
    position: 'relative',
    filter: 'url(#goo)',
  };

  const searchBoxStyle = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isExpanded ? '100%' : '50px',
    height: '50px',
    background: '#333',
    borderRadius: isExpanded ? '10px' : '25px',
    transition: 'all 1s',
    zIndex: 1,
  };

  const inputStyle = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    width: '90%',
    height: '20px',
    border: 'none',
    background: 'transparent',
    outline: 'none',
    color: '#f9f9f9',
    caretColor: 'transparent',
  };

  const bubbleStyle = (index) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    background: '#333',
    borderRadius: '25px',
    left: `${(index + 1) * 50}px`,
    animation: 'bubbling 1s infinite cubic-bezier(0.075, 0.82, 0.165, 1)',
  });

  
  const textStyle = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    color: '#f9f9f9',
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <div
        style={searchWrapperStyle}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div style={searchBoxStyle}>
          {isExpanded ? (
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                style={inputStyle}
                placeholder=">"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </form>
          ) : (
            <p style={{ ...textStyle, color: bubbleColors[0] }}>{letters[0]}</p>
          )}
        </div>
        {!isExpanded &&
          letters.slice(1).map((letter, index) => (
            <div key={index} style={bubbleStyle(index)}>
              <p style={{ ...textStyle, color: bubbleColors[index + 1] }}>{letter}</p>
            </div>
          ))}
        {!isExpanded && (
          <div style={bubbleStyle(5)}>
            <p style={textStyle}>🔎</p>
          </div>
        )}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedSearch;

