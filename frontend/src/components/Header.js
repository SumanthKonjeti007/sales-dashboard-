import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <a href="/">Home</a>
        <a href="/visualizations">Visualizations</a>
        <a href="/predictions">Predictions</a>
      </nav>
    </header>
  );
};

export default Header;
