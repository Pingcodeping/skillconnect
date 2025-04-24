// pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '', skills: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://skillconnect-server.onrender.com/api/users/register', form);
      setMessage('Registration successful! You can now login.');
      setForm({ name: '', email: '', password: '', bio: '', skills: '' });
    } catch (err) {
      setMessage('Error occurred during registration');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {message && <p className="text-center text-sm mb-4">{message}</p>}
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-4" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-4" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-4" required />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-4" />
        <input type="text" name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mb-4" />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Register</button>
      </form>
    </div>
    </>
  );
};

export default Register;
