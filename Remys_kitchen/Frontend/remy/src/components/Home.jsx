import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import MainBanner from "./MainBanner";
import BlogSection from "./BlogSection";
// import "../styles/styles.css";

function Home({ navigateTo }) {
  return (
    <div className="app">
      <Header navigateTo={navigateTo} />
      <main>
        <MainBanner navigateTo={navigateTo} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
