import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if sessionToken exists in sessionStorage
    return sessionStorage.getItem("sessionToken") ? true : false;
  });

  useEffect(() => {
    // Whenever the component is mounted, check session token in sessionStorage
    const sessionToken = sessionStorage.getItem("sessionToken");
    if (sessionToken) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // User is not authenticated
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Protect /home route with authentication logic */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
