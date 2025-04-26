import React, { useState, useEffect } from "react";
import "../styles/SettingsModal.css";
import "../styles/Upload.css";
import mouseImage from '../components/mouse.svg';

function Success({ isOpen, onClose, title, description, buttonText, relocate }) {

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose} id="overlay">
      <div className="modal-content" onClick={(e) => {

         e.stopPropagation()
         window.location.href=relocate
        }}>
        <h1>{title}</h1>
        <img src={mouseImage} alt="Logó" id="mouseImage"/>
        <p id="uploadDescription">{description}</p>

        <button onClick={onClose} className="tagaddbutton">{buttonText}</button>
      </div>
    </div>
  );
}

export default Success;