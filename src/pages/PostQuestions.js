import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';

const PostQuestions = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [connections, setConnections] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ title: '', body: '', tags: '' });
    const [showSuccess, setShowSuccess] = useState(false);

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

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                'https://skillconnect-server.onrender.com/api/questions',
                { ...newQuestion },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setQuestions([res.data, ...questions]);
            setNewQuestion({ title: '', body: '', tags: '' });

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error('Error posting question:', err);
            alert('Failed to post question');
        }
    };

    if (loading) return <LoadingSpinnerWithPercentage />;
    if (!currentUser) return <p className="text-center text-xl">User not found</p>;

    return (
        <>
            <NavbarLoggedIn />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                    <button
                        onClick={handleBackToProfile}
                        className="text-blue-600 font-medium hover:underline flex items-center"
                    >
                        ← Back to Profile
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Post a New Question</h2>

                    {showSuccess && (
                        <div className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded border border-green-300">
                            ✅ Question posted successfully!
                        </div>
                    )}

                    <form onSubmit={handlePostQuestion} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                placeholder="Title of your question"
                                value={newQuestion.title}
                                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Body</label>
                            <textarea
                                placeholder="Describe your question in detail"
                                value={newQuestion.body}
                                onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })}
                                className="w-full p-3 h-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Tags</label>
                            <input
                                type="text"
                                placeholder="e.g. react, javascript"
                                value={newQuestion.tags}
                                onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Post Question
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostQuestions;


