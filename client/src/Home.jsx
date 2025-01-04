import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Paths to the CSS and JS files in the public/assets folder
const cssFile = "/assets/index-BxLNu5sD.css"; // Public path for CSS
const jsFile = "/assets/index-Dujyy8bn.js"; // Public path for JS

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for session token (user authentication)
    const sessionToken = sessionStorage.getItem("sessionToken");
    if (!sessionToken) {
      // If no session token, redirect to login page
      navigate("/login"); // Use navigate to redirect instead of window.location.href
      return;
    }

    // Dynamically load the CSS and JS files
    const loadCSS = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssFile; // Load CSS from the public path
      link.crossOrigin = "anonymous";
      link.onload = () => console.log("CSS file loaded successfully.");
      link.onerror = (err) => console.error("Failed to load CSS file:", err);
      document.head.appendChild(link);
    };

    const loadJS = () => {
      const script = document.createElement("script");
      script.src = jsFile; // Load JS from the public path
      script.type = "module";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = () => console.log("JS file loaded successfully.");
      script.onerror = (err) => console.error("Failed to load JS file:", err);
      document.body.appendChild(script);
    };

    loadCSS();
    loadJS();

    // Cleanup dynamically added elements when the component unmounts
    return () => {
      const linkTags = document.head.querySelectorAll("link[rel='stylesheet']");
      linkTags.forEach((tag) => document.head.removeChild(tag));

      const scriptTags = document.body.querySelectorAll(
        "script[type='module']"
      );
      scriptTags.forEach((tag) => document.body.removeChild(tag));
    };
  }, [navigate]);

  return (
    <div id="root">
      {/* <h1>Welcome to the Home Page</h1>
      <p>
        The styles and scripts are dynamically loaded from the public/assets
        directory.
      </p> */}
    </div>
  );
};

export default Home;
