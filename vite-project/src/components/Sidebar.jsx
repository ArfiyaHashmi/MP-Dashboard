import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Home,
  MessageSquare,
  ListTodo,
  BarChart2,
} from 'lucide-react';
import AuthContext from '../context/authContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  // Set active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/chat')) return 'Chat';
    // if (path.includes('/analytics')) return 'Analytics';
    return 'Home';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);

    // Navigate based on the item clicked
    switch (itemName) {
      case 'Home':
        navigate('/');
        break;
      case 'Tasks':
        navigate('/tasks');
        break;
      case 'Chat':
        navigate('/chat');
        break;
      // case 'Analytics':
      //   // Add navigation for Analytics when implemented
      //   break;
      default:
        break;
    }
  };

  // Filter menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Home', icon: <Home size={20} /> },
      { name: 'Tasks', icon: <ListTodo size={20} /> },
    ];

    // Only managers and employees can access chat
    if (user && (user.role === 'manager' || user.role === 'employee')) {
      baseItems.splice(1, 0, { name: 'Chat', icon: <MessageSquare size={20} /> });
    }

    // Only managers can access analytics (when implemented)
    // if (user && user.role === 'manager') {
    //   baseItems.push({ name: 'Analytics', icon: <BarChart2 size={20} /> });
    // }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={`fixed top-19.5 left-0 h-[calc(100vh-4rem)] bg-[#38a3a5] text-white transition-all duration-300 z-30
        ${isOpen ? 'w-56' : 'w-14'} overflow-hidden shadow-lg`}
    >
      {/* Fixed hamburger button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-2 left-4 text-white focus:outline-none"
      >
        <Menu size={24} />
      </button>

      {/* Space under button */}
      <div className="mt-12 space-y-2 px-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleItemClick(item.name)}
            className={`
              flex items-center gap-3 cursor-pointer rounded-md px-3 py-2
              transition-all duration-300 ease-in-out
              ${activeItem === item.name
                ? 'bg-[#2c8e91] text-white'
                : 'hover:bg-[#2c8e91] hover:text-white'}
            `}
          >
            {item.icon}
            {isOpen && <span className="text-sm">{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;