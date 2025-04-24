import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import LoadingSpinnerWithPercentage from '../components/LoadingSpinnerWithPercentage';

export default function UserProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
                const meRes = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(meRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return <LoadingSpinnerWithPercentage />;

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 font-semibold">
                Failed to load user data.
            </div>
        );
    }

    return (
        <>
            <NavbarLoggedIn />
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen px-4 sm:px-8 md:px-16 lg:px-32 py-10">
                <button
                    onClick={handleBackToProfile}
                    className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                >
                    &larr; Back to Profile
                </button>

                <div className="max-w-4xl mx-auto mt-10">
                    <div className="bg-white shadow-xl hover:shadow-2xl rounded-3xl p-8 transition duration-300 ease-in-out">
                        <div className="flex flex-col items-center">
                            <div className="relative w-28 h-28 mb-6">
                                <div className="absolute inset-0 rounded-full animate-pulse bg-blue-200 blur-sm z-0"></div>
                                <div className="w-full h-full rounded-full bg-blue-500 text-white text-4xl font-bold flex items-center justify-center z-10 relative ring-4 ring-white">
                                    {currentUser.name?.charAt(0)}
                                </div>
                            </div>
                            <h1 className="text-3xl font-semibold text-gray-800">{currentUser.name}</h1>
                            <p className="text-gray-500 text-sm">{currentUser.email}</p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                <span className="block font-medium text-blue-600">User ID</span>
                                <span className="text-sm break-all">{currentUser._id}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                <span className="block font-medium text-blue-600">Joined</span>
                                <span className="text-sm">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm col-span-full">
                                <span className="block font-medium text-blue-600">Bio</span>
                                <span className="text-sm">{currentUser.bio || "No bio added."}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm col-span-full">
                                <span className="block font-medium text-blue-600">Email</span>
                                <span className="text-sm">{currentUser.email || "No bio added."}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm col-span-full">
                                <span className="block font-medium text-blue-600">Skills</span>
                                <span className="text-sm">{currentUser.skills || "No skills listed."}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
