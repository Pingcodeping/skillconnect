import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';

const Profile = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error('Error fetching data:', err);
        setConnections([]);
        setAllUsers([]);
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
      await axios.post(
        'http://localhost:5000/api/users/connect',
        { targetId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Connection request sent!');
      window.location.reload();
    } catch (err) {
      console.error('Connect error:', err);
      alert('Failed to send request');
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/users/accept',
        { requesterId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Request accepted!');
      window.location.reload();
    } catch (err) {
      console.error('Accept error:', err);
      alert('Failed to accept request');
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

  if (loading) return <p>Loading...</p>;
  if (!currentUser) return <p>User not found</p>;

  return (
    <>
      <NavbarLoggedIn />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser.name}</h1>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Bio:</strong> {currentUser.bio}</p>

        {/* 👥 Current Connections */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Your Connections</h2>
          {connections.length === 0 ? (
            <p>No connections yet</p>
          ) : (
            <ul className="list-disc ml-5">
              {connections.map(u => (
                <li key={u._id}>{u.name} ({u.email})</li>
              ))}
            </ul>
          )}
        </div>

        {/* 👤 Explore Users */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Explore Users</h2>
        <div className="space-y-4">
          {allUsers
            .filter(user =>
              user._id !== currentUser._id &&
              !connections.some(conn => conn._id === user._id)
            )
            .map(user => {
              const hasSentRequest = user.connectionRequests?.includes(currentUser._id);
              const hasReceivedRequest = currentUser.connectionRequests?.includes(user._id);

              return (
                <div key={user._id} className="border p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Bio:</strong> {user.bio}</p>

                  {hasSentRequest ? (
                    <span className="text-yellow-500 font-medium">🕓 Pending Request</span>
                  ) : hasReceivedRequest ? (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleAccept(user._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(user._id)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
