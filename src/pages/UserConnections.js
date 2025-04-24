// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import NavbarLoggedIn from '../components/NavbarLoggedIn';
// import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';

// const UserConnections = () => {
//     const [connections, setConnections] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');

//     const navigate = useNavigate();

//     const handleBackToProfile = () => {
//         navigate('/profile');
//     };

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             navigate('/login');
//             return;
//         }

//         const fetchConnections = async () => {
//             try {
//                 const meRes = await axios.get(' https://skillconnect-server.onrender.com/api/users/me', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setCurrentUser(meRes.data);

//                 const connectionsRes = await axios.get(
//                     ` https://skillconnect-server.onrender.com/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
//                 );
//                 setConnections(connectionsRes.data); // Assume this returns full user objects
//             } catch (err) {
//                 console.error('Error fetching connections:', err);
//                 setConnections([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchConnections();
//     }, [navigate]);

//     const filteredConnections = connections.filter((user) =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     if (loading) return <LoadingSpinnerWithPercentage />;
//     if (!currentUser) return <p className="text-center text-xl">User not found</p>;

//     return (
//         <>
//             <NavbarLoggedIn />

//             <div className="p-8">
//                 <div className="mb-6">
//                     <button onClick={handleBackToProfile} className="text-blue-500 hover:text-blue-700 font-semibold">
//                         &larr; Back to Profile
//                     </button>
//                 </div>

//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="Search by name, email, or bio"
//                         className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 <div className="mt-6">
//                     <h2 className="text-3xl font-semibold mb-4 text-gray-800">Your Connections</h2>
//                     {filteredConnections.length === 0 ? (
//                         <p className="text-lg text-gray-600">No connections found.</p>
//                     ) : (
//                         <div className="max-h-[550px] overflow-y-auto pr-2">
//                             <ul className="space-y-10">
//                                 {filteredConnections.map((u) => (
//                                     <li
//                                         key={u._id}
//                                         className="bg-white p-2 rounded-lg shadow-md hover:shadow-xl transition duration-300"
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <p className="text-sm font-semibold text-gray-800">{u.name}</p>
//                                                 <p className="text-sm text-gray-600">{u.email}</p>
//                                             </div>
//                                             <span className="px-1 py-2 bg-green-500 text-white rounded-md">
//                                                 Connected
//                                             </span>
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </>
//     );
// };

// export default UserConnections;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';

const UserConnections = () => {
    const [connections, setConnections] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const handleBackToProfile = () => {
        navigate('/profile');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchConnections = async () => {
            try {
                const meRes = await axios.get(' https://skillconnect-server.onrender.com/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(meRes.data);

                const connectionsRes = await axios.get(
                    ` https://skillconnect-server.onrender.com/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
                );
                setConnections(connectionsRes.data);
            } catch (err) {
                console.error('Error fetching connections:', err);
                setConnections([]);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, [navigate]);

    const filteredConnections = connections.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingSpinnerWithPercentage />;
    if (!currentUser) return <p className="text-center text-xl">User not found</p>;

    return (
        <>
            <NavbarLoggedIn />

            <div className="px-4 sm:px-8 md:px-16 lg:px-32 py-10">
                <div className="mb-6">
                    <button
                        onClick={handleBackToProfile}
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                        &larr; Back to Profile
                    </button>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or bio"
                        className="p-3 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Your Connections</h2>
                    {filteredConnections.length === 0 ? (
                        <p className="text-gray-600 text-base">No connections found.</p>
                    ) : (
                        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <ul className="space-y-6">
                                {filteredConnections.map((u) => (
                                    <li
                                        key={u._id}
                                        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300"
                                    >
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="min-w-0">
                                                <p className="text-lg font-semibold text-gray-900 truncate">{u.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{u.email}</p>
                                            </div>
                                            <span className="text-xs sm:text-sm px-3 py-1 bg-green-500 text-white rounded-full shadow">
                                                Connected
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserConnections;
