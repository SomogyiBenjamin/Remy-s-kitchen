import React from "react";
import "../styles/MainBanner.css";
import { useNavigate } from "react-router-dom";
function MainBanner() {
  const navigate=useNavigate();
  return (
    <section className="main-banner">
      <div className="banner-content">
        <h1>Remy's Kitchen</h1>
        <p>
          Fedezze fel kedvenc receptjeit, töltse fel saját receptjeit, és keresgéljen
          ízletes, megfizethető ételek között.
        </p>
        <button className="banner-button" onClick={() => navigate("/viewAll")}>
          Receptjeink
        </button>
      </div>
    </section>
  );
}

export default MainBanner;
