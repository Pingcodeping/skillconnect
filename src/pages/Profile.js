// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import NavbarLoggedIn from '../components/NavbarLoggedIn';
// import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';
// import QA from '../pages/QA';

// const Profile = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [questions, setQuestions] = useState([]); // State for storing questions
//   const [newQuestion, setNewQuestion] = useState({ title: '', body: '', tags: '' }); // State for new question
//   const [answerText, setAnswerText] = useState(''); // State for answering a question
//   const [questionId, setQuestionId] = useState(null); // State for the question being answered

//   const navigate = useNavigate();

//   const handleUserConnection = () => {
//     navigate('/userconnections');
//   };
//   const handleAllUsers = () => {
//     navigate('/allusers');
//   };
//   const handleUserQuestions = () => {
//     navigate('/userquestions');
//   };
//   const handlePostQuestions = () => {
//     navigate('/postquestions');
//   }

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const meRes = await axios.get('https://skillconnect-server.onrender.com/api/users/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCurrentUser(meRes.data);

//         const connectionsRes = await axios.get(
//           `https://skillconnect-server.onrender.com/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
//         );
//         setConnections(connectionsRes.data);

//         const allUsersRes = await axios.get('https://skillconnect-server.onrender.com/api/users/getAllUsers', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAllUsers(allUsersRes.data);

//         // Fetch questions posted by the current user
//         const questionsRes = await axios.get('https://skillconnect-server.onrender.com/api/questions', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setQuestions(questionsRes.data);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setConnections([]);
//         setAllUsers([]);
//         setQuestions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };


//   if (loading) return <LoadingSpinnerWithPercentage />;
//   if (!currentUser) return <p className="text-center text-xl">User not found</p>;

//   return (
//     <>
//       <NavbarLoggedIn />

//       <div className="container mx-auto p-6">
//         {/* Logout and Links */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4 w-full max-w-md mx-auto">
//           <button
//             onClick={handleLogout}
//             className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 text-sm sm:text-base"
//           >
//             Log Out
//           </button>
//           <button
//             onClick={handleUserConnection}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
//           >
//             User Connections
//           </button>
//           <button
//             onClick={handleAllUsers}
//             className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 text-sm sm:text-base"
//           >
//             All Users
//           </button>
//           <button
//             onClick={handleUserQuestions}
//             className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 text-sm sm:text-base"
//           >
//             User Questions
//           </button>
//           <button
//             onClick={handlePostQuestions}
//             className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-purple-700 transition duration-200 text-sm sm:text-base"
//           >
//             Post Question
//           </button>
//         </div>
//         {/* Profile Information */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-semibold text-gray-800">Welcome, {currentUser.name}</h1>
//           <p className="text-lg text-gray-600">{currentUser.email}</p>
//           <p className="text-lg text-gray-600 mt-2">{currentUser.bio}</p>
//         </div>
//         <QA />
//       </div>
//     </>
//   );
// };

// export default Profile;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';
import QA from '../pages/QA';

import { LogOut, Users, UserPlus, HelpCircle, Pencil } from 'lucide-react';

const Profile = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUserConnection = () => navigate('/userconnections');
  const handleAllUsers = () => navigate('/allusers');
  const handleUserQuestions = () => navigate('/userquestions');
  const handlePostQuestions = () => navigate('/postquestions');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const meRes = await axios.get('https://skillconnect-server.onrender.com/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(meRes.data);

        const connectionsRes = await axios.get(
          `https://skillconnect-server.onrender.com/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
        );
        setConnections(connectionsRes.data);

        const allUsersRes = await axios.get('https://skillconnect-server.onrender.com/api/users/getAllUsers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(allUsersRes.data);

        const questionsRes = await axios.get('https://skillconnect-server.onrender.com/api/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setConnections([]);
        setAllUsers([]);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <LoadingSpinnerWithPercentage />;
  if (!currentUser) return <p className="text-center text-xl">User not found</p>;

  const options = [
    { label: 'User Connections', icon: <Users />, onClick: handleUserConnection, bg: 'bg-blue-100' },
    { label: 'All Users', icon: <UserPlus />, onClick: handleAllUsers, bg: 'bg-green-100' },
    { label: 'User Questions', icon: <HelpCircle />, onClick: handleUserQuestions, bg: 'bg-purple-100' },
    { label: 'Post Question', icon: <Pencil />, onClick: handlePostQuestions, bg: 'bg-yellow-100' },
    { label: 'Log Out', icon: <LogOut />, onClick: handleLogout, bg: 'bg-red-100' },
  ];

  return (
    <>
      <NavbarLoggedIn />

      <div className="container mx-auto p-4">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser.name}</h1>
          <p className="text-gray-600">{currentUser.email}</p>
          {/* <p className="text-gray-600 italic mt-2">{currentUser.bio}</p> */}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          {options.map(({ label, icon, onClick, bg }, index) => (
            <div
              key={index}
              onClick={onClick}
              className={`cursor-pointer p-5 ${bg} rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center gap-4`}
            >
              <div className="text-xl text-gray-700">{icon}</div>
              <div className="text-gray-800 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* User's QA Section */}
        <QA />
      </div>
    </>
  );
};

export default Profile;


