import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage'

const Profile = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]); // State for storing questions
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', tags: '' }); // State for new question
  const [answerText, setAnswerText] = useState(''); // State for answering a question
  const [questionId, setQuestionId] = useState(null); // State for the question being answered

  const navigate = useNavigate();

  const handleUserConnection = () => {
    navigate('/userconnections');
  };
  const handleAllUsers = () =>{
    navigate('/allusers');
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

        // Fetch questions posted by the current user
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
      setQuestions([res.data, ...questions]); // Add the new question to the list
      setNewQuestion({ title: '', body: '', tags: '' }); // Clear form fields
    } catch (err) {
      console.error('Error posting question:', err);
      alert('Failed to post question');
    }
  };

  const handleAnswerQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `https://skillconnect-server.onrender.com/api/questions/${questionId}/answer`,
        { text: answerText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(questions.map((q) =>
        q._id === questionId ? res.data : q
      ));
      setAnswerText(''); // Clear answer text
      setQuestionId(null); // Reset questionId after answering
    } catch (err) {
      console.error('Error answering question:', err);
      alert('Failed to answer question');
    }
  };

  //if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (loading) return <LoadingSpinnerWithPercentage />;
  if (!currentUser) return <p className="text-center text-xl">User not found</p>;

  return (
    <>
      <NavbarLoggedIn />

      <div className="container mx-auto p-6">
        {/* Logout and Links */}
        <div className="flex justify-end space-x-4 mb-8">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
          >
            Log Out
          </button>
          <button
           // href="/userconnections"
           onClick={handleUserConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            User Connections
          </button>
          <button
           // href="/allusers"
           onClick={handleAllUsers}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
          >
            All Users
          </button>
        </div>

        {/* Profile Information */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, {currentUser.name}</h1>
          <p className="text-lg text-gray-600">{currentUser.email}</p>
          <p className="text-lg text-gray-600 mt-2">{currentUser.bio}</p>
        </div>

        {/* Post a New Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post a New Question</h2>
          <form onSubmit={handlePostQuestion} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Body"
              value={newQuestion.body}
              onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tags"
              value={newQuestion.tags}
              onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Post Question
            </button>
          </form>
        </div>

        {/* Display Posted Questions */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Questions</h2>
          {questions.length === 0 ? (
            <p>No questions yet</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((question) => (
                <li key={question._id} className="border p-4 rounded-lg shadow-sm bg-white">
                  <h3 className="text-xl font-semibold text-gray-800">{question.title}</h3>
                  <p className="mt-2 text-gray-700">{question.body}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Tags:</strong> {question.tags.join(', ')}
                  </div>
                  <button
                    onClick={() => setQuestionId(question._id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Answer
                  </button>

                  {/* Answer Question Form */}
                  {questionId === question._id && (
                    <form onSubmit={handleAnswerQuestion} className="mt-4 space-y-4">
                      <textarea
                        placeholder="Your answer"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                      >
                        Submit Answer
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;



