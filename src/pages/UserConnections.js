import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

const UserConnections = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [connections, setConnections] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]); // State for storing questions
    const [newQuestion, setNewQuestion] = useState({ title: '', body: '', tags: '' }); // State for new question
    const [answerText, setAnswerText] = useState(''); // State for answering a question
    const [questionId, setQuestionId] = useState(null); // State for the question being answered
    const [searchQuery, setSearchQuery] = useState(''); // State for search query


    const [pendingRequests, setPendingRequests] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const meRes = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(meRes.data);

                const connectionsRes = await axios.get(
                    `http://localhost:5000/api/users/getconnectionsforuser/?userId=${meRes.data._id}`
                );
                setConnections(connectionsRes.data);

                const allUsersRes = await axios.get('http://localhost:5000/api/users/getAllUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllUsers(allUsersRes.data);

                // Fetch questions posted by the current user
                const questionsRes = await axios.get('http://localhost:5000/api/questions', {
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

    // Filter users based on the search query
    const filteredUsers = allUsers.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });


    if (loading) return <p className="text-center text-xl">Loading...</p>;
    if (!currentUser) return <p className="text-center text-xl">User not found</p>;

    return (
        <>
            <NavbarLoggedIn />

            <div className="p-8">
                {/* Back Button */}
                <div className="mb-6">
                    <a href="/profile" className="text-blue-500 hover:text-blue-700 font-semibold">
                        &larr; Back to Profile
                    </a>
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

                {/* 👥 Current Connections */}
                <div className="mt-6">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Your Connections</h2>
                    {filteredUsers.length === 0 ? (
                        <p className="text-lg text-gray-600">No users found matching the search criteria.</p>
                    ) : (
                        <ul className="space-y-4">
                            {filteredUsers.map((u) => (
                                <li key={u._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xl font-semibold text-gray-800">{u.name}</p>
                                            <p className="text-sm text-gray-600">{u.email}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                                            connected
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


            </div>
        </>
    );
};

export default UserConnections;
