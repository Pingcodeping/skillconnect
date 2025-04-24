
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

export default function UserQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleBackToProfile = () => navigate('/profile');

  useEffect(() => {
    const token = localStorage.getItem('token');

    try {
      const decodedToken = jwtDecode(token);
      const decodedUserId = decodedToken?.id;

      if (!decodedUserId) {
        setError("Invalid token: missing user ID");
        setLoading(false);
        return;
      }

      setCurrentUser(decodedToken);

      const fetchUserQuestions = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/questions/user/${decodedUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data && Array.isArray(res.data.data)) {
            setQuestions(res.data.data);
          } else {
            setQuestions([]);
            setError('Unexpected response format.');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load questions.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserQuestions();
    } catch (err) {
      setError('Failed to decode token or token expired');
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <p className="text-center text-lg sm:text-xl mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-base mt-10">{error}</p>;
  if (questions.length === 0)
    return <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      <button
        onClick={handleBackToProfile}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
      >
        &larr; Back to Profile
      </button>
      <p className="text-center text-gray-500 mt-10">No questions found.</p></div>;

  return (
    <>
      <NavbarLoggedIn />
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
        <button
          onClick={handleBackToProfile}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
        >
          &larr; Back to Profile
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Questions by {currentUser?.name || currentUser?.email || 'You'}
        </h2>

        <div className="grid gap-6">
          {questions.map((question) => (
            <div key={question._id} className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition duration-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {question.title}
              </h3>
              <p className="text-gray-700 mb-3">{question.body}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p><span className="font-medium">Tags:</span> {Array.isArray(question.tags) ? question.tags.join(', ') : 'None'}</p>
                <p><span className="font-medium">Asked by:</span> {question.user?.name || question.user?.email || 'Unknown'}</p>
                <p><span className="font-medium">Posted on:</span> {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
