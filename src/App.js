// App.jsx
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import QA from './pages/QA';
import Navbar from './components/Navbar'; // Import Navbar
import UserConnections from './pages/UserConnections';
import All_Users from './pages/All_Users';

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
        <Route path="/qa" element={<QA />} />
        <Route path="/userconnections" element={<UserConnections />}/>
        <Route path="/backtoprofile" element={<Profile />} />
        <Route path="/allusers" element={<All_Users/>}/>
      </Routes>
    </Router>
  );
};

export default App;
