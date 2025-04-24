
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import NavbarLoggedIn from '../components/NavbarLoggedIn';
// import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';
// import QA from '../pages/QA';

// import { LogOut, Users, UserPlus, HelpCircle, Pencil } from 'lucide-react';

// const Profile = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [questions, setQuestions] = useState([]);
//   const [suggestedUsers, setSuggestedUsers] = useState([]);



//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const handleUserConnection = () => navigate('/userconnections');
//   const handleAllUsers = () => navigate('/allusers');
//   const handleUserQuestions = () => navigate('/userquestions');
//   const handlePostQuestions = () => navigate('/postquestions');

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

//         const questionsRes = await axios.get('https://skillconnect-server.onrender.com/api/questions', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setQuestions(questionsRes.data);

//         const suggestedRes = await axios.post('https://skillconnect-server.onrender.com/api/users/recommend-connections', {
//           userId: meRes.data._id,
//         });
//         setSuggestedUsers(suggestedRes.data.suggestedUsers || []);
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

//   if (loading) return <LoadingSpinnerWithPercentage />;
//   if (!currentUser) return <p className="text-center text-xl">User not found</p>;

//   const options = [
//     { label: 'User Connections', icon: <Users />, onClick: handleUserConnection, bg: 'bg-blue-100' },
//     { label: 'All Users', icon: <UserPlus />, onClick: handleAllUsers, bg: 'bg-green-100' },
//     { label: 'User Questions', icon: <HelpCircle />, onClick: handleUserQuestions, bg: 'bg-purple-100' },
//     { label: 'Post Question', icon: <Pencil />, onClick: handlePostQuestions, bg: 'bg-yellow-100' },
//     { label: 'Log Out', icon: <LogOut />, onClick: handleLogout, bg: 'bg-red-100' },
//   ];

//   return (
//     <>
//       <NavbarLoggedIn />

//       <div className="container mx-auto p-4">
//         {/* Profile Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser.name}</h1>
//           <p className="text-gray-600">{currentUser.email}</p>
//           {/* <p className="text-gray-600 italic mt-2">{currentUser.bio}</p> */}
//         </div>

//         {/* Action Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
//           {options.map(({ label, icon, onClick, bg }, index) => (
//             <div
//               key={index}
//               onClick={onClick}
//               className={`cursor-pointer p-5 ${bg} rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center gap-4`}
//             >
//               <div className="text-xl text-gray-700">{icon}</div>
//               <div className="text-gray-800 font-medium">{label}</div>
//             </div>
//           ))}
//         </div>
//         {/* Suggested Users Section */}
//         {suggestedUsers.length > 0 && (
//           <div className="mt-10 max-w-4xl mx-auto">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">People You May Know</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {suggestedUsers.map((user) => (
//                 <div
//                   key={user._id}
//                   className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
//                 >
//                   <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
//                   <p className="text-gray-600 text-sm mb-2">{user.email}</p>
//                   <p className="text-gray-600 text-sm mb-2">{user.skills}</p>
//                   <p className="text-gray-500 italic text-sm">{user.bio || 'No bio available'}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}


//         {/* User's QA Section */}
//         <QA />
//       </div>
//     </>
//   );
// };

// export default Profile;



import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, UserPlus, HelpCircle, Pencil,User  } from 'lucide-react';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import QA from './QA';

const Profile = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]); // Track pending requests
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUserConnection = () => navigate('/userconnections');
  const handleAllUsers = () => navigate('/allusers');
  const handleUserQuestions = () => navigate('/userquestions');
  const handlePostQuestions = () => navigate('/postquestions');
  const handleProfile = () => navigate('/userprofile')

  // Fetch user details, connections, all users, and suggestions
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

        // Get suggested users for connections
        const suggestedRes = await axios.post('https://skillconnect-server.onrender.com/api/users/recommend-connections', {
          userId: meRes.data._id,
        });
        setSuggestedUsers(suggestedRes.data.suggestedUsers || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setConnections([]);
        setAllUsers([]);
        setSuggestedUsers([]);
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
    { label: 'Profile', icon: <User  />, onClick: handleProfile, bg: 'bg-orange-100' },
    { label: 'Log Out', icon: <LogOut />, onClick: handleLogout, bg: 'bg-red-100' },
    
  ];

  const handleConnect = async (targetId) => {
    try {
      // Send connection request
      await axios.post(
        'https://skillconnect-server.onrender.com/api/users/connect',
        { targetId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Connection request sent!');
      setPendingRequests([...pendingRequests, targetId]); // Add to pending list
    } catch (err) {
      console.error('Connect error:', err);
      alert('Request already sent or failed to send');
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      await axios.post(
        'https://skillconnect-server.onrender.com/api/users/accept',
        { requesterId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Request accepted!');
      setConnections((prev) => [...prev, allUsers.find(user => user._id === requesterId)]);
      setAllUsers((prev) => prev.filter((user) => user._id !== requesterId));
    } catch (err) {
      console.error('Accept error:', err);
      alert('Request already accepted or failed');
    }
  };

  const handleReject = async (requesterId) => {
    try {
      alert(`Rejected request from ${requesterId}`);
    } catch (err) {
      console.error('Reject error:', err);
      alert('Failed to reject request');
    }
  };

  return (
    <>
      <NavbarLoggedIn />

      <div className="container mx-auto p-4">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser.name}</h1>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>
       
        {/* Suggested Users Section */}
        <div className=" grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold">Suggested Connections</h2><br></br>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedUsers.map((user) => (
              <div key={user._id} className="border p-2 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.bio}</p>
                <p className="text-sm text-gray-500">{user.skills}</p>
                <button
                  onClick={() => handleConnect(user._id)}
                  disabled={pendingRequests.includes(user._id)} // Disable if pending
                  className={`mt-4 py-2 px-4 rounded ${pendingRequests.includes(user._id) ? 'bg-gray-300' : 'bg-blue-500'} text-white`}
                >
                  {pendingRequests.includes(user._id) ? 'Pending' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
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
