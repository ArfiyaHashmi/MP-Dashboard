import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const ClientDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientTasks();
    }, []);

    const fetchClientTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debug log

            const response = await fetch('http://localhost:5000/api/tasks/client-tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }

            const data = await response.json();
            console.log('Fetched tasks:', data); // Debug log
            setTasks(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Tasks</h1>
                
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <p className="text-gray-600">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <p className="text-gray-600">No tasks assigned yet.</p>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Team:</span> {task.team}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Deadline:</span>{' '}
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-gray-700 mb-4">{task.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-green-100 text-green-800'}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;