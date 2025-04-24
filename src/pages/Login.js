// pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post(' https://skillconnect-server.onrender.com/api/users/login', { email, password });
      const res = await axios.post(' https://skillconnect-server.onrender.com/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token); // Store the token in localStorage
      navigate('/profile'); // Navigate to profile page after successful login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
    <Navbar/>
    
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
    </>
  );
};

export default Login;
