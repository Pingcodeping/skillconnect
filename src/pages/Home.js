// pages/Home.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
      <h1 className="text-5xl font-bold mb-4">Welcome to SkillConnect</h1>
      <p className="text-lg text-center max-w-xl mb-8">
        SkillConnect is your one-stop platform to connect with professionals,
        ask questions, share knowledge, and grow your skills. Join now and be part
        of an ever-growing tech community!
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
        >
          Login
        </Link>
      </div>
    </div>
    </>
  );
};

export default Home;
