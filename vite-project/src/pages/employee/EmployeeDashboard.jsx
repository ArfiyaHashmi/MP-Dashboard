import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdateStatus = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      setEditingTask(null);
      setUpdatedStatus('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-14 md:ml-56 flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Employee Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome, Employee! Here's your workspace.</p>
          
          <div className="grid gap-4 mt-6">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
                <p className="text-gray-600 mb-2">Team: {task.team}</p>
                <p className="text-gray-600 mb-2">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">{task.description}</p>
                
                {editingTask === task._id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(task._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                      {task.status}
                    </span>
                    <button
                      onClick={() => setEditingTask(task._id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Update Status
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;