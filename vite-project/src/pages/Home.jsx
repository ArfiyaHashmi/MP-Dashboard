import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-[#38a3a5] text-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Task Management System</h1>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-[#38a3a5] hover:bg-gray-100 font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Welcome to Task Management System
                    </h2>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Streamline your workflow, manage tasks efficiently, and collaborate seamlessly with your team.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Home;