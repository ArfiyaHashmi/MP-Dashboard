import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Home,
  FolderKanban,
  ListTodo,
  BarChart2,
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const navigate = useNavigate();

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
      case 'Chats':
        // Add navigation for Chats when implemented
        break;
      case 'Analytics':
        // Add navigation for Analytics when implemented
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Chats', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', icon: <ListTodo size={20} /> },
    { name: 'Analytics', icon: <BarChart2 size={20} /> },
  ];

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