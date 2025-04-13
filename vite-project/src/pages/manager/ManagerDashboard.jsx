import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const ManagerDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [taskData, setTaskData] = useState({
        name: '',
        team: '',
        deadline: '',
        description: ''
    });

    const handleInputChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Task Created:', taskData);
        // Add your backend API call here
        setShowForm(false);
        setTaskData({ name: '', team: '', deadline: '', description: '' });
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <Navbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="pl-20 mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-gray-800">Manager Dashboard</h1>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-300"
                        >
                            + New Task
                        </button>
                    </div>
                    <p className="pl-20 text-gray-600">Welcome, Manager! Here's your overview.</p>
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-xl w-full max-w-lg p-8 shadow-lg relative">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Task Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={taskData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Team Assigned</label>
                                    <input
                                        type="text"
                                        name="team"
                                        value={taskData.team}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={taskData.deadline}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={taskData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-4 py-2 rounded-md"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
