// Navbar.jsx
import { Link } from 'react-router-dom';

const NavbarLoggedIn = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="" className="text-white text-2xl font-bold">SkillConnect</Link>
        <div className="space-x-4">
        {/* <Link to="/qa" className="text-white hover:text-gray-200">QandA</Link> */}
        </div>
      </div>
    </nav>
  );
};

export default NavbarLoggedIn;
