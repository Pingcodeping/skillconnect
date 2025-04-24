
// src/pages/AllQuestions.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [questionId, setQuestionId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchQuestions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to answer.");
        navigate('/login');
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/questions/${questionId}/answer`,
        { text: answerText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? res.data : q))
      );
      setAnswerText('');
      setQuestionId(null);
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer');
    }
  };

  if (loading) return <LoadingSpinnerWithPercentage />;

  return (
    <>
      {/* <NavbarLoggedIn/> */}
      <div className="container mx-auto p-6">
        {/* <button
          onClick={handleBackToHome}
          className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          &larr; Back
        </button> */}
        <h1 className="text-3xl font-bold mb-6 text-center">All Questions</h1>

        {questions.length === 0 ? (
          <p>No questions available</p>
        ) : (
          <ul className="space-y-6">
            {questions.map((q) => (
              <li key={q._id} className="p-5 border rounded-md shadow bg-white">
                <h2 className="text-xl font-semibold text-gray-800">{q.title}</h2>
                <p className="text-gray-700 my-2">{q.body}</p>
                <p className="text-sm text-gray-600">
                  <strong>Tags:</strong> {q.tags.join(', ')}
                </p>

                {/* Display answers */}
                {q.answers?.length > 0 && (
  <div className="mt-4 space-y-2">
    <strong className="text-gray-800">Answers:</strong>
    {q.answers.map((ans, i) => (
      <div key={i} className="text-gray-700 border-l-4 border-blue-500 pl-3">
        <p>{ans.text}</p>
        {ans.user && (
          <p className="text-sm text-gray-500 italic">— {ans.user.name}</p> 
        )}
      </div>
    ))}
  </div>
)}


                {/* Answering Form */}
                {isLoggedIn ? (
                  <div className="mt-4">
                    <button
                      onClick={() => setQuestionId(q._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Answer
                    </button>

                    {questionId === q._id && (
                      <form onSubmit={handleAnswerSubmit} className="mt-4">
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Write your answer..."
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Submit Answer
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-red-600">Log in to answer this question.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AllQuestions;
