import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const EmployeeDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-14 md:ml-56 flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome, Employee! Here's your workspace.</p>
          {/* Add employee-specific content here */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
