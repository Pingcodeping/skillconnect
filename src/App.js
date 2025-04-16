// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Navbar from './components/Navbar'; // Import Navbar

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Clear authentication tokens from localStorage or sessionStorage
    localStorage.removeItem('authToken');  // Example: remove token from localStorage
    sessionStorage.removeItem('authToken'); // Optionally clear sessionStorage if you store tokens there

    // Optionally, you can clear cookies if you're storing authentication data in cookies
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Clear cookie

    // Update the state to reflect the logged-out status
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
