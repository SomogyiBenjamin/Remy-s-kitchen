import React from "react";
import "./LoadingScreen.css";
import mouseImage from "../asserts/mouse.svg";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="soup-container">
        <div className="mouse">
          <img src={mouseImage} alt="Mouse" className="mouse-image" />
        </div>
        <div className="soup"></div>
      </div>
      <p className="loading-text">Hozzávalók előkészítése...</p>
    </div>
  );
}

export default LoadingScreen;
