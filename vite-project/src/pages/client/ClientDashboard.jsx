import React from 'react';
import Navbar from '../../components/Navbar.jsx';

const ClientDashboard = () => {
    return (
        <div className="bg-gray-100 h-screen">
            <Navbar />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Client Dashboard</h1>
                <p className="text-gray-600">Welcome, Client! Here's your portal.</p>
                {/* Add client-specific content here */}
            </div>
        </div>
    );
};

export default ClientDashboard;