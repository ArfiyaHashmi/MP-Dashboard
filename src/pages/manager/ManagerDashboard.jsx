import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const ManagerDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [clients, setClients] = useState([]);
    const [taskData, setTaskData] = useState({
        name: '',
        team: '',
        clientName: '',
        deadline: '',
        description: ''
    });
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    // Fetch tasks and clients on component mount
    useEffect(() => {
        fetchTasks();
        fetchClients();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/clients');
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const deleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) throw new Error('Failed to delete task');
                
                setTasks(tasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find the selected client's ID
            const selectedClient = clients.find(client => client.name === taskData.clientName);
            if (!selectedClient) throw new Error('Client not found');

            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...taskData,
                    clientId: selectedClient._id
                }),
            });

            if (!response.ok) throw new Error('Failed to create task');
            
            const data = await response.json();
            setTasks([data, ...tasks]);
            setShowForm(false);
            setTaskData({ name: '', team: '', clientName: '', deadline: '', description: '' });
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            setShowRegisterForm(false);
            setUserData({ name: '', email: '', password: '', role: '' });
            alert('User registered successfully');
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">
                <Navbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="pl-20 mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-gray-800">Manager Dashboard</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-300"
                            >
                                + New Task
                            </button>
                            <button
                                onClick={() => setShowRegisterForm(true)}
                                className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-300"
                            >
                                + Register User
                            </button>
                        </div>
                    </div>
                    <p className="pl-20 text-gray-600">Welcome, Manager! Here's your overview.</p>

                    {/* Task List */}
                    <div className="pl-20 mt-8 grid gap-4">
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
                                        <p className="text-gray-600 mb-2">Team: {task.team}</p>
                                        <p className="text-gray-600 mb-2">Client: {task.clientName}</p>
                                        <p className="text-gray-600 mb-2">
                                            Deadline: {new Date(task.deadline).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-700">{task.description}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                    <label className="block text-gray-700 font-semibold mb-1">Client Name</label>
                                    <select
                                        name="clientName"
                                        value={taskData.clientName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map((client) => (
                                            <option key={client._id} value={client.name}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
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

                {/* Registration Modal */}
                {showRegisterForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New User</h2>
                            <form onSubmit={handleRegisterUser} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={userData.password}
                                        onChange={(e) => setUserData({...userData, password: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Role</label>
                                    <select
                                        value={userData.role}
                                        onChange={(e) => setUserData({...userData, role: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                    >
                                        <option value="">Select Role</option>
                                        <option value="employee">Employee</option>
                                        <option value="client">Client</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowRegisterForm(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-4 py-2 rounded-md"
                                    >
                                        Register User
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
