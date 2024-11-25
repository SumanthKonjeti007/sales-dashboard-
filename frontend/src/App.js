import React from "react";
import Dashboard from "./pages/Dashboard";
import "../src/styles/App.css";

const App = () => {
  return (
    <div className="app-container">

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#visualizations">Visualizations</a>
          <a href="#predictions">Predictions</a>
        </nav>

      <main>
        <Dashboard />
      </main>
      <footer className="footer">
        <p>© 2024 Dashboard App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
