
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

const All_Users = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [connections, setConnections] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]); // State for storing questions
    const [newQuestion, setNewQuestion] = useState({ title: '', body: '', tags: '' }); // State for new question
    const [answerText, setAnswerText] = useState(''); // State for answering a question
    const [questionId, setQuestionId] = useState(null); // State for the question being answered
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const handlebacktoprofile = () => {
            navigate('/profile');
          };

        const fetchData = async () => {
            try {
                // const meRes = await axios.get('http://localhost:5000/api/users/me', {
                const meRes = await axios.get('https://skillconnect-server.onrender.com/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(meRes.data);

                // const connectionsRes = await axios.get(
                //     `http://localhost:5000/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
                const connectionsRes = await axios.get(
                    `https://skillconnect-server.onrender.com/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
                );
                setConnections(connectionsRes.data);

                // const allUsersRes = await axios.get('http://localhost:5000/api/users/getAllUsers', {
                const allUsersRes = await axios.get('https://skillconnect-server.onrender.com/api/users/getAllUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllUsers(allUsersRes.data);

                // Fetch questions posted by the current user
                // const questionsRes = await axios.get('http://localhost:5000/api/questions', {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleConnect = async (targetId) => {
        try {
            // await axios.post(
            //     'http://localhost:5000/api/users/connect',
            await axios.post(
                'https://skillconnect-server.onrender.com/api/users/connect',
                { targetId },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            alert('Connection request sent!');
            setPendingRequests([...pendingRequests, targetId]); // ✅ Add to pending list
        } catch (err) {
            console.error('Connect error:', err);
            alert('Request already sent or failed to send');
        }
    };

    const handleAccept = async (requesterId) => {
        try {
            // await axios.post(
            //     'http://localhost:5000/api/users/accept',
            await axios.post(
                'https://skillconnect-server.onrender.com/api/users/accept',
                { requesterId },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            alert('Request accepted!');
        } catch (err) {
            console.error('Accept error:', err);
            alert('request accepted already or Failed to accept request');
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

    // Filter users based on the search query
    const filteredUsers = allUsers.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (loading) return <p>Loading...</p>;
    if (!currentUser) return <p>User not found</p>;

    return (
        <>
            <NavbarLoggedIn />
            <div className="p-8">
                <div className="mb-6">
                    <button handlebacktoprofile className="text-blue-500 hover:text-blue-700 font-semibold">
                        &larr; Back to Profile
                    </button>
                </div>


                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or bio"
                        className="p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 👥 Explore Users */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Explore Users</h2>
                    {filteredUsers
                        .filter(
                            (user) =>
                                user._id !== currentUser._id &&
                                !connections.some((conn) => conn._id === user._id)
                        )
                        .map((user) => {
                            const hasReceivedRequest = currentUser.connectionRequests?.includes(user._id);
                            const isPending = pendingRequests.includes(user._id);
                            const hasSentRequest = user.connectionRequests?.includes(currentUser._id) || isPending;

                            return (
                                <div
                                    key={user._id}
                                    className="border p-4 rounded-lg shadow-md mb-4 hover:bg-gray-100 transition-all"
                                >
                                    <h3 className="text-xl font-semibold">{user.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Bio:</strong> {user.bio}
                                    </p>

                                    {/* Connection Actions */}
                                    {hasSentRequest ? (
                                        <span className="text-yellow-500 font-medium">🕓 Pending Request</span>
                                    ) : hasReceivedRequest ? (
                                        <div className="mt-2 space-x-2">
                                            <button
                                                onClick={() => handleAccept(user._id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleReject(user._id)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(user._id)}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default All_Users;
