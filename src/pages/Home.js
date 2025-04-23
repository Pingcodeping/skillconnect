// // pages/Home.jsx
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// const Home = () => {
//   return (
//     <>
//     <Navbar/>
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
//       <h1 className="text-5xl font-bold mb-4">Welcome to SkillConnect</h1>
//       <p className="text-lg text-center max-w-xl mb-8">
//         SkillConnect is your one-stop platform to connect with professionals,
//         ask questions, share knowledge, and grow your skills. Join now and be part
//         of an ever-growing tech community!
//       </p>
//       <div className="flex gap-4">
//         <Link
//           to="/login"
//           className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
//         >
//           Login
//         </Link>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Home;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all questions with answers when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // const response = await axios.get('https://skillconnect-server.onrender.com/api/questions/getAllQuestionsWithAnswers');
        const response = await axios.get('https://skillconnect-server.onrender.com/api/questions/getAllQuestionsWithAnswers');
        setQuestions(response.data); // Store questions in the state
      } catch (err) {
        setError('Error fetching questions and answers');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to SkillConnect</h1>
        <p className="text-lg text-center max-w-xl mb-8">
          SkillConnect is your one-stop platform to connect with professionals,
          ask questions, share knowledge, and grow your skills. Join now and be part
          of an ever-growing tech community!
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
          >
            Login
          </Link>
        </div>

        {/* Display Questions and Answers
        <div className="mt-8 w-full max-w-4xl">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div>
              {questions.length > 0 ? (
                questions.map((question) => (
                  <div key={question._id} className="mb-6 p-4 border-b-2">
                    <h2 className="text-2xl font-semibold">{question.title}</h2>
                    <p>{question.body}</p>
                    <p className="text-sm text-gray-400">Posted by: {question.user ? question.user.name : 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">Tags: {question.tags.join(', ')}</p>
                    <div className="mt-4">
                      {question.answers.length > 0 ? (
                        question.answers.map((answer, index) => (
                          <div key={index} className="mt-2 p-4 border-l-4 border-indigo-500">
                            <p>{answer.text}</p>
                            <p className="text-sm text-gray-400">Answered by: {answer.user ? answer.user.name : 'Anonymous'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="mt-2 text-gray-500">No answers yet</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No questions available.</p>
              )}
            </div>
          )}
        </div> */}
      </div>
    </>
  );
};

export default Home;
