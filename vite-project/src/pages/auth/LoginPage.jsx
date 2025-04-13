import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/authContext';

const LoginPage = () => {
    const authContext = useContext(AuthContext);
    const { login, error, clearErrors, isAuthenticated, user } = authContext;
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('manager'); // Changed default to manager
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        role: 'manager'
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(`/${user.role}`); // Redirect based on authenticated user's role
        }

        if (error) {
            setTimeout(() => {
                clearErrors();
            }, 3000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user, navigate, error, clearErrors]);

    const { email, password, role } = credentials;

    const onChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleRoleSwitch = (role) => {
        setSelectedRole(role);
        setCredentials({ ...credentials, role }); // Update credentials when role changes
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('Attempting login with:', credentials); // Debug log
        if (email && password && role) {
            await login({
                email,
                password,
                role
            });
        }
    };
    return (
        <div className="flex items-center justify-center h-screen bg-[#eef5db]"> 
            <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-2xl px-8 md:px-12 pt-12 pb-12 w-full max-w-2xl">
                <div className="flex justify-end mb-6"> 
                    <div className="relative inline-block text-left">
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-black font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a]" /* Changed text color to black */
                            id="role-menu-button"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                        >
                            Login as: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="role-menu-button">
                                    <button onClick={() => handleRoleSwitch('manager')} className="block w-full text-left px-4 py-2 text-base text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                        Manager
                                    </button>
                                    <button onClick={() => handleRoleSwitch('employee')} className="block w-full text-left px-4 py-2 text-base text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                        Employee
                                    </button>
                                    <button onClick={() => handleRoleSwitch('client')} className="block w-full text-left px-4 py-2 text-base text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                        Client
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <h2 className="block text-gray-800 text-2xl font-bold mb-8 text-center"> Welcome to the company Website
                    Login
                </h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>}
                <form className="space-y-6" onSubmit={onSubmit}> 
                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                            Email Address:
                        </label>
                        <input
                            className="text-lg shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#02c39a]" /* Enhanced input styling */
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
                            Password:
                        </label>
                        <input
                            className=" text-lg shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#02c39a]" /* Enhanced input styling */
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button
                        className="text-lg bg-[#38a3a5] hover:bg-[#22577a] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:-translate-y-1" /* Added transition effects */
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;