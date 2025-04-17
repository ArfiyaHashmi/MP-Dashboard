import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Navbar = () => {
    const authContext = useContext(AuthContext);
    const { logout, user } = authContext;
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#38a3a5] text-white py-5 shadow-md">
            <div className="max-w-full px-6 flex items-center justify-between">
                <ul className="flex items-center space-x-4">
                    <li>
                        {user && (
                            <span className="font-semibold text-lg ">
                                Welcome, {user.name} ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
                            </span>
                        )}
                    </li>
                </ul>
                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
