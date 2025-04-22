
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NavbarLoggedIn from '../components/NavbarLoggedIn'

export default function UserQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
    const handlebacktoprofile = () => {
        navigate('/profile');
      };

  useEffect(() => {
    const token = localStorage.getItem('token');

    try {
      // Decode the JWT token and extract user info
      const decodedToken = jwtDecode(token);
      const decodedUserId = decodedToken?.id;

      console.log("Decoded Token:", decodedToken);
      console.log("User ID:", decodedUserId);

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
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("Response:", res);

          if (res.data && Array.isArray(res.data.data)) {
            setQuestions(res.data.data);
          } else {
            setQuestions([]);
            setError('Unexpected response format.');
          }
        } catch (err) {
          console.error('Error fetching questions:', err);
          setError(err.response?.data?.message || 'Failed to load questions.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserQuestions();
    } catch (err) {
      console.error("Error decoding token:", err);
      setError('Failed to decode token or token expired');
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (questions.length === 0) return <p className="text-center text-gray-500">No questions found.</p>;

  return (
    <>
    <NavbarLoggedIn />
    <div className="p-4 max-w-4xl mx-auto">
    <button onClick={handlebacktoprofile}  className="text-blue-500 hover:text-blue-700 font-semibold">
                        &larr; Back to Profile
    </button>
      <h2 className="text-2xl font-bold mb-4">
        Questions by {currentUser?.name || currentUser?.email || 'You'}
      </h2>
      {questions.map((question) => (
        <div key={question._id} className="border p-4 rounded-lg shadow-sm mb-4">
          <h3 className="text-xl font-semibold">{question.title}</h3>
          <p className="text-gray-700">{question.body}</p>
          <div className="text-sm text-gray-500 mt-2">
            Tags: {Array.isArray(question.tags) ? question.tags.join(', ') : 'None'}<br />
            Asked by: {question.user?.name || question.user?.email || 'Unknown'}<br />
            Posted on: {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'Unknown'}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
