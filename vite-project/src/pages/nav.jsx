import React from 'react';

function Nav() {
  return (
    <nav className="bg-gray-100 border-b border-gray-300 p-4">
      <ul className="flex space-x-4">
        <li>
          <a href="/" className="text-pink-500 hover:text-blue-700">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="text-blue-500 hover:text-blue-700">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="text-blue-500 hover:text-blue-700">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;