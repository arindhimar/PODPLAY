import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const bubbleColors = ["#4C83F0", "#D1333B", "#EEB80B", "#4C83F0", "#1CAF60", "#D1333B"];
const letters = ["S", "E", "A", "R", "C", "H"];

const AnimatedSearch = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearch = async () => {
    if (inputValue.length > 2) {
      try {
        const response = await axios.get("http://127.0.0.1:5000/songs/search", {
          params: { query: inputValue },
        });

        if (onSearch) {
          // console.log(response.data);
          onSearch(response.data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    handleSearch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const searchWrapperStyle = {
    width: "100%",
    height: "50px",
    position: "relative",
    filter: "url(#goo)",
  };

  const searchBoxStyle = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: isExpanded ? "100%" : "50px",
    height: "50px",
    background: "#333",
    borderRadius: isExpanded ? "10px" : "25px",
    transition: "all 1s",
    zIndex: 1,
  };

  const inputStyle = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    width: "90%",
    height: "20px",
    border: "none",
    background: "transparent",
    outline: "none",
    color: "#f9f9f9",
    caretColor: "#ffffff", // Visible caret color
  };

  const bubbleStyle = (index, totalBubbles) => {
    const bubbleWidth = 50;
    const containerWidth = window.innerWidth * 0.9; // 90% of the screen width
    const spacing = (containerWidth - bubbleWidth) / (totalBubbles - 1); // calculate spacing dynamically
    const position = index * spacing*0.45;

    return {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${bubbleWidth}px`,
      height: `${bubbleWidth}px`,
      background: "#333",
      borderRadius: "50%",
      left: `${position}px`,
      animation: `bouncing 1s infinite ${(index * 0.2)}s cubic-bezier(0.075, 0.82, 0.165, 1)`, // Adding delay for staggered effect
    };
  };

  const bouncingAnimation = `
  @keyframes bouncing {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

  const textStyle = {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    color: "#f9f9f9",
    margin: 0,
  };

  return (
    <>
      <style>{bouncingAnimation}</style>
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
                  onChange={handleInputChange}
                />
              </form>
            ) : (
              letters.map((letter, index) => (
                <div key={index} style={bubbleStyle(index, letters.length)}>
                  <p style={{ ...textStyle, color: bubbleColors[index % bubbleColors.length] }}>
                    {letter}
                  </p>
                </div>
              ))
            )}
          </div>
          {!isExpanded && (
            <div style={bubbleStyle(letters.length, letters.length)}>
              <p style={textStyle}>🔎</p>
            </div>
          )}
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: "none" }}>
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
    </>
  );
};

AnimatedSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default AnimatedSearch;
